const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt-nodejs');
const db = require('./db');

const users = require('./routes/api/v1/users');
const quizzes = require('./routes/api/v1/quizzes');
const questions = require('./routes/api/v1/questions');

const app = express();

app.locals.title = 'Quiz app';

// passport configuration
app.use(session({
  secret: 'xdxdxdxd',
  resave: true,
  saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({ extended: true })); // tu było false
app.use(bodyParser.json()); // no idea niby czemu tak ma być, ale no ok

// use routes
app.use('/api/v1/user', users);
app.use('/api/v1/quiz', quizzes);
app.use('/api/v1/question', questions);

app.use(passport.initialize());
app.use(passport.session());

passport.use('local-register', new LocalStrategy(
  {
    passReqToCallback: true
  },

  function(req, username, password, done) {
    var generateHash = function(password) {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };

    db.users.findOne({
      where: {
        username: username
      }
    }).then(function(user) {
      if (user) {
        return done(null, false, {
          message: 'User with this name exists'
        });
      } else {
        var userPassword = generateHash(password);
        var data = {
          username: username,
          password: userPassword,
          division: req.body.division,
          role: req.body.role,
        };

        db.users.create(data).then(function(newUser, created) {
          if (!newUser) {
            return done(null, false);
          }

          if (newUser) {
            return done(null, newUser);
          }
        });
      }
    });

  }
));

passport.use('local-login', new LocalStrategy(
  {
    passReqToCallback: true
  },
  function(req, username, password, done) {
    var isPasswordValid = function(userpass, password) {
      return bCrypt.compareSync(password, userpass);
    }

    db.users.findOne({
      where: {
        username: username,
      }
    }).then(function(user) {
      if (!user) {
        return done(null, false, {
          message: 'User doesn\'t exists',
        });
      }

      if (!isPasswordValid(user.password, password)) {
        return done(null, false, {
          message: 'Incorrect password'
        });
      }

      return done(null, user);
    }).catch(function(err) {
      console.log('Error: ' + err);

      return done(null, false, {
        message: 'Something went wrong'
      });
    });
  }
));

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

app.post('/register',
  passport.authenticate('local-register', { successRedirect: '/',
                                            failureRedirect: '/register' })
);

app.post('/login',
  passport.authenticate('local-login', { successRedirect: '/',
                                   failureRedirect: '/login' })
);

db.sequelize.sync().then(function() {
  console.log('Database is synced');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


// tu jest fajny kod do przyszłej rejestracji w apce
// https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537

// http://www.restapitutorial.com/httpstatuscodes.html
// bardzo ważne to jest

// https://sequelize.readthedocs.io/en/1.7.0/articles/express/
// hyyhyhyhyhyhyyh
