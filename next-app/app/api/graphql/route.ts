import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import prisma from '../../../lib/prisma';
import { Prisma } from '@prisma/client';
import { Resolvers } from '../../../../shared/resolver-types';
import { PermissionType, TargetType } from '../../../../shared/schema-types';


/**
 * The context object is shared across all resolvers in a single GraphQL request.
 * It's used to pass down request-specific information, such as authentication data.
 */
export interface Context {
  /** The ID of the currently authenticated user, or undefined if the user is not logged in. */
  userId?: number;
}

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

const resolvers: Resolvers = {
    RootQueryType: {
        polls: async () => {
            return prisma.poll.findMany();
        },
        poll: async (parent: unknown, { id }: { id: string }) => {
            const { id: pollIdStr } = fromGlobalId(id);
            const pollId = parseInt(pollIdStr, 10);
            return prisma.poll.findUnique({ where: { id: pollId } });
        },
        searchPolls: async (parent: unknown, { searchTerm }: { searchTerm: string }) => {
            return prisma.poll.findMany({
                where: {
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
            });
        },
        user: async (parent: unknown, { id }: { id: string }) => {
            const { id: userIdStr } = fromGlobalId(id);
            const userId = parseInt(userIdStr, 10);
            return prisma.user.findUnique({ where: { id: userId } });
        },
    },
    Mutation: {
        createPoll: async (parent: unknown, { title, options, userId }: { title: string, options: { optionText: string }[], userId: string }) => {
            const { id: userIdStr } = fromGlobalId(userId);
            const parsedUserId = parseInt(userIdStr, 10);

            const poll = await prisma.poll.create({
                data: {
                    title,
                    creator: { connect: { id: parsedUserId } },
                    options: {
                        create: options.map(option => ({ optionText: option.optionText })),
                    },
                    permissions: {
                        create: {
                            permission_type: 'EDIT',
                            target_type: 'USER',
                            target_id: parsedUserId,
                        },
                    },
                },
            });

            return {
                pollEdge: {
                    cursor: toCursor(poll.id),
                    node: poll,
                },
            };
        },
        submitVote: async (parent: unknown, { pollId, userId, ratings }: { pollId: string, userId: string, ratings: { optionId: string, rating: number }[] }) => {
            const { id: pollIdStr } = fromGlobalId(pollId);
            const parsedPollId = parseInt(pollIdStr, 10);
            const { id: userIdStr } = fromGlobalId(userId);
            const parsedUserId = parseInt(userIdStr, 10);

            return prisma.$transaction(async (tx) => {
                // First, delete existing vote ratings for the user and poll.
                await tx.pollVoteRating.deleteMany({
                    where: {
                        vote: {
                            pollId: parsedPollId,
                            userId: parsedUserId,
                        },
                    },
                });

                // Then, create the new vote and ratings.
                const vote = await tx.pollVote.upsert({
                    where: {
                        pollId_userId: {
                            pollId: parsedPollId,
                            userId: parsedUserId,
                        },
                    },
                    update: {},
                    create: {
                        pollId: parsedPollId,
                        userId: parsedUserId,
                    },
                });

                await tx.pollVoteRating.createMany({
                    data: ratings.map(({ optionId: optionIdStr, rating }) => {
                        const { id: optionId } = fromGlobalId(optionIdStr);
                        return {
                            voteId: vote.id,
                            optionId: parseInt(optionId, 10),
                            rating,
                        };
                    }),
                });

                const poll = await tx.poll.findUnique({ where: { id: parsedPollId } });
                if (!poll) {
                    throw new Error('Poll not found after voting');
                }
                // We return the entire poll object here so that Relay can update its cache. 
                // When a mutation happens, it's best practice to return all the objects
                // that were affected by the mutation so the client-side cache can be
                // updated accurately.
                return poll;
            });
        },
        editPoll: async (parent: unknown, { pollId, userId, title, options }: { pollId: string, userId: string, title: string, options: { id?: string | null, optionText: string }[] }) => {
            const { id: pollIdStr } = fromGlobalId(pollId);
            const parsedPollId = parseInt(pollIdStr, 10);
            const { id: userIdStr } = fromGlobalId(userId);
            const parsedUserId = parseInt(userIdStr, 10);

            // TODO: Use row level security in the database instead of checking permissions here.
            const permission = await prisma.pollPermission.findFirst({
                where: {
                    pollId: parsedPollId,
                    target_id: parsedUserId,
                    permission_type: 'EDIT',
                },
            });

            if (!permission) {
                throw new Error('No edit permission');
            }

            return prisma.$transaction(async (tx) => {
                await tx.poll.update({
                    where: { id: parsedPollId },
                    data: { title },
                });

                const currentOptions = await tx.pollOption.findMany({
                    where: { pollId: parsedPollId },
                });

                const newOptions = options;

                const newOptionIds = newOptions.map(o => o.id ? parseInt(fromGlobalId(o.id).id, 10) : null).filter(id => id !== null);
                
                const removedOptions = currentOptions.filter(o => !newOptionIds.includes(o.id));
                const addedOptions = newOptions.filter(o => !o.id);
                const updatedOptions = newOptions.filter(o => o.id && newOptionIds.includes(parseInt(fromGlobalId(o.id).id, 10)));

                if (removedOptions.length > 0) {
                    await tx.pollVoteRating.deleteMany({
                        where: {
                            optionId: {
                                in: removedOptions.map(o => o.id),
                            },
                        },
                    });
                    await tx.pollOption.deleteMany({
                        where: {
                            id: {
                                in: removedOptions.map(o => o.id),
                            },
                        },
                    });
                }

                if (addedOptions.length > 0) {
                    await tx.pollOption.createMany({
                        data: addedOptions.map(o => ({
                            pollId: parsedPollId,
                            optionText: o.optionText,
                        })),
                    });
                }

                if (updatedOptions.length > 0) {
                    for (const option of updatedOptions) {
                        await tx.pollOption.update({
                            where: { id: parseInt(fromGlobalId(option.id!).id, 10) },
                            data: { optionText: option.optionText },
                        });
                    }
                }

                return tx.poll.findUnique({ where: { id: parsedPollId } });
            });
        },
        signup: async (parent: unknown, { username, email, password }: { username: string, email: string, password: string }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            try {
                return await prisma.user.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword,
                    },
                });
            } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === 'P2002') {
                        throw new Error('Username or email already exists.');
                    }
                }
                throw e;
            }
        },
        login: async (parent: unknown, { usernameOrEmail, password }: { usernameOrEmail: string, password: string }) => {
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username: usernameOrEmail },
                        { email: usernameOrEmail },
                    ],
                },
            });
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
        id: (parent: {id: number}) => toGlobalId('Poll', parent.id),
        options: (parent: {id: number}) => {
            return prisma.pollOption.findMany({ where: { pollId: parent.id } });
        },
        permissions: (parent: {id: number}) => {
            return prisma.pollPermission.findMany({ where: { pollId: parent.id } });
        },
        votes: (parent: {id: number}) => {
            return prisma.pollVote.findMany({ where: { pollId: parent.id } });
        },
    },
    PollOption: {
        id: (parent: {id: number}) => toGlobalId('PollOption', parent.id)
    },
    Vote: {
        id: (parent: {id: number}) => toGlobalId('Vote', parent.id),
        user: async (parent: {userId: number}) => {
            const user = await prisma.user.findUnique({ where: { id: parent.userId } });
            if (!user) {
                throw new Error('User not found for vote');
            }
            return user;
        },
        poll: async (parent: {pollId: number}) => {
            const poll = await prisma.poll.findUnique({ where: { id: parent.pollId } });
            if (!poll) {
                throw new Error('Poll not found for vote');
            }
            return poll;
        },
        ratings: (parent: {id: number}) => {
            return prisma.pollVoteRating.findMany({
                where: { voteId: parent.id },
                include: { option: true },
            }).then(ratings => ratings.map(r => ({
                option: r.option,
                rating: r.rating,
            })));
        },
    },
    PollPermissions: {
        target_id: (parent: {target_id: number | null, target_type: string}) => {
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
        id: (parent: {id: number}) => toGlobalId('User', parent.id),
        polls: (parent: {id: number}, { permission }: { permission?: PermissionType | null }) => {
            const userId = parent.id;
            return prisma.poll.findMany({
                where: {
                    permissions: {
                        some: {
                            target_id: userId,
                            permission_type: permission || undefined,
                        },
                    },
                },
            });
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
                if (typeof user === 'object' && user !== null && 'userId' in user) {
                    return { userId: user.userId };
                }
            } catch (err) {
                console.error(err);
            }
        }
        return {};
    },
});

export { handler as GET, handler as POST };