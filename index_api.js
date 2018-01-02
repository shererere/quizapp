const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session'); // ????????????
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt-nodejs');
const db = require('./db');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const users = require('./routes/api/v1/users');
const quizzes = require('./routes/api/v1/quizzes');
const questions = require('./routes/api/v1/questions');

const app = express();

app.locals.title = 'Quiz app';

// passport configuration
// app.use(session({
//   secret: 'xdxdxdxd',
//   resave: true,
//   saveUninitialized: true,
// }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // tu było false
app.use(bodyParser.json()); // no idea niby czemu tak ma być, ale no ok

// use routes
app.use('/api/v1/user', users);
app.use('/api/v1/quiz', quizzes);
app.use('/api/v1/question', questions);

app.use(passport.initialize());
// app.use(passport.session());

var jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: '8MrmQxycj5fq6qKu',
}

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  // console.log(jwt_payload);
  var user = db.users.findOne({
    where: {
      id: jwt_payload.id,
    }
  });

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

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
        var token = jwt.sign(result.id, jwtOptions.secretOrKey);
        res.json({message: 'Successfully logged in', token: token});
      } else {
        res.status(401).json({message: 'Wrong password'});
      }
    }
  });
});

// passport.use('jwt-login', new JwtStrategy(jwtOptions, (jwt_payload, done) => {
//   console.log('payload recieved: ', jwt_payload);
//   db.users.findOne({
//     where: {
//       id: jwt_payload.id,
//     }
//   }).then(function(user) {
//     if (user) {
//       return done(null, user);
//     } else {
//       return done(null, false);
//     }
//   });
// }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.users.findById(id).then(function(user) {
    if (user) {
      done(null, user.get());
    } else {
      done(user.errors, null);
    }
  });
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/test', passport.authenticate('jwt', { session: false }),
  function (req, res) {
    res.json({ message: 'elo' });
  }
);

db.sequelize.sync().then(function() {
  console.log('Database is synced');
});

app.listen(3000, function () {
  console.log('Quiz app API is listening on port 3000!');
});


// tu jest fajny kod do przyszłej rejestracji w apce
// https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537

// http://www.restapitutorial.com/httpstatuscodes.html
// bardzo ważne to jest

// https://sequelize.readthedocs.io/en/1.7.0/articles/express/
// hyyhyhyhyhyhyyh
