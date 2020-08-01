var express = require('express');
var router = express.Router();
const { Theatres, validate } = require('../model/theatres');
const { MESSAGES } = require('../utility/constants')


/* Add a Theatre. */
router.post('/create', async function (req, res, next) {

  const result = validate(req.body);
  const dupTheatre = await Theatres.findOne({ theatre_name: req.body.theatre_name });


  if (result.error || dupTheatre) {
    res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });
  }

  let theatre = new Theatres({
    theatre_name: req.body.theatre_name,
    theatre_location: req.body.theatre_location,
    city: req.body.city,
    pincode: req.body.pincode
  });

  await theatre.save();
  res.status(200).send(theatre);
});

module.exports = router;