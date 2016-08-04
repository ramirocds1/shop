var performRequest2 = require('./performRequest2');

exports.createOrder = function  (infoReturned, cb){

	var ExistingCreditCard = '';
	var CCresult = "";
	var processWebPayment = 1;
	var result = -1;
	var authAmt = 403;
	var payMethodsXML = "";

	// for objOrderPrerequisite
	var DeliveryDate = '';
	var DeliveryMethod = 'UPSE';
	var FlatShippingCharge = '21.50';
	var PaymentType = 2;
	var PaymentTermCode = 'COD';
	var PaymentMethodTypeCode = '';
	var CardID = 0;
	var AVSAddressCode = 0;
	var ShipAddressCode = 18;
	var IsIncludeInsurance = true;
	var IsExistingCard = false;
	var DestinationZoneCode = '';
	var PODate = '';
	var PONumber = '';
	var Notes = '';
	var WorldPayTransactionID = '';
	var CVV2Code = '';
	var PaymentCurrency = 'USD';
	var AVSAddress = '';
	var ZipCode = '';
	var CardHolder = '';
	var ExpiryMonthYear = '';
	var CreditCardNumber = null;
	var PaymentMethodCode = null;
	var SaveThisCard = false;
	var CardNumber = null;
	var RefNumber = '';
	var CustomerCode = null;
	var PaymentMethodDesc = null;
	var IsDefault = false;
	var DefaultAddressForAVS = 0;



	var orderData = `{	key:[{"API_KEY":"`+infoReturned['API_KEY']+`","SESSION_KEY": "`+infoReturned['SESSION_KEY']+`"}],
						data:"{
								'objOrderPrerequisite': {
															'DeliveryDate':'`+DeliveryDate+`',
															'DeliveryMethod':'`+DeliveryMethod+`',
															'FlatShippingCharge':'`+FlatShippingCharge+`',
															'PaymentType':`+PaymentType+`,
															'PaymentTermCode':'`+PaymentTermCode+`',
															'PaymentMethodTypeCode':'`+PaymentMethodTypeCode+`',
															'CardID':`+CardID+`,
															'AVSAddressCode':`+AVSAddressCode+`,
															'ShipAddressCode':`+ShipAddressCode+`,
															'IsIncludeInsurance':`+IsIncludeInsurance+`,
															'IsExistingCard':`+IsExistingCard+`,
															'DestinationZoneCode':'`+DestinationZoneCode+`',
															'PODate':'`+PODate+`',
															'PONumber':'`+PONumber+`',
															'Notes':'`+Notes+`',
															'WorldPayTransactionID':'`+WorldPayTransactionID+`',
															'CVV2Code':'`+CVV2Code+`',
															'PaymentCurrency':'`+PaymentCurrency+`',
															'AVSAddress':'`+AVSAddress+`',
															'ZipCode':'`+ZipCode+`',
															'CardHolder':'`+CardHolder+`',
															'ExpiryMonthYear':'`+ExpiryMonthYear+`',
															'CreditCardNumber':`+CreditCardNumber+`,
															'PaymentMethodCode':`+PaymentMethodCode+`,
															'SaveThisCard':`+SaveThisCard+`,
															'CardNumber':`+CardNumber+`,
															'RefNumber':'`+RefNumber+`',
															'CustomerCode':`+CustomerCode+`,
															'PaymentMethodDesc':`+PaymentMethodDesc+`,
															'IsDefault':`+IsDefault+`,
															'DefaultAddressForAVS':`+DefaultAddressForAVS+`
														},
														'existingCreditCard':'`+ExistingCreditCard+`',
														'CCresult':'`+CCresult+`',
														'processWebPayment':'`+processWebPayment+`',
														'result':'`+result+`',
														'authAmt':'`+authAmt+`',
														'payMethodsXML':'`+payMethodsXML+`'
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
	var itemcode = "AMBA13";
	var quantity = 8;
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



