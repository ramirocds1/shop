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


exports.ShoppingCartLogin = function(infoReturned, cb, existence) {


	var loginName = infoReturned['shopifyInfo'].customer.email;
	var loginPassword = "test"; // TODO, se podria modificar la pass de acuerdo de los datos del usuario, pero así estaría bien igual

	var dataSent = `{
						key: [{ "API_KEY": "`+infoReturned['API_KEY']+`", "SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
		    			data: "{	
		    						'login':'`+loginName+`',
		    						'pwd':'`+loginPassword+`'
		    				   }"
					}`;


	performRequest2.performRequest( "POST" , "/StoreAPI/AccountMngmnt/ShoppingCartLogin" , dataSent ,
		function (body) {
			var msj = "ShoppingCartLogin Successful";
			var bodyJson = JSON.parse(body);
			var exist;
			if ( bodyJson["DATA"][0].length == 0 ){
				exist = false;
				console.log( msj + "\nUser does not exist" );
			}else{
				exist = true;
				console.log( msj + "\nUser found" );
				
			}
			cb(null,body, exist);
		},
		function (body) {
			console.log("ShoppingCartLogin Error, printing body:");
			console.log(body);
			cb(1,body,false);
		}
	);



}
