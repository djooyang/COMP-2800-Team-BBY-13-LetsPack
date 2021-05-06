const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ItemModel = require('./item.js');
const ItemSchema = ItemModel.itemSchema;

const EventSchema = new Schema({
	name: String,
	date: String,
	item: [ItemSchema]
});

const Event = mongoose.model('event', EventSchema);

module.exports = Event;