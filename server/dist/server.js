"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const http_1 = __importDefault(require("http"));
const schema_1 = __importDefault(require("./schema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_2 = require("./schema");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const port = 3001;
const server = new server_1.ApolloServer({
    schema: schema_1.default,
});
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield server.start();
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        app.use('/graphql', (0, express4_1.expressMiddleware)(server, {
            context: ({ req }) => __awaiter(this, void 0, void 0, function* () {
                const authHeader = req.headers.authorization;
                if (authHeader) {
                    const token = authHeader.split(' ')[1];
                    try {
                        const user = jsonwebtoken_1.default.verify(token, schema_2.JWT_SECRET);
                        return { userId: user.userId };
                    }
                    catch (err) {
                        // handle error
                    }
                }
                return {};
            }),
        }));
        yield new Promise((resolve) => httpServer.listen({ port }, resolve));
        console.log(`Server running on port ${port}`);
    });
}
startServer();
