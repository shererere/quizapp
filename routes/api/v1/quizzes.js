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

// assign (link) quiz to user
// link => assign
routes.post('/assign', function(req, res) {
  if (typeof(req.body.quizid) == 'undefined' ||
      typeof(req.body.userid) == 'undefined') {
        res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.sequelize.sync().then(function() {
      db.users_quizzes.create({
        quiz_id: req.body.quizid,
        user_id: req.body.userid,
      });
    }).then(function() {
      res.status(201).json({ message: 'Quiz assigned to user successfully' });
    });
  }
});

// unassign (unlink) quiz from user
// unlink => unassgin
routes.delete('/unassign', function(req, res) {
  if (typeof(req.body.quizid) == 'undefined' ||
      typeof(req.body.userid) == 'undefined') {
        res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.sequelize.sync().then(function() {
      db.users_quizzes.findOne({
        where: {
          quiz_id: req.body.quizid,
          user_id: req.body.userid,
        },
      }).then(function(result) {
        db.users_quizzes.destroy({
          where: {
            quiz_id: req.body.quizid,
            user_id: req.body.userid,
          }
        }).then(function() {
          res.status(201).json({ message: 'Quiz unassigned from user successfully' });
        });
      });
    });
  }
});

// remove quiz
routes.delete('/', function(req, res) {
  if (typeof(req.body.id) == 'undefined') {
    res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.quizzes.findOne({ 
      where: {
        id: req.body.id
      }
    }).then(function(result) {
      if (result == null) {
        // TODO: no JSON response
        res.status(204).json({ error: 'Quiz not found' });
      } else {
        db.quizzes.destroy({
          where: {
            id: req.body.id,
          }
        }).then(function() {
          res.status(200).json({ message: 'Quiz deleted successfully' });
        });
      }
    });
  }
});

module.exports = routes;
