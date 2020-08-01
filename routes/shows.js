var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const { Shows, validate, validateTiming, validateShowsQuery } = require('../model/shows');
const { Theatres } = require('../model/theatres');
const { Movies } = require('../model/movies');
const { MESSAGES } = require('../utility/constants');



//Add a show
router.post('/shows/create', async (req, res) => {

  const result = validate(req.body);
  if (result.error) return res.status(400).send({
    status: MESSAGES.FAILURE,
    reason: MESSAGES.INVALIDINPUT
  });

  const theatre = await Theatres.findOne({ theatre_id: req.body.theatre_id });
  const movie = await Movies.findOne({ movie_id: req.body.movie_id });

  if (!theatre || !movie)
    return res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });

  const validTime = await validateTiming(req, res, movie, theatre);
  if (!validTime) {
    res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });
  } else {
    let show = new Shows({
      theatre: theatre._id,
      movie: movie._id,
      date: req.body.date,
      time: req.body.time
    });

    await show.save();
    res.status(200).send({
      movie: movie,
      theatre: theatre,
      shows: [{
        date: show.date,
        time: show.time
      }]
    });
  }
});


//Get all shows
router.get('/showsBy', async (req, res) => {

  const result = validateShowsQuery(req.query);
  if (result.error) return res.status(400).send({
    status: MESSAGES.FAILURE,
    reason: MESSAGES.INVALIDINPUT
  });

  const movie = await Movies.findOne({ movie_id: req.query.movie_id });

  const query = {
    date: req.query.date, movie: movie._id
  }

  let theatresToShowsMap = new Map();
  for await (const doc of Shows.find(query).populate({ path: 'movie', match: { city: req.query.city } })) {
    let show = {
      "date": doc.date,
      "time": doc.time
    }
    let id = doc.theatre.toString();
    if (!theatresToShowsMap.has(id))
      theatresToShowsMap.set(id, []);
    theatresToShowsMap.get(id).push(show);
  }
  let obj = {
    movie: movie,
    theatres: []
  }
  const promiseArray = [];
  theatresToShowsMap.forEach((value, key) => {
    promiseArray.push(
      Promise.resolve(Theatres.findOne({ _id: mongoose.Types.ObjectId(key) }))
    );
  })
  Promise.all(promiseArray).then((theatres) => {
    theatres.forEach((theatre) => {
      const theatreObj = {
        theatre_id: theatre.theatre_id,
        theatre_name: theatre.theatre_name,
        theatre_location: theatre.theatre_location,
        city: theatre.city,
        pincode: theatre.pincode,
        shows: theatresToShowsMap.get(theatre._id.toString())
      }
      obj.theatres.push(theatreObj);
    })
    res.status(200).send(obj);
  })

})

module.exports = router;