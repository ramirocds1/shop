var async		= require('async');
var mongoose  	= require('mongoose');


/*

exports.method =  function(req, res) {

}

*/

function handleError(res, err){
	var status = err.status || 500;
	res.status(status);
	return res.json({
		errors: [err]
	});
};