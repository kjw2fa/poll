import path from 'path';
import sqlite3 from 'sqlite3';

const DBSOURCE = path.join(__dirname, '../db.sqlite'); // Always use project root

let db = new sqlite3.Database(DBSOURCE, (err: Error | null) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE Polls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            options TEXT,
            creatorId INTEGER
            )`, (err: Error | null) => {
            if (err) {
                // Table already created
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO Polls (title, options, creatorId) VALUES (?,?,?)'
                db.run(insert, ["What's your favorite color?", JSON.stringify(["Red", "Green", "Blue"]), 1])
            }
        });
        db.run(`CREATE TABLE Votes (
            voteId INTEGER PRIMARY KEY AUTOINCREMENT,
            pollId INTEGER,
            userId TEXT,
            UNIQUE(pollId, userId)
            )`, (err: Error | null) => {
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
            )`, (err: Error | null) => {
            if (err) {
                // Table already created
            }
        });
        db.run(`CREATE TABLE Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT
            )`, (err: Error | null) => {
            if (err) {
                // Table already created
            }
        });
        db.run(`CREATE TABLE PollPermissions (
            pollId INTEGER,
            userId INTEGER,
            canEdit BOOLEAN,
            PRIMARY KEY (pollId, userId)
            )`, (err: Error | null) => {
            if (err) {
                // Table already created
            }
        });
    }
});

export default db;
