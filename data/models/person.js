const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema and Model

const PersonSchema = new Schema({
	username: String,
	age: Number,
	events: [EventSchema]
});

const Author = mongoose.model('author', AuthorSchema);

module.exports = Author;
