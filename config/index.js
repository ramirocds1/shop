/*jshint node:true */
"use strict";

var path = require('path');
var nconf = require('nconf');

module.exports = function(env) {
    env = env || 'default';

    try {
    	console.log(" A: " , __dirname );
        nconf.file('environment', path.join(__dirname, '/env/', env + '.json'));
        console.log(" B: " , __dirname );
        nconf.file('default', path.join(__dirname, '/env/default.json'));

    }
    catch (e) {
    	console.log(e.message);
        return null;
    }

    return nconf;
};

