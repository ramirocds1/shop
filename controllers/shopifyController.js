var async = require('async');
var mongoose = require('mongoose');
var querystring = require('querystring');
var request = require('request');
var API_KEY = "";
var SESSION_KEY = "";
var hostGS = "http://server.fcmsbs.local:92";


function login(req, cb) {
	var _gesCompany = 'DEMO';
	var _gesLocation = 'HQ';
	var _gesJuris = 'SYS';
	var _gesPass = 'ADMIN';
	var _gesUser = 'ADMIN';
	var _gesVer = '7.0.100.00000.00000';
	var _gesWebsitePref = 'DEF';
	var _localHost = 'WEBSRV';
	var _productType = '8';
	var method = "POST";
	var endpoint = "/StoreAPI/GesApp/GesLogin";
	var data = 	{ gesCompany: _gesCompany , gesLocation: _gesLocation, gesJuris: _gesJuris, gesPass: _gesPass, gesUser: _gesUser, gesVer: _gesVer, gesWebsitePref: _gesWebsitePref, localHost: _localHost, productType: _productType };
	console.log("Call: Greenestep /StoreAPI/GesApp/GesLogin, User: 'ADMIN' , pass: 'ADMIN' , Company: 'DEMO'" );
	performRequest( hostGS,method,endpoint,data,
		function (body) {
			console.log("Login Successful");
			var bodyJson = JSON.parse(body);
			cb( 1 , bodyJson['KEY'][0]['API_KEY'] , bodyJson['KEY'][0]['SESSION_KEY'] );
		},
		function (body) {
			console.log("Login Error");
			cb(0,"","");
		}
	);
}



function performRequest( host , method , endpoint, data, cb, cbError) {

	function callback(error, response, body) {
	  if (!error && response.statusCode == 200) {
	    cb(body);
	  }else{
	  	cbError(body);
	  }
	}

	if (method == 'GET')
	{

		var options = {
		  method: method,
		  url: host + endpoint,
		  headers: {
		    'User-Agent': 'request'
		  }
		};

		request(options, callback);
	}else{
		// method == POST

		request.post({url: host + endpoint, form: data, headers: {} }, callback );

	}

}

exports.orderPlaced = function (req, res) {
	login(req ,
		function(result , api_key , session_key)
		{
			if (result=1){
				API_KEY = api_key;
				SESSION_KEY = session_key;
			}
		}
	);
	
	res.json( "DEVUELVO ABAJO" );

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