const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE Polls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text, 
            options text
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO Polls (title, options) VALUES (?,?)'
                db.run(insert, ["What's your favorite color?",JSON.stringify(["Red","Green","Blue"])])
            }
        });
        db.run(`CREATE TABLE Votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pollId INTEGER,
            name TEXT,
            ratings TEXT
            )`, 
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created
            }
        });  
    }
});


module.exports = db
