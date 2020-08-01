const mongoose = require('mongoose');
const {connection} = require('../config/db');
const Joi = require('joi');

const theatreSchema =  new mongoose.Schema({

    theatre_id:{
        type:Number,
        unique:true,
        index:true
    },
    theatre_name: {
        type: String,
        required: true,
        unique:true
    },
    theatre_location: {
        type: String,
        required: true
    },
    city: {
        type: String,
        enum: ['Bengaluru','Mumbai','Delhi','Lucknow']
    },
    pincode: {
        type: Number,
        required: true
    }},
)

theatreSchema.plugin(autoIncrement.plugin, { model: 'Theatres', field: 'theatre_id' });
//theatreSchema.plugin(autoIncrement.plugin, 'Theatres');
const Theatres = mongoose.model('Theatres', theatreSchema);

const validate = ((theatre)=>{
    const schema = {
        theatre_id: Joi.number(),
        theatre_name : Joi.string().required(),
        theatre_location : Joi.string().required(),
        city : Joi.string().valid('Bengaluru','Mumbai','Delhi','Lucknow').required(),
        pincode: Joi.number().required(),
     };
     return Joi.validate(theatre , schema)
})


module.exports.theatreSchema = theatreSchema;
module.exports.Theatres = Theatres;
module.exports.validate = validate;