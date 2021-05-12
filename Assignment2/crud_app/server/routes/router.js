"use strict";

const express= require('express');
const bodyParser= require('body-parser')
const app = express()
const route = express.Router();

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

/*
route.get('/', function(req, res){
	session["UserID"] = 2354;
	console.log(session);
  res.render('profile.ejs'); 
});
*/





route.get('/write', function(req, res){
  res.render('write.ejs');
});


route.post('/add', function(request, response){
    response.send('Transfer complete');
    //db.collection('counter').find();  ==> I will find data in file called counter.
    db.collection('counter').findOne({name : 'theNumberOfPosts'}, function(error, result){
      console.log(result.totalPost) //== total amount of post
      var totalAmountOfPost = result.totalPost;

      db.collection('post').insertOne({_id : totalAmountOfPost + 1, 제목 : request.body.title, 날짜 : request.body.date}, function(error, result){
        console.log('save complete');
        //In 'counter' from collection in DB, totalPost puls 1 (totalPost add +1)
        db.collection('counter').updateOne({name : 'theNumberOfPosts' },{ $inc : {totalPost : 1}},function(error, result){
          if(error){return console.log(error)}
        })

      });  
    }); 
})






// list로 GET요청으로 접속하면
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTLM을 보여줌

// '/list' ==> data which input from user
route.get('/list', function(req, res){
     // find all data in collection, called 'post'
    db.collection('post').find().toArray(function(error, result){
        console.log(result);
        res.render('list.ejs', { posts : result});
    });
});


route.delete('/delete', function(req, res){
  console.log(req.body);
  req.body._id = parseInt(req.body._id);  //  _id (String) convert to Int
  db.collection('post').deleteOne(req.body, function(error, result){
      console.log('delete complete');
      res.status(200).send({ message :'Succeed.'}); 
  })
})

route.get('/detail/:id', function(req, res){
  db.collection('post').findOne({_id : parseInt(req.params.id)}, function(error, result){
    console.log(result);
    res.render('detail.ejs', { data : result });
  })
})

route.get('/edit/:id', function(req, res){

  db.collection('post').findOne({_id : parseInt(req.params.id)}, function(error, result){
    console.log(result);
    res.render('edit.ejs', { post : result})
  })

})

route.put('/edit', function(req, res){
    db.collection('post').updateOne({ _id : parseInt(req.body.id) },{$set : {제목 : req.body.title, 날짜: req.body.date}}, function(error, result){
      console.log('Update complete')
      res.redirect('/list')
    })
})


/*add library for authoentication*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

/*middleware */
route.use(session({secret : 'secretecode', resave : true, saveUninitialized: false }));
route.use(passport.initialize());
route.use(passport.session());

/* routing login page*/
route.get('/login', function(req, res){
  res.render('login.ejs')
})

/*passport.authenticate ==> check id whether it is correct*/
route.post('/login', passport.authenticate('local', {

  failureRedirect : '/fail'
}),function(req, res){
		console.log("CALLED POST/LOGIN");
  res.redirect('/profile')
  console.log(req.user);
});



// /*insert middleware */
// /* whenever access /mypage ==> (isLogin) isLogin function operate*/
// route.get('/mypage', isLogin, function(req, res){
//   console.log(req.user);
//   res.render('mypage.ejs', {User : req.user}) //send data to ejs file
// })

// /* middleware */
// function isLogin(req, res, next){
//   if(req.user){
//     next()
//   } else{
//     res.send('you need to login?')
//   }
// }









passport.use(new LocalStrategy({
  usernameField: 'id', //compare to input (form==> name attribute'id')
  passwordField: 'pw', //compare to input (form==> 'pw')
  session: true, //after login for saving session or not.
  passReqToCallback: false,
}, function (input_Id, input_Pw, done) {
  //input_Id, input_Pw == input value
  //console.log(input_Id, input_Pw);

  // find id in DB
  db.collection('login').findOne({ id: input_Id }, function (error, result) {
    if (error) return done(error)
    // no id in DB
    if (!result) return done(null, false, { message: 'Not exist Id' })
     // id in DB, compare to input password
    if (input_Pw == result.pw) {
      return done(null, result)
    } else {
      return done(null, false, { message: 'Wrong password' })
    }
  })
}));
// done(sever error, if succeed user data send, error msg)

/*This is code for save the 
user.id == saved session
*/
passport.serializeUser(function (user, done) {
  done(null, user.id)
});

/*This is code for searching user's information from DB*/ 
passport.deserializeUser(function (ID, done) {
  db.collection('login').findOne({id : ID}, function(error, result){
    done(null, result) //result == {id : text, pw : test}
  })
});

var Event = require('../model/event');
route.get('/profile', isLogin, function(req, res){
let events = [];
    db.collection('events').find().toArray(function(error, result){

//			for (let i = 0; i < result.length; i++) {
//				events.push(result[i]);
//			}

			events = result;

			res.render('profile.ejs', {User : req.user, events : events});

    });

});

function isLogin(req, res, next){
  if(req.user){
    next()
  } else{
    res.send('you need to login?')
  }
}


//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



route.use(filter(options, {dispatchToErrorHandler: true}));


/**
 * @description Root Route
 * @method GET /
 */
route.get('/', services.homeRoutes);


/**
 * @description add users
 * @method GET /add-user
 */
route.get('/add-user', services.add_user);

route.get('/add-event', services.add_event);


/**
 * @description update Route
 * @method GET /update-user
 */
route.get('/update-user', services.update_user);

route.get('/update-event', services.update_event);

// API
route.post('/api/users', controller.create);
route.post('/api/events', controller.createEvent);
route.get('/api/users', controller.find);
route.put('/api/users/:id', controller.update);
route.put('/api/event/:id', controller.updateEvent);
route.delete('/api/users/:id', controller.delete);
route.delete('/api/events/:id', controller.deleteEvent);

module.exports = route


/**
 * @description update Route
 * @method GET /login
 */
 route.get('/login', services.login);
