var performRequest2 = require('./performRequest2');
var async = require('async');
var CronJob = require('cron').CronJob;

exports.createOrder = function  (infoReturned, cb){

	// this is the only relevant information, the rest must be hardcoded
	
	console.log ("TYPEOF ***************** : " , typeof(infoReturned["bodyGetCustomerDetails"]) ); 

	var ShipAddressCode = infoReturned["bodyGetCustomerDetails"].addressCode;
	var DeliveryMethod = "UPSE";
	var FlatShippingCharge = 21.50;
	var PaymentType = 2;
	var PaymentTermCode = "COD";

	console.log ("Important info for creating order: ShipAddressCode:"+ShipAddressCode+" , DeliveryMethod:"+DeliveryMethod+" , FlatShippingCharge:"+FlatShippingCharge+" , PaymentType:"+PaymentType+" , PaymentTermCode:" + PaymentTermCode);
	
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
			console.log(body);
			cb(1,body);
		}
	);

}



exports.addItemToCart = function  (infoReturned, cb){

	var line_items = infoReturned['shopifyInfo'].line_items
	console.log("");
	console.log("Adding "+line_items.length+" items to cart" );
	var bodyCb = [];

	async.each(line_items, function(item, callback) {
		

			var itemcode = "AMBA13"; //item.product_id;
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
			
			performRequest2.performRequest('POST','/StoreAPI/ShoppingCart/AddItemToCart',cartItemInfo,
				function (body) {
					console.log("addItemToCart OK");
					bodyCb.push(body);
					callback(null,bodyCb);
				},
				function (body) {
					console.log("addItemToCart Error");
					callback(1,bodyCb);
				}
			);

		
	}, function(err) {
			if( err ) {
      			console.log('An item failed to process on addItemToCart');
				cb(1,bodyCb);
    		} else {
    			console.log('All files have been processed successfully on addItemToCart');
				cb(null,bodyCb);
    		}
	});
	
	
}


function conditionToTerminate(k,body){
	return k ==2;
	// TODO DESCOMENTAR: return ( (dataArray["TrackingNumber"] != undefined) && (dataArray["TrackingNumber"] != null) ) ;
}

exports.getShipmentTrackingNos = function  (infoReturned, cb){
	

	var bodyCreateOrder = JSON.parse(infoReturned["bodyCreateOrder"]);
	var OrderNo = bodyCreateOrder["DATA"].OrderNo;
	var docType = 8;
	

	var trackingOrdersNosInfo = `{	key:[ {"API_KEY":"`+infoReturned['API_KEY']+`","SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
									data:"{
											'orderNo':'`+OrderNo+`',
											'docType':'`+docType+`'
										  }"
								 }`;
	var k = 0;
	var everySecond = '* * * * * *';
	var cadaMinuto = '00 * * * * *';
	var eachHalfHour = '* 00,30 * * * *';

	var job = new CronJob( everySecond , function() {
		k++;
		console.log("Asking GS server for tracking number");
		performRequest2.performRequest('POST','/StoreAPI/WebOrder/GetShipmentTrackingNos',trackingOrdersNosInfo,
			function (body) {
			  	if (conditionToTerminate(k,body)){
			  		// SIMULAR ALGUN VALOR ACA
			  		job.stop();
			  		cb(null,body);
				}

			},
			function (body) {
				console.log("getShipmentTrackingNos Error");
			  	if (conditionToTerminate(k,body)){
			  		job.stop();
			  		cb(1,body);
				}
			}
		);
	}, null, true, 'America/Los_Angeles');

}