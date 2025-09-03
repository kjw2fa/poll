const express = require('express');
const cors = require('cors');
const db = require('./database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();
const port = 3001;
const JWT_SECRET = 'ghosdjfojwelfasdlfjocieaitnkn3i5023r1j';

app.use(cors());
app.use(express.json());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));



















app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
