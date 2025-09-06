import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema, GraphQLBoolean, GraphQLNonNull, GraphQLInputObjectType, GraphQLInt, GraphQLFloat } from 'graphql';
import db from './database';

const JWT_SECRET = 'your-secret-key';

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
    userId: number;
    canEdit: boolean;
}

// User Type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString }
    })
});

// Permissions Type
const PermissionsType = new GraphQLObjectType({
    name: 'Permissions',
    fields: () => ({
        canEdit: { type: GraphQLBoolean }
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
            type: PermissionsType,
            args: { userId: { type: GraphQLID } },
            resolve(parent: Poll, args: { userId: string }): Promise<{ canEdit: boolean }> {
                return new Promise((resolve, reject) => {
                    db.get('SELECT canEdit FROM PollPermissions WHERE pollId = ? AND userId = ?', [parent.id, parseInt(args.userId, 10)], (err: Error | null, row: PollPermission) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({
                                canEdit: row ? !!row.canEdit : false
                            });
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

// MyPolls Type
const MyPollsType = new GraphQLObjectType({
    name: 'MyPolls',
    fields: () => ({
        createdPolls: { type: new GraphQLList(PollType) },
        votedPolls: { type: new GraphQLList(PollType) }
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
            resolve(parent: any, args: { userId: string }): Promise<{ createdPolls: Poll[], votedPolls: Poll[] }> {
                return new Promise((resolve, reject) => {
                    const createdPollsPromise: Promise<Poll[]> = new Promise((resolve, reject) => {
                        db.all('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id JOIN PollPermissions ON Polls.id = PollPermissions.pollId WHERE PollPermissions.userId = ? AND PollPermissions.canEdit = 1', [parseInt(args.userId, 10)], (err: Error | null, rows: any[]) => {
                            if (err) reject(err);
                            else resolve(rows.map(row => ({ ...row, options: JSON.parse(row.options), creator: { username: row.creatorUsername } })));
                        });
                    });

                    const votedPollsPromise: Promise<Poll[]> = new Promise((resolve, reject) => {
                        db.all('SELECT Polls.*, Users.username as creatorUsername FROM Polls JOIN Users ON Polls.creatorId = Users.id JOIN Votes ON Polls.id = Votes.pollId WHERE Votes.userId = ? GROUP BY Polls.id', [parseInt(args.userId, 10)], (err: Error | null, rows: any[]) => {
                            if (err) reject(err);
                            else resolve(rows.map(row => ({ ...row, options: JSON.parse(row.options), creator: { username: row.creatorUsername } })));
                        });
                    });

                    Promise.all([createdPollsPromise, votedPollsPromise])
                        .then(([createdPolls, votedPolls]) => {
                            resolve({ createdPolls, votedPolls });
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
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

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createPoll: {
            type: PollType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                options: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
                userId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent: any, args: { title: string, options: string[], userId: string }): Promise<Poll> {
                return new Promise((resolve, reject) => {
                    const optionsJson = JSON.stringify(args.options);
                    db.run('INSERT INTO Polls (title, options, creatorId) VALUES (?, ?, ?)', [args.title, optionsJson, parseInt(args.userId, 10)], function (this: any, err: Error | null) {
                        if (err) {
                            reject(err);
                        } else {
                            const pollId = this.lastID;
                            db.run('INSERT INTO PollPermissions (pollId, userId, canEdit) VALUES (?, ?, ?)', [pollId, parseInt(args.userId, 10), true], function (this: any, err2: Error | null) {
                                if (err2) {
                                    reject(err2);
                                } else {
                                    resolve({
                                        id: pollId,
                                        title: args.title,
                                        options: args.options.toString(),
                                        creatorId: parseInt(args.userId, 10)
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
                    db.get('SELECT canEdit FROM PollPermissions WHERE pollId = ? AND userId = ?', [parseInt(args.pollId, 10), parseInt(args.userId, 10)], (err: Error | null, row: PollPermission) => {
                        if (err || !row || !row.canEdit) {
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
                            reject(err);
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