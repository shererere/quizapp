const routes = require('express').Router();
const bCrypt = require('bcrypt-nodejs');
const auth = require('../../../auth');
const db = require('../../../db');
const isAdmin = require('../../../middleware');


var generateHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

/**
 * Return all divisions.
 * @method
 */
routes.get('/division/all', function (req, res) {
  db.users.findAll({
    group: ['division'],
    attributes: ['division'],
  }).then(function (result) {
    let divisions = [];

    result.forEach(function(d) {
      divisions.push(d.division);
    });
    res.status(200).json(divisions);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Return all users.
 * @method
 */
routes.get('/', function (req, res) {
  db.users.findAll({
    attributes: {
      exclude: ['password'],
    },
  }).then(function(result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Return one user.
 * @method
 * @param {uuid} id - User ID.
 */
routes.get('/:id', function (req, res) {
  db.users.findAll({
    where: {
      id: req.params.id,
    },
    attributes: {
      exclude: ['password'],
    },
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Return if user is admin.
 * @method
 * @param {uuid} id - User ID.
 */
routes.get('/:id/admin', function (req, res) {
  db.users.findAndCountAll({
    where: {
      id: req.params.id,
      role: 'admin',
    },
  }).then(function (result) {
    res.status(200).json(result.count);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

// NOTE: this route should return 204 no content if result is []
/**
 * Return user's answers to a specific quiz.
 * @method
 * @param {uuid} user_id - User ID.
 * @param {uuid} quiz_id - Quiz ID.
 */
routes.get('/:user/quiz/:quiz/answers', function (req, res) {
  db.users_answers.findAll({
    include: [{
      model: db.quizzes,
      attributes: [],
      include: [{
        model: db.questions,
        attributes: [],
        where: {
          quiz_id: req.params.quiz,
        }
      }],
    }],
    where: {
        user_id: req.params.user,
        quiz_id: req.params.quiz,
    },
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

// NOTE: this route should return 204 no content if result is []
/**
 * Return number of user's correct answers.
 * @method
 * @param {uuid} user_id - User ID.
 * @param {uuid} quiz_id - Quiz ID.
 */
routes.get('/:user/quiz/:quiz/answers/correct', function (req, res) {
  db.users_answers.findAndCountAll({
    where: {
      answer: 0,
      user_id: req.params.user,
      quiz_id: req.params.quiz,
    },
  }).then(function (result) {
    res.status(200).json(result.count);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Return questions that user has answered in given quiz.
 * @method
 * @param {uuid} user_id - User ID.
 * @param {uuid} quiz_id - Quiz ID.
 */
routes.get('/:user/quiz/:quiz/questions', function (req, res) {
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
      attributes: [],
      model: db.users,
      where: {
        id: req.params.user,
      },
    }],
    where: {
      quiz_id: req.params.quiz,
    }
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error.message });
  });
});

// NOTE: this route should return 204 no content if result is []
/**
 * Return user's answer to a specific question.
 * @method
 * @param {uuid} user_id - User ID.
 * @param {uuid} question_id - Question ID.
 */
routes.get('/:user/question/:question/answer', function (req, res) {
  db.users_answers.findAll({
    where: {
      question_id: req.params.question,
      user_id: req.params.user,
    },
    attributes: ['answer'],
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

// NOTE: this route should return 204 no content if result is []
/**
 * Return users that belongs to the division.
 * @method
 * @param {string} division - Division.
 */
routes.get('/division/:division', function (req, res) {
  db.users.findAll({
    where: {
      division: {
        [db.Sequelize.Op.like]: req.params.division,
      },
    },
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});



/**
 * Return user's finished quizzes.
 * @method
 * @param {uuid} user - User ID.
 */
routes.get('/:user/quizzes/finished', function (req, res) {
  db.users.findAll({
    where: {
      id: req.params.user,
    },
    include: [{
      model: db.quizzes,
      through: {
        where: {
          finished: true,
        },
        attributes: [],
      },
    }],
    attributes: [],
  }).then(function (result) {
    res.status(200).json(result[0].quizzes);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Return user's available quizzes.
 * @method
 * @param {uuid} user - User ID.
 */
routes.get('/:user/quizzes/available', function (req, res) {
  db.users.findAll({
    where: {
      id: req.params.user,
    },
    include: [{
      model: db.quizzes,
      through: {
        where: {
          finished: false,
        },
        attributes: [],
      },
    }],
    attributes: [],
  }).then(function (result) {
    res.status(200).json(result[0].quizzes);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});

/**
 * Return quizzes that user takes part in.
 * @method
 * @param {uuid} user - User ID.
 */
routes.get('/:user/quizzes', function (req, res) {
  db.quizzes.findAndCountAll({
    include: [{
      model: db.users,
      attributes: [],
      where: {
        id: req.params.user,
      },
    }],
  }).then(function (result) {
    let counter = 0;
    let finalResults = [];
    result.rows.forEach(function (item, key) {
      db.users_quizzes.findOne({
        attributes: ['finished'],
        where: {
          user_id: req.params.user,
          quiz_id: item.id,
        },
      }).then(function (result1) {
        db.users_answers.findAndCountAll({
          where: {
            answer: 0,
            user_id: req.params.user,
            quiz_id: item.id,
          },
        }).then(function (result2) {
          finalResults.push({
            id: item.id,
            name: item.name,
            size: item.size,
            created_at: item.created_at,
            finished: result1.finished,
            correct_answers: result2.count,
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
 * Check if user has finished the quiz.
 * @method
 * @param {uuid} user - User ID.
 * @param {uuid} quiz - Quiz ID.
 */
routes.get('/:user/quiz/:quiz/finished', function (req, res) {
  db.users_quizzes.findAll({
    attributes: ['finished'],
    where: {
      user_id: req.params.user,
      quiz_id: req.params.quiz,
    },
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', error: error });
  });
});


/**
 * Toggle "finish" of user's quiz.
 * @method
 * @param {uuid} userid - User ID.
 * @param {uuid} quizid - Quiz ID.
 */
routes.post('/quiz/finish', auth.passport.authenticate('jwt', { session: false }), function(req, res) {
  if (typeof (req.body.userid) == 'undefined' ||
    typeof (req.body.quizid) == 'undefined') {
    res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.sequelize.sync().then(function () {
      db.users_quizzes.findOne({
        where: {
          user_id: req.body.userid,
          quiz_id: req.body.quizid,
        },
      }).then(function(record) {
        record.update({
          finished: !record.finished,
        },
        {
          fields: ['finished'],
        });
      });
    }).then(function () {
      res.status(201).json({ message: 'User finished quiz successfully' });
    }).catch(function (error) {
      res.status(400).json({ messsage: 'Error 400', error: error });
    });
  }
});

/**
 * Answer to quiz question.
 * @method
 * @param {uuid} questionid - Question ID.
 * @param {uuid} userid - User ID.
 * @param {uuid} quizid - Quiz ID.
 * @param {int} answer - {0 (correct), 1, 2, 3}.
 */
routes.post('/quiz/answer', auth.passport.authenticate('jwt', { session: false }), function(req, res) {
  if (typeof(req.body.questionid) == 'undefined' ||
      typeof(req.body.userid) == 'undefined' ||
      typeof(req.body.quizid) == 'undefined' ||
      typeof(req.body.answer) == 'undefined') {
        res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.sequelize.sync().then(function() {
      db.users_answers.create({
        question_id: req.body.questionid,
        user_id: req.body.userid,
        quiz_id: req.body.quizid,
        answer: req.body.answer,
      });
    }).then(function() {
      res.status(201).json({ message: 'User answered to question successfully' });
    }).catch(function (error) {
      res.status(400).json({ messsage: 'Error 400', error: error });
    });
  }
});

/**
 * Delete user answers from quiz.
 * @method
 * @param {uuid} userid - User ID.
 * @param {uuid} quizid - Quiz ID.
 */

routes.delete('/quiz/answers', auth.passport.authenticate('jwt', { session: false }), isAdmin, function(req, res) {
  if (typeof(req.body.userid) === 'undefined' ||
      typeof(req.body.quizid) === 'undefined' ) {
        res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.users_answers.findAll({
      where: {
        user_id: req.body.userid,
        quiz_id: req.body.quizid,
      }
    }).then(function (result) {
      if (result == null) {
        // TODO: no JSON response
        res.status(204).json({ error: 'Answers not found' });
      } else {
        db.users_answers.destroy({
          where: {
            user_id: req.body.userid,
            quiz_id: req.body.quizid,
          }
        }).then(function () {
          res.status(200).json({ message: 'Answers deleted successfully' });
        });
      }
    }).catch(function (error) {
      res.status(400).json({ messsage: 'Error 400', error: error });
    });
  }
});

/**
 * Delete user.
 * @method
 * @param {uuid} userid - User ID.
 */
routes.delete('/', auth.passport.authenticate('jwt', { session: false }), isAdmin, function(req, res) {
  if (typeof(req.body.userid) == 'undefined') {
    res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.users.findOne({
      where: {
        id: req.body.userid
      }
    }).then(function(result) {
      if (result == null) {
        // TODO: no JSON response
        res.status(204).json({ error: 'User not found' });
      } else {
        db.users.destroy({
          where: {
            id: req.body.userid,
          }
        }).then(function() {
          res.status(200).json({ message: 'User deleted successfully' });
        });
      }
    }).catch(function (error) {
      res.status(400).json({ messsage: 'Error 400', error: error });
    });
  }
});

/**
 * Register user.
 * @method
 * @param {string} username - Username.
 * @param {string} password - Password.
 * @param {string} division - Division name
 * @param {enum} role - 'user' or 'admin'
 */

routes.post('/register', auth.passport.authenticate('jwt', { session: false }), isAdmin, function (req, res) {
  if (typeof (req.body.username) == 'undefined' ||
    typeof (req.body.password) == 'undefined' ||
    typeof (req.body.division) == 'undefined' ||
    typeof (req.body.role) == 'undefined') {
    res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.users.findOne({
      where: {
        username: req.body.username
      }
    }).then(function (user) {
      if (user) {
        res.status(400).json({ message: 'User exists' });
      } else {
        var userPassword = generateHash(req.body.password);
        var data = {
          username: req.body.username,
          password: userPassword,
          division: req.body.division,
          role: req.body.role,
        };

        db.users.create(data).then(function (newUser, created) {
          if (!newUser) {
            res.status(400).json({ messsage: 'Unexpected error' });
          }

          if (newUser) {
            res.status(201).json({ messsage: 'User created' });
          }
        });
      }
    });
  }
});

/**
 * Change user's password.
 * @method
 * @param {uuid} userid - userid.
 * @param {string} password - Password.
 */
routes.post('/password/change', auth.passport.authenticate('jwt', { session: false }), function (req, res) {
  if (typeof (req.body.userid) == 'undefined' ||
    typeof (req.body.password) == 'undefined') {
      res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.users.findOne({
      where: {
        id: req.body.userid,
      },
    }).then(function (record) {
      record.update({
        password: generateHash(req.body.password),
      },
      {
        fields: ['password'],
      });
    }).then(function () {
      res.status(200).json({ message: 'Password changed successfully' });
    }).catch(function (error) {
      res.status(400).json({ messsage: 'Error 400', error: error });
    });
  }
});

module.exports = routes;
