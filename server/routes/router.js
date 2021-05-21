"use strict";

const express= require('express');
const bodyParser= require('body-parser')
const app = express()
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const fs = require("fs");
const route = express.Router();
const sanitizeHtml = require('sanitize-html');

const services = require('../services/render');
const controller = require('../controller/controller');

const filter = require('content-filter');

var blackList = ['$','{', '}','&','&&','|','||']
var options = {
	urlBlackList: blackList,
	bodyBlackList: blackList
}

route.use(bodyParser.urlencoded({extended: true}))
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs'); // ejs
const methodOverride = require('method-override') // update function library
route.use(methodOverride('_method')) // update function library

var db; 
MongoClient.connect('mongodb+srv://lunaticky:rhanchd6@cluster0.rfmec.mongodb.net/todoapp?retryWrites=true&w=majority', function(error, client){
  if (error) return console.log(error)

  db = client.db('todoapp'); //connect to DB called todoapp
})


route.use(filter(options, {dispatchToErrorHandler: true}));


/**
 * @description Root Route
 * @method GET /
 */
route.get('/', services.homeRoutes);

/* routing login page*/
route.get('/login', services.login);

/* routing login page*/
route.get('/about', services.about);


//**********************AUTHENTICATION**************************
/*add library for authentication*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

/*middleware */
route.use(session({secret : 'secretecode', resave : true, saveUninitialized: false }));
route.use(passport.initialize());
route.use(passport.session());


/*passport.authenticate ==> check id whether it is correct*/
route.post('/login', passport.authenticate('local', {

  failureRedirect : '/login'
}),function(req, res){
  res.redirect('/profile')
});


passport.use(new LocalStrategy({
  usernameField: 'id', //compare to input (form==> name attribute'id')
  passwordField: 'pw', //compare to input (form==> 'pw')
  session: true, //after login for saving session or not.
  passReqToCallback: false,
}, function (input_Id, input_Pw, done) {
  // find id in DB
  db.collection('logins').findOne({ id: sanitizeHtml(input_Id) }, function (error, result) {
    if (error) return done(error)
    // no id in DB
    if (!result) return done(null, false, { message: 'Not exist Id' })
     // id in DB, compare to input password
    if (input_Pw === result.pw) {
      return done(null, result)
    } else {
      return done(null, false, { message: 'Wrong password' })
    }
  })
}));

/*This is code for save the 
user.id == saved session
*/
passport.serializeUser(function (user, done) {
  done(null, user.id)
});

/*This is code for searching user's information from DB*/ 
passport.deserializeUser(function (ID, done) {
  db.collection('logins').findOne({id : ID}, function(error, result){
    done(null, result) //result == {id : text, pw : test}
  })
});
//^^^^^^^^^^^^^^^^^^AUTHENTICATION^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


var Event = require('../model/event');
route.get('/profile', isLogin, function(req, res){
let events = [];
let invites = [];
		db.collection('events').find({ users : req._passport.session.user }).toArray(function(error, result){
				events = result;
				db.collection('invites').find({ recipient : req._passport.session.user }).toArray(function(error, result){
						invites = result;
				res.render('profile.ejs', {User : req.user, events : events, invites : invites});
				});
		});

});


/*************    items  ************* */
var  ItemDb = require('../model/item')

route.get('/items', function(req, res){
  let events = [];
  let eventId = sanitizeHtml(req.query.id);
  //디비에 저장된 post라는 collection안의 모든 데이터를 꺼내주세요
 db.collection('items').find({eventId : eventId}).toArray(function(error, result){
   Event.findById(eventId).then(data => {
    res.render('items.ejs', {events : events, item : result, event : eventId, eventData: data}); // 코드위치 확인
   })
 });
});


// route.get('/preparations', function(req, res){
//   let eventId = sanitizeHtml(req.query.id);
//   //디비에 저장된 post라는 collection안의 모든 데이터를 꺼내주세요
//  db.collection('items').find({eventId : eventId}).toArray(function(error, result){
//    Event.findById(eventId).then(data => {
//     res.render('preparations.ejs', { item : result, event : eventId, eventData: data}); // 코드위치 확인
//    })
//  });
// });






function isLogin(req, res, next){
  if(req.user){
    next()
  } else{
    res.redirect("/login");
  }
}

route.get('/logout', function(req,res){
  req.session.destroy(function(error){
      if(error) {
          console.log(error);
      }
  });
  res.redirect("/login");
})
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

route.get('/signup', services.signup);
route.get('/new-event', services.new_event);
route.get('/add-item', services.add_item);
route.get('/update-event', services.update_event);
route.get('/update-item', services.update_item);
route.get('/invite-create', services.invite_create);
route.get('/preparations', services.preparation);

route.get('/invite-accept', controller.acceptInvite);
route.get('/invite-reject', controller.rejectInvite);

route.post('/api/signup', controller.signup);
route.post('/api/events', controller.createEvent);
route.post('/api/item', controller.createItem);
route.post('/api/invites', controller.createInvite);
route.post('/claim-item', controller.claimItem);
route.post('/api/items', controller.createItem);
route.put('/api/event/:id', controller.updateEvent);
route.put('/api/item/:id', controller.updateItem);
route.delete('/api/events/:id', controller.deleteEvent);
route.delete('/api/item/:id', controller.deleteItem);

route.use(services.badURL);


module.exports = route
