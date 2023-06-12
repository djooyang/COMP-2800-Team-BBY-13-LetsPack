"use strict";

const express = require('express');
const favicon = require('serve-favicon');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');

const connectDB = require('./server/database/connection');

const app = express();
var expressErrorHnadler = require('express-error-handler');

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

app.use(favicon(__dirname + '/assets/img/favicon.ico'));
// log requests
app.use(morgan('tiny'));

// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))

// set view engine
app.set("view engine", "ejs")
//app.set("views", path.resolve(__dirname, "views/ejs"))

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))

// load routers
app.use('/', require('./server/routes/router'))

/*
var errorHandler = expressErrorHnadler({
    static: {
        '404' : 'view/404.ejs'
    }
});

app.use( expressErrorHnadler.httpError(404));
app.use(errorHandler);
*/

app.use((req,res, next) => {
    res.status(404).send('Page Not Found')
})
app.listen(PORT, ()=> { console.log(`Server is running on https://lets-pack-app-to-heroku.herokuapp.com`)});
