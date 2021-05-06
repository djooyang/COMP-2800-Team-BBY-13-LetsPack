const { MongoClient} = require('mongodb');
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

//async function main() {
//	//await listDatabases();
////	await findEventByName("Crying");
//	                 //await findAllItemsInEventByName("Crying");
////	await createEvent(
////		{
////		name: "Boba Fett",
////		date: "Every Day"
////	});
//	await addItemToEventByName('Boba Fett', {name: 'Bruh',
//																									description: 'describing it',
//																									qty: 5,
//																									owner: 'a220fja4',
//																									note: 'huh?'});
//
//	//await updateItemInEventByItemName('Crying', 'Itemnamein', 'description', 'CrayCray');
//	//await removeItemFromEventByName('Crying', 'Itemnamein');
////	await removeEventByName('Hi');
//}
//
//main().catch(console.error);


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
	}
}


async function findAllItemsInEventByName(eventName) {
	await connect()
	const event = await findEventByName(eventName);
	await disconnect();
	return event.item;
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
																																						{upsert:true});
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


async function listDatabases() {
	await connect();
	const databasesList = await client.db().admin().listDatabases();
	console.log("Databases:");
	databasesList.databases.forEach(db => {
		console.log(db.name);
	})
	await disconnect();
}

module.exports = {
		createEvent: createEvent(),
		removeEventByName: removeEventByName(),
		addItemToEventByName: addItemToEventByName(),
		removeItemFromEventByName: removeItemFromEventByName(),
		updateItemInEventByItemName: updateItemInEventByItemName(),
		findAllItemsInEventByName: findAllItemsInEventByName(),
		findEventByName: findEventByName(),
};
