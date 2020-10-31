let { findOneByURL } = require("./findOneByURL");
let { getMaxInField } = require("./getMaxInField");
const URL = require('./URLModel');

module.exports.createNewShortURL = (data, done) => {
  console.log("createNewShortURL", {URL, data}); 
 

  if(data === {}) {
    return done({message: "no data provided to create new URL"});
  }

  // data.byOriginalURL = true;

  // check if URL already exists
  findOneByURL(data.url, true, function(err, foundData) {

    // handle callback error
    if(err) { 
      console.log("Error in searching by URL using data:", {err, foundData}); 
    }

    // check callback contains data
    if(foundData) {
      console.log('URL already exists:', foundData);  
      // return existing URL
      return done(null, foundData);
    }
    else {
      console.log('No results'); 
 
      //URL doesnt exist so createNewShortURL
      let maxURL = -1;

      //get current maxURL value
      getMaxInField("short_url", function(err, maxData) {
        console.log("getMaxInField callback");

        // handle callback error
        if(err) { 
          console.log("Error in searching by URL using data:", {err, maxData}); 
        }

        // make sure callback contains data
        if(!maxData) {
          console.log('No results'); 
          //set initial url
          maxURL = 0;
        }
        else {
          console.log('max URL is:', {urlObj: maxData, "short_url": maxData["short_url"]});  
          console.log("typeof maxData['short_url']:", typeof maxData['short_url']);
          // set next max URL
          maxURL = parseInt(maxData["short_url"]) + 1;
        }

        // create new short url
        const newURL = new URL({
          "original_url": data.url,
          "short_url": maxURL,
          "created": new Date().toUTCString()
        });

        console.log("Created new URL:", newURL);

        newURL.save(function(err, data) {

          if(err) {
            console.log("Error while saving new url:", {err, data})
            return done(err);

          }
      
          console.log("Success creating and saving new URL:", {data})
          return done(null, data);

        });

      });
  
    }
    

  });
 
}