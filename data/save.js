"use strict";

const Event = require('./models/event.js');
const Person = require('./models/person.js');


const save_event = function(inputName, inputDate, inputParticipants) {
	let newEvent = new Event({
		name: inputName,
		date: inputDate,
		participants: inputParticipants
	});

	newEvent.save().then(function() {
		done();
	});
});


const save_person = function(inputName, inputAddress, inputDob, inputSex, inputHobby) {
	let newPerson = new Person({
		name: inputName,
		address: inputAddress,
		dob: inputDob,
		sex: inputSex,
		hobby: inputHobby
	});

	newPerson.save().then(function() {
		done();
	});
});

module.exports = save_event;
module.exports = save_person;
