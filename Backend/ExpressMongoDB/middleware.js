const jwt = require('jsonwebtoken');
const config = require('./config');

function verifyToken(req, res, next) {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (!token) {
    res.status(401).send('UnauthorizedError');
    return;
  }    
  if (token.startsWith('Bearer ')) {
      // Remove 'Bearer ' from string
      token = token.slice(7, token.length);
  }

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
        return res.status(401).send('UnauthorizedError');
    }
    req.id = decoded.id;
    next();
  });
}

module.exports = verifyToken;