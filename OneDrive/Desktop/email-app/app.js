const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const EMAILS_FILE = path.join(__dirname, 'emails.txt');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'Invalid email' });
    }
    fs.appendFile(EMAILS_FILE, email + '\n', (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Error saving' });
        res.json({ success: true, message: 'Email submitted!' });
    });
});

app.get('/emails', (req, res) => {
    fs.readFile(EMAILS_FILE, 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') return res.json({ success: true, emails: [] });
        if (err) return res.status(500).json({ success: false, message: 'Error reading' });
        const emails = data.split('\n').filter(e => e.trim());
        res.json({ success: true, emails });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));