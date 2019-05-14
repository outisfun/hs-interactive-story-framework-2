// use as node init-module element somethingelse

var args = process.argv.slice(2);
var moduleType = args[0];
var moduleName = args[1];

var fs = require('fs');
var mkdirp = require('mkdirp');

// build module folder
mkdirp('./src/modules/' + moduleType + '_' + moduleName, function (err) {
  fs.writeFile('./src/modules/' + moduleType + '_' + moduleName +'/template.hbs', '', function() {
    console.log('Module ' + moduleType + '_' + moduleName + ' added. Optionally add scripts and styles, and info in frameworkdata.js');
  });
});

