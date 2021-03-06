var nconf    = require('nconf');
var async = require('async');
var CronJob = require('cron').CronJob;
var performRequest = require('./performRequest');


exports.createOrder = function  (infoReturned, rollbar, cb){

	var bodyGetCustomerDetailsJson = JSON.parse( infoReturned["bodyGetCustomerDetails"] );
	var dataElement = bodyGetCustomerDetailsJson["DATA"][1];
	
	// this is the only relevant information, the rest must be hardcoded
	var ShipAddressCode = dataElement.match(/'addressCode':'(.+?)'/)[1];
	var DeliveryMethod = infoReturned['shopifyInfo'].shipping_lines[0].title;
	var FlatShippingCharge = infoReturned['shopifyInfo'].shipping_lines[0].price;
	var PaymentType = 2;
	var PaymentTermCode = "COD";

	console.log ("\nCreating Order\nImportant info for creating order: ShipAddressCode:"+ShipAddressCode+" , DeliveryMethod:"+DeliveryMethod+" , FlatShippingCharge:"+FlatShippingCharge+" , PaymentType:"+PaymentType+" , PaymentTermCode:" + PaymentTermCode);


	var orderData = `{
						key:[{"API_KEY":"`+infoReturned['API_KEY']+`","SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}]
						,data:"{'objOrderPrerequisite':{
															'DeliveryDate':'',
															'DeliveryMethod':'` + DeliveryMethod + `',
															'FlatShippingCharge':'` + FlatShippingCharge + `',
															'PaymentType':` + PaymentType + `,
															'PaymentTermCode':'` + PaymentTermCode + `',
															'PaymentMethodTypeCode':'',
															'CardID':0,
															'AVSAddressCode':0,
															'ShipAddressCode':` + ShipAddressCode + `,
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

	performRequest.performRequest( 'POST','/StoreAPI/WebOrder/CreateOrder',orderData,
		function (body) {
			cb(null,body);
		},
		function (body) {
			console.log("CreateOrder Error");
			rollbar.reportMessageWithPayloadData( "[#"+infoReturned['shopifyInfo'].id+"] There was an error creating a new order",
				{
					level: "error",
					shopifyOrderID: infoReturned['shopifyInfo'].id,
					ShipAddressCode: ShipAddressCode,
					DeliveryMethod: DeliveryMethod,
					FlatShippingCharge: FlatShippingCharge,
					PaymentType: PaymentType,
					PaymentTermCode: PaymentTermCode,
					response: body
				});
				console.log(body);
				cb(1,body);
		}
	);

}

exports.addItemToCart = function  (infoReturned, rollbar, cb){

	var line_items = infoReturned['shopifyInfo'].line_items;
	console.log("Adding "+line_items.length+" items to cart" );
	var bodyCb = [];

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
			
			performRequest.performRequest('POST','/StoreAPI/ShoppingCart/AddItemToCart',cartItemInfo,
				function (body) {
					infoReturned['lineitems'].push(item.id);
					bodyCb.push(body);
					callback(null,bodyCb);
				},
				function (body) {
					console.log( "AddItemToCartError\n" , body);
					rollbar.reportMessageWithPayloadData( "[#"+infoReturned['shopifyInfo'].id+"] There was an error when adding an item to the cart",
						{
							level: "error",
							shopifyOrderID: infoReturned['shopifyInfo'].id,
							itemcode: itemcode,
							quantity: quantity,
							itemAliasCode: itemAliasCode,
							measureCode: measureCode,
							response: body
						});

					callback(1,bodyCb);
				}
			);
	}, function(err) {
			if( err ) {
      			console.log('An item failed to process on addItemToCart, aborting process.');
				cb(1,bodyCb);
    		} else {
    			console.log('All files have been processed successfully on addItemToCart');
				cb(null,bodyCb);
    		}
	});
	
	
}


function conditionToTerminate(bodyJSON){
	return  ( bodyJSON["DATA"][0] != undefined );
}

exports.getShipmentTrackingNos = function  (infoReturned, rollbar, cb){
	

	var bodyCreateOrder = JSON.parse(infoReturned["bodyCreateOrder"]);
	var OrderNo = bodyCreateOrder["DATA"].OrderNo;
	var docType = 8;
	

	var trackingOrdersNosInfo = `{	key:[ {"API_KEY":"`+infoReturned['API_KEY']+`","SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
									data:"{
											'orderNo':'`+OrderNo+`',
											'docType':'`+docType+`'
										  }"
								 }`;

	var job = new CronJob( nconf.get("additionalKeys:interval") , function() {
		console.log("Asking GS server for tracking number");
		performRequest.performRequest('POST','/StoreAPI/WebOrder/GetShipmentTrackingNos',trackingOrdersNosInfo,
			function (body) {
				var bodyJSON = JSON.parse(body);
			  	if (conditionToTerminate(bodyJSON)){
					rollbar.reportMessageWithPayloadData( "[#"+infoReturned['shopifyInfo'].id+"] a new tracking number was entered for OrderNo: "+OrderNo+" ",
						{
							level: "info",
							shopifyOrderID: infoReturned['shopifyInfo'].id,
							OrderNo: OrderNo,
							docType: docType
						});
			  		job.stop();
			  		cb(null,bodyJSON);
				}
			},
			function (body) {
				console.log("getShipmentTrackingNos Error.");
				rollbar.reportMessageWithPayloadData( "[#"+infoReturned['shopifyInfo'].id+"] There was an error when obtaining the Tracking number",
					{
						level: "error",
						shopifyOrderID: infoReturned['shopifyInfo'].id,
						OrderNo: OrderNo,
						docType: docType,
						response: body
					});
		  		job.stop();
		  		cb(1,body);
				
			}
		);
	}, null, true, 'America/Los_Angeles');

}