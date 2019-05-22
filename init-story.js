var args = process.argv.slice(2);
var storyFolder = args[0];

var fs = require('fs');
var mkdirp = require('mkdirp');

// build main folder
mkdirp('./stories/' + storyFolder, function (err) {
  // add json file
  if (!fs.existsSync('./stories/' + storyFolder +'/data.yml')) {
    fs.writeFile('./stories/' + storyFolder +'/data.yml', '', function() {
      console.log('All good. Now add content to the data.yml file and build story!');
    });
  }
});

// build subfolders
mkdirp('./stories/' + storyFolder +'/build', function (err) {
  if (err) console.error(err);
});

mkdirp('./stories/' + storyFolder +'/dist', function (err) {
  if (err) console.error(err);
});
