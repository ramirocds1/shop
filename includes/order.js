var performRequest2 = require('./performRequest2');
var async = require('async');

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
	console.log("lineItems: " , line_items.length );

	var item = line_items[0];
	var itemcode = "247913"//item.product_id;
	var quantity = item.quantity;
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
console.log(cartItemInfo);

	performRequest2.performRequest('POST','/StoreAPI/ShoppingCart/AddItemToCart',cartItemInfo,
		function (body) {
			console.log("addItemToCart OK");
			//console.log(body);
			//bodyCb.push(body)
		},
		function (body) {
			console.log("addItemToCart Error");
			console.log(body);
			//callback(1,bodyCb); DESCOMENTAR ESTO
		}
	);	


	/*
	var bodyCb = []

	async.each(line_items, function(item, callback) {
		var itemcode = item.product_id;
		var quantity = item.quantity;
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
		console.log("CART_ITEM_INFO: " , cartItemInfo );
		
		performRequest2.performRequest('POST','/StoreAPI/ShoppingCart/AddItemToCart',cartItemInfo,
			function (body) {
				console.log("addItemToCart OK");
				//console.log(body);
				//bodyCb.push(body)
			},
			function (body) {
				console.log("addItemToCart Error");
				console.log(body);
				//callback(1,bodyCb); DESCOMENTAR ESTO
			}
		);
		
	}, function(err) {
			if( err ) {
      			// One of the iterations produced an error.
      			// All processing will now stop.
      			console.log('An item failed to process');
				cb(1,bodyCb)
    		} else {
				cb(null,bodyCb)
      			console.log('All files have been processed successfully');
    		}
	});
	*/
	
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