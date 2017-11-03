'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize('quizapp', 'quizapp', 'zaq1@WSX', {
  host: '139.59.166.253',
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
