var async = require('async');
var mongoose = require('mongoose');
var querystring = require('querystring');
var async = require('async');
var customer = require('../includes/customer');
var loginRequest = require('../includes/loginRequest');
var order = require('../includes/order');

exports.orderPlaced = function (req, res) {



	var infoReturned = {
		API_KEY : "" ,
		SESSION_KEY : "" ,
		bodySaveCustomer : "" ,
		bodyShoppingCartLogin : "" ,
		bodyCreateOrder : "",
		bodyAddItemToCart : "",
		bodyGetCustomerDetails : "",
		bodyGetShipmentTrackingNos : "",
		shopifyInfo: req.body
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
	
	   loginRequest.ShoppingCartLogin (infoReturned,
		    function(err, body){
		    	infoReturned['bodyShoppingCartLogin'] = body;
		    	//console.log("callback ShoppingCartLogin");
		    	done(err);
		    }
	   );
	}

	var getCustomerDetailsSync = function(done){
		
	   customer.getCustomerDetails (infoReturned,
		    function(err,body){
		    	infoReturned['bodyGetCustomerDetails'] = body;
		    	//console.log("callback getCustomerDetails");
		    	done(err);
		    }
	   );
	}

	var saveCustomerSync = function(done){
		
	   customer.saveCustomer (infoReturned,
		    function(err,body){
		    	infoReturned['bodySaveCustomer'] = body;
		    	//console.log("callback saveCustomer");
		    	done(err);
		    }
	   );
	}

	var addItemToCartSync = function(done){
		
	   order.addItemToCart (infoReturned,
		    function(err,body){
		    	infoReturned['bodyAddItemToCart'] = body;
		    	//console.log("callback addItemToCart");
		    	done(err);
		    }
	   );
	}

	var createOrderSync = function(done){
		
	   order.createOrder (infoReturned,
		    function(err,body){
		    	infoReturned['bodyCreateOrder'] = body;
		    	//console.log("callback createOrder");
		    	done(err);
		    }
	   );
	}

	var getShipmentTrackingNosSync = function(done){
		
	   order.getShipmentTrackingNos (infoReturned,
		    function(err,body){
		    	infoReturned['bodyGetShipmentTrackingNos'] = body;
		    	//console.log("callback getShipmentTrackingNos");
		    	done(err);
		    }
	   );
	}


	async.waterfall([ loginSync , ShoppingCartLoginSync , getCustomerDetailsSync, saveCustomerSync , addItemToCartSync, createOrderSync  , getShipmentTrackingNosSync],
		function(err){
			console.log("");
			console.log("async.waterfall END");
			// se ejecuta cuando ermino todo
			res.json("END");
		}
	)

}

exports.updateOrder = function (req, res) {
	//get fullfilment for order with order number

	
	var key = 'ddb35ccba70e31fa0a78fdbb74da2370';
	var shopName = 'appTEST';
	var password = 'ad0c509444d76f2c5bc40b3091525023';

	const Shopify = require('shopify-api-node');

	const shopify = new Shopify(shopName, key, password);

	// parse received data from GreeneStep
	var order_id = req.data.TrackingNumber || 3778312711;
	var tracking_number = req.data.TrackingNumber;
	var tracking_company = req.data.DelivDesc;
	var tracking_url = req.data.TrackUrl;
	var tracking_delivery_date = req.data.DeliveryDate;
	var tracking_note = req.data.Note;

	// Get all fullfilments from Shopify
	shopify.fulfillment.list(order_id)
		.then(fulfillments => {
			console.log('FULFILLMENTS: ', fulfillments);
			// Put the modifications for the fulfillment in Shopify
			shopify.fulfillment.update(order_id, fulfillments[0].id, {
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
		
}

function handleError(res, err) {
	var status = err.status || 500;
	res.status(status);
	return res.json({
		errors: [err]
	});
};