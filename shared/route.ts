import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import prisma from '../next-app/lib/prisma';
import { Prisma } from '@prisma/client';
import { Resolvers, PermissionType, TargetType } from './schema';
import { AuthUser, ResolverContext } from './types/context';


const typeDefs = fs.readFileSync(path.join(process.cwd(), 'shared/schema.graphql'), 'utf-8');

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

const resolvers: Resolvers<ResolverContext> = {
    RootQueryType: {
        polls: async (parent, args, context) => {
            return context.prisma.poll.findMany();
        },
        poll: async (parent, { id }, context) => {
            const { id: pollIdStr } = fromGlobalId(id);
            const pollId = parseInt(pollIdStr, 10);
            return context.prisma.poll.findUnique({ where: { id: pollId } });
        },
        searchPolls: async (parent, { searchTerm }, context) => {
            return context.prisma.poll.findMany({
                where: {
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
            });
        },
        user: async (parent, { id }, context) => {
            const { id: userIdStr } = fromGlobalId(id);
            const userId = parseInt(userIdStr, 10);
            return context.prisma.user.findUnique({ where: { id: userId } });
        },
    },
    Mutation: {
        createPoll: async (parent, { title, options }, context) => {
            if (!context.user) {
                throw new Error('Authentication required');
            }
            const { id: userIdStr } = fromGlobalId(context.user.id);
            const parsedUserId = parseInt(userIdStr, 10);

            const poll = await context.prisma.poll.create({
                data: {
                    title,
                    creator: { connect: { id: parsedUserId } },
                    options: {
                        create: options.map((option) => ({ optionText: option.optionText })),
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

            return poll;
        },
        submitVote: async (parent, { pollId, ratings }, context) => {
            if (!context.user) {
                throw new Error('Authentication required');
            }
            const { id: pollIdStr } = fromGlobalId(pollId);
            const parsedPollId = parseInt(pollIdStr, 10);
            const { id: userIdStr } = fromGlobalId(context.user.id);
            const parsedUserId = parseInt(userIdStr, 10);

            return context.prisma.$transaction(async (tx) => {
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
                return poll;
            });
        },
        editPoll: async (parent, { pollId, title, options }, context) => {
            if (!context.user) {
                throw new Error('Authentication required');
            }
            const { id: pollIdStr } = fromGlobalId(pollId);
            const parsedPollId = parseInt(pollIdStr, 10);
            const { id: userIdStr } = fromGlobalId(context.user.id);
            const parsedUserId = parseInt(userIdStr, 10);

            const permission = await context.prisma.pollPermission.findFirst({
                where: {
                    pollId: parsedPollId,
                    target_id: parsedUserId,
                    permission_type: 'EDIT',
                },
            });

            if (!permission) {
                throw new Error('No edit permission');
            }

            return context.prisma.$transaction(async (tx) => {
                await tx.poll.update({
                    where: { id: parsedPollId },
                    data: { title },
                });

                const currentOptions = await tx.pollOption.findMany({
                    where: { pollId: parsedPollId },
                });
                const currentOptionIds = currentOptions.map(o => o.id);

                const addedOptions = options.filter(o => !o.id);
                const updatedOptions = options.filter((o): o is (typeof o & { id: string }) => !!o.id);
                const updatedOptionIds = updatedOptions.map(o => parseInt(fromGlobalId(o.id).id, 10));

                const removedOptionIds = currentOptionIds.filter(id => !updatedOptionIds.includes(id));

                if (removedOptionIds.length > 0) {
                    await tx.pollVoteRating.deleteMany({
                        where: {
                            optionId: {
                                in: removedOptionIds,
                            },
                        },
                    });
                    await tx.pollOption.deleteMany({
                        where: {
                            id: {
                                in: removedOptionIds,
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
                            where: { id: parseInt(fromGlobalId(option.id).id, 10) },
                            data: { optionText: option.optionText },
                        });
                    }
                }

                const poll = await tx.poll.findUnique({ where: { id: parsedPollId } });
                if (!poll) {
                    throw new Error('Poll not found after edit');
                }
                return poll;
            });
        },
        signup: async (parent, { username, email, password }, context) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            try {
                return await context.prisma.user.create({
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
        login: async (parent, { usernameOrEmail, password }, context) => {
            const user = await context.prisma.user.findFirst({
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
        id: (parent) => toGlobalId('Poll', parent.id),
        options: async (parent, args, context) => {
            return context.prisma.pollOption.findMany({ where: { pollId: parent.id } });
        },
        permissions: async (parent, args, context) => {
            return context.prisma.pollPermission.findMany({ where: { pollId: parent.id } });
        },
        votes: async (parent, args, context) => {
            return context.prisma.pollVote.findMany({ where: { pollId: parent.id } });
        },
    },
    PollOption: {
        id: (parent) => toGlobalId('PollOption', parent.id)
    },
    Vote: {
        id: (parent) => toGlobalId('Vote', parent.id),
        user: async (parent, args, context) => {
            const user = await context.prisma.user.findUnique({ where: { id: parent.userId } });
            if (!user) {
                throw new Error('User not found for vote');
            }
            return user;
        },
        poll: async (parent, args, context) => {
            const poll = await context.prisma.poll.findUnique({ where: { id: parent.pollId } });
            if (!poll) {
                throw new Error('Poll not found for vote');
            }
            return poll;
        },
        ratings: async (parent, args, context) => {
            const ratings = await context.prisma.pollVoteRating.findMany({
                where: { voteId: parent.id },
                include: { option: true },
            });
            return ratings.map(r => ({
                option: r.option,
                rating: r.rating,
            }));
        },
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
        polls: (parent, { permission }, context) => {
            const userId = parent.id;
            return context.prisma.poll.findMany({
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

const server = new ApolloServer<ResolverContext>({
    schema,
});

const handler = startServerAndCreateNextHandler(server, {
    context: async (req) => {
        const authHeader = req.headers.authorization;
        let authUser: AuthUser | null = null;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded  && typeof decoded.userId === 'number') {
                    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
                    if (user) {
                        authUser = {
                            id: toGlobalId('User', user.id),
                            email: user.email,
                            role: 'USER', // You might want to add a role to your user model
                        };
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }
        return { user: authUser, prisma };
    },
});

export { handler as GET, handler as POST };