"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ItemSchema = new Schema({
	name: String,
	qty: Number,
	owner: String
});

const Item = mongoose.model('item', ItemSchema);

module.exports = Item;
