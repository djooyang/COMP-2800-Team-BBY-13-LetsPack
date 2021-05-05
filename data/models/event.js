"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const EventSchema = new Schema({
	name: String,
	date: String,
	participants: [PersonSchema]
});

const Item = mongoose.model('item', ItemSchema);

module.exports = Item;