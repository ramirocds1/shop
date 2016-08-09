var performRequest2 = require('./performRequest2');

exports.saveCustomer = function  (infoReturned, cb, existence){

	
	if ( existence == false ){

		var customer = infoReturned['shopifyInfo'].customer
		var billing_address = infoReturned['shopifyInfo'].billing_address

		var customerData = `{
			key: [{ "API_KEY": "`+infoReturned['API_KEY']+`",
					"SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
			data:"{
					'oCustomer':{
									'Active':null,
									'CustCode':'',
									'Name':'`+ customer.name +`',
									'CustomerNotes':'`+ customer.note +`',
									'SourceCode':'',
									'PONumberRequired':null,
									'DefaultContCode':0,
									'ShippingAddrCount':0,
									'ContactAddrCount':0,
									'BillingAddressRecord':{
														'Active':null,
														'AddressCode':0,
														'CustCode':null,
														'Password':'test',
														'CompanyName':'',
														'FirstName':'`+ billing_address.first_name +`',
														'LastName':'`+ billing_address.last_name +`',
														'FirstLast':null,
														'Street':'`+ billing_address.address1 +`',
														'Email':'`+ customer.email +`',
														'SubType':'2',
														'Telephone':'`+ billing_address.phone +`',
														'Telephone2':null,
														'Fax':'',
														'City':'`+ billing_address.city +`',
														'State':'`+ billing_address.province_code +`',
														'Zip':'`+ billing_address.zip +`',
														'Country':'`+ billing_address.country +`',
														'SecretQuestion':'',
														'SecretAnswer':'',
														'Residence':'F',
														'AddressType':0,
														'IsAddressUsed':false,
														'FullAddress':null,
														'MobilePhone':null
													},
													'ShippingAddressRecords':[],
													'ContactAddressRecords':[]
														},
									'isNew':'1',
									'regisError':'',
									'arrCustSurvey':'[]'
								}"
				}`;

		
		performRequest2.performRequest( 'POST','/StoreAPI/AccountMngmnt/SaveCustomer',customerData,
			function (body) {
				console.log("saveCustomer OK");
				//console.log(body);
				cb(null,body);
			},
			function (body) {
				console.log("saveCustomer Error");
				console.log("BODY_ERROR: " , body);
				cb(1,body);
			}
		);
		
	}else{
		//var datasrt = infoReturned.bodyGetCustomerDetails["DATA"];
		//var datajson = JSON.parse( datasrt );
		console.log("Customer already exists." );

		//console.log("BODY DETAILS: " , infoReturned.bodyGetCustomerDetails["DATA"]  );
		cb(null,"");
	}



}

exports.getCustomerDetails = function  (infoReturned, cb, existence){

	console.log("getCustomerDetails saveCustomer:  " , infoReturned["bodySaveCustomer"])
	console.log("getCustomerDetails bodyShoppingCartLogin:  ", infoReturned["bodyShoppingCartLogin"])
	var custCode = "NADA";
	

	console.log("TYPEOF: " , infoReturned["bodyShoppingCartLogin"]);
	if (existence == true){
		console.log("EXIST TRUE");
		var bodyShoppingCartLoginJson = JSON.parse(infoReturned["bodyShoppingCartLogin"]);

		custCode = bodyShoppingCartLoginJson["DATA"][0].CUST_CODE; // TODO corregir valor
	}else{
		console.log("EXIST FALSE");
	}

console.log("custCode: " , custCode);
	
	var customerDetailsData =  `{
									key:[{ "API_KEY": "`+infoReturned['API_KEY']+`", "SESSION_KEY": "`+infoReturned['SESSION_KEY']+`" }],
									data: "{'custCode':'`+custCode+`','isNew':''}"
								}`;

	performRequest2.performRequest( 'POST','/StoreAPI/AccountMngmnt/GetCustomerDetails',customerDetailsData,
		function (body) {
			//console.log(body);
			cb(null,body);
		},
		function (body) {
			console.log("getCustomerDetails Info: Customer does not exist");
			//console.log(body);
			cb( null, { existence: "NOT_FOUND" , custCode: custCode } );
		}
	);

}

