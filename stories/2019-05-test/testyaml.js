yaml = require('js-yaml');
fs   = require('fs');

// Get document, or throw exception on error
try {
  var doc = yaml.safeLoad(fs.readFileSync(__dirname + '/data.yml', 'utf8'));
  console.log(doc.index.ellesse_intro.layoutContent.ellesse_intro__text.elementData.paragraph);
} catch (e) {
  console.log(e);
}
