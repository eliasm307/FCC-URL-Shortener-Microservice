let { findOneByURL } = require("./findOneByURL");
let { getMaxInField } = require("./getMaxInField");
const URL = require('./URLModel');

module.exports.createNewShortURL = async (data, done) => {
  try {
    console.log("createNewShortURL", {data}); 
    
    //variable to hold maxURL number
    let maxURL = -1;

    // check if valid data was provided
    if(!data || Object.keys(data).length === 0) {
      return Promise.reject({message: "no data provided to create new URL"});
    } 

    // check if URL already exists
    const foundData = await findOneByURL(data.url, true);
    console.log("createNewShortURL async result: ",{foundData});
      
    // check callback contains data
    if(foundData) {
      console.log('URL already exists:', foundData);  
      // return existing URL
      return foundData;
    } 

    //get current maxURL value
    const maxData = await getMaxInField("short_url"); 
    console.log("createNewShortURL async result: ",{maxData});

    // make sure callback contains data
    if(!maxData) {
      console.log('No results, url is first one'); 
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

    return newURL.save();
  
  }
  catch(e) {
    return Promise.reject(e);
  }
 
 
};