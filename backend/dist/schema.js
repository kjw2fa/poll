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
const graphql_1 = require("graphql");
const db_utils_1 = require("./db-utils");
const enums_1 = require("./enums");
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
// Enum Types
const PermissionTypeEnum = new graphql_1.GraphQLEnumType({
    name: 'PermissionType',
    values: {
        VIEW: { value: enums_1.PermissionType.VIEW },
        VOTE: { value: enums_1.PermissionType.VOTE },
        EDIT: { value: enums_1.PermissionType.EDIT },
    },
});
const TargetTypeEnum = new graphql_1.GraphQLEnumType({
    name: 'TargetType',
    values: {
        USER: { value: enums_1.TargetType.USER },
        PUBLIC: { value: enums_1.TargetType.PUBLIC },
    },
});
// User Type
const UserType = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        username: { type: graphql_1.GraphQLString }
    })
});
// Permissions Type
const PollPermissionsType = new graphql_1.GraphQLObjectType({
    name: 'PollPermissions',
    fields: () => ({
        permission_type: { type: PermissionTypeEnum },
        target_type: { type: TargetTypeEnum },
        target_id: { type: graphql_1.GraphQLID },
    })
});
// Vote Type
const VoteType = new graphql_1.GraphQLObjectType({
    name: 'Vote',
    fields: () => ({
        option: { type: graphql_1.GraphQLString },
        rating: { type: graphql_1.GraphQLInt }
    })
});
// Poll Type
const PollType = new graphql_1.GraphQLObjectType({
    name: 'Poll',
    fields: () => ({
        id: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
            resolve: (parent) => toGlobalId('Poll', parent.id)
        },
        title: {
            type: graphql_1.GraphQLString,
            resolve: (parent) => parent.title
        },
        options: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve(parent) {
                return __awaiter(this, void 0, void 0, function* () {
                    const rows = yield (0, db_utils_1.dbAll)('SELECT optionText FROM PollOptions WHERE pollId = ?', [parent.id]);
                    return rows.map(row => row.optionText);
                });
            }
        },
        creator: {
            type: UserType,
            resolve: (parent) => ({
                id: toGlobalId('User', parent.creatorId),
                username: parent.creatorUsername,
                email: '' // Not available in PollRow
            })
        },
        permissions: {
            type: new graphql_1.GraphQLList(PollPermissionsType),
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const rows = yield (0, db_utils_1.dbAll)('SELECT * FROM PollPermissions WHERE pollId = ?', [parent.id]);
                    return rows;
                });
            }
        },
        votes: {
            type: new graphql_1.GraphQLList(VoteType),
            args: { userId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const pollId = parent.id;
                    const { id: userIdStr } = fromGlobalId(args.userId);
                    const userId = parseInt(userIdStr, 10);
                    const voteRow = yield (0, db_utils_1.dbGet)('SELECT voteId FROM Votes WHERE pollId = ? AND userId = ? LIMIT 1', [pollId, userId]);
                    if (!voteRow) {
                        return [];
                    }
                    const details = yield (0, db_utils_1.dbAll)('SELECT option, rating FROM VoteDetails WHERE pollId = ? AND voteId = ?', [pollId, voteRow.voteId]);
                    const pollOptionsRows = yield (0, db_utils_1.dbAll)('SELECT optionText FROM PollOptions WHERE pollId = ?', [pollId]);
                    const pollOptions = pollOptionsRows.map(r => r.optionText);
                    const filteredDetails = details.filter(detail => pollOptions.includes(detail.option));
                    return filteredDetails;
                });
            }
        }
    })
});
const PageInfoType = new graphql_1.GraphQLObjectType({
    name: 'PageInfo',
    fields: () => ({
        hasNextPage: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean) },
        hasPreviousPage: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean) },
        startCursor: { type: graphql_1.GraphQLString },
        endCursor: { type: graphql_1.GraphQLString },
    }),
});
const PollEdgeType = new graphql_1.GraphQLObjectType({
    name: 'PollEdge',
    fields: () => ({
        cursor: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        node: { type: PollType },
    }),
});
const PollConnectionType = new graphql_1.GraphQLObjectType({
    name: 'PollConnection',
    fields: () => ({
        edges: { type: new graphql_1.GraphQLList(PollEdgeType) },
        pageInfo: { type: new graphql_1.GraphQLNonNull(PageInfoType) },
    }),
});
// MyPolls Type
const MyPollsType = new graphql_1.GraphQLObjectType({
    name: 'MyPolls',
    fields: () => ({
        createdPolls: {
            type: PollConnectionType,
            args: {
                first: { type: graphql_1.GraphQLInt },
                after: { type: graphql_1.GraphQLString },
                last: { type: graphql_1.GraphQLInt },
                before: { type: graphql_1.GraphQLString },
            },
            resolve: (parent, args) => {
                const { id: userIdStr } = fromGlobalId(parent.userId);
                const userId = parseInt(userIdStr, 10);
                const baseQuery = 'SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id WHERE Polls.creatorId = ?';
                return paginationResolver(baseQuery, [userId], args);
            }
        },
        votedPolls: {
            type: PollConnectionType,
            args: {
                first: { type: graphql_1.GraphQLInt },
                after: { type: graphql_1.GraphQLString },
                last: { type: graphql_1.GraphQLInt },
                before: { type: graphql_1.GraphQLString },
            },
            resolve: (parent, args) => {
                const { id: userIdStr } = fromGlobalId(parent.userId);
                const userId = parseInt(userIdStr, 10);
                const baseQuery = 'SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id JOIN Votes ON Polls.id = Votes.pollId WHERE Votes.userId = ? GROUP BY Polls.id';
                return paginationResolver(baseQuery, [userId], args);
            }
        }
    })
});
// WinningOption Type
const WinningOptionType = new graphql_1.GraphQLObjectType({
    name: 'WinningOption',
    fields: () => ({
        option: { type: graphql_1.GraphQLString },
        averageRating: { type: graphql_1.GraphQLFloat }
    })
});
// PollResult Type
const PollResultType = new graphql_1.GraphQLObjectType({
    name: 'PollResult',
    fields: () => ({
        pollTitle: { type: graphql_1.GraphQLString },
        totalVotes: { type: graphql_1.GraphQLInt },
        voters: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        results: { type: new graphql_1.GraphQLList(WinningOptionType) },
        allAverageRatings: { type: new graphql_1.GraphQLList(WinningOptionType) }
    })
});
// Root Query
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        polls: {
            type: new graphql_1.GraphQLList(PollType),
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const rows = yield (0, db_utils_1.dbAll)('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id', []);
                    return rows;
                });
            }
        },
        poll: {
            type: PollType,
            args: { id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id: pollIdStr } = fromGlobalId(args.id);
                    const pollId = parseInt(pollIdStr, 10);
                    const row = yield (0, db_utils_1.dbGet)('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id WHERE Polls.id = ?', [pollId]);
                    return row !== null && row !== void 0 ? row : null;
                });
            }
        },
        myPolls: {
            type: MyPollsType,
            args: { userId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve(parent, args) {
                return { userId: args.userId };
            }
        },
        pollResults: {
            type: PollResultType,
            args: { pollId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id: pollIdStr } = fromGlobalId(args.pollId);
                    const pollId = parseInt(pollIdStr, 10);
                    const pollRow = yield (0, db_utils_1.dbGet)('SELECT title FROM Polls WHERE id = ?', [pollId]);
                    if (!pollRow) {
                        throw new Error('Poll not found');
                    }
                    const pollTitle = pollRow.title;
                    const pollOptionsRows = yield (0, db_utils_1.dbAll)('SELECT optionText FROM PollOptions WHERE pollId = ?', [pollId]);
                    const pollOptions = pollOptionsRows.map(r => r.optionText);
                    const rows = yield (0, db_utils_1.dbAll)('SELECT u.username, vd.option, vd.rating FROM Votes v JOIN Users u ON v.userId = u.id LEFT JOIN VoteDetails vd ON v.voteId = vd.voteId WHERE v.pollId = ?', [pollId]);
                    const optionRatings = {};
                    pollOptions.forEach((option) => {
                        optionRatings[option] = [];
                    });
                    const votersSet = new Set();
                    rows.forEach(row => {
                        if (row.username)
                            votersSet.add(row.username);
                        if (row.option && optionRatings[row.option]) {
                            optionRatings[row.option].push(row.rating);
                        }
                    });
                    const averageRatings = {};
                    let maxAverageRating = -1;
                    for (const option in optionRatings) {
                        const ratingsArr = optionRatings[option];
                        if (ratingsArr.length > 0) {
                            const sum = ratingsArr.reduce((a, b) => a + b, 0);
                            const avg = sum / ratingsArr.length;
                            averageRatings[option] = avg;
                            if (avg > maxAverageRating) {
                                maxAverageRating = avg;
                            }
                        }
                    }
                    const winningOptions = [];
                    for (const option in averageRatings) {
                        if (averageRatings[option] === maxAverageRating) {
                            winningOptions.push({ option, averageRating: maxAverageRating });
                        }
                    }
                    const allAverageRatings = Object.entries(averageRatings).map(([option, averageRating]) => ({ option, averageRating }));
                    return {
                        pollTitle,
                        totalVotes: votersSet.size,
                        voters: Array.from(votersSet),
                        results: winningOptions,
                        allAverageRatings
                    };
                });
            }
        },
        searchPolls: {
            type: new graphql_1.GraphQLList(PollType),
            args: { searchTerm: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const rows = yield (0, db_utils_1.dbAll)('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id WHERE Polls.title LIKE ?', [`%${args.searchTerm}%`]);
                    return rows;
                });
            }
        }
    }
});
// Rating Input Type
const RatingInput = new graphql_1.GraphQLInputObjectType({
    name: 'RatingInput',
    fields: {
        option: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        rating: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) }
    }
});
const LoginResponseType = new graphql_1.GraphQLObjectType({
    name: 'LoginResponse',
    fields: () => ({
        token: { type: graphql_1.GraphQLString },
        userId: { type: graphql_1.GraphQLID },
        username: { type: graphql_1.GraphQLString }
    })
});
const CreatePollPayload = new graphql_1.GraphQLObjectType({
    name: 'CreatePollPayload',
    fields: () => ({
        pollEdge: { type: PollEdgeType },
    }),
});
const SubmitVotePayload = new graphql_1.GraphQLObjectType({
    name: 'SubmitVotePayload',
    fields: () => ({
        pollEdge: { type: PollEdgeType },
    }),
});
// Mutations
const Mutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createPoll: {
            type: CreatePollPayload,
            args: {
                title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                options: { type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLString)) },
                userId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) }
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id: userIdStr } = fromGlobalId(args.userId);
                    const userId = parseInt(userIdStr, 10);
                    const result = yield (0, db_utils_1.dbRun)('INSERT INTO Polls (title, creatorId) VALUES (?, ?)', [args.title, userId]);
                    const pollId = result.lastID;
                    for (const option of args.options) {
                        yield (0, db_utils_1.dbRun)('INSERT INTO PollOptions (pollId, optionText) VALUES (?, ?)', [pollId, option]);
                    }
                    yield (0, db_utils_1.dbRun)('INSERT INTO PollPermissions (pollId, permission_type, target_type, target_id) VALUES (?, ?, ?, ?)', [pollId, enums_1.PermissionType.EDIT, enums_1.TargetType.USER, userId]);
                    const row = yield (0, db_utils_1.dbGet)('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id WHERE Polls.id = ?', [pollId]);
                    return {
                        pollEdge: {
                            cursor: toCursor(pollId),
                            node: row,
                        }
                    };
                });
            }
        },
        submitVote: {
            type: SubmitVotePayload,
            args: {
                pollId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                userId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                ratings: { type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(RatingInput))) }
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id: pollIdStr } = fromGlobalId(args.pollId);
                    const pollId = parseInt(pollIdStr, 10);
                    const { id: userIdStr } = fromGlobalId(args.userId);
                    const userId = parseInt(userIdStr, 10);
                    const user = yield (0, db_utils_1.dbGet)('SELECT username FROM Users WHERE id = ?', [userId]);
                    if (!user) {
                        throw new Error('User not found');
                    }
                    const result = yield (0, db_utils_1.dbRun)('INSERT OR REPLACE INTO Votes (pollId, userId) VALUES (?, ?)', [pollId, userId]);
                    const voteId = result.lastID;
                    yield (0, db_utils_1.dbRun)('DELETE FROM VoteDetails WHERE pollId = ? AND voteId = ?', [pollId, voteId]);
                    args.ratings.forEach(({ option, rating }) => {
                        (0, db_utils_1.dbRun)('INSERT INTO VoteDetails (pollId, voteId, option, rating) VALUES (?, ?, ?, ?)', [pollId, voteId, option, rating]);
                    });
                    const row = yield (0, db_utils_1.dbGet)('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id WHERE Polls.id = ?', [pollId]);
                    return {
                        pollEdge: {
                            cursor: toCursor(pollId),
                            node: row,
                        }
                    };
                });
            }
        },
        editPoll: {
            type: PollType,
            args: {
                pollId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                userId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                options: { type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLString)) }
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id: pollIdStr } = fromGlobalId(args.pollId);
                    const pollId = parseInt(pollIdStr, 10);
                    const { id: userIdStr } = fromGlobalId(args.userId);
                    const userId = parseInt(userIdStr, 10);
                    const permission = yield (0, db_utils_1.dbGet)('SELECT permission_type FROM PollPermissions WHERE pollId = ? AND target_id = ? AND permission_type = ?', [pollId, userId, enums_1.PermissionType.EDIT]);
                    if (!permission) {
                        throw new Error('No edit permission');
                    }
                    // Update title
                    yield (0, db_utils_1.dbRun)('UPDATE Polls SET title = ? WHERE id = ?', [args.title, pollId]);
                    // Get current options
                    const currentOptionsRows = yield (0, db_utils_1.dbAll)('SELECT optionText FROM PollOptions WHERE pollId = ?', [pollId]);
                    const currentOptions = currentOptionsRows.map(r => r.optionText);
                    // Find removed and added options
                    const removedOptions = currentOptions.filter(o => !args.options.includes(o));
                    const addedOptions = args.options.filter(o => !currentOptions.includes(o));
                    if (removedOptions.length > 0) {
                        const placeholders = removedOptions.map(() => '?').join(',');
                        yield (0, db_utils_1.dbRun)(`DELETE FROM PollOptions WHERE pollId = ? AND optionText IN (${placeholders})`, [pollId, ...removedOptions]);
                        // Also delete votes for removed options
                        yield (0, db_utils_1.dbRun)(`DELETE FROM VoteDetails WHERE pollId = ? AND option IN (${placeholders})`, [pollId, ...removedOptions]);
                    }
                    if (addedOptions.length > 0) {
                        for (const option of addedOptions) {
                            yield (0, db_utils_1.dbRun)('INSERT INTO PollOptions (pollId, optionText) VALUES (?, ?)', [pollId, option]);
                        }
                    }
                    const updatedPoll = yield (0, db_utils_1.dbGet)('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id WHERE Polls.id = ?', [pollId]);
                    return updatedPoll !== null && updatedPoll !== void 0 ? updatedPoll : null;
                });
            }
        },
        signup: {
            type: UserType,
            args: {
                username: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const hashedPassword = yield bcrypt_1.default.hash(args.password, 10);
                    try {
                        const result = yield (0, db_utils_1.dbRun)('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [args.username, args.email, hashedPassword]);
                        return { id: toGlobalId('User', result.lastID), username: args.username, email: args.email };
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
                });
            }
        },
        login: {
            type: LoginResponseType,
            args: {
                username: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield (0, db_utils_1.dbGet)('SELECT * FROM Users WHERE username = ? OR email = ?', [args.username, args.username]);
                    if (!user) {
                        throw new Error('Invalid username or password.');
                    }
                    const match = yield bcrypt_1.default.compare(args.password, user.password);
                    if (!match) {
                        throw new Error('Invalid username or password.');
                    }
                    const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, exports.JWT_SECRET, { expiresIn: '1d' });
                    return { token, userId: toGlobalId('User', user.id), username: user.username };
                });
            }
        }
    }
});
exports.default = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
