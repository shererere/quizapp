const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('sequelize');

const app = express();
const db = new sequelize('xd', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

// ************************************************************************ \\

const Quiz = db.define('quiz', {
  name: sequelize.STRING,
});

const Question = db.define('question', {
  content: sequelize.STRING,
  correct_answer: sequelize.STRING,
  wrong_answer1: sequelize.STRING,
  wrong_answer2: sequelize.STRING,
  wrong_answer3: sequelize.STRING,
});

// ************************************************************************ \\

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/add', function (req, res) {
  db.sync().then(function() {
    Quiz.create({
      name: req.body.name,
    });
  });
  res.send('stworzono xd');
});


app.get('/addrandom', function (req, res) {
  db.sync().then(function () {

  });
});

app.get('/sprawc', function (req, res) {
  Quiz.findAll({
    where: {
      id: 2,
    }
  })
  .then(function(result) {
    res.send(result);
  });
});




app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


// https://sequelize.readthedocs.io/en/1.7.0/articles/express/
// hyyhyhyhyhyhyyh
