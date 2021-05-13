"use strict";

const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    id : {
        type : String,
        required: true,
        unique: true
    },
    pw : {
        type: String,
        required: true
    }
})


const Login = mongoose.model('login', schema);

module.exports = Login;