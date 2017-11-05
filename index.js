const express = require('express');
const bodyParser = require('body-parser');

const db = require('./db');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

app.locals.title = 'Quiz app';

app.get('/', function (req, res) {
  res.send('Hello World!');
});


/*
  TODO:
    -> tabele łączące
*/

// |--------|
// |  quiz  |
// |--------|

// return all quizzes
app.get('/quizzes', function (req, res) {
  db.quizzes.findAll().then(function(result) {
    res.status(200).json(result);
  });
});

// return all quizzes, that user takes part in
app.get('/user/:user/quizzes', function (req, res) {
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
  });
});

// add new quiz
app.post('/quiz', function (req, res) {
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



// |-------------|
// |  questions  |
// |-------------|

// return all the questions
app.get('/questions', function (req, res) {
  db.questions.findAll().then(function(result) {
    res.status(200).json(result);
  });
});

// return all questions that belong to the quiz
app.get('/quiz/:quiz/questions', function (req,res) {
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

// add new question
app.post('/question', function (req, res) {
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
    });
  }
});


// |---------|
// |  users  |
// |---------|

// return all users
app.get('/users', function (req, res) {
  db.users.findAll().then(function(result) {
    res.status(200).json(result);
  });
});

// return user with id
app.get('/user/:id', function (req, res) {
  // TODO: no idea czy działa xd
  // R: dziala
  db.users.findAll({
    where: {
      id: req.params.id,
    },
  }).then(function (result) {
    res.status(200).json(result);
  });
});

// return users that belong to the division
app.get('/users/division/:division', function (req, res) {
  db.users.findAll({
    where: {
      division: req.params.division,
    },
  }).then(function (result) {
    res.status(200).json(result);
  });
});

// return all users that take part in quiz
app.get('/quiz/:quiz/users', function (req, res) {
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

// add new user
app.post('/user', function (req, res) {
  if (typeof(req.body.username) == 'undefined' ||
      typeof(req.body.password) == 'undefined' ||
      typeof(req.body.division) == 'undefined' ) {
        res.status(400).json({ error: 'Missing parameters!' });
  } else {
    db.sequelize.sync().then(function() {
      db.users.create({
        username: req.body.username,
        password: req.body.password, //plaintext xdxdxdxd
        division: req.body.division,
        role: 'user',
      });
    }).then(function() {
      res.status(201).json({ message: 'User created successfully' });
    });
  }

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


// http://www.restapitutorial.com/httpstatuscodes.html
// bardzo ważne to jest

// https://sequelize.readthedocs.io/en/1.7.0/articles/express/
// hyyhyhyhyhyhyyh
