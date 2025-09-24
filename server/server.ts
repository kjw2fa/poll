import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import schema from './schema.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './schema.js';

const app = express();
const httpServer = http.createServer(app);
const port = 3001;

const server = new ApolloServer({
    schema,
});

async function startServer() {
    await server.start();

    app.use(cors());
    app.use(express.json());

    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }: { req: express.Request }) => {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                try {
                    const user = jwt.verify(token, JWT_SECRET);
                    return { userId: (user as any).userId };
                } catch (err) {
                    // handle error
                }
            }
            return {};
        },
    }));

    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
    console.log(`Server running on port ${port}`);
}

startServer();
