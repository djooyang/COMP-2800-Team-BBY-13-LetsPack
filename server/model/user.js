"use strict";

const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    email : {
        type : String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
    }
})


const user = mongoose.model('user', schema);

module.exports = user;