import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { makeExecutableSchema } from '@graphql-tools/schema';
import fs from 'fs';
import path from 'path';
import db from './database';
import { dbGet, dbAll, dbRun } from './db-utils';
import { PermissionType, TargetType } from '@shared/generated-types';
import { Poll, User, Vote, VoteRating, PollPermissions, Resolvers, PollOption } from '@shared/generated-types';
import { PollDbObject, VoteDbObject, UserDbObject, PollOptionDbObject, PollPermissionsDbObject } from './db-types';

interface UserWithPassword extends UserDbObject {
    password?: string;
}

export const JWT_SECRET = 'your-secret-key';

// Helper functions for global IDs
const toGlobalId = (type: string, id: number | string) => Buffer.from(`${type}:${id}`).toString('base64');
const fromGlobalId = (globalId: string) => {
    const decoded = Buffer.from(globalId, 'base64').toString('ascii');
    const [type, id] = decoded.split(':');
    return { type, id };
};

// Helper functions for cursor pagination
const toCursor = (id: number) => Buffer.from(String(id)).toString('base64');
const fromCursor = (cursor: string) => Buffer.from(cursor, 'base64').toString('ascii');

async function paginationResolver(baseQuery: string, queryParams: any[], { first, after, last, before }: { first?: number | null, after?: string | null, last?: number | null, before?: string | null }) {
    let query = baseQuery;
    const params = [...queryParams];

    if (after) {
        query += ` AND Polls.id > ?`;
        params.push(parseInt(fromCursor(after), 10));
    }

    if (before) {
        query += ` AND Polls.id < ?`;
        params.push(parseInt(fromCursor(before), 10));
    }

    let limit = first || last || 10;
    if (first) {
        query += ` ORDER BY Polls.id ASC LIMIT ?`;
        params.push(limit + 1);
    } else if (last) {
        query += ` ORDER BY Polls.id DESC LIMIT ?`;
        params.push(limit + 1);
    }

    const rows = await dbAll<PollDbObject>(query, params);

    let edges = rows.map(row => ({
        cursor: toCursor(row.id as number),
        node: row
    }));

    const hasNextPage = first ? edges.length > limit : false;
    const hasPreviousPage = last ? edges.length > limit : false;

    if (first && edges.length > limit) {
        edges = edges.slice(0, limit);
    }
    if (last && edges.length > limit) {
        edges = edges.slice(0, limit).reverse();
    }

    return {
        edges,
        pageInfo: {
            hasNextPage,
            hasPreviousPage,
            startCursor: edges.length > 0 ? edges[0].cursor : null,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        }
    };
}

const typeDefs = fs.readFileSync(path.join(__dirname, '..', 'schema.graphql'), 'utf8');

const resolvers: Resolvers = {
    RootQueryType: {
        polls: async () => {
            const rows = await dbAll<PollDbObject>('SELECT * FROM Polls', []);
            return rows.map(row => ({ ...row, id: toGlobalId('Poll', row.id) }));
        },
        poll: async (parent: any, { id }: { id: string }) => {
            const { id: pollIdStr } = fromGlobalId(id);
            const pollId = parseInt(pollIdStr, 10);
            const poll = await dbGet<PollDbObject>('SELECT * FROM Polls WHERE id = ?', [pollId]);
            if (!poll) {
                return null;
            }
            return { ...poll, id: toGlobalId('Poll', poll.id) };
        },
        searchPolls: async (parent: any, { searchTerm }: { searchTerm: string }) => {
            const rows = await dbAll<PollDbObject>('SELECT * FROM Polls WHERE title LIKE ?', [`%${searchTerm}%`]);
            return rows.map(row => ({ ...row, id: toGlobalId('Poll', row.id) }));
        },
        user: async (parent, { id }) => {
            const { id: userIdStr } = fromGlobalId(id);
            const userId = parseInt(userIdStr, 10);
            const user = await dbGet<UserDbObject>('SELECT * FROM Users WHERE id = ?', [userId]);
            if (!user) {
                return null;
            }
            return { ...user, id: toGlobalId('User', user.id) };
        },
    },
    Mutation: {
        createPoll: async (parent, { title, options, userId }) => {
            const { id: userIdStr } = fromGlobalId(userId);
            const parsedUserId = parseInt(userIdStr, 10);
            const result = await dbRun('INSERT INTO Polls (title) VALUES (?)', [title]);
            const pollId = result.lastID;

            for (const option of options) {
                await dbRun('INSERT INTO PollOptions (pollId, optionText) VALUES (?, ?)', [pollId, option.optionText]);
            }

            await dbRun('INSERT INTO PollPermissions (pollId, permission_type, target_type, target_id) VALUES (?, ?, ?, ?)', [pollId, PermissionType.Edit, TargetType.User, parsedUserId]);
            console.log('Inserted EDIT permission');
            await dbRun('INSERT INTO PollPermissions (pollId, permission_type, target_type, target_id) VALUES (?, ?, ?, ?)', [pollId, PermissionType.View, TargetType.Public, null]);
            console.log('Inserted VIEW permission');
            await dbRun('INSERT INTO PollPermissions (pollId, permission_type, target_type, target_id) VALUES (?, ?, ?, ?)', [pollId, PermissionType.Vote, TargetType.Public, null]);
            console.log('Inserted VOTE permission');
            
            const row = await dbGet<PollDbObject>('SELECT * FROM Polls WHERE id = ?', [pollId]);
            
            if (!row) {
                throw new Error('Failed to create poll');
            }

            return {
                pollEdge: {
                    cursor: toCursor(pollId),
                    node: row as unknown as Poll,
                }
            };
        },
        submitVote: async (parent, { pollId, userId, ratings }) => {
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
                await dbRun('INSERT INTO VoteDetails (voteId, optionId, rating) VALUES (?, ?, ?)', [voteId, parseInt(optionId), rating]);
            }
            const row = await dbGet<PollDbObject>('SELECT * FROM Polls WHERE id = ?', [parsedPollId]);
            if (!row) {
                throw new Error('Poll not found after voting');
            }
            return {
                pollEdge: {
                    cursor: toCursor(parsedPollId),
                    node: row as unknown as Poll,
                }
            };
        },
        editPoll: async (parent, { pollId, userId, title, options }) => {
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

            const newOptionIds = newOptions.map(o => o.id ? fromGlobalId(o.id).id : null).filter(id => id !== null);
            const removedOptions = currentOptionsRows.filter(o => !newOptionIds.includes(String(o.id)));
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
            if (!poll) {
                return null;
            }
            return { ...poll, id: toGlobalId('Poll', poll.id) };
        },
        signup: async (parent, { username, email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            try {
                const result = await dbRun('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
                const user = await dbGet<UserDbObject>('SELECT * FROM Users WHERE id = ?', [result.lastID]);
                if (!user) {
                    return null;
                }
                return { ...user, id: toGlobalId('User', user.id) };
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
        login: async (parent, { username, password }) => {
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
        id: (parent) => toGlobalId('Poll', parent.id),
        options: async (parent) => {
            const { id: pollIdStr } = fromGlobalId(parent.id as string);
            const pollId = parseInt(pollIdStr, 10);
            return await dbAll<PollOptionDbObject>('SELECT id, optionText FROM PollOptions WHERE pollId = ?', [pollId]) as unknown as PollOption[];
        },
        permissions: async (parent) => {
            const { id: pollIdStr } = fromGlobalId(parent.id as string);
            const pollId = parseInt(pollIdStr, 10);
            return await dbAll<PollPermissionsDbObject>('SELECT * FROM PollPermissions WHERE pollId = ?', [pollId]) as unknown as PollPermissions[];
        },
        votes: async (parent) => {
            const { id: pollIdStr } = fromGlobalId(parent.id as string);
            const pollId = parseInt(pollIdStr, 10);
            return await dbAll<VoteDbObject>('SELECT * FROM Votes WHERE pollId = ?', [pollId]) as unknown as Vote[];
        },
    },
    PollOption: {
        id: (parent) => toGlobalId('PollOption', parent.id)
    },
    Vote: {
        id: (parent) => toGlobalId('Vote', parent.id),
        user: async (parent: any) => {
            const user = await dbGet<UserDbObject>('SELECT * FROM Users WHERE id = ?', [parent.userId]);
            if (!user) throw new Error('User not found');
            return user as unknown as User;
        },
        poll: async (parent: any) => {
            const poll = await dbGet<PollDbObject>('SELECT * FROM Polls WHERE id = ?', [parent.pollId]);
            if (!poll) throw new Error('Poll not found');
            return poll as unknown as Poll;
        },
        ratings: async (parent) => {
            return await dbAll<VoteRating>(`
                SELECT vd.optionId, po.optionText, vd.rating 
                FROM VoteDetails vd
                JOIN PollOptions po ON vd.optionId = po.id
                WHERE vd.voteId = ?
            `, [parent.id]);
        }
    },
    PollPermissions: {
        target_id: (parent) => {
            if (parent.target_type && parent.target_type === TargetType.User) {
                if (parent.target_id) {
                    return toGlobalId('User', parent.target_id);
                }
            }
            return null;
        }
    },
    VoteRating: {
        option: async (parent: any) => {
            const option = await dbGet<PollOptionDbObject>('SELECT id, optionText FROM PollOptions WHERE id = ?', [parent.optionId]);
            if (!option) throw new Error('Option not found');
            return option as unknown as PollOption;
        }
    },
    User: {
        id: (parent: User) => toGlobalId('User', parent.id),
        polls: async (parent, { permission }) => {
            const { id: userIdStr } = fromGlobalId(parent.id as string);
            const userId = parseInt(userIdStr, 10);
            let query = 'SELECT Polls.* FROM Polls JOIN PollPermissions ON Polls.id = PollPermissions.pollId WHERE PollPermissions.target_id = ?';
            const params: any[] = [userId];
            if (permission) {
                query += ' AND PollPermissions.permission_type = ?';
                params.push(permission);
            }
            const polls = await dbAll<PollDbObject>(query, params);
            return polls.map(poll => ({ ...poll, id: toGlobalId('Poll', poll.id) }));
        },
    }
};

export default makeExecutableSchema({
    typeDefs,
    resolvers,
});