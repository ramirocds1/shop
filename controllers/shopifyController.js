var async = require('async');
var mongoose = require('mongoose');
var querystring = require('querystring');
var async = require('async');
var customer = require('../includes/customer');
var loginRequest = require('../includes/loginRequest');
var order = require('../includes/order');
const Shopify = require('shopify-api-node');
var key = 'a2465c83176d07f26e5abc6374e66eae';
var shopName = 'shopcds';
var password = 'c9b9cdfece3699a5e21bcec6631f61f2';

var interval = '* * * * * *'; // everySecond
//var interval = '00,30 * * * * *'; // Each half minute
//var interval = '00 * * * * *'; // everyMinute
//var interval = '* 00,30 * * * *'; // eachHalfHour


exports.orderPlaced = function (req, res) {

	console.log("Executing orderPlaced");
	res.json({ code: 200, message: "" });

	var infoReturned = {
		API_KEY : "" ,
		SESSION_KEY : "" ,
		bodySaveCustomer : "" ,
		bodyShoppingCartLogin : "" ,
		bodyCreateOrder : "",
		bodyAddItemToCart : "",
		bodyGetCustomerDetails : "",
		bodyGetShipmentTrackingNos : "",
		shopifyInfo: req.body,
		userexists: false,
		lineitems: []
	}

	var loginSync = function(done){
		loginRequest.loginGS(req ,
			function(err , api_key , session_key)
			{
				if (err == null ){
					console.log("Saving keys.");
					infoReturned['API_KEY'] = api_key;
					infoReturned['SESSION_KEY'] = session_key;
				}

				done(err);
			}
		);
	}


	var ShoppingCartLoginSync = function(done){
		// HECHO
	   loginRequest.ShoppingCartLogin (infoReturned,
		    function(err, body, existence){

		    	infoReturned['userexists'] = existence;
		    	if (err == null ){
		    		infoReturned['bodyShoppingCartLogin'] = body;
		    	}

		    	done(err);
		    }
	   );
	}

	var saveCustomerSync = function(done){
	   
	   customer.saveCustomer (infoReturned,
		    function(err,body, existence){

		    	infoReturned['userexists'] = existence;
		    	if (err == null ){
		    		infoReturned['bodySaveCustomer'] = body;

		    	}
		    	//console.log("callback saveCustomer");
		    	done(err);
		    } , infoReturned['userexists']
	   );
	}


	var getCustomerDetailsSync = function(done){
		
	   customer.getCustomerDetails (infoReturned,
		    function(err,body){
		    	if (err == null ){
		    		infoReturned['bodyGetCustomerDetails'] = body;
		    	}
		    	//console.log("callback getCustomerDetails");
		    	done(err);
		    } , infoReturned['userexists']
	   );
	}



	var addItemToCartSync = function(done){
		
	   order.addItemToCart (infoReturned,
		    function(err,body){
		    	if (err == null ){
		    		infoReturned['bodyAddItemToCart'] = body;
		    	}
		    	//console.log("callback addItemToCart");
		    	done(err);
		    }
	   );
	}

	var createOrderSync = function(done){
		
	   order.createOrder (infoReturned,
		    function(err,body){
		    	if (err == null ){
		    		infoReturned['bodyCreateOrder'] = body;
		    	}
		    	//console.log("callback createOrder");
		    	done(err);
		    }
	   );
	}

	var getShipmentTrackingNosSync = function(done){
		
	   order.getShipmentTrackingNos (infoReturned, interval, 
		    function(err,body){
		    	if (err == null ){
		    		infoReturned['bodyGetShipmentTrackingNos'] = body;
		    	}
		    	//console.log("callback getShipmentTrackingNos");
		    	done(err);
		    }
	   );
	}

	var updateOrderSync = function(done){
		
		updateOrder(infoReturned,
			function (msj,err){
		    	console.log(msj);
		    	done(err);
			});
	}

	async.waterfall([ 	loginSync ,
						ShoppingCartLoginSync,
						saveCustomerSync,
						ShoppingCartLoginSync,
						getCustomerDetailsSync,
						addItemToCartSync,
						createOrderSync,
						getShipmentTrackingNosSync,
						updateOrderSync
					],
		function(err){}
	)

	
	
}

function updateOrder(infoReturned, cb) {

	const shopify = new Shopify(shopName, key, password);
	
	var order_id =   infoReturned.shopifyInfo.id;
	var tracking_number = infoReturned['bodyGetShipmentTrackingNos']["DATA"][0].TrackingNumber;
	var tracking_company = infoReturned.shopifyInfo.shipping_lines.title;
	var tracking_url = infoReturned['bodyGetShipmentTrackingNos']["DATA"][0].TrackUrl;
	var tracking_delivery_date = infoReturned['bodyGetShipmentTrackingNos']["DATA"][0].DeliveryDate;
	var tracking_note = infoReturned['bodyGetShipmentTrackingNos']["DATA"][0].Note;
	var lineItemsSent = [];
	for (var i = 0; i < infoReturned.lineitems.length; i++) {
	 	lineItemsSent.push( { "id": infoReturned.lineitems[i] } );
	}

	
	var msj = "Tracking Number received.\nUpdating order on Shopify.\nCreating a new fullfilment.";
	
	shopify.fulfillment.create(
		order_id,
		{ 	tracking_number: tracking_number, 
			line_items: lineItemsSent,
			tracking_company: "DHL", // TODO VER BIEN QUE VA ACA
			shipping_carrier: "DHL" // TODO VER BIEN QUE VA ACA
		}
	).then(response => {

		msj = msj + '\nFullfillment creation succeded';
		msj = msj + '\nPaying transaction';

		shopify.transaction.create(
			infoReturned.shopifyInfo.id,
			{ amount: infoReturned.shopifyInfo.total_price , kind: "capture" }
		).then(response => {
			msj = msj + "\nPayment Succeded";
			cb(msj,null);
		}).catch(err => {

			msj = msj + 'Payment error (printing message)\n' + err;
			cb(msj,1);
		
		});
	}).catch(err => {
						msj = msj + 'Fullfilment creation error (printing message)\n' + err;
						cb(msj,1);
					});

	
}


