var performRequest2 = require('./performRequest2');

exports.saveCustomer = function  (infoReturned, cb){

	if ( infoReturned.bodyGetCustomerDetails.existence == "NOT_FOUND" ){
		var code = infoReturned['bodyGetCustomerDetails'].custCode;
		console.log("Customer: " + code + " not found, creating it." );

		var customer = infoReturned['shopifyInfo'].customer
		var billing_address = infoReturned['shopifyInfo'].billing_address

		var customerData = `{
			key: [{ "API_KEY": "`+infoReturned['API_KEY']+`",
					"SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
			data:"{
					'oCustomer':{
									'Active':null,
									'CustCode':'`+code+`',
									'Name':'`+ customer.name +`',
									'CustomerNotes':'`+ customer.note +`',
									'SourceCode':'',
									'PONumberRequired':null,
									'DefaultShipCode':`+ infoReturned['shopifyInfo'].shipping_address.zip +`,
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
				//console.log(body);
				cb(1,body);
			}
		);
		
	}



}

exports.getCustomerDetails = function  (infoReturned, cb){

	var custCode = infoReturned['shopifyInfo'].customer.email;
	console.log("EL CODE ES:" , custCode)
	var customerDetailsData =  `{
									key:[{ "API_KEY": "`+infoReturned['API_KEY']+`", "SESSION_KEY": "`+infoReturned['SESSION_KEY']+`" }],
									data: "{'custCode':'`+custCode+`','isNew':''}"
								}`;

	performRequest2.performRequest( 'POST','/StoreAPI/AccountMngmnt/GetCustomerDetails',customerDetailsData,
		function (body) {
			console.log("getCustomerDetails OK");
			//console.log(body);
			cb(null,body);
		},
		function (body) {
			console.log("getCustomerDetails Error, Customer does not exist");
			//console.log(body);
			cb( null, { existence: "NOT_FOUND" , custCode: custCode } );
		}
	);

}

