var express = require('express');
var router = express.Router();
const { Movies, validate } = require('../model/movies');
const { MESSAGES } = require('../utility/constants')


/* Add a Movie. */
router.post('/create', async function (req, res, next) {

  const result = validate(req.body);
  const dupMovie = await Movies.findOne({ movie_name: req.body.movie_name });


  if (result.error || dupMovie) {
    res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });
  }

  let movies = new Movies({
    movie_name: req.body.movie_name,
    movie_trailer: req.body.movie_trailer,
    movie_overview: req.body.movie_overview,
    movie_poster: req.body.movie_poster,
    length: req.body.length,
  });

  await movies.save();
  res.status(200).send(movies);
});

module.exports = router;