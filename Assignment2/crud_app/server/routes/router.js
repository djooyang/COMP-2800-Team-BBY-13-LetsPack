"use strict";

const express= require('express');
const session = require('express-session');
const app = express();
const fs = require("fs");
const { JSDOM } = require('jsdom');

const services = require('../services/render');
const controller = require('../controller/controller');

const filter = require('content-filter');

var blackList = ['$','{', '}','&','&&','|','||']
var options = {
	urlBlackList: blackList,
	bodyBlackList: blackList
}

app.use(session(
  {
      secret:'Secret text gotta keep guessing',
      name:'letsPackSession',
      resave: false,
      saveUninitialized: true }));

app.use(filter(options, {dispatchToErrorHandler: true}));


/**
 * @description Root Route
 * @method GET /
 */
app.get('/', services.login);


app.get('/profile', services.profile);



/**
 * @description add users
 * @method GET /add-user
 */
app.get('/add-user', services.add_user);

/**
 * @description update Route
 * @method GET /update-user
 */
app.get('/update-user', services.update_user);

// API
app.post('/api/users', controller.create);
app.get('/api/users', controller.find);
app.put('/api/users/:id', controller.update);
app.delete('/api/users/:id', controller.delete);

module.exports = app


/**
 * @description update Route
 * @method GET /login
 */
 app.get('/login', services.login);


// Notice that this is a 'POST'
app.post('/authenticate', function(req, res) {
	  console.log("AUTHENTICATE CALLED");
    res.setHeader('Content-Type', 'application/json');


//    console.log("Email", req.body.email);
//    console.log("Password", req.body.password);


    authenticate(req.body.email, req.body.password,
        function(rows) {
            //console.log(rows.password);
            if(rows == null) {
                // not found
                res.send({ status: "fail", msg: "User account not found." });
            } else {
                // authenticate the user, create a session
                req.session.loggedIn = true;
                req.session.email = rows.email;
                req.session.save(function(err) {
                    // session saved
                })
                // this will only work with non-AJAX calls
                //res.redirect("/profile");
                // have to send a message to the browser and let front-end complete
                // the action
                res.send({ status: "success", msg: "Logged in." });
            }
    });

});


function authenticate(email, pwd, callback) {

    let dbresults = controller.findByEmailAndPassword(email, pwd);
console.log("DB RESULTS");
console.log(dbresults);
            return callback(dbresults);
}



app.get('/logout', function(req,res){
    req.session.destroy(function(error){
        if(error) {
            console.log(error);
        }
    });
    res.redirect("/profile");
})