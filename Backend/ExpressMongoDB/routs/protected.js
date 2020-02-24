const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware');
const bodyParser = require('body-parser');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


// @route   GET /api/protected/userinfo
// @desc    User Info
// @access  Private
router.get('/userinfo', verifyToken, async function(req, res, next) {
    try {
        const user = await User.findById(req.id)    
        if(!user) {
            res.status(400).send('User not found');
            return;
        }

        res.status(200).send({'id': user.id, 
                    'name': user.name, 
                    'email': user.email, 
                    'balance': user.balance});    
    }
    catch(error) {
        res.status(500).send(error.message);
        return;
    }
})

async function createAndSendTransaction(userId, recipientName, amount, res) {
 let session;
 try {  
     await Transaction.createCollection(); // mongo can't create a collection inside a transaction query

    session = await mongoose.startSession();
    session.startTransaction();

    let opts = { session, new: true };
    
    opts.useFindAndModify = false; // findOneAndUpdate()` without the `useFindAndModify` option set to false are deprecated
    const emitter = await User.findOneAndUpdate({ _id: userId }, 
                                                { $inc: { balance: -amount } }, 
                                                opts);

    if(emitter.balance < 0) {
        // If emitter would have negative balance, fail and abort the transaction
        // `session.abortTransaction()` will undo the above `findOneAndUpdate()`
        throw new Error('Balance exceeded');
    }                                                

    const recipient = await User.findOneAndUpdate({ name: recipientName }, 
                                                  { $inc: { balance: amount } }, 
                                                  opts);

    const transaction = await new Transaction({ emitterId: emitter.id, 
                                            recipientId: recipient.id, 
                                            amount, 
                                            emitterBalance: emitter.balance,
                                            recipientBalance: recipient.balance
                                         })
                                        .save(opts);
    const { id, date, emitterBalance } = transaction; // to avoid 'Cannot use a session that has ended'
    await session.commitTransaction();
    session.endSession();
    res.status(200).send({transaction:{id, 
                                       date, 
                                       name: recipientName, 
                                       amount, 
                                       balance: emitterBalance}});

  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    res.status(400).send(error.message);
  }
}


// @route   POST /api/protected/transactions
// @desc    Creates a transaction
// @access  Private
router.post('/transactions', verifyToken, function(req, res, next) {
    createAndSendTransaction(req.id, req.body.name, req.body.amount, res)
});


// @route   GET /api/protected/transactions
// @desc    List of logged user transactions
// @access  Private
router.get('/transactions', verifyToken, async function(req, res, next) {
    try {
        const user = await User.findById(req.id) 
        if(!user) {
            res.status(401).send('Invalid user');
            return;
        }
        const expenseTransactions = await Transaction.aggregate([
                                {'$match': {emitterId: user._id}},
                                {'$lookup': {localField: 'recipientId', 
                                            from: 'users',
                                            foreignField: '_id',
                                            as: 'recipient'}}])

        const expenseTransactionsArr = expenseTransactions.map(transaction => {
                                return {id: transaction._id,
                                        date: transaction.date, 
                                        username: transaction.recipient[0].name, 
                                        amount: -transaction.amount, 
                                        balance: transaction.emitterBalance }});

        const incomeTransactions = await Transaction.aggregate([
                                {'$match': {recipientId: user._id}},
                                {'$lookup': {localField: 'emitterId', 
                                            from: 'users',
                                            foreignField: '_id',
                                            as: 'emitter'}}])

        const incomeTransactionsArr = incomeTransactions.map(transaction => {
                                return {id: transaction._id,
                                        date: transaction.date, 
                                        username: transaction.emitter[0].name, 
                                        amount: transaction.amount, 
                                        balance: transaction.recipientBalance }});

        const sortedTransactions = incomeTransactionsArr.concat(expenseTransactionsArr)
                                                        .sort((x, y) => x.date > y.date);
        res.status(200).send({'trans_token': sortedTransactions});    
    }
    catch(error) {
        res.status(500).send(error.message);
        return;
    }
})


// @route   POST /api/protected/users/list
// @desc    List of all users with filter
// @access  Private
router.post('/users/list', verifyToken, async function(req, res, next) {
    try {
        const users = await User.find({name: new RegExp(req.body.filter, 'i')});

        const usersData = users.map(user => {
            return {id: user.id, name: user.name};
        });
        res.status(200).send(usersData);
    }
    catch(error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
