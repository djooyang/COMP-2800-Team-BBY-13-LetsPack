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

	let myEvent = {name: "Let's Go Camping", date: new Date(2019, 0, 23)};
	await createEvent(myEvent);

//	await removeEventByName('Other Event');

	let myAxe = {name: 'Axe', description: 'Small, Wooden handle, Very sharp.',
								qty: 1, owner: 'Robert', note: "Can't fall a tree with it."};
	await addItemToEventByName("Let's Go Camping", myAxe);

	let myTent = {name: 'Tent', description: '3 person tent.',
								qty: 1, owner: 'Robert', note: "Needs a tarp cause it isn't rain proof."};
	await addItemToEventByName("Let's Go Camping", myTent);

	let myFirstAidKit = {name: 'First Aid Kit', description: 'Suitable for a group of 4',
								qty: 1, owner: 'Robert', note: "I only have level 1 first aid."};
	await addItemToEventByName("Let's Go Camping", myFirstAidKit);


//	await removeItemFromEventByName('Other Event', 'Something');


	await updateItemInEventByItemName("Let's Go Camping", 'Axe', 'name', 'Hatchet');


//	let items = await findAllItemsInEventByName("Other Event");
//	console.log(items);


	let event = await findEventByName("Let's Go Camping");
	console.log(event);

}

main().catch(console.error);

