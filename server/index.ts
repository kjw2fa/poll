import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { schema } from './route';
import prisma from '@/lib/prisma';
import { AuthUser, ResolverContext } from './types/context';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, toGlobalId } from './utils';

async function startServer() {
  const app = express();

  const server = new ApolloServer<ResolverContext>({
    schema,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
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
                            role: 'USER',
                        };
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }
        return { user: authUser, prisma };
      },
    }),
  );

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  });
}

startServer();
