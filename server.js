'use strict';

const express = require('express');
// var mongo = require('mongodb');
const mongoose = require('mongoose'); 
const cors = require('cors'); 

const { handleGetOriginalURL } = require("./src/handlers/handleGetOriginalURL");
const { handlePostNewURL } = require("./src/handlers/handlePostNewURL");
const { sendTestGetRequest, sendTestPostRequest } = require("./src/testRequests"); //for sending test requests for testing

const app = express();
app.use(cors());

const SPACER = "--------------------------------------------------------------------------------------------------------";
 
// connect to mongo
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// global setting for safety timeouts to handle possible
// wrong callbacks that will never be called
const timeout = 10000;
 
/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

// create static folder (named 'public') using local /public folder
app.use('/public', express.static(process.cwd() + '/public'));

// log all requests
app.use((req, res, next) => {
  console.log(SPACER);
  console.log(req.method + " " + req.path + " - " + req.ip);
  console.log(SPACER);

  if(req.method === 'POST') console.log("req.body:", req.body)
  next();
});

// load main page for main route
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// route to check health status
app.get(['/is-mongoose-ok', '/u-ok'], function(req, res) {
  if (mongoose) {
    res.json({isMongooseOk: !!mongoose.connection.readyState})
  } else {
    res.json({isMongooseOk: false})
  }
});

// TODO
app.get("/api/shorturl", function (req, res) {
  res.send("SHOW LIST OF ALL SAVED LINKS TBC")

});

// shorturl api handlers
app.route("/api/shorturl/:shorturl")
  .get(async function (req, res, next) { 
    
    try{
      await handleGetOriginalURL(req, res, next, timeout);  
    }
    catch(e) {
      console.log("GET async error: ", e);
      next();
    }

  })
  .post(async function (req, res, next) {
    try {
      await handlePostNewURL(req, res, next, timeout); 
    }
    catch(e) {
      console.log("POST async error: ", e);
      next();

    }
 
  });


const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening on port', listener.address().port);
});

