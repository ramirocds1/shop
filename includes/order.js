var performRequest2 = require('./performRequest2');

exports.createOrder = function  (infoReturned, cb){

	// this is the only relevant information, the rest must be hardcoded
	var ShipAddressCode = infoReturned["bodyGetCustomerDetails"].addressCode;
	var DeliveryMethod = "UPSE";
	var FlatShippingCharge = 21.50;
	var PaymentType = 2;
	var PaymentTermCode = "COD";

		var orderData = `{	key:[{"API_KEY":"`+infoReturned['API_KEY']+`","SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
							data:"{
									'objOrderPrerequisite': {
																'DeliveryDate':'',
																'DeliveryMethod':'`+DeliveryMethod+`',
																'FlatShippingCharge':'`+FlatShippingCharge+`',
																'PaymentType':`+PaymentType+`,
																'PaymentTermCode':'`+PaymentTermCode+`',
																'PaymentMethodTypeCode':'',
																'CardID':0,
																'AVSAddressCode':0,
																'ShipAddressCode':`+ShipAddressCode+`,
																'IsIncludeInsurance':true,
																'IsExistingCard':false,
																'DestinationZoneCode':'',
																'PODate':'',
																'PONumber':'',
																'Notes':'',
																'WorldPayTransactionID':'',
																'CVV2Code':'',
																'PaymentCurrency':'USD',
																'AVSAddress':'',
																'ZipCode':'',
																'CardHolder':'',
																'ExpiryMonthYear':'',
																'CreditCardNumber':null,
																'PaymentMethodCode':null,
																'SaveThisCard':false,
																'CardNumber':null,
																'RefNumber':'',
																'CustomerCode':null,
																'PaymentMethodDesc':null,
																'IsDefault':false,
																'DefaultAddressForAVS':0
															},
															'existingCreditCard':'',
															'CCresult':'',
															'processWebPayment':'1',
															'result':'-1',
															'authAmt':'',
															'payMethodsXML':''
										}"`; 


	performRequest2.performRequest( 'POST','/StoreAPI/WebOrder/CreateOrder',orderData,
		function (body) {
			console.log("createOrder OK");
			//console.log(body);
			cb(null,body);
		},
		function (body) {
			console.log("createOrder Error");
			//console.log(body);
			cb(1,body);
		}
	);

}



exports.addItemToCart = function  (infoReturned, cb){

	var line_items = infoReturned['shopifyInfo'].line_items

	var itemcode = line_items.product_id;
	var quantity = line_items.quantity;
	var itemAliasCode = "";
	var measureCode = "";


	var cartItemInfo = `{	key:[ {"API_KEY":"`+infoReturned['API_KEY']+`","SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
							data:"{
									'itemCode':'`+itemcode+`',
									'quantity':'`+quantity+`',
									'itemAliasCode':'`+itemAliasCode+`',
									'measureCode':'`+measureCode+`'
								 }"
						}`;


	performRequest2.performRequest( 'POST','/StoreAPI/ShoppingCart/AddItemToCart',cartItemInfo,
		function (body) {
			console.log("addItemToCart OK");
			//console.log(body);
			cb(null,body);
		},
		function (body) {
			console.log("addItemToCart Error");
			//console.log(body);
			cb(1,body);
		}
	);

}


exports.getShipmentTrackingNos = function  (infoReturned, cb){
	
	var orderno = 600015;
	var docType = 8;

	var trackingOrdersNosInfo = `{	key:[ {"API_KEY":"`+infoReturned['API_KEY']+`","SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
									data:"{
											'orderNo':'`+orderno+`',
											'docType':'`+docType+`'
										  }"
								 }`;

	performRequest2.performRequest('POST','/StoreAPI/WebOrder/GetShipmentTrackingNos',trackingOrdersNosInfo,
		function (body) {
			console.log("getShipmentTrackingNos OK");
			//console.log(body);
			cb(null,body);
		},
		function (body) {
			console.log("getShipmentTrackingNos Error");
			//console.log(body);
			cb(1,body);
		}
	);

}



