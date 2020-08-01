const mongoose = require('mongoose');
const {connection} = require('../config/db');
const Joi = require('joi');

const movieSchema = new mongoose.Schema({

    movie_id:{
        type:Number,
        unique:true
    },
    movie_name: {
        type: String,
        required: true,
        unique: true,
    },
    movie_trailer: {
        type: String,
        required: true
    },
    movie_overview: {
        type: String,
        required: true
    },
    movie_poster: {
        type: String,
        required: true
    },
    length: {
        type: Number,
        required: true
    }
})

movieSchema.plugin(autoIncrement.plugin, { model: 'Movies', field: 'movie_id' });
//movieSchema.plugin(autoIncrement.plugin, 'Movies');
const Movies = mongoose.model('Movies', movieSchema);

const validate = ((movie)=>{
    const schema = {
        //movie_id: Joi.number(),
        movie_name : Joi.string().required(),
        movie_trailer : Joi.string().required(),
        movie_overview : Joi.string().required(),
        movie_poster: Joi.string().required(),
        length: Joi.number().required(),
     };
     return Joi.validate(movie , schema)
})

module.exports.movieSchema = movieSchema;
module.exports.Movies = Movies;
module.exports.validate = validate;