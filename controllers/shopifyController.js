var async = require('async');
var mongoose = require('mongoose');
var querystring = require('querystring');
var async = require('async');
var customer = require('../includes/customer');
var loginRequest = require('../includes/loginRequest');
var order = require('../includes/order');

var key = 'a2465c83176d07f26e5abc6374e66eae';
var shopName = 'shopcds';
var password = 'c9b9cdfece3699a5e21bcec6631f61f2';

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
		userexists: false
	}



	var loginSync = function(done){
		// HECHO
		//console.log("SHOPIFY MANDA: " , infoReturned.shopifyInfo );
		loginRequest.loginGS(req ,
			function(err , api_key , session_key)
			{
				if (err == null ){
					console.log("Saving keys.");
					infoReturned['API_KEY'] = api_key;
					infoReturned['SESSION_KEY'] = session_key;
				}else{
					handleError(res, err);
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
		    	}else{
		    		handleError(res, err);
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

		    	}else{
		    		handleError(res, err);
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
		    	}else{
		    		handleError(res, err);
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
		    	}else{
		    		handleError(res, err);
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
		    	}else{
		    		handleError(res, err);
		    	}
		    	//console.log("callback createOrder");
		    	done(err);
		    }
	   );
	}

	var getShipmentTrackingNosSync = function(done){
		
	   order.getShipmentTrackingNos (infoReturned,
		    function(err,body){
		    	if (err == null ){
		    		infoReturned['bodyGetShipmentTrackingNos'] = body;
		    	}else{
					handleError(res, err);
		    	}
		    	//console.log("callback getShipmentTrackingNos");
		    	done(err);
		    }
	   );
	}

	var updateOrderSync = function(done){
		
		updateOrder(infoReturned,
			function (err){
		    	if (err == null ){
		    		console.log("updateOrder sin error");
		    	}else{
		    		console.log("updateOrder CON error");
					handleError(res, err);
		    	}
		    	done(err);
			});
	}

	async.waterfall([ loginSync , ShoppingCartLoginSync , saveCustomerSync, ShoppingCartLoginSync, getCustomerDetailsSync , addItemToCartSync, createOrderSync, getShipmentTrackingNosSync, updateOrderSync ],
		function(err){
			console.log("");
			console.log("async.waterfall END");
		}
	)

	
	
}

function updateOrder(infoReturned, cb) {
	//get fullfilment for order with order number

	console.log("Updating order in Shopify");


	const Shopify = require('shopify-api-node');
	const shopify = new Shopify(shopName, key, password);

	// parse received data from GreeneStep
	
	var order_id =   infoReturned.shopifyInfo.id; //  req.data.TrackingNumber || 3778312711;
	var tracking_number = infoReturned['bodyGetShipmentTrackingNos']["DATA"][0].TrackingNumber;
	var tracking_company = infoReturned['bodyGetShipmentTrackingNos']["DATA"][0].DelivDesc;
	var tracking_url = infoReturned['bodyGetShipmentTrackingNos']["DATA"][0].TrackUrl;
	var tracking_delivery_date = infoReturned['bodyGetShipmentTrackingNos']["DATA"][0].DeliveryDate;
	var tracking_note = infoReturned['bodyGetShipmentTrackingNos']["DATA"][0].Note;

	console.log("INFO ENVIADA" , tracking_company);	

	// Get all fullfilments from Shopify
	shopify.fulfillment.list(order_id)
		.then(fulfillments => {
			console.log('FULFILLMENTS: ', fulfillments);
			// Put the modifications for the fulfillment in Shopify
			shopify.fulfillment.update(order_id, 1, {
				tracking_number: tracking_number,
				tracking_company: tracking_company,
				tracking_url: tracking_url
			}).then(response => {
				console.log('UPDATE RESPONSE: ', response);
				res.json({
					code: 200,
					message: 'OK'
				});
			}).catch(err =>
				console.error('Error: ', err)
				);
		})
		.catch(err =>
			console.error('Error: ', err)
		);

		cb(null);
		
		
}

function handleError(res, err) {
	//var status = err.status || 500;
	//res.status(status);
	//return res.json({
	//	errors: [err]
	//});
};