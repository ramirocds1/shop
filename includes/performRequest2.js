var request = require('request');
var host = "http://24.89.145.74:92"
// ***** FOR MAKING API CALLS *****
exports.performRequest =  function( method , endpoint, data, cb, cbError) {

	var headersSent = { 
     	'cache-control': 'no-cache',
     	'content-type': 'application/json'
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

	var options = { method: 'POST', url: host + endpoint, headers: headersSent, body: data };
	request(options, callback);

	

}

// 