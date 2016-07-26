var async = require('async');
var mongoose = require('mongoose');
var querystring = require('querystring');
var request = require('request');




function login(req, cb) {

	var gesUser = "name of the user logging in";
	var gesCompany = "Name chosen for the company.";
	var gesPass = "password of the user";
	var localHost = "??";
	var productType = "??";
	var gesWebsitePref = "Web Store Code chosen for Ecommerce Website Ecommerce";
	var gesVer = "Version of GreeneStep Business Suite";
	var gesLocation = "Default location of the company";
	var gesJuris = "value for Jurisdiction";
	var method = 'POST';
	var host = "https://heroku-shopify-test.herokuapp.com";
	var endpoint = "/shopify/updateOrder"
	var returnData;

	performRequest( host , method , endpoint,

		{
			gesUser: gesUser, gesCompany: gesCompany, gesPass: gesPass, localHost: localHost, productType: productType,
			gesWebsitePref: gesWebsitePref, gesVer: gesVer, gesLocation: gesLocation, gesJuris: gesJuris
		},
		
		function (body) {
			console.log("Success: " + body);
			cb(body);
		},


		function (body) {
			console.log("Error: " + body);
			cb(body);
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
		request.post(
		    host + endpoint ,
		    { form: { key: 'value' } },
		    callback
		);

	}

}

exports.orderPlaced = function (req, res) {

	//console.log(req.body );

	login(req ,

		function(loginResponse)
		{
			res.json({
				message: loginResponse
			});
		}
	);


}

exports.updateOrder = function (req, res) {
	//get fullfilment for order with order number

	console.log("llega");
	//	console.log(req.body.form.key);
	
	res.json({
		message: "Success!"
	});

	/*
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
		*/
}

function handleError(res, err) {
	var status = err.status || 500;
	res.status(status);
	return res.json({
		errors: [err]
	});
};