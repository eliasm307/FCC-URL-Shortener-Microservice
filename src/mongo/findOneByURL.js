const URL = require('./URLModel');

module.exports.findOneByURL = async (url, byOriginalURL = false, done) => {
  console.log("findOneByURL", {url, byOriginalURL});

  // set searchParams
  let searchParams;

  // make sure short url is a number if required
  if(byOriginalURL) {
    // search by original_url
    searchParams = {"original_url": url} 

  } 
  else {
    // search by short URL
    if(!isNaN(url)) {
      // input url is numeric
      searchParams = {"short_url": parseInt(url)}; 
    }
    else {
      console.log("input short_url should be an integer number:", url);
      return Promise.reject({error: "input short_url should be an integer number: "+ url}); 
    }
  }

  return URL.findOne(searchParams).exec();
  
/*
  URL.findOne(searchParams, function(err, data) {
    console.log("find callback", {searchParams, data, err}); 

    if(err) {
      console.log("Error finding object using params:", searchParams, {err, data});
      return done(err); 
    }
    else if(!data || data.length === 0) {
      console.log("No results found ", {searchParams, data, err});
      return done(null, data);
    }
    else {
      console.log("Successfully found object using params:", searchParams, "found object:", {err, data});
      return done(null, data);

    }
 
  });
  */
 
}