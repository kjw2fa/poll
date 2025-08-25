const express = require('express');
const cors = require('cors');
const db = require('./database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
const JWT_SECRET = 'ghosdjfojwelfasdlfjocieaitnkn3i5023r1j';

app.use(cors());
app.use(express.json());

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM Users WHERE username = ?`, [username], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }
        // Issue JWT token
        const token = jwt.sign({ userId: user.userId, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, userId: user.userId, username: user.username });
    });
});

app.post('/api/polls', (req, res) => {
    const { title, options, userId } = req.body;
    const optionsJson = JSON.stringify(options);
    db.run(
        `INSERT INTO Polls (title, options) VALUES (?, ?)`,
        [title, optionsJson],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const pollId = this.lastID;
            db.run(
                `INSERT INTO PollPermissions (pollId, userId, canEdit) VALUES (?, ?, ?)`,
                [pollId, userId, true],
                function (err2) {
                    if (err2) {
                        return res.status(500).json({ error: err2.message });
                    }
                    res.status(201).json({ id: pollId });
                }
            );
        }
    );
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

    // Use INSERT OR REPLACE to ensure uniqueness of (pollId, userId)
    db.run(
        `INSERT OR REPLACE INTO Votes (pollId, userId, userName) VALUES (?, ?, ?)`,
        [pollId, userId, userName],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const voteId = this.lastID;
            // Delete any existing VoteDetails for this voteId and pollId
            db.run(
                `DELETE FROM VoteDetails WHERE pollId = ? AND voteId = ?`,
                [pollId, voteId],
                function (err2) {
                    if (err2) {
                        return res.status(500).json({ error: err2.message });
                    }
                    // Insert new VoteDetails
                    const stmt = db.prepare(
                        `INSERT INTO VoteDetails (pollId, voteId, option, rating) VALUES (?, ?, ?, ?)`
                    );
                    ratings.forEach(({ option, rating }) => {
                        stmt.run([pollId, voteId, option, rating]);
                    });
                    stmt.finalize();
                    res.status(201).json({ voteId });
                }
            );
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

app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields required.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            `INSERT INTO Users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashedPassword],
            function (err) {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                res.status(201).json({ userId: this.lastID, username, email });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

app.get('/api/user/:userId/polls', (req, res) => {
    const userId = req.params.userId;
    // Polls user can edit (created)
    db.all(`
        SELECT Polls.* FROM Polls
        JOIN PollPermissions ON Polls.id = PollPermissions.pollId
        WHERE PollPermissions.userId = ? AND PollPermissions.canEdit = 1
    `, [userId], (err, createdPolls) => {
        if (err) return res.status(500).json({ error: err.message });
        // Polls user voted on
        db.all(`
            SELECT Polls.* FROM Polls
            JOIN Votes ON Polls.id = Votes.pollId
            WHERE Votes.userId = ?
            GROUP BY Polls.id
        `, [userId], (err2, votedPolls) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ createdPolls, votedPolls });
        });
    });
});

app.get('/api/poll/:pollId/permissions', (req, res) => {
    const pollId = req.params.pollId;
    const userId = req.query.userId;
    db.get(
        `SELECT canEdit FROM PollPermissions WHERE pollId = ? AND userId = ?`,
        [pollId, userId],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ canEdit: row ? !!row.canEdit : false });
        }
    );
});

app.get('/api/poll/:pollId/vote', (req, res) => {
    const pollId = req.params.pollId;
    const userId = req.query.userId;
    db.get(
        `SELECT voteId FROM Votes WHERE pollId = ? AND userId = ? LIMIT 1`,
        [pollId, userId],
        (err, voteRow) => {
            if (err || !voteRow) return res.json({ ratings: null });
            db.all(
                `SELECT option, rating FROM VoteDetails WHERE pollId = ? AND voteId = ?`,
                [pollId, voteRow.voteId],
                (err2, details) => {
                    if (err2) return res.json({ ratings: null });
                    const ratings = {};
                    details.forEach(d => { ratings[d.option] = d.rating; });
                    res.json({ ratings });
                }
            );
        }
    );
});

app.post('/api/poll/:pollId/edit', (req, res) => {
    const pollId = req.params.pollId;
    const { userId, title, options } = req.body;
    db.get(
        `SELECT canEdit FROM PollPermissions WHERE pollId = ? AND userId = ?`,
        [pollId, userId],
        (err, row) => {
            if (err || !row || !row.canEdit) return res.status(403).json({ error: 'No edit permission' });
            db.run(
                `UPDATE Polls SET title = ?, options = ? WHERE id = ?`,
                [title, JSON.stringify(options), pollId],
                function (err2) {
                    if (err2) return res.status(500).json({ error: err2.message });
                    res.json({ success: true });
                }
            );
        }
    );
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
