var args = process.argv.slice(2);
var storyFolder = args[0];
var moduleName = args[1];

console.log(storyFolder, moduleName, args);

var fs = require('fs');
var mkdirp = require('mkdirp');

// build main folder
mkdirp('./stories/' + storyFolder + '/' + moduleName, function (err) {
  // add json file
  fs.writeFile('./stories/' + storyFolder + '/' + moduleName +'/template.hbs', '', function() {
    console.log('Custom module ' + moduleName + ' for story ' + storyFolder + ' added.');
  });
});

