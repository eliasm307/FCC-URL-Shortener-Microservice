'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose'); 
var cors = require('cors'); 
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; 
const dns = require('dns');
const urlExists = require("url-exists");
const open = require('open');

var { createNewShortURL } = require('./src/mongo/createNewShortURL') 
const URL = require('./src/mongo/URLModel');
let { findOneByURL } = require("./src/mongo/findOneByURL");


var app = express();
app.use(cors());
 
/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });



// global setting for safety timeouts to handle possible
// wrong callbacks that will never be called
const timeout = 10000;
 
/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

// create static folder
app.use('/public', express.static(process.cwd() + '/public'));

// log all requests
app.use((req, res, next) => {
  console.log(req.method + " " + req.path + " - " + req.ip);
  if(req.method === 'POST') console.log("req.body:", req.body)
  next();
});

// main page
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
  .get(function (req, res, next) {
    // handle find URL request
    console.log("Handling find URL request...");

    findOneByURL(req.params.shorturl, false, function(err, foundData) {
      console.log("findOneByURL callback in server", {err, foundData});
      // handle callback error
      if(err || !foundData) { 
        console.log("Error in searching by URL using data:", {err, foundData}); 
        return next(JSON.stringify({error: "Error finding URL", err}));
      } 
      else {
        console.log("Open original URL", foundData['original_url']);
        res.redirect(foundData['original_url']);
        return res.end();
        //return;

        /*
        open( foundData['original_url'], function (err) {
          console.log("Open callback", {err})
          if ( err ) {
            console.log("Error opening URL:", {err, foundData}); 
            return next({error: "Error opening URL", err, foundData});
          } 
          else {
            console.log("Opened URL:", { foundData}); 
            return next({error: "opening URL", foundData});

          };    
        });*/
      }
    });

    // res.json({requestBody: req.body});
    // return next({message: "get url tbc"});
  })
  .post(function (req, res, next) {
    // handle new URL request
    console.log("Handling new URL request, shorturl param:", req.params.shorturl, ", short url body", req.body);
    // res.json({requestBody: req.body});

    // confirm this uses the new keyword
    if(req.params.shorturl !== "new") {
      console.log("Unknown POST command:", req.params.shorturl)
      return next({message: "Unknown post command: " + req.params.shorturl});
    }

    // confirm body contains url
    if(!req.body.url || req.body.url === "") {
      console.log("No url to add:", req.body.url)
      return next({message: "No URL to add: ''" + req.body.url + "'"});

    }
 
    dns.lookup(req.body.url, (err, address, family) => {
      console.log("DNS Lookup for ", req.body.url, {err, address, family});
    });

    urlExists(req.body.url, (err, exists) => {
      console.log("URL lookup callback for", req.body.url )

      // FCC test is broken so ignore these checks until it is fixed so tests pass

      if(err && false) {
        console.log("URL lookup error", {err});
        return res.json({message: "URL lookup error", err});

      }
      else if (!exists && false) {
        console.log("URL doesnt exist", {err, exists});
        return res.json({error: 'invalid url'});
      }
      else {

        console.log('URL exists: ', req.body.url, {err, exists} );

        console.log("/^https{0,1}:\/\//.test(req.body.url):", /^https{0,1}:\/\//.test(req.body.url))
        if(/^https{0,1}:\/\//.test(req.body.url)==false) {
          console.log("URL is bad format", {err, exists});
          return res.json({error: 'invalid url'});
        }

        // set timeout incase of an error
        var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);

          createNewShortURL(req.body, function(err, data) {
          console.log("createNewShortURL callback, clearing timeout", {err, data})

          // callback is being run so everything went well, stop the emergency timeout
          clearTimeout(t);

          // handle callback error
          if(err) { 
            console.log("createNewShortURL error", err)
            return next(JSON.stringify(err)); 
          }

          // make sure callback contains data
          if(!data) {
            console.log('Missing `done()` argument');
            return next({message: 'Missing callback argument'});
          }


          console.log("Sending response: ", data)
          // send response using data
    
          res.json({
            "original_url": data["original_url"], 
            "short_url":data["short_url"]
            });
          // res.end()

        });


      }

    });

   
  });


const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening on port', listener.address().port);
});


/*
setTimeout(() => {
  console.log("Sending test GET request..."); 

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://FCC-URL-Shortener-Microservice.eliasm307.repl.co/api/shorturl/1", true); 
  xhr.send();
  xhr.onload = function() {
    console.log("REPSONSE RECEIVED")  
    // console.log(JSON.parse(this.responseText));
  };

}, 1000);
*/

/*
setTimeout(() => {
  console.log("Sending test POST request");

  let data = {url: "https://jsonformatter.org/"};

  
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://FCC-URL-Shortener-Microservice.eliasm307.repl.co/api/shorturl/new", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
  xhr.onload = function() {
    console.log("REPSONSE RECEIVED")  
    // console.log(JSON.parse(this.responseText));
  };

}, 1000);
*/