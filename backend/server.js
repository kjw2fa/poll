const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/polls', (req, res) => {
    const { title, options } = req.body;
    const optionsJson = JSON.stringify(options);
    db.run(`INSERT INTO Polls (title, options) VALUES (?, ?)`, [title, optionsJson], function (err) {
        if (err) {
            return console.log(err.message);
        }
        res.status(201).json({ id: this.lastID });
    });
});

app.get('/api/polls/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT * FROM Polls WHERE id = ?`, [id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "id": row.id,
            "title": row.title,
            "options": JSON.parse(row.options)
        })
    });
});

app.post('/api/votes', (req, res) => {
    const { pollId, userId, userName, ratings } = req.body;
    // ratings: [{ option: "Red", rating: 10 }, ...]
    db.run(
        `INSERT INTO Votes (pollId, userId, userName) VALUES (?, ?, ?)`,
        [pollId, userId, userName],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const voteId = this.lastID;
            const stmt = db.prepare(
                `INSERT INTO VoteDetails (pollId, voteId, option, rating) VALUES (?, ?, ?, ?)`
            );
            ratings.forEach(({ rating, option }) => {
                stmt.run([pollId, voteId, option, rating]);
            });
            stmt.finalize();
            res.status(201).json({ voteId });
        }
    );
});

app.get('/api/polls/:id/results', (req, res) => {
    const pollId = req.params.id;

    db.get(`SELECT title, options FROM Polls WHERE id = ?`, [pollId], (err, pollRow) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (!pollRow) {
            res.status(404).json({ "error": "Poll not found" });
            return;
        }

        const pollTitle = pollRow.title;
        const pollOptions = JSON.parse(pollRow.options);

        // Get all votes and their details for this poll
        db.all(`
            SELECT Votes.voteId, Votes.userName, VoteDetails.option, VoteDetails.rating
            FROM Votes
            LEFT JOIN VoteDetails ON Votes.voteId = VoteDetails.voteId
            WHERE Votes.pollId = ?
        `, [pollId], (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }

            // Aggregate ratings per option
            const optionRatings = {};
            pollOptions.forEach(option => {
                optionRatings[option] = [];
            });

            const votersSet = new Set();
            rows.forEach(row => {
                if (row.userName) votersSet.add(row.userName);
                if (row.option && optionRatings[row.option]) {
                    optionRatings[row.option].push(row.rating);
                } else if (row.option) {
                    console.warn("Unknown option in VoteDetails:", row.option);
                }
            });

            // Calculate averages
            const averageRatings = {};
            let maxAverageRating = -1;
            for (const option in optionRatings) {
                const ratingsArr = optionRatings[option];
                if (ratingsArr.length > 0) {
                    const sum = ratingsArr.reduce((a, b) => a + b, 0);
                    const avg = sum / ratingsArr.length;
                    averageRatings[option] = avg;
                    if (avg > maxAverageRating) {
                        maxAverageRating = avg;
                    }
                }
            }

            // Find winning options
            const winningOptions = [];
            for (const option in averageRatings) {
                if (averageRatings[option] === maxAverageRating) {
                    winningOptions.push({ option, averageRating: maxAverageRating });
                }
            }

            res.json({
                pollTitle,
                totalVotes: votersSet.size,
                voters: Array.from(votersSet),
                results: winningOptions,
                allAverageRatings: averageRatings
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
