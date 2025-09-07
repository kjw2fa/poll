import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';
import jwt from 'jsonwebtoken'; // Import jwt
import { JWT_SECRET } from './schema'; // Import JWT_SECRET

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Middleware to extract and verify JWT
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            (req as any).userId = (user as any).userId; // Attach userId to request object
            next();
        });
    } else {
        next();
    }
});

app.use('/graphql', graphqlHTTP((req) => ({
    schema,
    graphiql: true,
    context: { userId: (req as any).userId } // Pass userId to context
})));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
