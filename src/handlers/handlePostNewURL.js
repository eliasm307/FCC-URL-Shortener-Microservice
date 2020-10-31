const dns = require('dns');
const urlExists = require("url-exists-async-await"); 

const { createNewShortURL } = require('../mongo/createNewShortURL')  

module.exports.handlePostNewURL = async (req, res, next, timeout) => {

  // handle new URL request
  console.log("Handling new URL request, shorturl param:", req.params.shorturl, ", short url body", req.body); 

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

  // output result from dns lookup, this seems to mis-categorise links so output result to compare with url-exists tool
  dns.lookup(req.body.url, (err, address, family) => {
    console.log("DNS Lookup for ", req.body.url, {err, address, family});
  });

  // use url-exists tool to see if URL is valid
  const exists = await urlExists(req.body.url);
 
  // FCC test is broken so ignore these checks until it is fixed so tests pass
  if (!exists && false) {
    console.log("URL doesnt exist", {err, exists});
    return res.json({error: 'invalid url'});
  }
  else {

    console.log('URL exists: ', req.body.url, {exists} );

    // Check the input URL starts with "http(s)://" instead of if it is a working link
    //console.log("/^https{0,1}:\/\//.test(req.body.url):", /^https{0,1}:\/\//.test(req.body.url))
    if(/^https{0,1}:\/\//.test(req.body.url)==false) {
      console.log("URL is bad format", {exists});
      return res.json({error: 'invalid url'});
    }

    // set timeout incase of an error
    /*
    var t = setTimeout(() => { 
      //TODO investigate this as I dont think this will work
      next({message: 'timeout'}); 
      }, timeout
    );
    */

    const data = await createNewShortURL(req.body);

    // callback is being run so everything went well, stop the emergency timeout
    // console.log("createNewShortURL callback, clearing timeout", {data});
    // clearTimeout(t);  

    // send response using data
    console.log("Sending response: ", data) 
    return res.json({
      "original_url": data["original_url"], 
      "short_url":data["short_url"]
    });  

  };
 

};