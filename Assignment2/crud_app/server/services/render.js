"use strict";

const axios = require('axios');


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

exports.profile = (req, res) =>{
    // check for a session first!
    if(req.session.loggedIn) {
//			        // put the name in
//        $template("#profile_name").html(req.session.email);
        res.render("profile");
    } else {
        // not logged in - no session!
			 console.log("Redirected************************");
        res.redirect('/');
    }
}

exports.login = (req, res) =>{
    res.render('login');
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

