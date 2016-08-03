var performRequest2 = require('./performRequest2');

exports.saveCustomer = function  (infoReturned, cb){


	var customerData = `{
		key: [{ "API_KEY": "`+infoReturned['API_KEY']+`",
				"SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
		data:"{
				'oCustomer':{
								'Active':null,
								'CustCode':'',
								'Name':'',
								'CustomerNotes':'',
								'SourceCode':'',
								'PONumberRequired':null,
								'DefaultShipCode':0,
								'DefaultContCode':0,
								'ShippingAddrCount':0,
								'ContactAddrCount':0,
								'BillingAddressRecord':{
															'Active':null,
															'AddressCode':0,
															'CustCode':null,
															'Password':'test',
															'CompanyName':'',
															'FirstName':'Mark',
															'LastName':'Z',
															'FirstLast':null,
															'Street':'xyzStreet',
															'Email':'Mark@Z.com',
															'SubType':'2',
															'Telephone':'759875895',
															'Telephone2':null,
															'Fax':'',
															'City':'New York',
															'State':'NY',
															'Zip':'10001',
															'Country':'India',
															'SecretQuestion':'2',
															'SecretAnswer':'delhi',
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

exports.getCustomerDetails = function  (infoReturned, cb){

	var customerDetailsData =  `{
									key:[{ "API_KEY": "`+infoReturned['API_KEY']+`", "SESSION_KEY": "`+infoReturned['SESSION_KEY']+`" }],
									data: "{'custCode':'ANCR','isNew':''}"
								}`;





	performRequest2.performRequest( 'POST','/StoreAPI/AccountMngmnt/GetCustomerDetails',customerDetailsData,
		function (body) {
			console.log("getCustomerDetails OK");
			//console.log(body);
			cb(null,body);
		},
		function (body) {
			console.log("getCustomerDetails Error");
			//console.log(body);
			cb(1,body);
		}
	);

}

