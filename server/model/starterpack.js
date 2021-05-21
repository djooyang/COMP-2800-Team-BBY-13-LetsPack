"use strict";

const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    items : {
			type : [],
			required: true
		}
})


const starterpack = mongoose.model('starterpack', schema);

module.exports = starterpack;