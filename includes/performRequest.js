var request = require('request');
var host = "http://24.89.145.74:92"

// ***** FOR MAKING API CALLS *****
exports.performRequest =  function( method , endpoint, data, cb, cbError) {

	  var headersSent = {
	  	'cache-control': 'no-cache',
	    'accept': 'application/json', 
	    'content-type' : 'application/json'
	  };

	function callback(error, response, body) {
	  if (!error && response.statusCode == 200) {
	    cb(body);
	  }else{
	  	console.log("STATUS CODE: ", response.statusCode)
	  	cbError(body);
	  }
	}

	console.log ("");
	console.log ("Calling: " + method + " " + host + endpoint);
	var options = {url: host + endpoint, form: data, headersSent };
	
	request.post(options , callback );

}

