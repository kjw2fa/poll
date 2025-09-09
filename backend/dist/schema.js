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
const database_1 = __importDefault(require("./database"));
const enums_1 = require("./enums");
exports.JWT_SECRET = 'your-secret-key';
// Helper functions for cursor pagination
const toCursor = (id) => Buffer.from(String(id)).toString('base64');
const fromCursor = (cursor) => Buffer.from(cursor, 'base64').toString('ascii');
function paginationResolver(baseQuery, queryParams, { first, after, last, before }) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = baseQuery;
        const params = [...queryParams];
        if (after) {
            query += ` AND Polls.id > ?`;
            params.push(fromCursor(after));
        }
        if (before) {
            query += ` AND Polls.id < ?`;
            params.push(fromCursor(before));
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
        return new Promise((resolve, reject) => {
            database_1.default.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    let edges = rows.map(row => ({
                        cursor: toCursor(row.id),
                        node: Object.assign(Object.assign({}, row), { options: JSON.parse(row.options), creator: { username: row.creatorUsername } })
                    }));
                    const hasNextPage = first ? edges.length > limit : false;
                    const hasPreviousPage = last ? edges.length > limit : false;
                    if (first && edges.length > limit) {
                        edges = edges.slice(0, limit);
                    }
                    if (last && edges.length > limit) {
                        edges = edges.slice(0, limit).reverse();
                    }
                    resolve({
                        edges,
                        pageInfo: {
                            hasNextPage,
                            hasPreviousPage,
                            startCursor: edges.length > 0 ? edges[0].cursor : null,
                            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                        }
                    });
                }
            });
        });
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
        id: { type: graphql_1.GraphQLID },
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
        id: { type: graphql_1.GraphQLID },
        title: { type: graphql_1.GraphQLString },
        options: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        creator: {
            type: UserType,
            resolve(parent, args) {
                return new Promise((resolve, reject) => {
                    database_1.default.get('SELECT Users.* FROM Users JOIN Polls ON Users.id = Polls.creatorId WHERE Polls.id = ?', [parent.id], (err, row) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(row);
                        }
                    });
                });
            }
        },
        permissions: {
            type: new graphql_1.GraphQLList(PollPermissionsType),
            resolve(parent, args) {
                return new Promise((resolve, reject) => {
                    database_1.default.all('SELECT * FROM PollPermissions WHERE pollId = ?', [parent.id], (err, rows) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                });
            }
        },
        votes: {
            type: new graphql_1.GraphQLList(VoteType),
            args: { userId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve(parent, args) {
                return new Promise((resolve, reject) => {
                    database_1.default.get('SELECT voteId FROM Votes WHERE pollId = ? AND userId = ? LIMIT 1', [parent.id, parseInt(args.userId, 10)], (err, voteRow) => {
                        if (err || !voteRow) {
                            resolve([]);
                        }
                        else {
                            database_1.default.all('SELECT option, rating FROM VoteDetails WHERE pollId = ? AND voteId = ?', [parent.id, voteRow.voteId], (err2, details) => {
                                if (err2) {
                                    reject(err2);
                                }
                                else {
                                    resolve(details);
                                }
                            });
                        }
                    });
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
                const { userId } = parent;
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
                const { userId } = parent;
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
                return new Promise((resolve, reject) => {
                    database_1.default.all('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id', [], (err, rows) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(rows.map(row => (Object.assign(Object.assign({}, row), { options: JSON.parse(row.options), creator: { username: row.creatorUsername } }))));
                        }
                    });
                });
            }
        },
        poll: {
            type: PollType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return new Promise((resolve, reject) => {
                    database_1.default.get('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id WHERE Polls.id = ?', [parseInt(args.id, 10)], (err, row) => {
                        if (err) {
                            reject(err);
                        }
                        else if (!row) {
                            resolve(null);
                        }
                        else {
                            resolve(Object.assign(Object.assign({}, row), { options: JSON.parse(row.options), creator: { username: row.creatorUsername } }));
                        }
                    });
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
                return new Promise((resolve, reject) => {
                    database_1.default.get('SELECT title, options FROM Polls WHERE id = ?', [args.pollId], (err, pollRow) => {
                        if (err) {
                            reject(err);
                        }
                        else if (!pollRow) {
                            reject(new Error('Poll not found'));
                        }
                        else {
                            const pollTitle = pollRow.title;
                            const pollOptions = JSON.parse(pollRow.options);
                            database_1.default.all('SELECT u.username, vd.option, vd.rating FROM Votes v JOIN Users u ON v.userId = u.id LEFT JOIN VoteDetails vd ON v.voteId = vd.voteId WHERE v.pollId = ?', [args.pollId], (err, rows) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
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
                                    resolve({
                                        pollTitle,
                                        totalVotes: votersSet.size,
                                        voters: Array.from(votersSet),
                                        results: winningOptions,
                                        allAverageRatings
                                    });
                                }
                            });
                        }
                    });
                });
            }
        },
        searchPolls: {
            type: new graphql_1.GraphQLList(PollType),
            args: { searchTerm: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) } },
            resolve(parent, args) {
                return new Promise((resolve, reject) => {
                    database_1.default.all('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id WHERE Polls.title LIKE ?', [`%${args.searchTerm}%`], (err, rows) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(rows.map(row => (Object.assign(Object.assign({}, row), { options: JSON.parse(row.options), creator: { username: row.creatorUsername } }))));
                        }
                    });
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
                return new Promise((resolve, reject) => {
                    const optionsJson = JSON.stringify(args.options);
                    database_1.default.run('INSERT INTO Polls (title, options, creatorId) VALUES (?, ?, ?)', [args.title, optionsJson, parseInt(args.userId, 10)], function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            const pollId = this.lastID;
                            database_1.default.run('INSERT INTO PollPermissions (pollId, permission_type, target_type, target_id) VALUES (?, ?, ?, ?)', [pollId, enums_1.PermissionType.EDIT, enums_1.TargetType.USER, parseInt(args.userId, 10)], function (err2) {
                                if (err2) {
                                    reject(err2);
                                }
                                else {
                                    database_1.default.get('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id WHERE Polls.id = ?', [pollId], (err3, row) => {
                                        if (err3) {
                                            reject(err3);
                                        }
                                        else {
                                            const newPoll = Object.assign(Object.assign({}, row), { options: JSON.parse(row.options), creator: { username: row.creatorUsername } });
                                            resolve({
                                                pollEdge: {
                                                    cursor: toCursor(pollId),
                                                    node: newPoll,
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            }
        },
        submitVote: {
            type: PollType,
            args: {
                pollId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                userId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                ratings: { type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(RatingInput))) }
            },
            resolve(parent, args) {
                return new Promise((resolve, reject) => {
                    database_1.default.get('SELECT username FROM Users WHERE id = ?', [parseInt(args.userId, 10)], (err, user) => {
                        if (err || !user) {
                            reject(new Error('User not found'));
                        }
                        else {
                            database_1.default.run('INSERT OR REPLACE INTO Votes (pollId, userId) VALUES (?, ?)', [args.pollId, args.userId], function (err) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    const voteId = this.lastID;
                                    database_1.default.run('DELETE FROM VoteDetails WHERE pollId = ? AND voteId = ?', [args.pollId, voteId], function (err2) {
                                        if (err2) {
                                            reject(err2);
                                        }
                                        else {
                                            const stmt = database_1.default.prepare('INSERT INTO VoteDetails (pollId, voteId, option, rating) VALUES (?, ?, ?, ?)');
                                            args.ratings.forEach(({ option, rating }) => {
                                                stmt.run([args.pollId, voteId, option, rating]);
                                            });
                                            stmt.finalize();
                                            database_1.default.get('SELECT * FROM Polls WHERE id = ?', [args.pollId], (err, row) => {
                                                if (err) {
                                                    reject(err);
                                                }
                                                else {
                                                    resolve(Object.assign(Object.assign({}, row), { options: JSON.parse(row.options) }));
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
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
                return new Promise((resolve, reject) => {
                    database_1.default.get('SELECT permission_type FROM PollPermissions WHERE pollId = ? AND target_id = ? AND permission_type = ?', [parseInt(args.pollId, 10), parseInt(args.userId, 10), enums_1.PermissionType.EDIT], (err, row) => {
                        if (err || !row) {
                            reject(new Error('No edit permission'));
                        }
                        else {
                            const optionsJson = JSON.stringify(args.options);
                            database_1.default.run('UPDATE Polls SET title = ?, options = ? WHERE id = ?', [args.title, optionsJson, args.pollId], function (err2) {
                                if (err2) {
                                    reject(err2);
                                }
                                else {
                                    database_1.default.get('SELECT * FROM Polls WHERE id = ?', [args.pollId], (err3, updatedPoll) => {
                                        if (err3) {
                                            reject(err3);
                                        }
                                        else {
                                            resolve(Object.assign(Object.assign({}, updatedPoll), { options: JSON.parse(updatedPoll.options) }));
                                        }
                                    });
                                }
                            });
                        }
                    });
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
                    return new Promise((resolve, reject) => {
                        database_1.default.run('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [args.username, args.email, hashedPassword], function (err) {
                            if (err) {
                                if (err.message.includes('UNIQUE constraint failed: Users.username')) {
                                    reject(new Error('Username already exists.'));
                                }
                                else if (err.message.includes('UNIQUE constraint failed: Users.email')) {
                                    reject(new Error('Email already exists.'));
                                }
                                else {
                                    reject(err);
                                }
                            }
                            else {
                                resolve({ id: this.lastID, username: args.username, email: args.email });
                            }
                        });
                    });
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
                return new Promise((resolve, reject) => {
                    database_1.default.get('SELECT * FROM Users WHERE username = ? OR email = ?', [args.username, args.username], (err, user) => {
                        if (err) {
                            return reject(err);
                        }
                        if (!user) {
                            return reject(new Error('Invalid username or password.'));
                        }
                        bcrypt_1.default.compare(args.password, user.password, (err, match) => {
                            if (err) {
                                return reject(err);
                            }
                            if (!match) {
                                return reject(new Error('Invalid username or password.'));
                            }
                            const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, exports.JWT_SECRET, { expiresIn: '1d' });
                            resolve({ token, userId: user.id, username: user.username });
                        });
                    });
                });
            }
        }
    }
});
exports.default = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
