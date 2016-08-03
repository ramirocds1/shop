var performRequest2 = require('./performRequest2');

exports.createOrder = function  (infoReturned, cb){



	var orderData = `{	key:[{"API_KEY":"`+infoReturned['API_KEY']+`","SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
						data:"{
								'objOrderPrerequisite': {
															'DeliveryDate':'',
															'DeliveryMethod':'UPSE',
															'FlatShippingCharge':'21.50',
															'PaymentType':2,
															'PaymentTermCode':'COD',
															'PaymentMethodTypeCode':'',
															'CardID':0,
															'AVSAddressCode':0,
															'ShipAddressCode':18,
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
	var cartItemInfo = `{	key:[ {"API_KEY":"`+infoReturned['API_KEY']+`","SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
							data:"{
									'itemCode':'AMBA13',
									'quantity':'8',
									'itemAliasCode':'',
									'measureCode':''
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
	var trackingOrdersNosInfo = `{	key:[ {"API_KEY":"`+infoReturned['API_KEY']+`","SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
									data:"{
											'orderNo':'600015',
											'docType':'8'
										  }"
								}`;



	performRequest2.performRequest('POST','/StoreAPI//WebOrder/GetShipmentTrackingNos',trackingOrdersNosInfo,
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



