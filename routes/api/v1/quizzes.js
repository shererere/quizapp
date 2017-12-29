const routes = require('express').Router();
const db = require('../../../db');

/**
 * Return all quizzes.
 * @method
 */
routes.get('/', function (req, res) {
  db.quizzes.findAll().then(function(result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Return quiz info.
 * @method
 * @param {uuid} quiz - Quiz ID.
 */
routes.get('/:quiz', function (req, res) {
  db.quizzes.findAll({
    where: {
      id: req.params.quiz,
    },
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Add new quiz.
 * @method
 * @param {string} name - Quiz name.
 * @param {int} size - Amount of questions that are randomly chosen for user.
 */
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
    }).catch(function (error) {
      res.status(400).json({ messsage: 'Error 400', error: error });
    });
  }
});

/**
 * Return all users that haven't finished the quiz yet.
 * @method
 * @param {uuid} quiz - Quiz ID.
 */
routes.get('/:quiz/users/solving', function (req, res) {
  db.users.findAll({
    attributes: {
      exclude: ['password'],
    },
    include: [{
      model: db.quizzes,
      where: {
        id: req.params.quiz,
      },
      through: {
        where: {
          finished: false,
        },
        attributes: [],
      },
      attributes: [],
    }],
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Return all users that take part in quiz.
 * @method
 * @param {uuid} quiz - Quiz ID.
 */
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
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Return all users that take part in quiz from given division.
 * @method
 * @param {uuid} quiz - Quiz ID.
 * @param {string} division - Division.
 */
routes.get('/:quiz/users/division/:divisions', function (req, res) {
  db.users.findAll({
    where: {
      division: {
        [db.Sequelize.Op.like]: req.params.division,
      },
    },
    include: [{
      model: db.quizzes,
      attributes: [],
      where: {
        id: req.params.quiz,
      },
    }],
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Return all questions that belong to the quiz.
 * @method
 * @param {uuid} quiz - Quiz ID.
 * @param {int} limit - Amount of questions that are randomly chosen for user.
 */
routes.get('/:quiz/questions/limit/:limit', function (req,res) {
  db.questions.findAll({
    limit: parseInt(req.params.limit),
    order: [
      db.sequelize.fn('RAND'),
    ],
    attributes: [
      'content',
      'created_at',
      'updated_at',
      'id',
      'quiz_id',
      ['correct_answer', 'answer0'],
      ['wrong_answer1', 'answer1'],
      ['wrong_answer2', 'answer2'],
      ['wrong_answer3', 'answer3'],
    ],
    include: [{
      model: db.quizzes,
      where: {
        id: req.params.quiz,
      },
      attributes: [],
    }],
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Assign quiz to user.
 * @method
 * @param {uuid} quizid - Quiz ID.
 * @param {uuid} userid - User ID.
 */
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
    }).catch(function (error) {
      res.status(400).json({ messsage: 'Error 400', error: error });
    });
  }
});

/**
 * Unassign quiz from user.
 * @method
 * @param {uuid} quizid - Quiz ID.
 * @param {uuid} userid - User ID.
 */
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
      }).catch(function (error) {
        res.status(400).json({ messsage: 'Error 400', error: error });
      });
    });
  }
});

/**
 * Remove quiz.
 * @method
 * @param {uuid} quizid - Quiz ID.
 */
routes.delete('/', function(req, res) {
  if (typeof(req.body.quizid) == 'undefined') {
    res.status(400).json({ error: 'Missing parameters!', error: error });
  } else {
    db.quizzes.findOne({
      where: {
        id: req.body.quizid
      }
    }).then(function(result) {
      db.quizzes.destroy({
        where: {
          id: req.body.quizid,
        }
      }).then(function() {
        res.status(200).json({ message: 'Quiz deleted successfully' });
      });
    }).catch(function (error) {
      res.status(204).json({ messsage: 'Quiz not found', error: error });
    });
  }
});

module.exports = routes;
