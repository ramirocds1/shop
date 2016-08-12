var nconf    = require('nconf');
var performRequest = require('./performRequest');

exports.saveCustomer = function  (infoReturned, rollbar, cb, existence){

	if (!existence){

		var customer = infoReturned['shopifyInfo'].customer
		var billing_address = infoReturned['shopifyInfo'].billing_address
		var pass = nconf.get("keys:ShoppingCartLoginPassword");;

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
														'Password':'`+ pass +`',
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

		
		performRequest.performRequest( 'POST','/StoreAPI/AccountMngmnt/SaveCustomer',customerData,
			function (body) {
					rollbar.reportMessageWithPayloadData( "[#"+infoReturned['shopifyInfo'].id+"] SaveCustomer successful",
						{
							level: "info",
							shopifyOrderID: infoReturned['shopifyInfo'].id,
							customer: infoReturned['shopifyInfo'].customer,
							password: pass
						});
				console.log("saveCustomer Success");
				cb(null,body, true, false);
			},
			function (body) {

				rollbar.reportMessageWithPayloadData( "[#"+infoReturned['shopifyInfo'].id+"] SaveCustomer Error",
					{
						level: "error",
						shopifyOrderID: infoReturned['shopifyInfo'].id,
						customer: infoReturned['shopifyInfo'].customer,
						password: pass
					});
				console.log("saveCustomer Error, printing body\n" , body);
				cb(1,body, false , false);
			}
		);
	}else{
		console.log("\nSaveCustomer: customer already exists, skipping creating a new one.")
		cb(null, infoReturned['bodySaveCustomer'] , true, true);
	}

}

exports.getCustomerDetails = function  (infoReturned, rollbar, cb){

	var bodyShoppingCartLoginJson = JSON.parse(infoReturned["bodyShoppingCartLogin"]);
	var custCode = bodyShoppingCartLoginJson["DATA"][0][0].CUST_CODE;
	
	var customerDetailsData =  `{
									key:[{ "API_KEY": "`+infoReturned['API_KEY']+`", "SESSION_KEY": "`+infoReturned['SESSION_KEY']+`" }],
									data: "{'custCode':'`+custCode+`','isNew':''}"
								}`;

	performRequest.performRequest( 'POST','/StoreAPI/AccountMngmnt/GetCustomerDetails',customerDetailsData,
		function (body) {
			cb(null,body);
		},
		function (body) {
			console.log("getCustomerDetails Error");
			rollbar.reportMessageWithPayloadData( "[#"+infoReturned['shopifyInfo'].id+"] GetCustomerDetails Error",
			{ level: "error", shopifyOrderID: infoReturned['shopifyInfo'].id, custCode: custCode, isNew: isNew });
			cb( 1, body );
		}
	);

}

