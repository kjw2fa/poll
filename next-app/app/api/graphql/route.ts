import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { dbGet, dbAll, dbRun } from '../../../lib/db-utils';
import { PollDbObject, VoteDbObject, UserDbObject, PollOptionDbObject, PollPermissionsDbObject, VoteRatingDbObject } from '../../../../shared/db-types';
import { Resolvers, PermissionType, TargetType } from '../../../../shared/generated-types';

const typeDefs = fs.readFileSync(path.join(process.cwd(), '../shared/schema.graphql'), 'utf-8');

// Helper functions for global IDs
const toGlobalId = (type: string, id: number | string) => Buffer.from(`${type}:${id}`).toString('base64');
const fromGlobalId = (globalId: string) => {
    const decoded = Buffer.from(globalId, 'base64').toString('ascii');
    const [type, id] = decoded.split(':');
    return { type, id };
};

// Helper functions for cursor pagination
const toCursor = (id: number) => Buffer.from(String(id)).toString('base64');

export const JWT_SECRET = 'your-secret-key';

interface UserWithPassword extends UserDbObject {
    password?: string;
}

const resolvers: Resolvers = {
    RootQueryType: {
        polls: async () => {
            return dbAll<PollDbObject>('SELECT * FROM Polls', []);
        },
        poll: async (parent: unknown, { id }: { id: string }) => {
            const { id: pollIdStr } = fromGlobalId(id);
            const pollId = parseInt(pollIdStr, 10);
            const poll = await dbGet<PollDbObject>('SELECT * FROM Polls WHERE id = ?', [pollId]);
            return poll || null;
        },
        searchPolls: async (parent: unknown, { searchTerm }: { searchTerm: string }) => {
            return dbAll<PollDbObject>('SELECT * FROM Polls WHERE title LIKE ?', [`%${searchTerm}%`]);
        },
        user: async (parent: unknown, { id }: { id: string }) => {
            const { id: userIdStr } = fromGlobalId(id);
            const userId = parseInt(userIdStr, 10);
            const user = await dbGet<UserDbObject>('SELECT * FROM Users WHERE id = ?', [userId]);
            return user || null;
        },
    },
    Mutation: {
        createPoll: async (parent: unknown, { title, options, userId }: { title: string, options: { optionText: string }[], userId: string }) => {
            const { id: userIdStr } = fromGlobalId(userId);
            const parsedUserId = parseInt(userIdStr, 10);
            const result = await dbRun('INSERT INTO Polls (title) VALUES (?)', [title]);
            const pollId = result.lastID;

            for (const option of options) {
                await dbRun('INSERT INTO PollOptions (pollId, optionText) VALUES (?, ?)', [pollId, option.optionText]);
            }

            await dbRun('INSERT INTO PollPermissions (pollId, permission_type, target_type, target_id) VALUES (?, ?, ?, ?)', [pollId, PermissionType.Edit, TargetType.User, parsedUserId]);
            
            const row = await dbGet<PollDbObject>('SELECT * FROM Polls WHERE id = ?', [pollId]);
            
            if (!row) {
                throw new Error('Failed to create poll');
            }

            return {
                pollEdge: {
                    cursor: toCursor(pollId),
                    node: row,
                }
            };
        },
        submitVote: async (parent: unknown, { pollId, userId, ratings }: { pollId: string, userId: string, ratings: { optionId: string, rating: number }[] }) => {
            const { id: pollIdStr } = fromGlobalId(pollId);
            const parsedPollId = parseInt(pollIdStr, 10);
            const { id: userIdStr } = fromGlobalId(userId);
            const parsedUserId = parseInt(userIdStr, 10);

            const user = await dbGet<UserDbObject>('SELECT username FROM Users WHERE id = ?', [parsedUserId]);
            if (!user) {
                throw new Error('User not found');
            }

            const result = await dbRun('INSERT OR REPLACE INTO Votes (pollId, userId) VALUES (?, ?)', [parsedPollId, parsedUserId]);
            const voteId = result.lastID;

            for (const { optionId: optionIdStr, rating } of ratings) {
                const { id: optionId } = fromGlobalId(optionIdStr);
                await dbRun('INSERT INTO VoteDetails (voteId, optionId, rating) VALUES (?, ?, ?)', [voteId, parseInt(optionId, 10), rating]);
            }
            const row = await dbGet<PollDbObject>('SELECT * FROM Polls WHERE id = ?', [parsedPollId]);
            if (!row) {
                throw new Error('Poll not found after voting');
            }
            return {
                pollEdge: {
                    cursor: toCursor(parsedPollId),
                    node: row,
                }
            };
        },
        editPoll: async (parent: unknown, { pollId, userId, title, options }: { pollId: string, userId: string, title: string, options: { id?: string | null, optionText: string }[] }) => {
            const { id: pollIdStr } = fromGlobalId(pollId);
            const parsedPollId = parseInt(pollIdStr, 10);
            const { id: userIdStr } = fromGlobalId(userId);
            const parsedUserId = parseInt(userIdStr, 10);

            const permission = await dbGet<PollPermissionsDbObject>('SELECT permission_type FROM PollPermissions WHERE pollId = ? AND target_id = ? AND permission_type = ?', [parsedPollId, parsedUserId, PermissionType.Edit]);
            if (!permission) {
                throw new Error('No edit permission');
            }

            await dbRun('UPDATE Polls SET title = ? WHERE id = ?', [title, parsedPollId]);

            const currentOptionsRows = await dbAll<PollOptionDbObject>('SELECT id, optionText FROM PollOptions WHERE pollId = ?', [parsedPollId]);

            const newOptions = options;

            const newOptionIds = newOptions.map(o => o.id ? parseInt(fromGlobalId(o.id).id, 10) : null).filter(id => id !== null);
            const removedOptions = currentOptionsRows.filter(o => !newOptionIds.includes(o.id));
            const addedOptions = newOptions.filter(o => !o.id);

            if (removedOptions.length > 0) {
                const removedOptionIds = removedOptions.map(o => o.id);
                const placeholders = removedOptionIds.map(() => '?').join(',');
                await dbRun(`DELETE FROM PollOptions WHERE id IN (${placeholders})`, removedOptionIds);
                await dbRun(`DELETE FROM VoteDetails WHERE optionId IN (${placeholders})`, removedOptionIds);
            }

            if (addedOptions.length > 0) {
                for (const option of addedOptions) {
                    await dbRun('INSERT INTO PollOptions (pollId, optionText) VALUES (?, ?)', [parsedPollId, option.optionText]);
                }
            }
            
            const poll = await dbGet<PollDbObject>('SELECT * FROM Polls WHERE id = ?', [parsedPollId]);
            return poll || null;
        },
        signup: async (parent: unknown, { username, email, password }: { username: string, email: string, password: string }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            try {
                const result = await dbRun('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
                const user = await dbGet<UserDbObject>('SELECT * FROM Users WHERE id = ?', [result.lastID]);
                return user || null;
            } catch (err: any) {
                if (err.message.includes('UNIQUE constraint failed: Users.username')) {
                    throw new Error('Username already exists.');
                }
                if (err.message.includes('UNIQUE constraint failed: Users.email')) {
                    throw new Error('Email already exists.');
                }
                throw err;
            }
        },
        login: async (parent: unknown, { username, password }: { username: string, password: string }) => {
            const user = await dbGet<UserWithPassword>('SELECT * FROM Users WHERE username = ? OR email = ?', [username, username]);
            if (!user) {
                throw new Error('Invalid username or password.');
            }
            const match = await bcrypt.compare(password, user.password!)
            if (!match) {
                throw new Error('Invalid username or password.');
            }
            const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
            return { token, userId: toGlobalId('User', user.id), username: user.username };
        }
    },
    Poll: {
        id: (parent: PollDbObject) => toGlobalId('Poll', parent.id),
        options: (parent: PollDbObject) => {
            return dbAll<PollOptionDbObject>('SELECT id, optionText FROM PollOptions WHERE pollId = ?', [parent.id]);
        },
        permissions: (parent: PollDbObject) => {
            return dbAll<PollPermissionsDbObject>('SELECT * FROM PollPermissions WHERE pollId = ?', [parent.id]);
        },
        votes: (parent: PollDbObject) => {
            return dbAll<VoteDbObject>('SELECT * FROM Votes WHERE pollId = ?', [parent.id]);
        },
    },
    PollOption: {
        id: (parent: PollOptionDbObject) => toGlobalId('PollOption', parent.id)
    },
    Vote: {
        id: (parent: VoteDbObject) => toGlobalId('Vote', parent.id),
        user: async (parent: VoteDbObject) => {
            const user = await dbGet<UserDbObject>('SELECT * FROM Users WHERE id = ?', [parent.userId]);
            if (!user) throw new Error('User not found');
            return user;
        },
        poll: async (parent: VoteDbObject) => {
            const poll = await dbGet<PollDbObject>('SELECT * FROM Polls WHERE id = ?', [parent.pollId]);
            if (!poll) throw new Error('Poll not found');
            return poll;
        },
        ratings: async (parent: VoteDbObject) => {
            const ratings = await dbAll<VoteRatingDbObject>(`
                SELECT vd.optionId, po.optionText, vd.rating 
                FROM VoteDetails vd
                JOIN PollOptions po ON vd.optionId = po.id
                WHERE vd.voteId = ?
            `, [parent.id]);
            return ratings.map(r => ({
                rating: r.rating,
                option: {
                    id: r.optionId,
                    optionText: r.optionText,
                    pollId: parent.pollId
                }
            }));
        }
    },
    PollPermissions: {
        target_id: (parent: PollPermissionsDbObject) => {
            if (parent.target_type && parent.target_type === TargetType.User) {
                if (parent.target_id) {
                    return toGlobalId('User', parent.target_id);
                }
            }
            return null;
        }
    },
    VoteRating: {
        option: (parent) => parent.option,
        rating: (parent) => parent.rating,
    },
    User: {
        id: (parent: UserDbObject) => toGlobalId('User', parent.id),
        polls: (parent: UserDbObject, { permission }: { permission?: PermissionType | null }) => {
            const userId = parent.id;
            let query = 'SELECT Polls.* FROM Polls JOIN PollPermissions ON Polls.id = PollPermissions.pollId WHERE PollPermissions.target_id = ?';
            const params: any[] = [userId];
            if (permission) {
                query += ' AND PollPermissions.permission_type = ?';
                params.push(permission);
            }
            return dbAll<PollDbObject>(query, params);
        },
    }
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const server = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler(server, {
    context: async (req) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const user = jwt.verify(token, JWT_SECRET);
                return { userId: (user as any).userId };
            } catch (err) {
                // handle error
            }
        }
        return {};
    },
});

export { handler as GET, handler as POST };