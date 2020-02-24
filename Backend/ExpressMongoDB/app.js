const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');


// mongoose.Promise = global.Promise

mongoose
  .connect(config.mongoURI, { 
    useNewUrlParser: true,
    useCreateIndex: true,
    // replicaSet: 'rs'
  })
  .then(() => console.log('MongoDB connected.'))
  .catch(err => console.log(err));

app.use(cors());
const userController = require('./routs/user');
app.use('/users', userController);

const sessionController = require('./routs/session');
app.use('/sessions/create', sessionController);

const protectedController = require('./routs/protected');
app.use('/api/protected', protectedController);

const port = process.env.PORT || 3000;

const server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});


module.exports = app;