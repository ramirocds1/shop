var nconf    = require('nconf');
var request = require('request');
var host = nconf.get("gsBackoffice");
// ***** FOR MAKING API CALLS *****
exports.performRequestLogin =  function( method , endpoint, data, cb, cbError) {
	console.log ("\nCalling: " + method + " " + host + endpoint);
	request.post( 
					{ 	url: host + endpoint,
						form: data,
						headers: { 
									'cache-control': 'no-cache',
									'accept': 'application/json',
									'content-type' : 'application/json'
								 }
					},

					function callback(error, response, body) {
						  if (!error && response.statusCode == 200)
						    	cb(body);
						  else{
						  		console.log("STATUS CODE: ", response.statusCode)
						  		cbError(body);
						  }
					}

				);

}

exports.performRequest =  function( method , endpoint, data, cb, cbError) {
	request(
				{
					method: 'POST',
					url: host + endpoint,
					headers: {
								'cache-control': 'no-cache',
								'content-type': 'application/json'
							 },
					body: data
				},

				function callback(error, response, body) {
				  	  var msj = "\nCalling: " + method + " " + host + endpoint;
					  if (!error && response.statusCode == 200) {
					  		console.log(msj + " -> RETURNED OK.");
					    	cb(body);
					  }else{
					  		console.log(msj + " -> RETURNED ERROR.");
					  		cbError(body);
					  }
				}
			);
}











