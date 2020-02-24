const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const User = require('../models/User');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


// @route   POST /users
// @desc    Register new user
// @access  Public
router.post('/', async function (req, res) {
  const { username, email, password } = req.body;
  // Simple validation
  if(!username || !email || !password) {
    return res.status(400).send('You must send username, email and password');
  }

  try {
  // Check for existing user
    const user =  await User.findOne({ email })
 
    if(user) {
      res.status(400).send('A user with that email already exists');
      return;
    }

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({
      name: username,
      email,
      password: hashedPassword,
      salt,
      balance: config.startBalance,
    });

    const newUserEntry = await newUser.save();
    const token = await jwt.sign({ id: newUserEntry.id },
              config.secret, 
              { expiresIn: 86400  });// expires in 24 hours
    res.status(200).send({ token: token });
  }    
  catch(error) {
      res.status(500).send(error.message);
      return;
  }
})

module.exports = router;
