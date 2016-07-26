var async = require('async');
var mongoose = require('mongoose');
var querystring = require('querystring');
var https = require('https');




function login(req) {

	console.log(req.body.clave );



	var gesUser = "name of the user logging in";
	var gesCompany = "Name chosen for the company.";
	var gesPass = "password of the user";
	var localHost = "??";
	var productType = "??";
	var gesWebsitePref = "Web Store Code chosen for Ecommerce Website Ecommerce";
	var gesVer = "Version of GreeneStep Business Suite";
	var gesLocation = "Default location of the company";
	var gesJuris = "value for Jurisdiction";
	var method = 'GET';
	var host = "http://heroku-shopify-test.herokuapp.com";
	var endpoint = "/GesApp/GesLogin"

	performRequest( host , method , '/shopify/updateOrder',

		{
			gesUser: gesUser, gesCompany: gesCompany, gesPass: gesPass, localHost: localHost, productType: productType,
			gesWebsitePref: gesWebsitePref, gesVer: gesVer, gesLocation: gesLocation, gesJuris: gesJuris
		},

		method ,
		
		function (data) {
			console.log('Logged in');
		});

	
}



function performRequest( host , method , endpoint, data, success) {

	var dataString = JSON.stringify(data);
	
	

	
	var headers = {
		'Content-Type': 'application/json',
		'accept': '*/*',
		'Content-Length': dataString.length
	};

	var options = {
		host: host,
		path: endpoint,
		method: method,
		headers: headers
	};


	console.log("VOY A ENVIAR");


	var req = https.request(options, function (res) {



		res.setEncoding('utf-8');
		var responseString = '';

		res.on('data', function (data) {
			responseString += data;
		});

		res.on('end', function () {
			console.log(responseString);
			var responseObject = JSON.parse(responseString);
			success(responseObject);
		});
	});

	req.write(dataString);
	req.end();
}

exports.orderPlaced = function (req, res) {

	//console.log(req.body );

	var loginResponse = login(req);

	res.json({
		message: 'OK'
	});
}

exports.updateOrder = function (req, res) {
	//get fullfilment for order with order number

	console.log("llega");
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