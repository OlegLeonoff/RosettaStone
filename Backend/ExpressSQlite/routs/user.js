const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const buildMissingParamsString = require('../utils/strings');
const bcrypt = require('bcrypt');
const config = require('../config');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const sqlite = require('../db/db');



async function userAlreadyExists (email){
  const query = `SELECT id from users WHERE email='${email}'`;
  const entry = await sqlite.get(query);
  return !!entry;
}

async function writeUserAndSendToken(req, res) {    
    if(await userAlreadyExists(req.body.email)) {
      res.status(400).send('A user with that email already exists');
      return;
    }

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const query = `INSERT INTO users (name, email, password, salt, balance) 
                   VALUES ('${req.body.username}', '${req.body.email}', '${hashedPassword}', '${salt}', ${config.startBalance})`;
    
    if(await sqlite.run(query)) {
      const token = jwt.sign({ email: req.body.email }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ token: token });
    }
    else {
      res.status(500);
    }
} 

// @route   POST /users
// @desc    Register a new user
// @access  Public
router.post('/', function (req, res) {
    const errorStr = buildMissingParamsString([[req.body.email, 'email'], 
                            [req.body.username, 'username'],
                            [req.body.password, 'password']]);
    if(errorStr) {
      res.status(400).send(errorStr); 
      return;
    }
    writeUserAndSendToken(req, res);
});

module.exports = router;
