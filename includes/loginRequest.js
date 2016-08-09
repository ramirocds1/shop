var performRequest = require('./performRequest');
var performRequest2 = require('./performRequest2');

exports.loginGS = function(req, cb) {


	var data = 	{
		gesCompany: 'DEMO',
		gesLocation: 'HQ',
		gesJuris: 'SYS',
		gesPass: 'ADMIN',
		gesUser: 'ADMIN',
		gesVer: '7.0.100.00000.00000',
		gesWebsitePref: 'DEF',
		localHost: 'WEBSRV',
		productType: '8'
	};
	
	performRequest.performRequest( "POST" , "/StoreAPI/GesApp/GesLogin" , data ,
		function (body) {
			console.log("Login Successful");
			var bodyJson = JSON.parse(body);
			cb( null , bodyJson['KEY'][0]['API_KEY'] , bodyJson['KEY'][0]['SESSION_KEY'] );
		},
		function (body) {
			console.log("Login Error");
			cb(1,"","");
		}
	);
}


exports.ShoppingCartLogin = function(infoReturned, cb) {

	
	var loginName = infoReturned['shopifyInfo'].customer.email;
	var loginPassword = "test";

	var dataSent = `{
						key: [{ "API_KEY": "`+infoReturned['API_KEY']+`", "SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
		    			data: "{	
		    						'login':'`+loginName+`',
		    						'pwd':'`+loginPassword+`'
		    				   }"
					}`;


	performRequest2.performRequest( "POST" , "/StoreAPI/AccountMngmnt/ShoppingCartLogin" , dataSent ,
		function (body) {
			console.log("ShoppingCartLogin Successful");
			var bodyJson = JSON.parse(body);
			if ( bodyJson["DATA"][0].length == 0 ){
				console.log("User does not exist");
			}else{
				console.log("User found");
			}
			cb(null,body);
		},
		function (body) {
			console.log("ShoppingCartLogin Error, printing body:");
			console.log(body);
			cb(1,body);
		}
	);
}
