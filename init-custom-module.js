var args = process.argv.slice(2);
var storyFolder = args[0];
var moduleName = args[1];

var fs = require('fs');
var mkdirp = require('mkdirp');

// build main folder
mkdirp('./src/modules/custom/' + moduleName, function (err) {
  // add json file
  fs.writeFile('./src/modules/custom/' + moduleName +'/template.hbs', '', function() {
    console.log('Custom module ' + moduleName + ' added.');
  });
});

