"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("./schema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Import jwt
const schema_2 = require("./schema"); // Import JWT_SECRET
const app = (0, express_1.default)();
const port = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Middleware to extract and verify JWT
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, schema_2.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.userId = user.userId; // Attach userId to request object
            next();
        });
    }
    else {
        next();
    }
});
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)((req) => ({
    schema: schema_1.default,
    graphiql: true,
    context: { userId: req.userId } // Pass userId to context
})));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
