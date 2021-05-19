"use strict";

const axios = require('axios');

//gets all the users and passes them to the index page when it's constructed
exports.homeRoutes = (req, res) => {
        res.render('login');
}


exports.login = (req, res) => {
	res.render('login.ejs');
}

exports.about = (req, res) => {
	res.render('about.ejs');
}

exports.chat = (req, res) => {
	res.render('chat.ejs');
}

exports.chat2 = (req, res) => {
	res.render('chat2.ejs');
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
    res.render('add_item', {event : req.query.id});
}

exports.signup = (req, res) =>{
    res.render('signup');
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

exports.invite_create = (req, res) =>{

		Event.findById(req.query.id)
				 .then(eventData => {

							res.render("invite_create", { event : eventData, sender : req._passport.session.user})
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

exports.new_event = (req, res) =>{
	res.render('new_event');
}

exports.badURL = (req, res) =>{
	res.redirect('/')
}
