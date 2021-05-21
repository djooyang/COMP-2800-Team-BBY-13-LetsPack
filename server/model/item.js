"use strict";

const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    eventId : {
        type : String,
        required: true
		},
    qty : {
        type : Number,
        required: true
    },
    des : {
        type : String
    },
    owner : {
        type : String
    },
    packed : {
        type : Boolean
		}
})


const Item = mongoose.model('item', schema);

module.exports = Item;