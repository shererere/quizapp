const routes = require('express').Router();
const db = require('../../../db');
const auth = require('../../../auth');
const isAdmin = require('../../../middleware');

/**
 * Return all quizzes.
 * @method
 */
routes.get('/', function (req, res) {
  db.quizzes.findAndCountAll({
    attributes: [
      'id',
      'name',
      'size',
      [db.sequelize.fn('date_format', db.sequelize.col('created_at'), '%Y-%m-%d %H:%i'), 'created_at'],
    ],
    order: [['created_at', 'DESC']],
  }).then(function(result) {
    let counter = 0;
    let finalResults = [];
    result.rows.forEach(function(quiz, key) {
      db.questions.findAndCountAll({
        where: {
          quiz_id: quiz.id,
        },
      }).then(function(result1) {
        db.users_quizzes.findAndCountAll({
          where: {
            quiz_id: quiz.id,
          },
        }).then(function (result2) {
          finalResults.push({
            id: quiz.id,
            name: quiz.name,
            size: quiz.size,
            created_at: quiz.created_at,
            user_count: result2.count,
            question_count: result1.count,
          });
          counter++;
          if (counter >= result.count) {
            res.status(200).json(finalResults);
          }
        });
      });
    });
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Return newest quiz info.
 * @method
 */
routes.get('/newest', function (req, res) {
  db.quizzes.findAll({
    limit: 1,
    order: [['created_at', 'DESC']],
  }).then(function (result) {
    res.status(200).json(result[0]);
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
routes.post('/', auth.passport.authenticate('jwt', { session: false }), isAdmin, function (req, res) {
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
  db.users.findAndCountAll({
    attributes: {
      exclude: ['password'],
    },
    order: [['division', 'ASC']],
    include: [{
      model: db.quizzes,
      attributes: [],
      where: {
        id: req.params.quiz,
      },
    }],
  }).then(function (result) {
    let counter = 0;
    let finalResults = [];
    result.rows.forEach(function(user, key) {
      db.users_quizzes.findOne({
        attributes: ['finished'],
        where: {
          user_id: user.id,
          quiz_id: req.params.quiz,
        },
      }).then(function(result1) {
          db.users_answers.findAndCountAll({
            where: {
              answer: 0,
              user_id: user.id,
              quiz_id: req.params.quiz,
            },
          }).then(function(result2) {
            finalResults.push({
              id: user.id,
              username: user.username,
              division: user.division,
              role: user.role,
              created_at: user.created_at,
              finished: result1.finished,
              correctAnswers: result2.count,
            });
            counter++;
            if (counter == result.count) {
              res.status(200).json(finalResults);
            }
          });
      });
    });
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
 */
routes.get('/:quiz/questions', function (req, res) {
  db.questions.findAll({
    attributes: [
      'content',
      'created_at',
      'updated_at',
      'id',
      'quiz_id',
      'has_image',
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
 * Return certain amount of questions that belong to the quiz in random order.
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
      'has_image',
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
routes.post('/assign', auth.passport.authenticate('jwt', { session: false }), isAdmin, function(req, res) {
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
routes.delete('/unassign', auth.passport.authenticate('jwt', { session: false }), isAdmin, function(req, res) {
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
routes.delete('/', auth.passport.authenticate('jwt', { session: false }), isAdmin, function(req, res) {
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
