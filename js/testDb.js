const database = require('./databaseControl.js');
const createEvent = database.createEvent;
const removeEventByName = database.removeEventByName;
const addItemToEventByName = database.addItemToEventByName;
const removeItemFromEventByName = database.removeItemFromEventByName;
const updateItemInEventByItemName = database.updateItemInEventByItemName;
const findAllItemsInEventByName = database.findAllItemsInEventByName;
const findEventByName = database.findEventByName;

async function main() {

	await createEvent(
		{
		name: "My head hurts",
		date: "Every Day"
	});

//	await removeEventByName('Hi');
//
//	await addItemToEventByName('Boba Fett', {name: 'Bruh',
//																									description: 'describing it',
//																									qty: 5,
//																									owner: 'a220fja4',
//																									note: 'huh?'});
//
//	await removeItemFromEventByName('Crying', 'Itemnamein');
//
//	await updateItemInEventByItemName('Crying', 'Itemnamein', 'description', 'CrayCray');
//
//	await findAllItemsInEventByName("Crying");
//
//	await findEventByName("Crying");
}
