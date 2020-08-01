const mongoose = require('mongoose');
const {Theatres,theatreSchema} = require('./theatres');
const {Movies, movieSchema} = require('./movies');
const {connection} = require('../config/db');
const moment = require('moment');

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const Shows = mongoose.model('Shows', new mongoose.Schema({

    theatre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theatres'
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movies'
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
}));

const validate = ((shows)=>{
    const schema = {
        movie_id : Joi.number().required(),
        theatre_id : Joi.number().required(),
        date : Joi.required(),
        time : Joi.required()
     };
     return Joi.validate(shows , schema)
})

const validateShowsQuery = ((shows)=>{
    const schema = {
        movie_id : Joi.number().required(),
        city : Joi.required(),
        date : Joi.required()
     };
     return Joi.validate(shows , schema)
})

async function validateTiming(req, res, movie, theatre) {

    const startTime = req.body.time;
    const startDate = req.body.date;
    const showStart = moment(startDate+' '+startTime);
    const showEnd = moment(startDate+' '+startTime).add(movie.length,'minutes');
    const prevDate = moment(req.body.date).subtract('1', 'days').format('YYYY-MM-DD');
    const endDate = moment(req.body.date +' '+req.body.time).add(movie.length,'minutes').format('YYYY-MM-DD') ;
  
    const query = {
      $or:[ {date: startDate, theatre: theatre._id},
        {date: endDate, theatre: theatre._id},
        {date: prevDate, theatre: theatre._id}]
    }
    for await (const doc of Shows.find(query)) {
      
      let movie = await Movies.findById(doc.movie);
      let existingShowStart = moment(doc.date+' '+doc.time);
      let existingShowEnd = moment(doc.date+' '+doc.time).add(movie.length,'minutes');
      if(showStart.isBetween(existingShowStart,existingShowEnd) ||  showEnd.isBetween(existingShowStart,existingShowEnd) 
         || moment(existingShowStart).isSame(showStart) || (existingShowStart.isBetween(showStart,showEnd) 
                || moment(showStart).isSame(existingShowStart)))
                 return false; 
    }
    return true;
  }
module.exports.validateShowsQuery = validateShowsQuery;   
module.exports.validateTiming = validateTiming;
module.exports.validate = validate;
module.exports.Shows = Shows;