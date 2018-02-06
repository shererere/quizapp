const db = require('./db.js');
const jwt = require('jsonwebtoken');

function middleware() {
  return function(req, res, next) {
    const token = req.headers['authorization'].substring(7);
    const userid = jwt.decode(token);

    db.users.findOne({
      where: {
        id: userid,
      },
    }).then(function(result) {
      if (result.role === 'admin') {
        next();
      } else {
        res.status(401).json({ message: 'This action is not allowed' });
      }
    });

  }
}

module.exports = middleware();
