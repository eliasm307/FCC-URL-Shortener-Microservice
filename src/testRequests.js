const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; 

module.exports.sendTestGetRequest = () => {
  // Test GET request after 1 second 
  setTimeout(() => {
    console.log("Sending test GET request..."); 

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://FCC-URL-Shortener-Microservice.eliasm307.repl.co/api/shorturl/1", true); 
    xhr.send();
    xhr.onload = function() {
      console.log("REPSONSE RECEIVED")  
      // console.log(JSON.parse(this.responseText));
    };

  }, 1000);
}

module.exports.sendTestPostRequest = () => {
  // Test POST request after 1 second after load
  setTimeout(() => {
    console.log("Sending test POST request...");

    let data = {url: "https://jsonformatter.org/"};

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://FCC-URL-Shortener-Microservice.eliasm307.repl.co/api/shorturl/new", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.onload = function() {
      console.log("REPSONSE RECEIVED")  
      // console.log(JSON.parse(this.responseText));
    };

  }, 1000);
}