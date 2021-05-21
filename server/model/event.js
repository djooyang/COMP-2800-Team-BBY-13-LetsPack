"use strict";

const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    eventdate : {
        type : String,
        required: true
    },
    description : {
        type : String,
        required :true
    },
    users : {
			type : [String]
		}
})


const event = mongoose.model('event', schema);

module.exports = event;
