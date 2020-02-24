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



async function isRegisteredUser (email, password){
  const query = `SELECT password, salt from users WHERE email='${email}'`;
  const entry = await sqlite.get(query);
  const hashedPassword = bcrypt.hashSync(password, entry.salt);
  return hashedPassword === entry.password;
}

async function sendToken(email, password, res) {    
    if(!await isRegisteredUser(email, password)) {
      res.status(401).send('Invalid email or password');
      return;
    }
    const token = jwt.sign({ email: email }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ token: token });
} 


// @route   POST /sessions/create
// @desc    Auth user
// @access  Public
router.post('/', function (req, res) {
  const { email, password } = req.body;
  if(!email || !password){
    res.status(400).send('You must send email and password'); 
    return;
  }
  sendToken(req.body.email, req.body.password, res);
});

module.exports = router;
