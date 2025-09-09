import path from 'path';
import sqlite3 from 'sqlite3';
import { PermissionType, TargetType } from './enums';

const DBSOURCE = path.join(__dirname, '../db.sqlite'); // Always use project root

let db = new sqlite3.Database(DBSOURCE, (err: Error | null) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS Polls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                options TEXT,
                creatorId INTEGER
                )`, (err: Error | null) => {
                if (err) {
                    console.error(err.message);
                }
            });
            db.run(`CREATE TABLE IF NOT EXISTS Votes (
                voteId INTEGER PRIMARY KEY AUTOINCREMENT,
                pollId INTEGER,
                userId TEXT,
                UNIQUE(pollId, userId)
                )`, (err: Error | null) => {
                if (err) {
                    console.error(err.message);
                }
            });
            db.run(`CREATE TABLE IF NOT EXISTS VoteDetails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pollId INTEGER,
                voteId INTEGER,
                option TEXT,
                rating INTEGER
                )`, (err: Error | null) => {
                if (err) {
                    console.error(err.message);
                }
            });
            db.run(`CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                email TEXT UNIQUE,
                password TEXT
                )`, (err: Error | null) => {
                if (err) {
                    console.error(err.message);
                }
            });
            db.run(`CREATE TABLE IF NOT EXISTS PollPermissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pollId INTEGER,
                permission_type TEXT CHECK(permission_type IN (${Object.values(PermissionType).map(t => `'${t}'`).join(', ')})),
                target_type TEXT CHECK(target_type IN (${Object.values(TargetType).map(t => `'${t}'`).join(', ')})),
                target_id INTEGER,
                FOREIGN KEY (pollId) REFERENCES Polls(id),
                FOREIGN KEY (target_id) REFERENCES Users(id)
                )`, (err: Error | null) => {
                if (err) {
                    console.error(err.message);
                }
            });
        });
    }
});

export default db;
