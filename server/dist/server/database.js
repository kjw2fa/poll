import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { PermissionType, TargetType } from './enums.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DBSOURCE = path.join(__dirname, '../db.sqlite'); // Always use project root
const dbPromise = new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DBSOURCE, (err) => {
        if (err) {
            // Cannot open database
            console.error(err.message);
            reject(err);
        }
        else {
            console.log('Connected to the SQLite database.');
            console.log('Dropping and recreating tables...');
            const permissionTypes = Object.values(PermissionType).map(t => `'${t}'`).join(', ');
            const targetTypes = Object.values(TargetType).map(t => `'${t}'`).join(', ');
            db.serialize(() => {
                // Drop existing tables for a clean slate
                db.run(`DROP TABLE IF EXISTS PollOptions`);
                db.run(`DROP TABLE IF EXISTS VoteDetails`);
                db.run(`DROP TABLE IF EXISTS Votes`);
                db.run(`DROP TABLE IF EXISTS PollPermissions`);
                db.run(`DROP TABLE IF EXISTS Polls`);
                db.run(`DROP TABLE IF EXISTS Users`);
                console.log('Tables dropped.');
                // Create new tables
                db.run(`CREATE TABLE IF NOT EXISTS Polls (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT
                    )`, (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                });
                db.run(`CREATE TABLE IF NOT EXISTS PollOptions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    pollId INTEGER,
                    optionText TEXT,
                    FOREIGN KEY (pollId) REFERENCES Polls(id)
                    )`, (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                });
                db.run(`CREATE TABLE IF NOT EXISTS Votes (
                    voteId INTEGER PRIMARY KEY AUTOINCREMENT,
                    pollId INTEGER,
                    userId INTEGER,
                    UNIQUE(pollId, userId)
                    )`, (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                });
                db.run(`CREATE TABLE IF NOT EXISTS VoteDetails (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    voteId INTEGER,
                    optionId INTEGER,
                    rating INTEGER,
                    FOREIGN KEY (voteId) REFERENCES Votes(voteId),
                    FOREIGN KEY (optionId) REFERENCES PollOptions(id)
                    )`, (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                });
                db.run(`CREATE TABLE IF NOT EXISTS Users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE,
                    email TEXT UNIQUE,
                    password TEXT
                    )`, (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                });
                db.run(`CREATE TABLE IF NOT EXISTS PollPermissions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    pollId INTEGER,
                    permission_type TEXT CHECK(permission_type IN (${permissionTypes})),
                    target_type TEXT CHECK(target_type IN (${targetTypes})),
                    target_id INTEGER,
                    FOREIGN KEY (pollId) REFERENCES Polls(id),
                    FOREIGN KEY (target_id) REFERENCES Users(id)
                    )`, (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                });
                console.log('Tables recreated.');
                resolve(db);
            });
        }
    });
});
export default dbPromise;
