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
				console.log("saveCustomer Success");
				cb(null,body, true, false);
			},
			function (body) {
				console.log("saveCustomer Error, printing body\n" , body);
				cb(1,body, false , false);
			}
		);
		
	}else{
		console.log("Customer exists, skipping creating a new one.")
		cb(null, infoReturned['bodySaveCustomer'] , true, true);
	}

}

exports.getCustomerDetails = function  (infoReturned, cb, existence){

	var custCode = "";
	if (existence == true){
		var bodyShoppingCartLoginJson = JSON.parse(infoReturned["bodyShoppingCartLogin"]);
		custCode = bodyShoppingCartLoginJson["DATA"][0][0].CUST_CODE; // valor correcto
	}else{
		var bodySaveCustomer = JSON.parse(infoReturned["bodySaveCustomer"]);
		custCode = bodySaveCustomer["DATA"].CustCode // valor correcto
	}
	
	var customerDetailsData =  `{
									key:[{ "API_KEY": "`+infoReturned['API_KEY']+`", "SESSION_KEY": "`+infoReturned['SESSION_KEY']+`" }],
									data: "{'custCode':'`+custCode+`','isNew':''}"
								}`;

	performRequest2.performRequest( 'POST','/StoreAPI/AccountMngmnt/GetCustomerDetails',customerDetailsData,
		function (body) {
			cb(null,body);
		},
		function (body) {
			console.log("getCustomerDetails Info: Customer does not exist");
			cb( null, { existence: "NOT_FOUND" , custCode: custCode } );
		}
	);

}

