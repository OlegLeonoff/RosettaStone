const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware');
const sqlite = require('../db/db');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


async function getAndSendUserData (id, res){
    const query = `SELECT id, name, email, balance 
                   FROM users 
                   WHERE id='${id}'`;
    console.log('query=', query);
    const entry = await sqlite.get(query);
    if(!entry) {
        res.status(400).send('User not found');
        return;
    }
    res.status(200).send({'id': entry.id, 
                          'name': entry.name, 
                          'email': entry.email, 
                          'balance': entry.balance});
}

// @route   GET /api/protected/userinfo
// @desc    User Info
// @access  Private
router.get('/userinfo', verifyToken, function(req, res, next) {
    getAndSendUserData(req.id, res)
});

async function getAndSendUserList (filter, req, res){
    let userList = [];
    const query = `SELECT * 
                FROM users
                WHERE name LIKE '%${filter}%'`
    await sqlite.each(query, [], function(row) {
            if(row.id !== req.id) {  // req.id been set in verifyToken function
                userList.push({id: row.id, name: row.name});    
            }});

    res.status(200).send(userList); 
}

// @route   POST /api/protected/users/list
// @desc    List of all users with filter
// @access  Private
router.post('/users/list', verifyToken, function(req, res, next) {
    try {
        getAndSendUserList(req.body.filter, req, res);
    }
    catch (e) {
        res.status(500);
    }
});


async function getTransactionData(emitterId, amount, date) {
    const query = `SELECT id, emitterBalance 
                 FROM transactions 
                 WHERE emitterId = ${emitterId} 
                 AND amount = ${amount}
                 AND date = '${date}'`;

    const entry = await sqlite.get(query);
    return entry;
}

async function createAndSendTransaction (senderId, recipientName, amount, res){
    try {
    let query = `SELECT id, name, email, balance 
                 FROM users 
                 WHERE id='${senderId}'`;
    let entry = await sqlite.get(query);
    if(!entry) {
        res.status(400).send('User not found');  // sender not found in db
        return;
    }
    const { id, name, email, balance } = entry;
    if(balance < amount) {
        res.status(400).send('Balance exceeded');
        return;
    }
    query = `SELECT * 
             FROM users 
             WHERE name='${recipientName}'`;

    entry = await sqlite.get(query)
    if(!entry) {
        res.status(400).send('User not found');  // recipient not found in db
        return;
    }
    const [recipientId, recipientBalance] = [entry.id, entry.balance];
    const now = new Date().toISOString();
    query = `BEGIN TRANSACTION;

             UPDATE users
             SET balance = ${balance} - ${amount}
             WHERE id = ${id};
             
             UPDATE users
             SET balance = ${recipientBalance} + ${amount}
             WHERE id = ${recipientId};

             INSERT INTO transactions (emitterId, 
                                       recipientId, 
                                       amount, 
                                       emitterBalance, 
                                       recipientBalance,
                                       date) 
             VALUES (${id}, ${recipientId}, ${amount}, 
                     ${balance} - ${amount}, ${recipientBalance} + ${amount}, '${now}');            
            
             COMMIT;`
             // transaction in SQLite is thread safe,see the doc https://www.sqlite.org/atomiccommit.html 
             
    const success = await sqlite.exec(query);
    if(!success) {
        res.status(500);
        return;
    }

    const data = await getTransactionData(id, amount, now);
    if(!data) {
        res.status(500);
        return;
    }

    res.status(200).send({transaction:{id: data.id, date: now, 
                          username: recipientName, amount: amount, balance: data.emitterBalance}});
    }
    catch (e) {
        res.status(500);
    }
}

// @route   POST /api/protected/transactions
// @desc    Creates a transaction
// @access  Private
router.post('/transactions', verifyToken, function(req, res, next) {
    try {
        createAndSendTransaction(req.id, req.body.name, req.body.amount, res);
    }
    catch (e) {
        res.status(500);
    }
});


async function sendTransactionList(userId, res) {
    let expenseTransactions = [];
    query = `SELECT transactions.id, date, name, amount, emitterBalance 
             FROM transactions
             JOIN users ON transactions.recipientId = users.id
             WHERE emitterId = ${userId}`
    await sqlite.each(query, [], function(row) {
              expenseTransactions.push({ id: row.id, date: row.date, 
                                     username: row.name, amount: -row.amount, 
                                     balance: row.emitterBalance });    
          });

    let incomeTransactions = [];
    query = `SELECT transactions.id, date, name, amount, recipientBalance 
             FROM transactions
             JOIN users ON transactions.emitterId = users.id
             WHERE recipientId = ${userId}`
    await sqlite.each(query, [], function(row) {
            incomeTransactions.push({ id: row.id, date: row.date, 
                                     username: row.name, amount: row.amount, 
                                     balance: row.recipientBalance });    
          });
    return res.status(200).send({ transactions: expenseTransactions.concat(incomeTransactions)
        .sort((x, y) => x.date > y.date) });
}


// @route   GET /api/protected/transactions
// @desc    List of logged user transactions
// @access  Private
router.get('/transactions', verifyToken, function(req, res, next) {
    try {
        sendTransactionList(req.id, res)
    }
    catch (e) {
        res.status(500);
    }
});

module.exports = router;
