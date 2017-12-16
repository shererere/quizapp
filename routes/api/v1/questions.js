const routes = require('express').Router();
const db = require('../../../db');

// return all the questions
routes.get('/', function (req, res) {
  db.questions.findAll().then(function(result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

// add new question
routes.post('/', function (req, res) {
  if (typeof(req.body.content) == 'undefined' ||
      typeof(req.body.correct_answer) == 'undefined' ||
      typeof(req.body.wrong_answer1) == 'undefined' ||
      typeof(req.body.wrong_answer2) == 'undefined' ||
      typeof(req.body.wrong_answer3) == 'undefined' ||
      typeof(req.body.quiz_id) == 'undefined') {
        res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.sequelize.sync().then(function() {
      db.questions.create({
        content: req.body.content,
        correct_answer: req.body.correct_answer,
        wrong_answer1: req.body.wrong_answer1,
        wrong_answer2: req.body.wrong_answer2,
        wrong_answer3: req.body.wrong_answer3,
        quiz_id: req.body.quiz_id,
      });
    }).then(function() {
      res.status(201).json({ message: 'Question added successfully' });
    }).catch(function (error) {
      res.status(400).json({ messsage: 'Error 400', error: error });
    });
  }
});

// remove question
routes.delete('/', function(req, res) {
  if (typeof(req.body.id) == 'undefined') {
    res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.questions.findOne({
      where: {
        id: req.body.id
      }
    }).then(function(result) {
      if (result == null) {
        // TODO: no JSON response
        res.status(204).json({ error: 'Question not found' });
      } else {
        db.questions.destroy({
          where: {
            id: req.body.id,
          }
        }).then(function() {
          res.status(200).json({ message: 'Question deleted successfully' });
        });
      }
    }).catch(function (error) {
      res.status(400).json({ messsage: 'Error 400', error: error });
    });
  }
});

module.exports = routes;
