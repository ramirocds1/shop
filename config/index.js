/*jshint node:true */
"use strict";

var path = require('path');
var nconf = require('nconf');

module.exports = function(env) {
    env = env || 'default';

    try {
        nconf.file('environment', path.join(__dirname, '/env/', env + '.json'));
        nconf.file('default', path.join(__dirname, '/env/default.json'));
    }
    catch (e) {
        return null;
    }

    return nconf;
};

