// backend/debug.js
const sqlite3 = require('sqlite3');
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'));

function dbGet(sql, params) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

function dbAll(sql, params) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function dbRun(sql, params) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

async function debug() {
    try {
        const polls = await dbAll("SELECT id, title FROM Polls", []);
        console.log("All polls in the database:");
        console.log(polls);

        const users = await dbAll("SELECT id, username, email FROM Users", []);
        console.log("All users in the database:");
        console.log(users);

    } catch (error) {
        console.error("Error debugging database:", error);
    } finally {
        db.close();
    }
}

debug();
