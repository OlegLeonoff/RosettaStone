const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


function sendToken(id, res) {    
    const token = jwt.sign({ id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ token: token });
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
      const user = await User.findOne({ email });
        if(user) {
          const hashedPassword = bcrypt.hashSync(password, user.salt);
          if(hashedPassword === user.password) {
            sendToken(user.id, res);
            return;
          }
        }
        res.status(401).send('Invalid email or password');          
      }
    catch(error) {
      res.status(500).send(error.message);
      return;
    }
});

module.exports = router;
