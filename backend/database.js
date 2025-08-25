const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = path.join(__dirname, '../db.sqlite'); // Always use project root

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE Polls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            options TEXT
            )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO Polls (title, options) VALUES (?,?,?)'
                    db.run(insert, [null, "What's your favorite color?", JSON.stringify(["Red", "Green", "Blue"])])
                }
            });
        db.run(`CREATE TABLE Votes (
            voteId INTEGER PRIMARY KEY AUTOINCREMENT,
            pollId INTEGER,
            userId TEXT,
            userName TEXT,
            UNIQUE(pollId, userId)
            )`,
            (err) => {
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
            )`,
            (err) => {
                if (err) {
                    // Table already created
                }
            });
        db.run(`CREATE TABLE Users (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT
            )`,
            (err) => {
                if (err) {
                    // Table already created
                }
            });
        db.run(`CREATE TABLE PollPermissions (
            pollId INTEGER,
            userId INTEGER,
            canEdit BOOLEAN,
            PRIMARY KEY (pollId, userId)
            )`,
            (err) => {
                if (err) {
                    // Table already created
                }
            });
    }
});


module.exports = db
