// use as node init-module element somethingelse

var args = process.argv.slice(2);
var storyFolder = args[0];
var moduleName = args[1];

var fs = require('fs');
var mkdirp = require('mkdirp');

// build main folder
mkdirp('./stories/' + storyFolder + '/custom_' + moduleName, function (err) {
  // add json file
  fs.writeFile('./stories/' + storyFolder + '/custom_' + moduleName +'/template.hbs', '', function() {
    console.log('Custom module ' + moduleName + ' for story ' + storyFolder + ' added.');
  });
});

