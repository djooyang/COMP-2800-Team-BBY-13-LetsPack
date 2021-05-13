"use strict";

const axios = require('axios');

//gets all the users and passes them to the index page when it's constructed
exports.homeRoutes = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/users')
        .then(function(response){
            res.render('index', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}

//gets all the events and passes them to the profile page when it's constructed
exports.profile = (req, res) => {
    // Make a get request to /api/users
    axios.get('profile', { params : { email : req.query.email}})
        .then(function(response){
            res.render('profile', { events : response.data });
        })
        .catch(err =>{
            res.send(err);
        })
}





//****************Item part*********************** */


exports.items = (req, res) => {
    // Make a get request to /api/users
    axios.get('items', { params : { email : req.query.email}})
        .then(function(response){
            res.render('items', { item : response.data });
        })
        .catch(err =>{
            res.send(err);
        })
    
}

exports.items = (req, res) =>{
    res.render('items');
}

exports.add_item = (req, res) =>{
    res.render('add_item');
}





exports.add_user = (req, res) =>{
    res.render('add_user');
}

exports.update_user = (req, res) =>{
    axios.get('http://localhost:3000/api/users', { params : { id : req.query.id }})
        .then(function(userdata){
            res.render("update_user", { user : userdata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}

var Event = require('../model/event');
var ItemDb = require('../model/item');

exports.update_event = (req, res) =>{

		Event.findById(req.query.id)
				 .then(eventData => {

							res.render("update_event", { event : eventData})
						})
						.catch(err =>{
							res.send(err);
						})
}


exports.update_item = (req, res) =>{

    ItemDb.findById(req.query.id)
             .then(useritem => {

                        res.render("update_item", { item : useritem})
                    })
                    .catch(err =>{
                        res.send(err);
                    })
}


exports.login = (req, res) =>{
    res.render('login');
}

exports.add_event = (req, res) =>{
	res.render('add_event');
}


