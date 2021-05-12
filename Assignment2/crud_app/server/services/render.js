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

exports.update_event = (req, res) =>{

		Event.findById(req.query.id)
				 .then(eventData => {

							res.render("update_event", { event : eventData})
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
/*
exports.login = (req, res) =>{
    axios.get('http://localhost:3000/login')
        .then(function(){
            req.render('login')
        })
        .catch(err =>{
            res.send(err);
        })
}
*/

