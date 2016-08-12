var nconf    = require('nconf');
var request = require('request');

// ***** FOR MAKING API CALLS *****
exports.performRequestLogin =  function( method , endpoint, data, cb, cbError) {
	console.log ("\nCalling: " + method + " " + nconf.get("additionalKeys:gsBackoffice") + endpoint);
	request.post( 
					{ 	url: nconf.get("additionalKeys:gsBackoffice") + endpoint,
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
					url: nconf.get("additionalKeys:gsBackoffice") + endpoint,
					headers: {
								'cache-control': 'no-cache',
								'content-type': 'application/json'
							 },
					body: data
				},

				function callback(error, response, body) {
				  	  var msj = "\nCalling: " + method + " " + nconf.get("additionalKeys:gsBackoffice") + endpoint;
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











