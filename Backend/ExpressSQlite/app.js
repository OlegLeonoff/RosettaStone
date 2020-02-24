const express = require('express');
const app = express();
const cors = require('cors');
const sqlite = require('./db/db');

async function initDatabase () {
    await sqlite.open('./db/db.sqlite');

    await sqlite.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name text, 
        email text UNIQUE, 
        password text, 
        salt text,
        balance INTEGER,
        CONSTRAINT email_unique UNIQUE (email)
        )`);

    await sqlite.run(`CREATE TABLE IF NOT EXISTS transactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    emitterId INTEGER, 
                    recipientId INTEGER, 
                    amount INTEGER, 
                    emitterBalance INTEGER, 
                    recipientBalance INTEGER,
                    date TEXT,
                    FOREIGN KEY(emitterId) REFERENCES users(id),
                    FOREIGN KEY(recipientId) REFERENCES users(id)
                    )`);
    await sqlite.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email)`);
}
initDatabase();

app.use(cors());
const userController = require('./routs/user');
app.use('/users', userController);

const sessionController = require('./routs/session');
app.use('/sessions/create', sessionController);

const protectedController = require('./routs/protected');
app.use('/api/protected', protectedController);

const port = 55341;

const server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

async function closeAll (event) {    
    await sqlite.close();
    server.close();
    console.log(event, ': disconnecting database...');
}

process.on('SIGINT', () => {
    closeAll('SIGINT');
});

process.on('SIGTERM', () => {
    closeAll('SIGTERM');
});

process.on('exit', (code) => {
    closeAll('exit');
});

module.exports = app;