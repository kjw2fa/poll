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
    db.run(`INSERT INTO Polls (title, options) VALUES (?, ?)`, [title, optionsJson], function(err) {
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
            res.status(400).json({"error":err.message});
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
    const { pollId, name, ratings } = req.body;
    const ratingsJson = JSON.stringify(ratings);
    db.run(`INSERT INTO Votes (pollId, name, ratings) VALUES (?, ?, ?)`, [pollId, name, ratingsJson], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.status(201).json({ id: this.lastID });
    });
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

        db.all(`SELECT name, ratings FROM Votes WHERE pollId = ?`, [pollId], (err, voteRows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }

            const voters = [];
            const totalVotes = voteRows.length;

            const optionRatings = {}; // Initialize optionRatings
            pollOptions.forEach(option => {
                optionRatings[option] = [];
            });

            voteRows.forEach(vote => {
                const voterName = vote.name;
                const ratings = JSON.parse(vote.ratings);
                if (voterName) {
                    voters.push(voterName);
                }

                ratings.forEach(rating => {
                    if (rating.options && rating.options.length > 0) {
                        rating.options.forEach(option => {
                            // Assuming rating.id is like 'rating-1' to 'rating-10'
                            const score = 11 - parseInt(rating.id.split('-')[1]);
                            if (optionRatings[option.text]) {
                                optionRatings[option.text].push(score);
                            }
                        });
                    }
                });
            });

            const averageRatings = {};
            let maxAverageRating = -1;

            for (const optionText in optionRatings) {
                const ratingsArray = optionRatings[optionText];
                if (ratingsArray.length > 0) {
                    const sum = ratingsArray.reduce((a, b) => a + b, 0);
                    const average = sum / ratingsArray.length;
                    averageRatings[optionText] = average;
                    if (average > maxAverageRating) {
                        maxAverageRating = average;
                    }
                }
            }

            const winningOptions = [];
            for (const optionText in averageRatings) {
                if (averageRatings[optionText] === maxAverageRating) {
                    winningOptions.push({ option: optionText, averageRating: maxAverageRating });
                }
            }

            res.json({
                pollTitle,
                totalVotes,
                voters,
                results: winningOptions,
                allAverageRatings: averageRatings // Optional: for debugging or more detailed display
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
