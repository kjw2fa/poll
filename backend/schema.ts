import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema, GraphQLBoolean, GraphQLNonNull, GraphQLInputObjectType, GraphQLInt, GraphQLFloat, GraphQLEnumType } from 'graphql';
import db from './database';
import { PermissionType, TargetType } from './enums';

export const JWT_SECRET = 'your-secret-key';

// Helper functions for cursor pagination
const toCursor = (id: number) => Buffer.from(String(id)).toString('base64');
const fromCursor = (cursor: string) => Buffer.from(cursor, 'base64').toString('ascii');

async function paginationResolver(baseQuery: string, queryParams: any[], { first, after, last, before }: { first?: number, after?: string, last?: number, before?: string }) {
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
    } else if (last) {
        query += ` ORDER BY Polls.id DESC LIMIT ?`;
        params.push(limit + 1);
    }

    return new Promise((resolve, reject) => {
        db.all(query, params, (err: Error | null, rows: any[]) => {
            if (err) {
                reject(err);
            } else {
                let edges = rows.map(row => ({
                    cursor: toCursor(row.id),
                    node: {
                        ...row,
                        options: JSON.parse(row.options),
                        creator: { username: row.creatorUsername }
                    }
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
}


interface User {
    id: number;
    username: string;
    email: string;
    password?: string;
}

interface Poll {
    id: number;
    title: string;
    options: string;
    creatorId: number;
}

interface Vote {
    voteId: number;
    pollId: number;
    userId: string;
}

interface VoteDetail {
    id: number;
    pollId: number;
    voteId: number;
    option: string;
    rating: number;
}

interface PollPermission {
    pollId: number;
    permission_type: PermissionType;
    target_type: TargetType;
    target_id: number;
}

// Enum Types
const PermissionTypeEnum = new GraphQLEnumType({
    name: 'PermissionType',
    values: {
        VIEW: { value: PermissionType.VIEW },
        VOTE: { value: PermissionType.VOTE },
        EDIT: { value: PermissionType.EDIT },
    },
});

const TargetTypeEnum = new GraphQLEnumType({
    name: 'TargetType',
    values: {
        USER: { value: TargetType.USER },
        PUBLIC: { value: TargetType.PUBLIC },
    },
});

// User Type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString }
    })
});

// Permissions Type
const PollPermissionsType = new GraphQLObjectType({
    name: 'PollPermissions',
    fields: () => ({
        permission_type: { type: PermissionTypeEnum },
        target_type: { type: TargetTypeEnum },
        target_id: { type: GraphQLID },
    })
});

// Vote Type
const VoteType = new GraphQLObjectType({
    name: 'Vote',
    fields: () => ({
        option: { type: GraphQLString },
        rating: { type: GraphQLInt }
    })
});

// Poll Type
const PollType = new GraphQLObjectType({
    name: 'Poll',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        options: { type: new GraphQLList(GraphQLString) },
        creator: {
            type: UserType,
            resolve(parent: Poll, args: any): Promise<User> {
                return new Promise((resolve, reject) => {
                    db.get('SELECT Users.* FROM Users JOIN Polls ON Users.id = Polls.creatorId WHERE Polls.id = ?', [parent.id], (err: Error | null, row: User) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row);
                        }
                    });
                });
            }
        },
        permissions: {
            type: new GraphQLList(PollPermissionsType),
            resolve(parent: Poll, args: any): Promise<PollPermission[]> {
                return new Promise((resolve, reject) => {
                    db.all('SELECT * FROM PollPermissions WHERE pollId = ?', [parent.id], (err: Error | null, rows: PollPermission[]) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                });
            }
        },
        votes: {
            type: new GraphQLList(VoteType),
            args: { userId: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parent: Poll, args: { userId: string }): Promise<VoteDetail[]> {
                return new Promise((resolve, reject) => {
                    db.get('SELECT voteId FROM Votes WHERE pollId = ? AND userId = ? LIMIT 1', [parent.id, parseInt(args.userId, 10)], (err: Error | null, voteRow: Vote) => {
                        if (err || !voteRow) {
                            resolve([]);
                        } else {
                            db.all('SELECT option, rating FROM VoteDetails WHERE pollId = ? AND voteId = ?', [parent.id, voteRow.voteId], (err2: Error | null, details: VoteDetail[]) => {
                                if (err2) {
                                    reject(err2);
                                } else {
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

const PageInfoType = new GraphQLObjectType({
    name: 'PageInfo',
    fields: () => ({
        hasNextPage: { type: new GraphQLNonNull(GraphQLBoolean) },
        hasPreviousPage: { type: new GraphQLNonNull(GraphQLBoolean) },
        startCursor: { type: GraphQLString },
        endCursor: { type: GraphQLString },
    }),
});

const PollEdgeType = new GraphQLObjectType({
    name: 'PollEdge',
    fields: () => ({
        cursor: { type: new GraphQLNonNull(GraphQLString) },
        node: { type: PollType },
    }),
});

const PollConnectionType = new GraphQLObjectType({
    name: 'PollConnection',
    fields: () => ({
        edges: { type: new GraphQLList(PollEdgeType) },
        pageInfo: { type: new GraphQLNonNull(PageInfoType) },
    }),
});

// MyPolls Type
const MyPollsType = new GraphQLObjectType({
    name: 'MyPolls',
    fields: () => ({
        createdPolls: {
            type: PollConnectionType,
            args: {
                first: { type: GraphQLInt },
                after: { type: GraphQLString },
                last: { type: GraphQLInt },
                before: { type: GraphQLString },
            },
            resolve: (parent: { userId: string }, args) => {
                const { userId } = parent;
                const baseQuery = 'SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id WHERE Polls.creatorId = ?';
                return paginationResolver(baseQuery, [userId], args);
            }
        },
        votedPolls: {
            type: PollConnectionType,
            args: {
                first: { type: GraphQLInt },
                after: { type: GraphQLString },
                last: { type: GraphQLInt },
                before: { type: GraphQLString },
            },
            resolve: (parent: { userId: string }, args) => {
                const { userId } = parent;
                const baseQuery = 'SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id JOIN Votes ON Polls.id = Votes.pollId WHERE Votes.userId = ? GROUP BY Polls.id';
                return paginationResolver(baseQuery, [userId], args);
            }
        }
    })
});

// WinningOption Type
const WinningOptionType = new GraphQLObjectType({
    name: 'WinningOption',
    fields: () => ({
        option: { type: GraphQLString },
        averageRating: { type: GraphQLFloat }
    })
});

// PollResult Type
const PollResultType = new GraphQLObjectType({
    name: 'PollResult',
    fields: () => ({
        pollTitle: { type: GraphQLString },
        totalVotes: { type: GraphQLInt },
        voters: { type: new GraphQLList(GraphQLString) },
        results: { type: new GraphQLList(WinningOptionType) },
        allAverageRatings: { type: new GraphQLList(WinningOptionType) }
    })
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        polls: {
            type: new GraphQLList(PollType),
            resolve(parent: any, args: any): Promise<Poll[]> {
                return new Promise((resolve, reject) => {
                    db.all('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id', [], (err: Error | null, rows: any[]) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows.map(row => ({
                                ...row,
                                options: JSON.parse(row.options),
                                creator: { username: row.creatorUsername }
                            })));
                        }
                    });
                });
            }
        },
        poll: {
            type: PollType,
            args: { id: { type: GraphQLID } },
            resolve(parent: any, args: { id: string }): Promise<Poll | null> {
                return new Promise((resolve, reject) => {
                    db.get('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id WHERE Polls.id = ?', [parseInt(args.id, 10)], (err: Error | null, row: any) => {
                        if (err) {
                            reject(err);
                        } else if (!row) {
                            resolve(null);
                        } else {
                            resolve({
                                ...row,
                                options: JSON.parse(row.options),
                                creator: { username: row.creatorUsername }
                            });
                        }
                    });
                });
            }
        },
        myPolls: {
            type: MyPollsType,
            args: { userId: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parent: any, args: { userId: string }) {
                return { userId: args.userId };
            }
        },
        pollResults: {
            type: PollResultType,
            args: { pollId: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parent: any, args: { pollId: string }): Promise<any> {
                return new Promise((resolve, reject) => {
                    db.get('SELECT title, options FROM Polls WHERE id = ?', [args.pollId], (err: Error | null, pollRow: Poll) => {
                        if (err) {
                            reject(err);
                        } else if (!pollRow) {
                            reject(new Error('Poll not found'));
                        } else {
                            const pollTitle = pollRow.title;
                            const pollOptions = JSON.parse(pollRow.options);

                            db.all('SELECT u.username, vd.option, vd.rating FROM Votes v JOIN Users u ON v.userId = u.id LEFT JOIN VoteDetails vd ON v.voteId = vd.voteId WHERE v.pollId = ?', [args.pollId], (err: Error | null, rows: any[]) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    const optionRatings: { [key: string]: number[] } = {};
                                    pollOptions.forEach((option: string) => {
                                        optionRatings[option] = [];
                                    });

                                    const votersSet = new Set<string>();
                                    rows.forEach(row => {
                                        if (row.username) votersSet.add(row.username);
                                        if (row.option && optionRatings[row.option]) {
                                            optionRatings[row.option].push(row.rating);
                                        }
                                    });

                                    const averageRatings: { [key: string]: number } = {};
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

                                    const winningOptions: { option: string, averageRating: number }[] = [];
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
            type: new GraphQLList(PollType),
            args: { searchTerm: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parent: any, args: { searchTerm: string }): Promise<Poll[]> {
                return new Promise((resolve, reject) => {
                    db.all('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id WHERE Polls.title LIKE ?', [`%${args.searchTerm}%`], (err: Error | null, rows: any[]) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows.map(row => ({
                                ...row,
                                options: JSON.parse(row.options),
                                creator: { username: row.creatorUsername }
                            })));
                        }
                    });
                });
            }
        }
    }
});

// Rating Input Type
const RatingInput = new GraphQLInputObjectType({
    name: 'RatingInput',
    fields: {
        option: { type: new GraphQLNonNull(GraphQLString) },
        rating: { type: new GraphQLNonNull(GraphQLInt) }
    }
});

const LoginResponseType = new GraphQLObjectType({
    name: 'LoginResponse',
    fields: () => ({
        token: { type: GraphQLString },
        userId: { type: GraphQLID },
        username: { type: GraphQLString }
    })
});

const CreatePollPayload = new GraphQLObjectType({
    name: 'CreatePollPayload',
    fields: () => ({
        pollEdge: { type: PollEdgeType },
    }),
});

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createPoll: {
            type: CreatePollPayload,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                options: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
                userId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent: any, args: { title: string, options: string[], userId: string }): Promise<any> {
                return new Promise((resolve, reject) => {
                    const optionsJson = JSON.stringify(args.options);
                    db.run('INSERT INTO Polls (title, options, creatorId) VALUES (?, ?, ?)', [args.title, optionsJson, parseInt(args.userId, 10)], function (this: any, err: Error | null) {
                        if (err) {
                            reject(err);
                        } else {
                            const pollId = this.lastID;
                            db.run('INSERT INTO PollPermissions (pollId, permission_type, target_type, target_id) VALUES (?, ?, ?, ?)', [pollId, PermissionType.EDIT, TargetType.USER, parseInt(args.userId, 10)], function (this: any, err2: Error | null) {
                                if (err2) {
                                    reject(err2);
                                } else {
                                    db.get('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id WHERE Polls.id = ?', [pollId], (err3: Error | null, row: any) => {
                                        if (err3) {
                                            reject(err3);
                                        } else {
                                            const newPoll = {
                                                ...row,
                                                options: JSON.parse(row.options),
                                                creator: { username: row.creatorUsername }
                                            };
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
                pollId: { type: new GraphQLNonNull(GraphQLID) },
                userId: { type: new GraphQLNonNull(GraphQLID) },
                ratings: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(RatingInput))) }
            },
            resolve(parent: any, args: { pollId: string, userId: string, ratings: { option: string, rating: number }[] }): Promise<Poll> {
                return new Promise((resolve, reject) => {
                    db.get('SELECT username FROM Users WHERE id = ?', [parseInt(args.userId, 10)], (err: Error | null, user: User) => {
                        if (err || !user) {
                            reject(new Error('User not found'));
                        } else {
                            db.run('INSERT OR REPLACE INTO Votes (pollId, userId) VALUES (?, ?)', [args.pollId, args.userId], function (this: any, err: Error | null) {
                                if (err) {
                                    reject(err);
                                } else {
                                    const voteId = this.lastID;
                                    db.run('DELETE FROM VoteDetails WHERE pollId = ? AND voteId = ?', [args.pollId, voteId], function (this: any, err2: Error | null) {
                                        if (err2) {
                                            reject(err2);
                                        } else {
                                            const stmt = db.prepare('INSERT INTO VoteDetails (pollId, voteId, option, rating) VALUES (?, ?, ?, ?)');
                                            args.ratings.forEach(({ option, rating }) => {
                                                stmt.run([args.pollId, voteId, option, rating]);
                                            });
                                            stmt.finalize();
                                            db.get('SELECT * FROM Polls WHERE id = ?', [args.pollId], (err: Error | null, row: Poll) => {
                                                if (err) {
                                                    reject(err);
                                                } else {
                                                    resolve({
                                                        ...row,
                                                        options: JSON.parse(row.options)
                                                    });
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
                pollId: { type: new GraphQLNonNull(GraphQLID) },
                userId: { type: new GraphQLNonNull(GraphQLID) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                options: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) }
            },
            resolve(parent: any, args: { pollId: string, userId: string, title: string, options: string[] }): Promise<Poll> {
                return new Promise((resolve, reject) => {
                    db.get('SELECT permission_type FROM PollPermissions WHERE pollId = ? AND target_id = ? AND permission_type = ?', [parseInt(args.pollId, 10), parseInt(args.userId, 10), PermissionType.EDIT], (err: Error | null, row: PollPermission) => {
                        if (err || !row) {
                            reject(new Error('No edit permission'));
                        } else {
                            const optionsJson = JSON.stringify(args.options);
                            db.run('UPDATE Polls SET title = ?, options = ? WHERE id = ?', [args.title, optionsJson, args.pollId], function (this: any, err2: Error | null) {
                                if (err2) {
                                    reject(err2);
                                } else {
                                    db.get('SELECT * FROM Polls WHERE id = ?', [args.pollId], (err3: Error | null, updatedPoll: Poll) => {
                                        if (err3) {
                                            reject(err3);
                                        } else {
                                            resolve({
                                                ...updatedPoll,
                                                options: JSON.parse(updatedPoll.options)
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
                signup: {
            type: UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent: any, args: any): Promise<User> {
                const hashedPassword = await bcrypt.hash(args.password, 10);
                return new Promise((resolve, reject) => {
                    db.run('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [args.username, args.email, hashedPassword], function(this: any, err: Error | null) {
                        if (err) {
                            if (err.message.includes('UNIQUE constraint failed: Users.username')) {
                                reject(new Error('Username already exists.'));
                            } else if (err.message.includes('UNIQUE constraint failed: Users.email')) {
                                reject(new Error('Email already exists.'));
                            } else {
                                reject(err);
                            }
                        } else {
                            resolve({ id: this.lastID, username: args.username, email: args.email });
                        }
                    });
                });
            }
        },
        login: {
            type: LoginResponseType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent: any, args: any): Promise<{ token: string, userId: number, username: string }> {
                return new Promise((resolve, reject) => {
                    db.get('SELECT * FROM Users WHERE username = ? OR email = ?', [args.username, args.username], (err: Error | null, user: User) => {
                        if (err) {
                            return reject(err);
                        }
                        if (!user) {
                            return reject(new Error('Invalid username or password.'));
                        }

                        bcrypt.compare(args.password, user.password!, (err: Error | undefined, match: boolean) => {
                            if (err) {
                                return reject(err);
                            }
                            if (!match) {
                                return reject(new Error('Invalid username or password.'));
                            }

                            const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
                            resolve({ token, userId: user.id, username: user.username });
                        });
                    });
                });
            }
        }
    }
});

export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
