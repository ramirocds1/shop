var async = require('async');
var mongoose = require('mongoose');
var querystring = require('querystring');
var async = require('async');
var customer = require('../includes/customer');
var loginRequest = require('../includes/loginRequest');
var order = require('../includes/order');

exports.orderPlaced = function (req, res) {
  
	var API_KEY = "";
	var SESSION_KEY = "";
	var bodySaveCustomer = "";
	var bodyShoppingCartLogin = "";
	var bodyCreateOrder = "";
	var bodyAddItemToCart = "";
	var bodyGetCustomerDetails = "";

	var loginSync = function(done){
		loginRequest.loginGS(req ,
			function(result , api_key , session_key)
			{
				if (result==1){
					console.log("callback login, saving keys.");
					API_KEY = api_key;
					SESSION_KEY = session_key;
				}
				done(null);
			}
		);
	}


	var ShoppingCartLoginSync = function(done,api_key,session_key){
		//console.log("recibe sesskey", session_key)
	   loginRequest.ShoppingCartLogin (API_KEY,SESSION_KEY,
		    function(body){
		    	bodyShoppingCartLogin = body;
		    	console.log("callback ShoppingCartLogin");
		    	done();
		    }
	   );
	}

	var saveCustomerSync = function(done){
		
	   customer.saveCustomer (API_KEY,SESSION_KEY,
		    function(body){
		    	bodySaveCustomer = body;
		    	console.log("callback saveCustomer");
		    	done();
		    }
	   );
	}


	var getCustomerDetailsSync = function(done){
		
	   customer.getCustomerDetails (API_KEY,SESSION_KEY,
		    function(body){
		    	bodyGetCustomerDetails = body;
		    	console.log("callback getCustomerDetails");
		    	done();
		    }
	   );
	}

	var createOrderSync = function(done){
		
	   order.createOrder (API_KEY,SESSION_KEY,
		    function(body){
		    	bodyCreateOrder = body;
		    	console.log("callback createOrder");
		    	done();
		    }
	   );
	}


	var addItemToCartSync = function(done){
		
	   order.addItemToCart (API_KEY,SESSION_KEY,
		    function(body){
		    	bodyAddItemToCart = body;
		    	console.log("callback addItemToCart");
		    	done();
		    }
	   );
	}

	async.waterfall([ loginSync , ShoppingCartLoginSync , saveCustomerSync , getCustomerDetailsSync, createOrderSync , addItemToCartSync ],
		function(err){
			console.log("");
			console.log("termina waterfall");
			// se ejecuta cuando ermino todo
			res.json(bodyShoppingCartLogin);
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