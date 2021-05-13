"use strict";

var Userdb = require('../model/model');
var Users = require('../model/user');
var Event = require('../model/event');
var Invite = require('../model/invite');
const sanitizeHtml = require('sanitize-html');

//Helper function to sanitize the html out of the body.
function sanitizeHtmlOfBody(bodyToSanitize) {
	bodyToSanitize.name = sanitizeHtml(bodyToSanitize.name);
	bodyToSanitize.email = sanitizeHtml(bodyToSanitize.email);
	bodyToSanitize.hobby = sanitizeHtml(bodyToSanitize.hobby);
	bodyToSanitize.gender = sanitizeHtml(bodyToSanitize.gender);
	bodyToSanitize.status = sanitizeHtml(bodyToSanitize.status);
}


// create and save new user
exports.create = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

	sanitizeHtmlOfBody(req.body);

    // new user
    const user = new Userdb({
        name : req.body.name,
        email : req.body.email,
        gender: req.body.gender,
        hobby: req.body.hobby,
        status : req.body.status
    })

    // save user in the database
    user.save(user)
        .then(data => {
            res.redirect('/add-user');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}

// create and save new user
exports.createEvent = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

//	sanitizeHtmlOfBody(req.body); NEED TO SANITZE LATER
    // new event
    const event = new Event({
        name : req.body.name,
				users : [req._passport.session.user]
    })

    // save user in the database
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



exports.createInvite = (req,res)=>{
	console.log("CALLED CREATE INVITE IN CONTROLLER");
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

//	sanitizeHtmlOfBody(req.body); NEED TO SANITZE LATER
    // new event
    const invite = new Invite({
        sender : req.body.sender,
				eventname : req.body.eventname,
			  eventid : req.body.eventid,
			  recipient : req.body.recipient
    })

    // save user in the database
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




// retrieve and return all users/ retrive and return a single user
exports.find = (req, res)=>{

    if(req.query.id){
        const id = sanitizeHtml(req.query.id);

        Userdb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }else{
        Userdb.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}

// Update a new identified user by user id
exports.update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

		sanitizeHtmlOfBody(req.body);

    const id = sanitizeHtml(req.params.id);
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })
}


// Update a new identified event by event id
exports.updateEvent = (req, res)=>{
    if(!req.body){

        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

//		sanitizeHtmlOfBody(req.body); NEED TO SANITIZE LATER
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


//exports.update_event = (req, res) =>{
//
//		Event.findById(req.query.id)
//				 .then(eventData => {
//
//							res.render("update_event", { event : eventData})
//						})
//						.catch(err =>{
//							res.send(err);
//						})
//}

// Update a new identified event by event id
exports.acceptInvite = (req, res)=>{
	console.log("ACCEPTING INVITE");
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

//		sanitizeHtmlOfBody(req.body); NEED TO SANITIZE LATER
    const id = sanitizeHtml(req.query.id);

		Invite.findByIdAndDelete(id).then(inviteData => {


			Event.findByIdAndUpdate(inviteData.eventid, {$push: {"users": inviteData.recipient}}, { useFindAndModify: false, safe: true, upsert: true})
					.then(data => {
							if(!data){
									res.status(404).send({ message : `Cannot Update event with ${id}. Maybe event not found!`})
							}else{
									res.redirect('/profile');
							}
					})
					.catch(err =>{
							res.status(500).send({ message : "Error Update event information"})
					})


		})
}



exports.rejectInvite = (req, res)=>{
	console.log("REJECTING INVITE");
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

//		sanitizeHtmlOfBody(req.body); NEED TO SANITIZE LATER
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
                message: "Could not delete User with id=" + id
            });
        });
}



// Delete a user with specified user id in the request
exports.delete = (req, res)=>{
    const id = sanitizeHtml(req.params.id);

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "User was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
}

// Delete a event with specified event id in the request
exports.deleteEvent = (req, res)=>{
    const id = sanitizeHtml(req.params.id);

    Event.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Event was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Event with id=" + id
            });
        });
}
