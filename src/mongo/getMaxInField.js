const URL = require('./URLModel');

module.exports.getMaxInField = async (field, done) => {
  // console.log("getMaxInField", {field});

  //set search field
  let sortParams = {};
  sortParams[field] = "desc";

  console.log("getMaxInField sortParams:", sortParams);

  let arr;
  try {
    arr = await URL
      .find()
      .sort(sortParams)
      .limit(1) 
      .exec();

    //get first element of array, if it exists
    if(!!arr && arr.length !== 0) return arr[0];

    // default output
    return null;
  }
  catch(e) {
    return Promise.reject(e);
  }
  
};