const URL = require('./URLModel');

module.exports.getMaxInField = (field, done) => {
  // console.log("getMaxInField", {field});

  //set search field
  let sortParams = {};
  sortParams[field] = "desc";

  console.log("getMaxInField sortParams:", sortParams)

  URL
    .find()
    .sort(sortParams)
    .limit(1) 
    .exec(function(err, data) {

      if(err) {
        console.log("Error running getMaxInField query:", { err});
        return done(err); 

      }
      else if(!data || data.length === 0 ) {
        console.log("No max found, returning empty array", {err, data});
        return done(null, null)
      }
      else {
        console.log("Successfully ran getMaxInField query:", {err, data});
        return done(null, data[0]);

      }
 
    });
};