const routes = require('express').Router();
const db = require('../../../db');

/**
 * Return all questions.
 * @method
 */
routes.get('/', function (req, res) {
  db.questions.findAll().then(function(result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Return one question.
 * @method
 * @param {uuid} question - Question ID.
 */
routes.get('/:question', function (req, res) {
  db.questions.findOne({
    where: {
      id: req.params.question,
    },
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Add new question.
 * @method
 * @param {string} content - Question content.
 * @param {string} correct_answer - Correct answer content.
 * @param {string} wrong_answer1 - Wrong answer content.
 * @param {string} wrong_answer2 - Wrong answer content.
 * @param {string} wrong_answer3 - Wrong answer content.
 * @param {uuid} quiz_id - Quiz ID.
 */
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

/**
 * Remove question.
 * @method
 * @param {uuid} id - Question ID.
 */
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
