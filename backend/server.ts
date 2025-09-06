import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
