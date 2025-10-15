import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { PermissionType, TargetType } from '../../shared/generated-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DBSOURCE = path.join(__dirname, '../../db.sqlite'); // Adjusted path

const dbPromise = new Promise<sqlite3.Database>((resolve, reject) => {
    const db = new sqlite3.Database(DBSOURCE, (err: Error | null) => {
        if (err) {
            console.error(err.message)
            reject(err);
        } else {
            console.log('Connected to the SQLite database.');
            const permissionTypes = Object.values(PermissionType).map(t => `'${t}'`).join(', ');
            const targetTypes = Object.values(TargetType).map(t => `'${t}'`).join(', ');
            db.serialize(() => {
                db.run(`CREATE TABLE IF NOT EXISTS Polls ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT )`);
                db.run(`CREATE TABLE IF NOT EXISTS PollOptions ( id INTEGER PRIMARY KEY AUTOINCREMENT, pollId INTEGER, optionText TEXT, FOREIGN KEY (pollId) REFERENCES Polls(id) )`);
                db.run(`CREATE TABLE IF NOT EXISTS Votes ( id INTEGER PRIMARY KEY AUTOINCREMENT, pollId INTEGER, userId INTEGER, UNIQUE(pollId, userId) )`);
                db.run(`CREATE TABLE IF NOT EXISTS VoteDetails ( id INTEGER PRIMARY KEY AUTOINCREMENT, voteId INTEGER, optionId INTEGER, rating INTEGER, FOREIGN KEY (voteId) REFERENCES Votes(id), FOREIGN KEY (optionId) REFERENCES PollOptions(id) )`);
                db.run(`CREATE TABLE IF NOT EXISTS Users ( id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, email TEXT UNIQUE, password TEXT )`);
                db.run(`CREATE TABLE IF NOT EXISTS PollPermissions ( id INTEGER PRIMARY KEY AUTOINCREMENT, pollId INTEGER, permission_type TEXT CHECK(permission_type IN (${permissionTypes})), target_type TEXT CHECK(target_type IN (${targetTypes})), target_id INTEGER, FOREIGN KEY (pollId) REFERENCES Polls(id), FOREIGN KEY (target_id) REFERENCES Users(id) )`);
                resolve(db);
            });
        }
    });
});

export default dbPromise;
