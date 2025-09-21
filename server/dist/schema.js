"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = require("@graphql-tools/schema");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_utils_1 = require("./db-utils");
const graphql_1 = require("@/generated/graphql");
exports.JWT_SECRET = 'your-secret-key';
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
function paginationResolver(baseQuery, queryParams, { first, after, last, before }) {
    return __awaiter(this, void 0, void 0, function* () {
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
        }
        else if (last) {
            query += ` ORDER BY Polls.id DESC LIMIT ?`;
            params.push(limit + 1);
        }
        const rows = yield (0, db_utils_1.dbAll)(query, params);
        let edges = rows.map(row => ({
            cursor: toCursor(row.id),
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
    });
}
const typeDefs = fs_1.default.readFileSync(path_1.default.join(__dirname, '..', 'schema.graphql'), 'utf8');
const resolvers = {
    RootQueryType: {
        polls: () => __awaiter(void 0, void 0, void 0, function* () {
            const rows = yield (0, db_utils_1.dbAll)('SELECT * FROM Polls', []);
            return rows.map(row => (Object.assign(Object.assign({}, row), { id: toGlobalId('Poll', row.id) })));
        }),
        poll: (parent, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const { id: pollIdStr } = fromGlobalId(id);
            const pollId = parseInt(pollIdStr, 10);
            const poll = yield (0, db_utils_1.dbGet)('SELECT * FROM Polls WHERE id = ?', [pollId]);
            if (!poll) {
                return null;
            }
            return Object.assign(Object.assign({}, poll), { id: toGlobalId('Poll', poll.id) });
        }),
        searchPolls: (parent, { searchTerm }) => __awaiter(void 0, void 0, void 0, function* () {
            const rows = yield (0, db_utils_1.dbAll)('SELECT * FROM Polls WHERE title LIKE ?', [`%${searchTerm}%`]);
            return rows.map(row => (Object.assign(Object.assign({}, row), { id: toGlobalId('Poll', row.id) })));
        }),
        user: (parent, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const { id: userIdStr } = fromGlobalId(id);
            const userId = parseInt(userIdStr, 10);
            const user = yield (0, db_utils_1.dbGet)('SELECT * FROM Users WHERE id = ?', [userId]);
            if (!user) {
                return null;
            }
            return Object.assign(Object.assign({}, user), { id: toGlobalId('User', user.id) });
        }),
    },
    Mutation: {
        createPoll: (parent, { title, options, userId }) => __awaiter(void 0, void 0, void 0, function* () {
            const { id: userIdStr } = fromGlobalId(userId);
            const parsedUserId = parseInt(userIdStr, 10);
            const result = yield (0, db_utils_1.dbRun)('INSERT INTO Polls (title) VALUES (?)', [title]);
            const pollId = result.lastID;
            for (const option of options) {
                yield (0, db_utils_1.dbRun)('INSERT INTO PollOptions (pollId, optionText) VALUES (?, ?)', [pollId, option.optionText]);
            }
            console.log('Inserting permission with:', { pollId, permissionType: graphql_1.PermissionType.Edit, targetType: graphql_1.TargetType.User, parsedUserId });
            yield (0, db_utils_1.dbRun)('INSERT INTO PollPermissions (pollId, permission_type, target_type, target_id) VALUES (?, ?, ?, ?)', [pollId, graphql_1.PermissionType.Edit, graphql_1.TargetType.User, parsedUserId]);
            const row = yield (0, db_utils_1.dbGet)('SELECT * FROM Polls WHERE id = ?', [pollId]);
            if (!row) {
                throw new Error('Failed to create poll');
            }
            return {
                pollEdge: {
                    cursor: toCursor(pollId),
                    node: row,
                }
            };
        }),
        submitVote: (parent, { pollId, userId, ratings }) => __awaiter(void 0, void 0, void 0, function* () {
            const { id: pollIdStr } = fromGlobalId(pollId);
            const parsedPollId = parseInt(pollIdStr, 10);
            const { id: userIdStr } = fromGlobalId(userId);
            const parsedUserId = parseInt(userIdStr, 10);
            const user = yield (0, db_utils_1.dbGet)('SELECT username FROM Users WHERE id = ?', [parsedUserId]);
            if (!user) {
                throw new Error('User not found');
            }
            const result = yield (0, db_utils_1.dbRun)('INSERT OR REPLACE INTO Votes (pollId, userId) VALUES (?, ?)', [parsedPollId, parsedUserId]);
            const voteId = result.lastID;
            for (const { optionId: optionIdStr, rating } of ratings) {
                const { id: optionId } = fromGlobalId(optionIdStr);
                yield (0, db_utils_1.dbRun)('INSERT INTO VoteDetails (voteId, optionId, rating) VALUES (?, ?, ?)', [voteId, parseInt(optionId), rating]);
            }
            const row = yield (0, db_utils_1.dbGet)('SELECT * FROM Polls WHERE id = ?', [parsedPollId]);
            if (!row) {
                throw new Error('Poll not found after voting');
            }
            return {
                pollEdge: {
                    cursor: toCursor(parsedPollId),
                    node: row,
                }
            };
        }),
        editPoll: (parent, { pollId, userId, title, options }) => __awaiter(void 0, void 0, void 0, function* () {
            const { id: pollIdStr } = fromGlobalId(pollId);
            const parsedPollId = parseInt(pollIdStr, 10);
            const { id: userIdStr } = fromGlobalId(userId);
            const parsedUserId = parseInt(userIdStr, 10);
            const permission = yield (0, db_utils_1.dbGet)('SELECT permission_type FROM PollPermissions WHERE pollId = ? AND target_id = ? AND permission_type = ?', [parsedPollId, parsedUserId, graphql_1.PermissionType.Edit]);
            if (!permission) {
                throw new Error('No edit permission');
            }
            yield (0, db_utils_1.dbRun)('UPDATE Polls SET title = ? WHERE id = ?', [title, parsedPollId]);
            const currentOptionsRows = yield (0, db_utils_1.dbAll)('SELECT id, optionText FROM PollOptions WHERE pollId = ?', [parsedPollId]);
            const newOptions = options;
            const newOptionIds = newOptions.map(o => o.id ? fromGlobalId(o.id).id : null).filter(id => id !== null);
            const removedOptions = currentOptionsRows.filter(o => !newOptionIds.includes(String(o.id)));
            const addedOptions = newOptions.filter(o => !o.id);
            if (removedOptions.length > 0) {
                const removedOptionIds = removedOptions.map(o => o.id);
                const placeholders = removedOptionIds.map(() => '?').join(',');
                yield (0, db_utils_1.dbRun)(`DELETE FROM PollOptions WHERE id IN (${placeholders})`, removedOptionIds);
                yield (0, db_utils_1.dbRun)(`DELETE FROM VoteDetails WHERE optionId IN (${placeholders})`, removedOptionIds);
            }
            if (addedOptions.length > 0) {
                for (const option of addedOptions) {
                    yield (0, db_utils_1.dbRun)('INSERT INTO PollOptions (pollId, optionText) VALUES (?, ?)', [parsedPollId, option.optionText]);
                }
            }
            const poll = yield (0, db_utils_1.dbGet)('SELECT * FROM Polls WHERE id = ?', [parsedPollId]);
            if (!poll) {
                return null;
            }
            return Object.assign(Object.assign({}, poll), { id: toGlobalId('Poll', poll.id) });
        }),
        signup: (parent, { username, email, password }) => __awaiter(void 0, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            try {
                const result = yield (0, db_utils_1.dbRun)('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
                const user = yield (0, db_utils_1.dbGet)('SELECT * FROM Users WHERE id = ?', [result.lastID]);
                if (!user) {
                    return null;
                }
                return Object.assign(Object.assign({}, user), { id: toGlobalId('User', user.id) });
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
        }),
        login: (parent, { username, password }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, db_utils_1.dbGet)('SELECT * FROM Users WHERE username = ? OR email = ?', [username, username]);
            if (!user) {
                throw new Error('Invalid username or password.');
            }
            const match = yield bcrypt_1.default.compare(password, user.password);
            if (!match) {
                throw new Error('Invalid username or password.');
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, exports.JWT_SECRET, { expiresIn: '1d' });
            return { token, userId: toGlobalId('User', user.id), username: user.username };
        })
    },
    Poll: {
        id: (parent) => toGlobalId('Poll', parent.id),
        options: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const { id: pollIdStr } = fromGlobalId(parent.id);
            const pollId = parseInt(pollIdStr, 10);
            return yield (0, db_utils_1.dbAll)('SELECT id, optionText FROM PollOptions WHERE pollId = ?', [pollId]);
        }),
        permissions: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const { id: pollIdStr } = fromGlobalId(parent.id);
            const pollId = parseInt(pollIdStr, 10);
            return yield (0, db_utils_1.dbAll)('SELECT * FROM PollPermissions WHERE pollId = ?', [pollId]);
        }),
        votes: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const { id: pollIdStr } = fromGlobalId(parent.id);
            const pollId = parseInt(pollIdStr, 10);
            return yield (0, db_utils_1.dbAll)('SELECT * FROM Votes WHERE pollId = ?', [pollId]);
        }),
    },
    PollOption: {
        id: (parent) => toGlobalId('PollOption', parent.id)
    },
    Vote: {
        id: (parent) => toGlobalId('Vote', parent.id),
        user: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, db_utils_1.dbGet)('SELECT * FROM Users WHERE id = ?', [parent.userId]);
            if (!user)
                throw new Error('User not found');
            return user;
        }),
        poll: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const poll = yield (0, db_utils_1.dbGet)('SELECT * FROM Polls WHERE id = ?', [parent.pollId]);
            if (!poll)
                throw new Error('Poll not found');
            return poll;
        }),
        ratings: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, db_utils_1.dbAll)(`
                SELECT vd.optionId, po.optionText, vd.rating 
                FROM VoteDetails vd
                JOIN PollOptions po ON vd.optionId = po.id
                WHERE vd.voteId = ?
            `, [parent.id]);
        })
    },
    PollPermissions: {
        target_id: (parent) => {
            if (parent.target_type && parent.target_type === graphql_1.TargetType.User) {
                if (parent.target_id) {
                    return toGlobalId('User', parent.target_id);
                }
            }
            return null;
        }
    },
    VoteRating: {
        option: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const option = yield (0, db_utils_1.dbGet)('SELECT id, optionText FROM PollOptions WHERE id = ?', [parent.optionId]);
            if (!option)
                throw new Error('Option not found');
            return option;
        })
    },
    User: {
        id: (parent) => toGlobalId('User', parent.id),
        polls: (parent, { permission }) => __awaiter(void 0, void 0, void 0, function* () {
            const { id: userIdStr } = fromGlobalId(parent.id);
            const userId = parseInt(userIdStr, 10);
            let query = 'SELECT Polls.* FROM Polls JOIN PollPermissions ON Polls.id = PollPermissions.pollId WHERE PollPermissions.target_id = ?';
            const params = [userId];
            if (permission) {
                query += ' AND PollPermissions.permission_type = ?';
                params.push(permission);
            }
            const polls = yield (0, db_utils_1.dbAll)(query, params);
            return polls.map(poll => (Object.assign(Object.assign({}, poll), { id: toGlobalId('Poll', poll.id) })));
        }),
    }
};
exports.default = (0, schema_1.makeExecutableSchema)({
    typeDefs,
    resolvers,
});
