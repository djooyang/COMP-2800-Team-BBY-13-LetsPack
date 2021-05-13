"use strict";

const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    
    qty : {
		type : Number,
        required: true
	},
    des : {
        type : String,
        required: true
    },
    owner : {
        type : String,
        required: true
    }
})


const Item = mongoose.model('item', schema);

module.exports = Item;