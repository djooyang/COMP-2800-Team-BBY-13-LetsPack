const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	name: String,
	description: String,
	qty: Number,
	owner: String,
	note: String
})

const Item = mongoose.model('item', ItemSchema);

//module.exports = ItemSchema;
//module.exports = Item;

module.exports = {
    itemSchema: ItemSchema,
    item: Item
};