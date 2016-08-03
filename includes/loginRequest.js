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
			cb( 1 , bodyJson['KEY'][0]['API_KEY'] , bodyJson['KEY'][0]['SESSION_KEY'] );
		},
		function (body) {
			console.log("Login Error");
			cb(0,"","");
		}
	);
}


exports.ShoppingCartLogin = function(apikey, sessionkey, cb) {

	var loginName = "ANCR";
	var loginPassword = "test";

	var dataSent = `{
						key: [{ "API_KEY": "`+apikey+`", "SESSION_KEY": "`+sessionkey+`"}],
		    			data: "{	
		    						'login':'`+loginName+`',
		    						'pwd':'`+loginPassword+`'
		    				   }"
					}`;


	performRequest2.performRequest( "POST" , "/StoreAPI/AccountMngmnt/ShoppingCartLogin" , dataSent ,
		function (body) {
			console.log("ShoppingCartLogin Successful");
			cb(1,body);
		},
		function (body) {
			console.log("ShoppingCartLogin Error, printing body:");
			console.log(body);
			cb(0,body);
		}
	);
}
