// This is how to import all the database functions.
const database = require('./databaseControl.js');
const createEvent = database.createEvent;
const removeEventByName = database.removeEventByName;
const addItemToEventByName = database.addItemToEventByName;
const removeItemFromEventByName = database.removeItemFromEventByName;
const updateItemInEventByItemName = database.updateItemInEventByItemName;
const findAllItemsInEventByName = database.findAllItemsInEventByName;
const findEventByName = database.findEventByName;

async function main() {

	let myEvent = {name: "Let's Go Camping", date: new Date(2019, 0, 23)}; // 0 = January 23 = 23rd of month
	await createEvent(myEvent);//No concievable errors. Rapid calling is fine.

//	await removeEventByName('My head hurts'); //NonExistent event is fine. Rapid calling is fine.

//	let myItem = {name: 'Wee', description: 'describing it',
//								qty: 5, owner: 'a220fja4', note: 'huh?'};
//	await addItemToEventByName("Let's Go Camping", myItem); //NonExistent event is fine. Rapidly is fine.


//	await removeItemFromEventByName('Boba Fett', 'Bruh'); //NonExistent event is fine, NonExistent Item is find. Rapidly is fine.


//	await updateItemInEventByItemName('My head hurts', 'Naa', 'description', 'Yes'); //NonExistent event is fine, NonExistent item is fine, Rapidly is fine


//	let items = await findAllItemsInEventByName("Boba Fett"); //NonExistent event is fine(returns null), NonExistent item is fine (returns null). Rapidly is fine.
//	console.log(items);


//	let event = await findEventByName("My head hurts"); //NonExistent event is fine (returns null), Rapidly is fine.
//	console.log(event);

}

main().catch(console.error);

