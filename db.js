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
db.users_answers = require('./models/users_answers.js')(sequelize, Sequelize);
db.users_quizzes = require('./models/users_quizzes.js')(sequelize, Sequelize);

// |-----------|
// | relations |
// |-----------|
db.quizzes.hasMany(db.questions);
db.questions.belongsTo(db.quizzes);

db.users.belongsToMany(db.quizzes, {
  through: {
    model: db.users_quizzes,
  },
});

db.quizzes.belongsToMany(db.users, {
  through: {
    model: db.users_quizzes,
  },
});

db.users.belongsToMany(db.questions, {
  through: {
    model: db.users_answers,
  },
});

db.questions.belongsToMany(db.users, {
  through: {
    model: db.users_answers,
  },
})

module.exports = db;


// hyhyhyhyyhyhy
// https://lorenstewart.me/2016/09/12/sequelize-table-associations-joins/
