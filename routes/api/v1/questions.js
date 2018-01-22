const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');
const multer = require('multer');
const routes = require('express').Router();
const db = require('../../../db');
const auth = require('../../../auth');

const images_storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/images/');
  },
  // filename: function(req, file, cb) {
  //   cb(null, req.body.questionid);
  // },
});

const upload = multer({ dest: 'uploads/temp/' });
const upload_images = multer({ storage: images_storage });


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
routes.post('/', auth.passport.authenticate('jwt', { session: false }), function (req, res) {
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
routes.delete('/', auth.passport.authenticate('jwt', { session: false }), function(req, res) {
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

/**
 * It handles uploading file with questions.
 * @method
 * @param {uuid} id - Question ID.
 */
routes.post('/upload', upload.single('file'), function (req, res, next) {
  var stream = fs.createReadStream(req.file.path);
  var csvStream = csv({
    delimiter: ',',
    quote: '"'
  })
    .on('data', function (data) {
      db.questions.create({
        content: data[0],
        correct_answer: data[1],
        wrong_answer1: data[2],
        wrong_answer2: data[3],
        wrong_answer3: data[4],
        quiz_id: req.body.quizid,
      });
    })
    .on('end', function () {
      // NOTE: unlink -> delete file
      fs.unlink(req.file.path);
    });
  stream.pipe(csvStream);
});

/**
 * It handles adding image to question.
 * @method
 * @param {uuid} questionid - Question ID.
 */
routes.post('/upload/image', upload_images.single('file'), function (req, res, next) {

  if (!fs.existsSync(path.resolve(__dirname, '../../..', 'uploads', 'images', req.body.questionid))) {
    // change 'has_image' field in db
    if (typeof (req.body.questionid) == 'undefined') {
      res.status(400).json({ error: 'Missing parameters!' });
    } else {
      db.sequelize.sync().then(function () {
        db.questions.findOne({
          where: {
            id: req.body.questionid,
          },
        }).then(function (record) {
          record.update({
            has_image: !record.has_image,
          },
          {
            fields: ['has_image'],
          });
        });
      }).then(function () {
        res.status(201).json({ message: 'Image uploaded sucessfully' });

        // rename file
        fs.rename(path.resolve(__dirname, '../../..', 'uploads', 'images', req.file.filename),
                  path.resolve(__dirname, '../../..', 'uploads', 'images', req.body.questionid),
                  function(err) {
                    if (err) res.status(400).json({ message: 'Error 400', error: err });
                  });
      }).catch(function (error) {
        res.status(400).json({ messsage: 'Error 400', error: error });
      });
    }
  } else {
    res.status(400).json({ messsage: 'File associated with this question exist' });
  }
});

module.exports = routes;
