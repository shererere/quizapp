const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session'); // ????????????
const bCrypt = require('bcrypt-nodejs');
const path = require('path');
const auth = require('./auth');
const db = require('./db');

const users = require('./routes/api/v1/users');
const quizzes = require('./routes/api/v1/quizzes');
const questions = require('./routes/api/v1/questions');

const app = express();

app.locals.title = 'Quiz app';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // tu było false
app.use(bodyParser.json()); // no idea niby czemu tak ma być, ale no ok

// use routes
app.use('/api/v1/user', users);
app.use('/api/v1/quiz', quizzes);
app.use('/api/v1/question', questions);

app.use('/images', express.static(path.join(__dirname, 'uploads', 'images')));

app.use('/', express.static(path.join(__dirname, 'dist')));

app.use(auth.passport.initialize());

app.post("/login", function(req, res) {
  if(typeof(req.body.username) == 'undefined' ||
     typeof(req.body.password) == 'undefined'){
      res.status(400).json({message: 'Missing parameters'});
  }

  var isPasswordValid = function(userpass, password) {
    console.log(userpass, password);
    return bCrypt.compareSync(userpass, password);
  }

  db.users.findOne({
    where: {
      username: req.body.username,
    }
  }).then(function(result) {
    if(!result){
      res.status(401).json({message: 'User not found'});
    } else {
      if (isPasswordValid(req.body.password, result.password)) {
        var token = jwt.sign(result.id, auth.jwtOptions.secretOrKey);
        res.json({message: 'Successfully logged in', token: token});
      } else {
        res.status(401).json({message: 'Wrong password'});
      }
    }
  });
});

db.sequelize.sync().then(function() {
  console.log('Database is synced');
});

app.listen(3000, function () {
  console.log('Quiz app API is listening on port 3000!');
});
