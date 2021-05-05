"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PersonSchema = new Schema({
	name: String,
	address: Number,
	dob: String,
	sex: String,
	hobby: String
});

const Person = mongoose.model('person', PersonSchema);

module.exports = Person;
