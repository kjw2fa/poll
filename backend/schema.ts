import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema, GraphQLBoolean, GraphQLNonNull, GraphQLInputObjectType, GraphQLInt, GraphQLFloat, GraphQLEnumType } from 'graphql';
import db from './database';
import { dbGet, dbAll, dbRun } from './db-utils';
import { PermissionType, TargetType } from './enums';

// GraphQL object types
interface User {
    id: string;
    username: string;
    email: string;
    password?: string;
}

interface Poll {
    id: string;
    title: string;
    options: string[];
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
    target_id: string;
}

// Database row types
interface PollRow {
    id: number;
    title: string;
}

interface PollOptionRow {
    id: number;
    pollId: number;
    optionText: string;
}

interface VoteRow {
    voteId: number;
    pollId: number;
    userId: number;
}

interface VoteDetailRow {
    id: number;
    pollId: number;
    voteId: number;
    option: string;
    rating: number;
}

interface UserRow {
    id: number;
    username: string;
    email: string;
    password?: string;
}

interface PollPermissionRow {
    id: number;
    pollId: number;
    permission_type: PermissionType;
    target_type: TargetType;
    target_id: number;
}

interface PollResultRow {
    username: string;
    option: string;
    rating: number;
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

async function paginationResolver(baseQuery: string, queryParams: any[], { first, after, last, before }: { first?: number, after?: string, last?: number, before?: string }) {
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

    const rows = await dbAll<PollRow>(query, params);

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
        id: { type: new GraphQLNonNull(GraphQLID) },
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
        id: { 
            type: new GraphQLNonNull(GraphQLID),
            resolve: (parent: PollRow) => toGlobalId('Poll', parent.id)
        },
        title: { 
            type: GraphQLString,
            resolve: (parent: PollRow) => parent.title
        },
        options: { 
            type: new GraphQLList(GraphQLString),
            async resolve(parent: PollRow): Promise<string[]> {
                const rows = await dbAll<PollOptionRow>('SELECT optionText FROM PollOptions WHERE pollId = ?', [parent.id]);
                return rows.map(row => row.optionText);
            }
        },
        permissions: {
            type: new GraphQLList(PollPermissionsType),
            async resolve(parent: PollRow, args: any): Promise<PollPermissionRow[]> {
                const rows = await dbAll<PollPermissionRow>('SELECT * FROM PollPermissions WHERE pollId = ?', [parent.id]);
                return rows;
            }
        },
        votes: {
            type: new GraphQLList(VoteType),
            args: { userId: { type: new GraphQLNonNull(GraphQLID) } },
            async resolve(parent: PollRow, args: { userId: string }): Promise<VoteDetail[]> {
                const pollId = parent.id;
                const { id: userIdStr } = fromGlobalId(args.userId);
                const userId = parseInt(userIdStr, 10);

                const voteRow = await dbGet<VoteRow>('SELECT voteId FROM Votes WHERE pollId = ? AND userId = ? LIMIT 1', [pollId, userId]);
                if (!voteRow) {
                    return [];
                }
                const details = await dbAll<VoteDetailRow>('SELECT option, rating FROM VoteDetails WHERE pollId = ? AND voteId = ?', [pollId, voteRow.voteId]);
                
                const pollOptionsRows = await dbAll<PollOptionRow>('SELECT optionText FROM PollOptions WHERE pollId = ?', [pollId]);
                const pollOptions = pollOptionsRows.map(r => r.optionText);
                
                const filteredDetails = details.filter(detail => pollOptions.includes(detail.option));
                
                return filteredDetails;
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
                const { id: userIdStr } = fromGlobalId(parent.userId);
                const userId = parseInt(userIdStr, 10);
                const baseQuery = 'SELECT Polls.* FROM Polls JOIN PollPermissions ON Polls.id = PollPermissions.pollId WHERE PollPermissions.target_id = ? AND PollPermissions.permission_type = ?';
                return paginationResolver(baseQuery, [userId, PermissionType.EDIT], args);
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
                const { id: userIdStr } = fromGlobalId(parent.userId);
                const userId = parseInt(userIdStr, 10);
                const baseQuery = 'SELECT Polls.* FROM Polls JOIN Votes ON Polls.id = Votes.pollId WHERE Votes.userId = ? GROUP BY Polls.id';
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
            async resolve(parent: any, args: any): Promise<PollRow[]> {
                const rows = await dbAll<PollRow>('SELECT * FROM Polls', []);
                return rows;
            }
        },
        poll: {
            type: PollType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            async resolve(parent: any, args: { id: string }): Promise<PollRow | null> {
                const { id: pollIdStr } = fromGlobalId(args.id);
                const pollId = parseInt(pollIdStr, 10);
                const row = await dbGet<PollRow>('SELECT * FROM Polls WHERE id = ?', [pollId]);
                return row ?? null;
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
            async resolve(parent: any, args: { pollId: string }): Promise<any> {
                const { id: pollIdStr } = fromGlobalId(args.pollId);
                const pollId = parseInt(pollIdStr, 10);
                const pollRow = await dbGet<PollRow>('SELECT title FROM Polls WHERE id = ?', [pollId]);
                if (!pollRow) {
                    throw new Error('Poll not found');
                }
                const pollTitle = pollRow.title;

                const pollOptionsRows = await dbAll<PollOptionRow>('SELECT optionText FROM PollOptions WHERE pollId = ?', [pollId]);
                const pollOptions = pollOptionsRows.map(r => r.optionText);

                const rows = await dbAll<PollResultRow>('SELECT u.username, vd.option, vd.rating FROM Votes v JOIN Users u ON v.userId = u.id LEFT JOIN VoteDetails vd ON v.voteId = vd.voteId WHERE v.pollId = ?', [pollId]);
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

                return {
                    pollTitle,
                    totalVotes: votersSet.size,
                    voters: Array.from(votersSet),
                    results: winningOptions,
                    allAverageRatings
                };
            }
        },
        searchPolls: {
            type: new GraphQLList(PollType),
            args: { searchTerm: { type: new GraphQLNonNull(GraphQLString) } },
            async resolve(parent: any, args: { searchTerm: string }): Promise<PollRow[]> {
                const rows = await dbAll<PollRow>('SELECT * FROM Polls WHERE title LIKE ?', [`%${args.searchTerm}%`]);
                return rows;
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

const SubmitVotePayload = new GraphQLObjectType({
    name: 'SubmitVotePayload',
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
            async resolve(parent: any, args: { title: string, options: string[], userId: string }): Promise<any> {
                const { id: userIdStr } = fromGlobalId(args.userId);
                const userId = parseInt(userIdStr, 10);
                const result = await dbRun('INSERT INTO Polls (title) VALUES (?)', [args.title]);
                const pollId = result.lastID;

                for (const option of args.options) {
                    await dbRun('INSERT INTO PollOptions (pollId, optionText) VALUES (?, ?)', [pollId, option]);
                }

                await dbRun('INSERT INTO PollPermissions (pollId, permission_type, target_type, target_id) VALUES (?, ?, ?, ?)', [pollId, PermissionType.EDIT, TargetType.USER, userId]);
                
                const row = await dbGet<PollRow>('SELECT * FROM Polls WHERE id = ?', [pollId]);
                
                return {
                    pollEdge: {
                        cursor: toCursor(pollId),
                        node: row,
                    }
                };
            }
        },
        submitVote: {
            type: SubmitVotePayload,
            args: {
                pollId: { type: new GraphQLNonNull(GraphQLID) },
                userId: { type: new GraphQLNonNull(GraphQLID) },
                ratings: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(RatingInput))) }
            },
            async resolve(parent: any, args: { pollId: string, userId: string, ratings: { option: string, rating: number }[] }): Promise<any> {
                const { id: pollIdStr } = fromGlobalId(args.pollId);
                const pollId = parseInt(pollIdStr, 10);
                const { id: userIdStr } = fromGlobalId(args.userId);
                const userId = parseInt(userIdStr, 10);

                const user = await dbGet<UserRow>('SELECT username FROM Users WHERE id = ?', [userId]);
                if (!user) {
                    throw new Error('User not found');
                }
                const result = await dbRun('INSERT OR REPLACE INTO Votes (pollId, userId) VALUES (?, ?)', [pollId, userId]);
                const voteId = result.lastID;
                await dbRun('DELETE FROM VoteDetails WHERE pollId = ? AND voteId = ?', [pollId, voteId]);
                args.ratings.forEach(({ option, rating }) => {
                    dbRun('INSERT INTO VoteDetails (pollId, voteId, option, rating) VALUES (?, ?, ?, ?)', [pollId, voteId, option, rating]);
                });
                const row = await dbGet<PollRow>('SELECT * FROM Polls WHERE id = ?', [pollId]);
                return {
                    pollEdge: {
                        cursor: toCursor(pollId),
                        node: row,
                    }
                };
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
            async resolve(parent: any, args: { pollId: string, userId: string, title: string, options: string[] }): Promise<PollRow | null> {
                const { id: pollIdStr } = fromGlobalId(args.pollId);
                const pollId = parseInt(pollIdStr, 10);
                const { id: userIdStr } = fromGlobalId(args.userId);
                const userId = parseInt(userIdStr, 10);

                const permission = await dbGet<PollPermissionRow>('SELECT permission_type FROM PollPermissions WHERE pollId = ? AND target_id = ? AND permission_type = ?', [pollId, userId, PermissionType.EDIT]);
                if (!permission) {
                    throw new Error('No edit permission');
                }

                // Update title
                await dbRun('UPDATE Polls SET title = ? WHERE id = ?', [args.title, pollId]);

                // Get current options
                const currentOptionsRows = await dbAll<PollOptionRow>('SELECT optionText FROM PollOptions WHERE pollId = ?', [pollId]);
                const currentOptions = currentOptionsRows.map(r => r.optionText);

                // Find removed and added options
                const removedOptions = currentOptions.filter(o => !args.options.includes(o));
                const addedOptions = args.options.filter(o => !currentOptions.includes(o));

                if (removedOptions.length > 0) {
                    const placeholders = removedOptions.map(() => '?').join(',');
                    await dbRun(`DELETE FROM PollOptions WHERE pollId = ? AND optionText IN (${placeholders})`, [pollId, ...removedOptions]);
                    // Also delete votes for removed options
                    await dbRun(`DELETE FROM VoteDetails WHERE pollId = ? AND option IN (${placeholders})`, [pollId, ...removedOptions]);
                }

                if (addedOptions.length > 0) {
                    for (const option of addedOptions) {
                        await dbRun('INSERT INTO PollOptions (pollId, optionText) VALUES (?, ?)', [pollId, option]);
                    }
                }
                
                const updatedPoll = await dbGet<PollRow>('SELECT * FROM Polls WHERE id = ?', [pollId]);
                return updatedPoll ?? null;
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
                try {
                    const result = await dbRun('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [args.username, args.email, hashedPassword]);
                    return { id: toGlobalId('User', result.lastID), username: args.username, email: args.email };
                } catch (err: any) {
                    if (err.message.includes('UNIQUE constraint failed: Users.username')) {
                        throw new Error('Username already exists.');
                    }
                    if (err.message.includes('UNIQUE constraint failed: Users.email')) {
                        throw new Error('Email already exists.');
                    }
                    throw err;
                }
            }
        },
        login: {
            type: LoginResponseType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent: any, args: any): Promise<{ token: string, userId: string, username: string }> {
                const user = await dbGet<UserRow>('SELECT * FROM Users WHERE username = ? OR email = ?', [args.username, args.username]);
                if (!user) {
                    throw new Error('Invalid username or password.');
                }
                const match = await bcrypt.compare(args.password, user.password!)
                if (!match) {
                    throw new Error('Invalid username or password.');
                }
                const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
                return { token, userId: toGlobalId('User', user.id), username: user.username };
            }
        }
    }
});

export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
