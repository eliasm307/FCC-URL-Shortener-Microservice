const { findOneByURL } = require("../mongo/findOneByURL");

module.exports.handleGetOriginalURL = (req, res, next, timeout) => {
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
      }
    }); 
}