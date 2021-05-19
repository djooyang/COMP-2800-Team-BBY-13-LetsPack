"use strict";

var Userdb = require('../model/model');
var Users = require('../model/user');
var Event = require('../model/event');
var Login = require('../model/login');
var Invite = require('../model/invite');
var ItemDb = require('../model/item');
var StarterPack = require('../model/starterpack');
const sanitizeHtml = require('sanitize-html');

/*add library for authentication*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

//Helper function to sanitize the html of the body.
function sanitizeHtmlOfBody(bodyToSanitize) {
	for (var key in bodyToSanitize) {
		if (bodyToSanitize.hasOwnProperty(key)) {
			bodyToSanitize[key] = sanitizeHtml(bodyToSanitize[key]);
		}
	}
}


// create and save new account
exports.signup = (req,res)=>{
// validate request
		if(!req.body){
				res.status(400).send({ message : "Content can not be emtpy!"});
				return;
		}
		sanitizeHtmlOfBody(req.body);

// new user
		const login = new Login({
				id : req.body.id,
				pw : req.body.pw
		})

// save user in the database
		login.save(login)
				.then(data => {
						res.redirect('/login');
				})
				.catch(err =>{
						res.status(500).send({
						message : err.message || "Some error occurred while creating a create operation"
				});
		});
}


const createItemsFromPack = (pack, idOfEvent)=> {
	if (pack !== "none") {
		StarterPack.findOne({name: pack}, function(err,obj) {
			let newItems = [];
			for (let i = 0; i < obj.items.length; i++) {
				newItems[i] = {name: obj.items[i].name, eventId: idOfEvent, qty: obj.items[i].qty, owner: ""}
			}
				ItemDb.insertMany(newItems);
		});
	}
	return;
}


// create and save new event
exports.createEvent = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be empty!"});
        return;
    }
    sanitizeHtmlOfBody(req.body);

    // new event
    const event = new Event({
        name : req.body.name,
				users : [req._passport.session.user]
    })

		createItemsFromPack(req.body.starterpack, event._id);

    // save event in the database
    event.save(event)
        .then(data => {
            res.redirect('/profile');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });
}


// create and save a new invite
exports.createInvite = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    sanitizeHtmlOfBody(req.body);

    // new invite
    const invite = new Invite({
        sender : req.body.sender,
				eventname : req.body.eventname,
			  eventid : req.body.eventid,
			  recipient : req.body.recipient
    })

    // save invite in the database
    invite.save(invite)
        .then(data => {
            res.redirect('/profile');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });
}


// Update an event by id
exports.updateEvent = (req, res)=>{
    if(!req.body){

        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
    sanitizeHtmlOfBody(req.body);
    const id = sanitizeHtml(req.params.id);

    Event.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update event with ${id}. Maybe event not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update event information"})
        })
}


// Adds or removes the users id to the owner field of an item.
exports.claimItem = (req, res)=>{

    const id = sanitizeHtml(req.body.item);

        ItemDb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                } else {
										let newOwner;
                    if (data.owner === req._passport.session.user) {
											newOwner = "";
										} else {
											newOwner = req._passport.session.user;
										}

										ItemDb.findByIdAndUpdate(id, {owner : newOwner}, { useFindAndModify: false})
												.then(data => {
														if(!data){
																res.status(404).send({ message : `Cannot Update item with ${id}. Maybe event not found!`})
														}else{
																res.send(data)
														}
												})
												.catch(err =>{
														res.status(500).send({ message : "Error Update item information"})
												})
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Error retrieving item with id " + id})
            })

}


// Adds a user to an event's array of users and removes the invite from the database
exports.acceptInvite = (req, res)=>{

    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
		sanitizeHtmlOfBody(req.body);
    const id = sanitizeHtml(req.query.id);

		Invite.findByIdAndDelete(id)
			.then(inviteData => {
				Event.findByIdAndUpdate(inviteData.eventid, {$push: {"users": inviteData.recipient}}, { useFindAndModify: false, safe: true, upsert: true})
				.then(data => {
					if(!data){
						res.status(404).send({ message : `Cannot Update event with ${id}. Maybe event not found!`})
					} else {
						res.redirect('/profile');
					}
				})
				.catch(err =>{
					res.status(500).send({ message : "Error Update event information"})
				})
		})
}


// Removes an invite from the database
exports.rejectInvite = (req, res)=>{

    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
		sanitizeHtmlOfBody(req.body);
    const id = sanitizeHtml(req.query.id);

    Invite.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.redirect("/profile");
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete item with id=" + id
            });
        });
}


// Delete an event with specified event id in the request
exports.deleteEvent = (req, res)=>{
    const id = sanitizeHtml(req.params.id);

    Event.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                ItemDb.deleteMany({ eventId: id }).then(function(){
                    res.send({
                        message : "Event was deleted successfully!"
                    })
                }).catch(function(error){
                    res.status(500).send({
                        message: "Could not delete Items from the event with id=" + id
                    });
                });
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Event with id=" + id
            });
        });
}


// create and save a new item
exports.createItem = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    sanitizeHtmlOfBody(req.body);

    // new event
    const item = new ItemDb({
        name : req.body.item,
        eventId : req.body.eventId,
        qty : req.body.qty,
        owner : req.body.owner
    })

    // save item in the database
    item.save(item)
        .then(data => {
            res.redirect('/items');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });
}

// Update an item by id
exports.updateItem = (req, res)=>{

    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
    sanitizeHtmlOfBody(req.body);
    const id = sanitizeHtml(req.params.id);

    ItemDb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update event with ${id}. Maybe event not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update event information"})
        })
}

// Delete an item with specified item id in the request
exports.deleteItem = (req, res)=>{
    const id = sanitizeHtml(req.params.id);

    ItemDb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Item was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete item with id=" + id
            });
        });
}