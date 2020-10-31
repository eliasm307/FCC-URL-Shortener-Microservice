const URL = require('./URLModel');

module.exports.findOneByURL = (data, done) => {
  console.log("findByURL", {data});

  const searchParams = data.byOriginalURL ? {"original_url": data.url} : {"short_url": data.url}

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
 
}