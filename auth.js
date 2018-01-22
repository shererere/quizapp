const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const auth = {};

var jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: '8MrmQxycj5fq6qKu',
}

auth.passport = passport;
auth.jwtOptions = jwtOptions;


var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
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

module.exports = auth;
