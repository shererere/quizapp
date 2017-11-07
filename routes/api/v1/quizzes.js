const routes = require('express').Router();
const db = require('../../../db');

// return all quizzes
routes.get('/', function (req, res) {
  db.quizzes.findAll().then(function(result) {
    res.status(200).json(result);
  });
});

// add new quiz
routes.post('/', function (req, res) {
  if (typeof(req.body.name) == 'undefined' ||
      typeof(req.body.size) == 'undefined') {
        res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.sequelize.sync().then(function() {
      db.quizzes.create({
        name: req.body.name,
        size: req.body.size,
      });
    }).then(function() {
      res.status(201).json({ message: 'Quiz created successfully' });
    });
  }
});

// return all users that take part in quiz
routes.get('/:quiz/users', function (req, res) {
  db.users.findAll({
    include: [{
      model: db.quizzes,
      attributes: [],
      where: {
        id: req.params.quiz,
      },
    }],
    // TODO: trzeba wyjebac users_quizzes z response, bo jest zbędnę
    // R: ;]
 }).then(function (result) {
   res.status(200).json(result);
 });
});

// return all questions that belong to the quiz
routes.get('/:quiz/questions', function (req,res) {
  db.questions.findAll({
    include: [{
      model: db.quizzes,
      attributes: [],
      where: {
        id: req.params.quiz,
      },
    }],
 }).then(function (result) {
   res.status(200).json(result);
 });
});

module.exports = routes;
