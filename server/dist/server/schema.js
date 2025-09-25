import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { makeExecutableSchema } from '@graphql-tools/schema';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { dbGet, dbAll, dbRun } from './db-utils.js';
import { PermissionType, TargetType } from '../shared/generated-types.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const JWT_SECRET = 'your-secret-key';
// Helper functions for global IDs
const toGlobalId = (type, id) => Buffer.from(`${type}:${id}`).toString('base64');
const fromGlobalId = (globalId) => {
    const decoded = Buffer.from(globalId, 'base64').toString('ascii');
    const [type, id] = decoded.split(':');
    return { type, id };
};
// Helper functions for cursor pagination
const toCursor = (id) => Buffer.from(String(id)).toString('base64');
const fromCursor = (cursor) => Buffer.from(cursor, 'base64').toString('ascii');
const typeDefs = fs.readFileSync(path.join(__dirname, '..', 'shared', 'schema.graphql'), 'utf8');
const resolvers = {
    RootQueryType: {
        polls: async () => {
            return dbAll('SELECT * FROM Polls', []);
        },
        poll: async (parent, { id }) => {
            const { id: pollIdStr } = fromGlobalId(id);
            const pollId = parseInt(pollIdStr, 10);
            const poll = await dbGet('SELECT * FROM Polls WHERE id = ?', [pollId]);
            return poll || null;
        },
        searchPolls: async (parent, { searchTerm }) => {
            return dbAll('SELECT * FROM Polls WHERE title LIKE ?', [`%${searchTerm}%`]);
        },
        user: async (parent, { id }) => {
            const { id: userIdStr } = fromGlobalId(id);
            const userId = parseInt(userIdStr, 10);
            const user = await dbGet('SELECT * FROM Users WHERE id = ?', [userId]);
            return user || null;
        },
    },
    Mutation: {
        createPoll: async (parent, { title, options, userId }) => {
            const { id: userIdStr } = fromGlobalId(userId);
            const parsedUserId = parseInt(userIdStr, 10);
            const result = await dbRun('INSERT INTO Polls (title, userId) VALUES (?, ?)', [title, parsedUserId]);
            const pollId = result.lastID;
            for (const option of options) {
                await dbRun('INSERT INTO PollOptions (pollId, optionText) VALUES (?, ?)', [pollId, option.optionText]);
            }
            await dbRun('INSERT INTO PollPermissions (pollId, permission_type, target_type, target_id) VALUES (?, ?, ?, ?)', [pollId, PermissionType.Edit, TargetType.User, parsedUserId]);
            const row = await dbGet('SELECT * FROM Polls WHERE id = ?', [pollId]);
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
        submitVote: async (parent, { pollId, userId, ratings }) => {
            const { id: pollIdStr } = fromGlobalId(pollId);
            const parsedPollId = parseInt(pollIdStr, 10);
            const { id: userIdStr } = fromGlobalId(userId);
            const parsedUserId = parseInt(userIdStr, 10);
            const user = await dbGet('SELECT username FROM Users WHERE id = ?', [parsedUserId]);
            if (!user) {
                throw new Error('User not found');
            }
            const result = await dbRun('INSERT OR REPLACE INTO Votes (pollId, userId) VALUES (?, ?)', [parsedPollId, parsedUserId]);
            const voteId = result.lastID;
            for (const { optionId: optionIdStr, rating } of ratings) {
                const { id: optionId } = fromGlobalId(optionIdStr);
                await dbRun('INSERT INTO VoteDetails (voteId, optionId, rating) VALUES (?, ?, ?)', [voteId, parseInt(optionId), rating]);
            }
            const row = await dbGet('SELECT * FROM Polls WHERE id = ?', [parsedPollId]);
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
        editPoll: async (parent, { pollId, userId, title, options }) => {
            const { id: pollIdStr } = fromGlobalId(pollId);
            const parsedPollId = parseInt(pollIdStr, 10);
            const { id: userIdStr } = fromGlobalId(userId);
            const parsedUserId = parseInt(userIdStr, 10);
            const permission = await dbGet('SELECT permission_type FROM PollPermissions WHERE pollId = ? AND target_id = ? AND permission_type = ?', [parsedPollId, parsedUserId, PermissionType.Edit]);
            if (!permission) {
                throw new Error('No edit permission');
            }
            await dbRun('UPDATE Polls SET title = ? WHERE id = ?', [title, parsedPollId]);
            const currentOptionsRows = await dbAll('SELECT id, optionText FROM PollOptions WHERE pollId = ?', [parsedPollId]);
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
            const poll = await dbGet('SELECT * FROM Polls WHERE id = ?', [parsedPollId]);
            return poll || null;
        },
        signup: async (parent, { username, email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            try {
                const result = await dbRun('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
                const user = await dbGet('SELECT * FROM Users WHERE id = ?', [result.lastID]);
                return user || null;
            }
            catch (err) {
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
            const user = await dbGet('SELECT * FROM Users WHERE username = ? OR email = ?', [username, username]);
            if (!user) {
                throw new Error('Invalid username or password.');
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                throw new Error('Invalid username or password.');
            }
            const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
            return { token, userId: toGlobalId('User', user.id), username: user.username };
        }
    },
    Poll: {
        id: (parent) => toGlobalId('Poll', parent.id),
        options: (parent) => {
            return dbAll('SELECT id, optionText FROM PollOptions WHERE pollId = ?', [parent.id]);
        },
        permissions: (parent) => {
            return dbAll('SELECT * FROM PollPermissions WHERE pollId = ?', [parent.id]);
        },
        votes: (parent) => {
            return dbAll('SELECT * FROM Votes WHERE pollId = ?', [parent.id]);
        },
    },
    PollOption: {
        id: (parent) => toGlobalId('PollOption', parent.id)
    },
    Vote: {
        id: (parent) => toGlobalId('Vote', parent.id),
        user: async (parent) => {
            const user = await dbGet('SELECT * FROM Users WHERE id = ?', [parent.userId]);
            if (!user)
                throw new Error('User not found');
            return user;
        },
        poll: async (parent) => {
            const poll = await dbGet('SELECT * FROM Polls WHERE id = ?', [parent.pollId]);
            if (!poll)
                throw new Error('Poll not found');
            return poll;
        },
        ratings: async (parent) => {
            const ratings = await dbAll(`
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
        option: (parent) => parent.option,
        rating: (parent) => parent.rating,
    },
    User: {
        id: (parent) => toGlobalId('User', parent.id),
        polls: (parent, { permission }) => {
            const { id: userIdStr } = fromGlobalId(parent.id);
            const userId = parseInt(userIdStr, 10);
            let query = 'SELECT Polls.* FROM Polls JOIN PollPermissions ON Polls.id = PollPermissions.pollId WHERE PollPermissions.target_id = ?';
            const params = [userId];
            if (permission) {
                query += ' AND PollPermissions.permission_type = ?';
                params.push(permission);
            }
            return dbAll(query, params);
        },
    }
};
export default makeExecutableSchema({
    typeDefs,
    resolvers,
});
