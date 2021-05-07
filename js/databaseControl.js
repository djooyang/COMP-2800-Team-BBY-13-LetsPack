const { MongoClient } = require('mongodb');
const Event = require('../data/models/event.js');
const ItemModel = require('../data/models/item.js');
const Item = ItemModel.item;
const mongoose = require('mongoose');

var client;

async function connect() {
	const uri = 'mongodb://localhost/letspack';
	client = new MongoClient(uri);

	try {
		await client.connect();
	} catch (e) {
		console.error(e);
	}
}

async function disconnect() {
	await client.close();
}


/* Returns null if the specified event doesn't exist */
const findEventByName = async function(eventName) {
	await connect();
	const result = await client.db("letspack").collection("events").findOne({name: eventName});
	if (result) {
		console.log('Found event.');
		await disconnect();
		return result;
	} else {
		console.log("No event found.");
		await disconnect();
		return null;
	}
}

/* Returns null if the specified event doesn't exist
 * Returns null if no items exist in the specified event
 */
async function findAllItemsInEventByName(eventName) {
	let event = await findEventByName(eventName);

	if (event !== undefined && event !== null) {
		let items = event.item;
		if (items !== undefined && items !== null && items.length > 0) {
			return items;
		} else {
			return null;
		}
	} else {
		return null;
	}
}


// Stennie https://dba.stackexchange.com/questions/157149/how-can-i-update-a-single-field-in-an-array-of-embedded-documents/157162
async function updateItemInEventByItemName(eventName, itemName, key, value) {
	await connect();
	let dynamicUpdate = {$set:{}};
	dynamicUpdate.$set['item.$.' + key] = value;

	client.db("letspack").collection("events").updateOne(
		{name: eventName, 'item.name': itemName},
		dynamicUpdate
	)
	await disconnect();
}

async function removeItemFromEventByName(eventName, itemName) {
	await connect();
	client.db("letspack").collection("events").updateOne(
		{name: eventName}, {$pull: {'item': {name: itemName} } }
	);
	await disconnect();
}


async function addItemToEventByName(eventName, itemInfo) {
	await connect();
	let inputInfo = itemInfo;

	let newItem = new Item({
		name: inputInfo.name,
		description: inputInfo.description,
		qty: inputInfo.qty,
		owner: inputInfo.owner,
		note: inputInfo.note
	});
	const eventToAddTo = client.db("letspack").collection("events").updateOne({name: eventName},
																																						{$push: {item: newItem}},
																																						{upsert: false});
	await disconnect();
}

async function removeEventByName(eventName) {
	await connect();
	client.db("letspack").collection("events").findOneAndDelete({name: eventName});
	await disconnect();
}


async function createEvent(eventInfo) {
	await connect();
	let inputInfo = eventInfo;

	let newEvent = new Event({
		name: inputInfo.name,
		date: inputInfo.date
	});

	const result = await client.db("letspack").collection("events").insertOne(newEvent);
	console.log(result.insertedId);
	await disconnect();
}


module.exports = {
		createEvent: createEvent,
		removeEventByName: removeEventByName,
		addItemToEventByName: addItemToEventByName,
		removeItemFromEventByName: removeItemFromEventByName,
		updateItemInEventByItemName: updateItemInEventByItemName,
		findAllItemsInEventByName: findAllItemsInEventByName,
		findEventByName: findEventByName,
};
