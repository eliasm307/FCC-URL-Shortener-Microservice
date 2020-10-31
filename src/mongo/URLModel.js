var mongoose = require('mongoose'); 
var { Schema } = mongoose;

console.log("URL Model");

const urlSchema = new Schema({
  "original_url": {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  "short_url": {
    type: Number,
    required: true,
    min: 0,
    index: true,
    unique: true
  },
  "created": {
    type: String,
    required: true
  },
});

// add URL object schema to model 
module.exports = mongoose.model("URL", urlSchema);
 