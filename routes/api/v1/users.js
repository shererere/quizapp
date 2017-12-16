const routes = require('express').Router();
const db = require('../../../db');


// return all users
routes.get('/', function (req, res) {
  db.users.findAll().then(function(result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({messsage: 'Error 400'});
  });
});

// return user with id
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
    res.status(400).json({ messsage: 'Error 400' });
  });
});

// show user's answers
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
    res.status(400).json({ messsage: 'Error 400' });
  });
});

// return users that belong to the division
routes.get('/division/:division', function (req, res) {
  db.users.findAll({
    where: {
      division: req.params.division,
    },
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400' });
  });
});

// TODO: move to quiz ???
// return all quizzes, that user finished
routes.get('/:user/quizzes/finished', function (req, res) {
  db.users_quizzes.findAll({
    where: {
      user_id: req.params.user,
      finished: true,
    },
    attributes: ['quiz_id'],
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', content: error.message });
  });
});

// TODO: move to quiz ???
// return all quizzes, that are available for user
routes.get('/:user/quizzes/available', function (req, res) {
  db.users_quizzes.findAll({
    where: {
      user_id: req.params.user,
      finished: false,
    },
    attributes: ['quiz_id'],
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400', content: error.message });
  });
});

// return all quizzes, that user takes part in
routes.get('/:user/quizzes', function (req, res) {
  db.quizzes.findAll({
    include: [{
      model: db.users,
      attributes: [],
      where: {
        id: req.params.user,
      },
    }],
  }).then(function (result) {
    res.status(200).json(result);
  }).catch(function (error) {
    res.status(400).json({ messsage: 'Error 400' });
  });
});

// check if user has finished the quiz
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
    res.status(400).json({ messsage: 'Error 400' });
  });
});

// user finished a quiz
routes.post('/quiz/finish', function(req, res) {
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
      res.status(201).json({ message: 'User finished quest successfully' });
    }).catch(function (error) {
      res.status(400).json({ messsage: 'Error 400' });
    });
  }
});


// answer to quiz's question
routes.post('/quiz/answer', function(req, res) {
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
      res.status(400).json({ messsage: 'Error 400' });
    });
  }
});


// delete user from db
routes.delete('/', function(req, res) {
  if (typeof(req.body.id) == 'undefined') {
    res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.users.findOne({
      where: {
        id: req.body.id
      }
    }).then(function(result) {
      if (result == null) {
        // TODO: no JSON response
        res.status(204).json({ error: 'User not found' });
      } else {
        db.users.destroy({
          where: {
            id: req.body.id,
          }
        }).then(function() {
          res.status(200).json({ message: 'User deleted successfully' });
        });
      }
    }).catch(function (error) {
      res.status(400).json({ messsage: 'Error 400' });
    });
  }
});

// add new user
// routes.post('/user', function (req, res) {
//   if (typeof(req.body.username) == 'undefined' ||
//       typeof(req.body.password) == 'undefined' ||
//       typeof(req.body.division) == 'undefined' ) {
//         res.status(400).json({ error: 'Missing parameters!' });
//   } else {
//     db.sequelize.sync().then(function() {
//       db.users.create({
//         username: req.body.username,
//         password: req.body.password, //plaintext xdxdxdxd
//         division: req.body.division,
//         role: 'user',
//       });
//     }).then(function() {
//       res.status(201).json({ message: 'User created successfully' });
//     });
//   }

// });

module.exports = routes;
