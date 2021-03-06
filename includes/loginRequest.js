var nconf    = require('nconf');
var performRequest = require('./performRequest');

exports.loginGS = function(req, cb) {
	var data = 	{ gesCompany: 'DEMO', gesLocation: 'HQ',
		gesJuris: 'SYS', gesPass: 'ADMIN', gesUser: 'ADMIN',
		gesVer: '7.0.100.00000.00000', gesWebsitePref: 'DEF',
		localHost: 'WEBSRV', productType: '8'
	};
	
	performRequest.performRequestLogin( "POST" , "/StoreAPI/GesApp/GesLogin" ,data ,
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


exports.ShoppingCartLogin = function( infoReturned, rollbar , cb, existence, loggedin ) {

	if (!loggedin){
		// user is not logged in to cart
		var loginName = infoReturned['shopifyInfo'].customer.email;
		var loginPassword = nconf.get("keys:ShoppingCartLoginPassword");

		var dataSent = `{ key: [{ "API_KEY": "`+infoReturned['API_KEY']+`", "SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}], data: "{	
			    						'login':'`+loginName+`', 'pwd':'`+loginPassword+`'
			    				   }" }`;

		performRequest.performRequest( "POST" , "/StoreAPI/AccountMngmnt/ShoppingCartLogin" , dataSent ,
			function (body) {
				var msj = "ShoppingCartLogin Successful";
				var bodyJson = JSON.parse(body);

				if ( bodyJson["DATA"][0].length == 0 ){
					existence = loggedin = false;					
					console.log( msj + "\nCustomer does not exist" );
					rollbar.reportMessageWithPayloadData( "[#"+infoReturned['shopifyInfo'].id+"] Could not login into cart, user: "+loginName+" does not exist",
						{
							level: "info",
							shopifyOrderID: infoReturned['shopifyInfo'].id,
							loginName: loginName
						});

				}else{
					existence = loggedin = true;
					console.log( msj + "\nCustomer found" );
					rollbar.reportMessageWithPayloadData( "[#"+infoReturned['shopifyInfo'].id+"] "+loginName+" was successfully logged in to cart.",
						{
							level: "info",
							shopifyOrderID: infoReturned['shopifyInfo'].id,
							loginName: loginName
						});
				}
				cb(null,body, existence, loggedin);
			},
			function (body) {
				console.log("ShoppingCartLogin Error, printing body:");
				rollbar.reportMessageWithPayloadData( "[#"+infoReturned['shopifyInfo'].id+"] There was an error logging into the cart with: "+loginName+ " ",
					{
						level: "critical",
						shopifyOrderID: infoReturned['shopifyInfo'].id,
						request: dataSent,
						response: body
					});
				
				console.log(body);
				existence = loggedin = false;
				cb(1,body, existence, loggedin);
			}
		);

	}else
		cb( null, infoReturned['bodyShoppingCartLogin'] , existence, loggedin );

}
