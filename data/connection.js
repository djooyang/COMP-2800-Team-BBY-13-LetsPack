"use strict";

const mongoose = require('mongoose');

//Use the standard ES6 promise
mongoose.Promise = global.Promise;

//Connect to the database
before(function(done) {

	mongoose.connect('mongodb://localhost/testEvent',
		{ useNewUrlParser: true,
		  useUnifiedTopology: true,
		  useFindAndModify: false
		});
	mongoose.connection.once('open', function() {
		console.log('Connected to database.');
		done();
	}).on('error', function() {
		console.log('Error in connection.', error);
	});
})

//Drop the characters collection before each test
beforeEach(function(done) {
	//Drop the collections
	mongoose.connection.collections.events.drop(function() {
		done();
	});
		mongoose.connection.collections.events.drop(function() {
		done();
	});
});