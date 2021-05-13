"use strict";

const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    sender : {
        type : String,
        required: true
    },
    eventname : {
        type: String,
        required: true
    },
    eventid : {
        type: String,
        required: true
    },
    recipient : {
        type: String,
        required: true
    }
})


const Invite = mongoose.model('invites', schema);

module.exports = Invite;