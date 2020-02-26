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
  if(!entry) {
    return false;
  }
  const hashedPassword = bcrypt.hashSync(password, entry.salt);
  return hashedPassword === entry.password;
}

function sendToken(id, res) {    
  const token = jwt.sign({ id }, config.secret, {
    expiresIn: 86400 // expires in 24 hours
  });
  res.status(200).send({ token });
} 


// @route   POST /sessions/create
// @desc    Auth user
// @access  Public
router.post('/', async function (req, res) { 
    const { email, password } = req.body;
    if(!email || !password){
      res.status(400).send('You must send email and password'); 
      return;
    }
    try {
      const query = `SELECT id, password, salt from users WHERE email='${email}'`;
      const entry = await sqlite.get(query);

      if(entry) {
        const hashedPassword = bcrypt.hashSync(password, entry.salt);
        if(hashedPassword === entry.password) {
          sendToken(entry.id, res);
          return;
        }
      }
      res.status(401).send('Invalid email or password');          
    }
    catch(error) {
      res.status(500).send(error.message);
  }
});

module.exports = router;
