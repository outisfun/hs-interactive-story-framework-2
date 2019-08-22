
// use as node build-story --story=YYYY-MM-storyName

var args = process.argv.slice(2);
var storyFolder = args[0];

var fs = require('fs');
var mkdirp = require('mkdirp');
var Handlebars = require('handlebars');

var yaml = require('js-yaml');
var YAML = require('yamljs');
var _ = require('lodash');

var FD = YAML.load('./src/fd.yml');
var TEMPLATES = require('./src/templates.js'); // reconsider namespace?
var storydata = YAML.load('./stories/' + storyFolder + '/data.yml' );

// baswe templates to insert custom content
var htmlFile = fs.readFileSync('./src/helpers/index.html');
var jsFile = fs.readFileSync('./src/helpers/script.js');
var scssFile = fs.readFileSync('./src/helpers/style.scss');

function ISF_StoryBuilder(){

  // store scss imports & require modules
  this.constructors = {};
  this.styles = {};
  this.buildFiles();
}

ISF_StoryBuilder.prototype.buildFiles = function(){

  if (storydata !== undefined) {

    var self = this;

    // iterate through pages
    for (var page in storydata) {

      var pageHtml = '';
      var pageName = page;
      var pageSections = storydata[page];

      // iterate through sections, build layout and add content els
      for (var layout in pageSections) {

        var layoutId = layout;
        var layoutObj = pageSections[layoutId];

        if (!isCustom(layoutId)) {
          // build layout markup
          var layoutHtml = self.buildModule(layoutId, layoutObj).moduleHTML; // returns obj: { moduleHTML: "..." }
          var layoutContentObj = layoutObj.layoutContent;
          var layoutContentHtml = '';

          // build layout content
          for (var elem in layoutContentObj) {

            var elemId = elem;
            var elemObj = layoutContentObj[elem];

            if (!isCustom(elemObj)) {
              var element = self.buildModule( elemId, elemObj );
              layoutContentHtml += element.moduleHTML;
            } else {
              layoutContentHtml += this.buildCustomModule(elemObj.customModuleId, elemObj).moduleHtml;
            }
          }

          layoutHtml = layoutHtml.replace("<!-- content -->", layoutContentHtml);
          pageHtml +=layoutHtml;

        } else {
          pageHtml += this.buildCustomModule(layoutObj.customModuleId, layoutObj).moduleHtml;
        }
      }

      this.buildFile(page + '.html', 'dist', String(htmlFile).replace("<!-- story -->", pageHtml));
    }

    /* Build SCSS & JS files */
    var js = '';
    for (var cons in this.constructors) {
      js += this.constructors[cons] + "\r\n"; // add line break
    }

    var scss = '';
    for (var styl in this.styles) {
      scss += this.styles[styl] + "\r\n"; // add line break
    }

    this.buildFile('scripts.js', 'build', String(jsFile).replace("/* require modules */", js));
    this.buildFile('styles.scss', 'build', String(scssFile).replace("/* import styles */", scss));

    // build custom files (only if they don't exist, to avoid rewriting)
    if (!fs.existsSync('./stories/' + storyFolder +'/build/custom.js')) {
      this.buildFile('custom.js', 'build', '');
    }

    if (!fs.existsSync('./stories/' + storyFolder +'/build/custom.scss')) {
      this.buildFile('custom.scss', 'build', '');
    }
  }

};

ISF_StoryBuilder.prototype.buildFile = function(fileName, fileFolder, fileContents){
  fs.writeFile('./stories/' + storyFolder + '/' + fileFolder + '/' + fileName, fileContents, function() {
      console.log(storyFolder + ': ' + fileName + ' was built!');
  });
};

ISF_StoryBuilder.prototype.buildCodeModule = function(targetObj) {
  // build markup
  return TEMPLATES.code({"code" : JSON.stringify(targetObj, null, 4) });
};

ISF_StoryBuilder.prototype.buildCustomModule = function(moduleId, moduleObj) {

  var oCustom = {};

  // build markup
  if (TEMPLATES[moduleId]) {
    // code els
    if (moduleId.includes('code')) {
      var targetObj = { 'codetext': moduleObj };
    } else {
      oCustom.moduleHtml = TEMPLATES[moduleId]( moduleObj );
    }
  } else {
    console.log('Template for ' + moduleId + ' does not exist.' );
    return false;
  }

  // import custom styles for module (if they exist)
  if (fs.existsSync('./stories/' + storyFolder + '/' + moduleId + '/style.scss')) {
    this.styles[moduleId] = '@import "' + storyFolder + '/' + moduleId + '/style.scss";';
  }
  return oCustom;

};

ISF_StoryBuilder.prototype.buildModule = function(moduleId, moduleObj){

  var o = {}; // store strings

  var moduleType = moduleObj.layoutType || moduleObj.elementType;
  var moduleData = moduleObj.layoutData || moduleObj.elementData;

  if (moduleData) {
     moduleData.modId = moduleId;
  }

  // build js
  if (!this.constructors[moduleType]) {
    var requireConstructor = this.requireModuleConstructor( moduleType );
    if( requireConstructor !== undefined ) {
      this.constructors[moduleType] = requireConstructor;
    }
  }

  // build sass
  if (!this.styles[moduleType]) {
    var importStyle = this.importModuleStyle( moduleType );
    if( importStyle !== undefined ) {
      this.styles[moduleType] = importStyle;
    }
  }

  o.moduleHTML = this.buildModuleHTML(moduleType, moduleData);

  return o;
};

ISF_StoryBuilder.prototype.buildModuleHTML = function(moduleType, moduleData){
  // compile module markup
  if (TEMPLATES[ _.lowerCase(moduleType) ]) {
    return TEMPLATES[_.lowerCase(moduleType)](moduleData);
  } else {
    console.log('Template for ' + moduleType + ' does not exist.' );
    return false;
  }
};

ISF_StoryBuilder.prototype.importModuleStyle = function(moduleType) {
  var importString = '@import "' + _.lowerCase(moduleType) + '/style.scss";';
  return importString;
};

ISF_StoryBuilder.prototype.requireModuleConstructor = function(moduleType){

  if (!this.constructors.hasOwnProperty(moduleType)) { // make sure it's not already added
    if (FD[ _.upperCase(moduleType) ] !== undefined) {
      // check if it has a constructor - some modules don't.
      if (FD[ _.upperCase(moduleType) ].CONSTRUCTOR !== undefined) {
        var requireModule = "var " + FD[ _.upperCase(moduleType) ].CONSTRUCTOR + " = require('" + _.lowerCase(moduleType) + "/script.js'); ";
        var addToObject = 'constructors["' + _.lowerCase(moduleType) + '"] = ' + FD[ _.upperCase(moduleType) ].CONSTRUCTOR + '; ';
        this.constructors[moduleType] = requireModule + addToObject;
        return this.constructors[moduleType];
      }
    } else {
      console.log( moduleType + ' is not a valid module.');
      return false;
    }
  }
};

function isCustom(obj) {
  return (obj.customModuleId !== undefined);
}

var story = new ISF_StoryBuilder();
