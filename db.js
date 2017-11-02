'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize('xd', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// |--------|
// | models |
// |--------|
db.users = require('./models/users.js')(sequelize, Sequelize);
db.quizzes = require('./models/quizzes.js')(sequelize, Sequelize);
db.questions = require('./models/questions.js')(sequelize, Sequelize);

// |-----------|
// | relations |
// |-----------|
db.quizzes.hasMany(db.questions);
db.questions.belongsTo(db.quizzes);

module.exports = db;


// hyhyhyhyyhyhy
// https://lorenstewart.me/2016/09/12/sequelize-table-associations-joins/
