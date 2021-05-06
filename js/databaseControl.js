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

async function main() {
	await connect();
	//await listDatabases(client);
	                 //await findAllItemsInEventByName(client, "Crying");
//	await createEvent(client, {
//		name: "Crying",
//		date: "Every Day"
//	});
//	await addItemToEventByName(client, 'Crying', {name: 'Bruh',
//																									description: 'describing it',
//																									qty: 5,
//																									owner: 'a220fja4',
//																									note: 'huh?'});

	//await updateItemInEventByItemName(client, 'Crying', 'Bruh', 'description', 'Im going crazy');
	//await removeItemFromEventByName(client, 'Crying', 'Bruh');
	await removeEventByName(client, 'Hi');
	await disconnect();
}

main().catch(console.error);


const findEventByName = async function(client, eventName) {
	const result = await client.db("letspack").collection("events").findOne({name: eventName});
	if (result) {
		console.log('Found event.');
		return result;
	} else {
		console.log("No event found.");
	}
}
async function findAllItemsInEventByName(client, eventName) {
	const event = await findEventByName(client, eventName);
	return event.item;
}


// Stennie https://dba.stackexchange.com/questions/157149/how-can-i-update-a-single-field-in-an-array-of-embedded-documents/157162
async function updateItemInEventByItemName(client, eventName, itemName, key, value) {

	let dynamicUpdate = {$set:{}};
	dynamicUpdate.$set['item.$.' + key] = value;

	client.db("letspack").collection("events").updateOne(
		{name: eventName, 'item.name': itemName},
		dynamicUpdate
	)
}

async function removeItemFromEventByName(client, eventName, itemName) {
	client.db("letspack").collection("events").updateOne(
		{name: eventName}, {$pull: {'item': {name: itemName} } }
	);
}


async function addItemToEventByName(client, eventName, itemInfo) {
	let inputInfo = itemInfo;

	let newItem = new Item({
		name: inputInfo.name,
		description: inputInfo.description,
		qty: inputInfo.qty,
		owner: inputInfo.owner,
		note: inputInfo.note
	});
console.log(newItem);
	const eventToAddTo = client.db("letspack").collection("events").updateOne({name: eventName},
																																						{$push: {item: newItem}},
																																						{upsert:true});
}

async function removeEventByName(client, eventName) {
	client.db("letspack").collection("events").findOneAndDelete({name: eventName});
}


async function createEvent(client, eventInfo) {
	let inputInfo = eventInfo;

	let newEvent = new Event({
		name: inputInfo.name,
		date: inputInfo.date
	});

	const result = await client.db("letspack").collection("events").insertOne(newEvent);
	console.log(result.insertedId);
}


async function listDatabases(client) {
	const databasesList = await client.db().admin().listDatabases();
	console.log("Databases:");
	databasesList.databases.forEach(db => {
		console.log(db.name);
	})
}
