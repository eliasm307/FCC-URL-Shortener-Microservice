const { findOneByURL } = require("../mongo/findOneByURL");

module.exports.handleGetOriginalURL = async (req, res, next, timeout) => {
  console.log("Handling find URL request...");

  let foundData

  try{
    const foundData = await findOneByURL(req.params.shorturl, false);

    if(foundData) { 
      console.log("Open original URL", foundData['original_url']);
      res.redirect(foundData['original_url']);
      return res.end(); 
    }
    else {
      throw new Error("No original URL found for shorturl: " + req.params.shorturl);
    }

  } 
  catch(err) { 
    console.log("Error in searching by URL using data:", {err, foundData}); 
    return next(JSON.stringify({error: "Error finding URL", err}));

  };
   
};