"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const enums_1 = require("./enums");
const DBSOURCE = path_1.default.join(__dirname, '../db.sqlite'); // Always use project root
let db = new sqlite3_1.default.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
    else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE Polls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            options TEXT,
            creatorId INTEGER
            )`, (err) => {
            if (err) {
                // Table already created
            }
            else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO Polls (title, options, creatorId) VALUES (?,?,?)';
                db.run(insert, ["What's your favorite color?", JSON.stringify(["Red", "Green", "Blue"]), 1]);
            }
        });
        db.run(`CREATE TABLE Votes (
            voteId INTEGER PRIMARY KEY AUTOINCREMENT,
            pollId INTEGER,
            userId TEXT,
            UNIQUE(pollId, userId)
            )`, (err) => {
            if (err) {
                // Table already created
            }
        });
        db.run(`CREATE TABLE VoteDetails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pollId INTEGER,
            voteId INTEGER,
            option TEXT,
            rating INTEGER
            )`, (err) => {
            if (err) {
                // Table already created
            }
        });
        db.run(`CREATE TABLE Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT
            )`, (err) => {
            if (err) {
                // Table already created
            }
        });
        db.run(`DROP TABLE IF EXISTS PollPermissions`, (err) => {
            if (err) {
                console.error(err.message);
            }
        });
        db.run(`CREATE TABLE PollPermissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pollId INTEGER,
            permission_type TEXT CHECK(permission_type IN (${Object.values(enums_1.PermissionType).map(t => `'${t}'`).join(', ')})),
            target_type TEXT CHECK(target_type IN (${Object.values(enums_1.TargetType).map(t => `'${t}'`).join(', ')})),
            target_id INTEGER,
            FOREIGN KEY (pollId) REFERENCES Polls(id),
            FOREIGN KEY (target_id) REFERENCES Users(id)
            )`, (err) => {
            if (err) {
                // Table already created
            }
        });
    }
});
exports.default = db;
