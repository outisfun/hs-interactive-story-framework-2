
var args = process.argv.slice(2);
var storyFolder = args[0];

var fs = require('fs');
var mkdirp = require('mkdirp');
var Handlebars = require('handlebars');

var TEMPLATES = require('./src/templates.js'); // reconsider namespace?
var FRAMEWORKDATA = require('./src/frameworkdata.js');

// basic templates to insert custom content
var htmlFile = fs.readFileSync('./src/helpers/index.html');
var jsFile = fs.readFileSync('./src/helpers/script.js');
var scssFile = fs.readFileSync('./src/helpers/style.scss');

// check if data file exists and make an empty one if not.]
var rawdata = fs.readFileSync('./stories/' + storyFolder +'/data.json');

var storydata = JSON.parse(rawdata);

function ISF_StoryBuilder(){

  // store scss imports & require modules
  this.constructors = {};
  this.styles = {};
  //this.buildFolders();
  this.buildFiles();
}

ISF_StoryBuilder.prototype.buildFiles = function(){

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

          if (isCustom(elemId)) {
            if (elemId.includes('code_')) {
              // again. move this somewhere else, as it's only relevant for the preview
              var tId = layoutContentObj[elemId];
              var tObj = layoutContentObj[tId];
              layoutContentHtml += this.buildCodeModule(tObj); // returns markup
            }
          } else {
            //
            var element = self.buildModule( elemId, elemObj );
            layoutContentHtml += element.moduleHTML;
          }
        }

        layoutHtml = layoutHtml.replace("<!-- content -->", layoutContentHtml);
        pageHtml +=layoutHtml;
      } else {
        // in case it's a code block. relevant only for the preview, so move somewhere else
        if (layoutId.includes('code_')) {
          var targetId = layoutObj;
          var targetObj = pageSections[targetId];
          pageHtml += TEMPLATES.custom_code({"codetext" : JSON.stringify(targetObj, null, 4) });
        } else {
          pageHtml += this.buildCustomModule(layoutId, layoutObj); // returns html markup
        }
      }
    }

    var htmlString = String(htmlFile).replace("<!-- story -->", pageHtml);
    fs.writeFile("./stories/" + storyFolder + "/dist/" + pageName + ".html", htmlString, function() {
      console.log(pageName + ".html was built!");
    });
  }

  var js = '';
  for (var cons in this.constructors) {
    js += this.constructors[cons] + "\r\n"; // add line break
  }

  var jsString = String(jsFile).replace("/* require modules */", js);
  fs.writeFile("./stories/" + storyFolder + "/build/scripts.js", jsString, function() {
    console.log("scripts.js was built!");
  });

  var scss = '';
  for (var styl in this.styles) {
    scss += this.styles[styl] + "\r\n"; // add line break
  }
  var scssString = String(scssFile).replace("/* import styles */", scss);
  fs.writeFile("./stories/" + storyFolder + "/build/styles.scss", scssString, function() {
    console.log("styles.scss was built!");
  });
};



ISF_StoryBuilder.prototype.buildCodeModule = function(targetObj) {
  // build markup
  return TEMPLATES.element_code({"code" : JSON.stringify(targetObj, null, 4) });
};

ISF_StoryBuilder.prototype.buildCustomModule = function(moduleId, moduleObj) {
  // build markup
  if (TEMPLATES[moduleId]) {
    // code els
    if (moduleId.includes('code')) {
      var targetObj = { 'codetext': moduleObj };
      //return TEMPLATES.element_code({"code" : JSON.stringify(targetObj, null, 4) });
    } else {
      var markup = TEMPLATES[moduleId]( moduleObj );
      return markup;
    }
  } else {
    console.log('Template for ' + moduleId + ' does not exist!' );
    return false;
  }

  this.styles[moduleId] = '@import "' + moduleId + '/style.scss";';
};

ISF_StoryBuilder.prototype.buildModule = function(moduleId, moduleObj){

  var o = {}; // store strings

  var moduleClass = (moduleObj.hasOwnProperty('layoutType')) ? 'layout' : 'element';
  var moduleType = (moduleClass === 'layout') ? moduleObj.layoutType : moduleObj.elementType;
  var moduleData = (moduleClass === 'layout') ? moduleObj.layoutData : moduleObj.elementData;
  var moduleSlug = moduleClass + '_' + moduleType;

  if (moduleData) {
     moduleData.modId = moduleId;
  }

  // build js
  if (!this.constructors[moduleSlug]) {
    var requireConstructor = this.requireModuleConstructor( moduleSlug );
    if( requireConstructor !== undefined ) {
      this.constructors[moduleSlug] = requireConstructor;
    }
  }

  // build sass
  if (!this.styles[moduleSlug]) {
    var importStyle = this.importModuleStyle( moduleSlug );
    if( importStyle !== undefined ) {
      this.styles[moduleSlug] = importStyle;
    }
  }

  o.moduleHTML = this.buildModuleHTML(moduleSlug, moduleData);

  return o;
};

ISF_StoryBuilder.prototype.buildModuleHTML = function(moduleSlug, moduleData){
  // build markup
  if ( TEMPLATES[moduleSlug] ) {
    var markup = TEMPLATES[moduleSlug](moduleData);
    return markup;
  } else {
    console.log('Template for ' + moduleSlug + ' does not exist.' );
    return false;
  }
};

ISF_StoryBuilder.prototype.importModuleStyle = function(moduleSlug) {
  var importString = '@import "' + moduleSlug + '/style.scss";';
  return importString;
};

ISF_StoryBuilder.prototype.requireModuleConstructor = function(moduleSlug){
  if (!this.constructors.hasOwnProperty(moduleSlug)) { // make sure it's not already added
    if (FRAMEWORKDATA.MODULES[moduleSlug] !== undefined) {
      // check if it has a constructor - some modules don't.
      if (FRAMEWORKDATA.MODULES[moduleSlug].CONSTRUCTOR !== undefined) {
        var requireModule = "var " + FRAMEWORKDATA.MODULES[moduleSlug].CONSTRUCTOR + " = require('modules/" + moduleSlug + "/script.js'); ";
        var addToObject = 'constructors["' + moduleSlug + '"] = ' + FRAMEWORKDATA.MODULES[moduleSlug].CONSTRUCTOR + '; ';
        this.constructors[moduleSlug] = requireModule + addToObject;
        return this.constructors[moduleSlug];
      }
    } else {
      console.log( moduleSlug + ' is not a valid module.');
      return false;
    }
  }
};

function isCustom(el) {
  return (el.includes('custom_'));
}

var story = new ISF_StoryBuilder();
