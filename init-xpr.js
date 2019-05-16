// use as node init-e

var args = process.argv.slice(2);
var moduleType = args[0];
var moduleName = args[1];

var fs = require('fs');
var mkdirp = require('mkdirp');
