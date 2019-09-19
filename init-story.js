var args = process.argv.slice(2);
var storyFolder = args[0];

var fs = require('fs');
var mkdirp = require('mkdirp');

var dataFile = fs.readFileSync('./src/helpers/data.yml');


var buildFile = function(fileName, fileFolder, fileContents){
  fs.writeFile('./stories/' + storyFolder + '/' + fileName, fileContents, function() {
      console.log(storyFolder + ': ' + fileName + ' was built!');
  });
};

// build main folder
mkdirp('./stories/' + storyFolder, function (err) {

  // add yml file
  if (!fs.existsSync('./stories/' + storyFolder +'/data.yml')) {
    // fs.writeFile('./stories/' + storyFolder +'/data.yml', '', function() {
    //   console.log('All good. Now add content to the data.yml file and build story!');
    // });
    buildFile('data.yml', 'build', String(dataFile).replace("EXAMPLE", storyFolder));
    console.log('All good. Now add content to the data.yml file and save story!');
  }
});

// build subfolders
mkdirp('./stories/' + storyFolder +'/build', function (err) {
  if (err) console.error(err);
});

mkdirp('./stories/' + storyFolder +'/dist', function (err) {
  if (err) console.error(err);
});
