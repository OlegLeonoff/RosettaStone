const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TransactionSchema = new Schema({
  emitterId: {
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  recipientId: {
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  emitterBalance: {
    type: Number,
    required: true,
    ref: 'User'
  },
  recipientBalance: {
    type: Number,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  }
});


module.exports = Transaction = mongoose.model('transaction', TransactionSchema);
