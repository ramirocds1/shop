var request = require('request');
var host = "http://24.89.145.74:92"
// ***** FOR MAKING API CALLS *****
exports.performRequest =  function( method , endpoint, data, cb, cbError) {

	var headersSent = { 
     	'cache-control': 'no-cache',
     	'content-type': 'application/json'
 	};

	function callback(error, response, body) {
	  console.log ("");
	  var msj = "Calling: " + method + " " + host + endpoint;

	  if (!error && response.statusCode == 200) {
	  	console.log(msj + " -> RETURNED OK.");
	    cb(body);
	  }else{
	  	console.log(msj + " -> RETURNED ERROR.");
	  	cbError(body);
	  }
	}

	var options = { method: 'POST', url: host + endpoint, headers: headersSent, body: data };
	request(options, callback);
}

// 