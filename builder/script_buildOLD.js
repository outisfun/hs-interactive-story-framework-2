

// logic:
// init layout manager on build layout area
// on click
// -- open layout types -> click
// -- init layout builder
// ---- init layout options
// ---- init layout content

const yaml = require('js-yaml');
var fs = require('browserify-fs');
var resolve = require('resolve');

YAML = require('yamljs');

// parse frameworkdata as js and require it.
var FD = YAML.load('../src/fd.yml');


var test = YAML.stringify({'index':'hotspot', 'retro': ['test', 'onetwomany']});

// fs.mkdir('/temp', function() {
//   fs.writeFile('/temp/temp.yml', 'Hello world!\n', function() {
//     fs.readFile('/temp/temp.yml', 'utf-8', function(err, data) {
//       console.log(data);
//       document.querySelector('#links').href = '/temp/temp.yml';
//     });
//   });
// });

( function(window) {

  'use strict';

  var _ = require('lodash');

  function ISFLayoutManager(el) {

    this.DOM = {el: el};
    this.DOM.layoutConstructors = this.DOM.el.querySelector('.isf-builder__layouts');
    this.DOM.layoutEl = this.DOM.el.querySelector('.isf-builder__layout');

    this.layoutConstructors = [];

    // an object to store modules added to the story
    this.DOM.story = {};
    this.DOM.story.layouts = [];

    var self = this;

    // build layout buttons
    _.forOwn(FD.LAYOUTS, function(layout, key) {

      var lc = new ISFLayoutConstructor(key);

      self.layoutConstructors.push(lc);
      self.DOM.layoutConstructors.appendChild(lc.DOM.el);

      // when clicking an element,
      // it inits a new layout in a container
      lc.DOM.el.addEventListener('click', function(e) {

        var l = lc.initLayout('test_id', self.DOM.layoutEl.cloneNode(true));
        console.log(l);
        self.DOM.el.appendChild(l.DOM.el);
        //console.log(YAML.stringify(data));
      });
    });
  }

  ISFLayoutManager.prototype.add = function(layoutId, layoutType) {
    //
    var _FDLayoutData = FD.LAYOUTS[layoutType].DATA;
    var layoutData = {};
    var yml = '';

    // Iterate over available layouts and build setup elements
    _.forOwn(_FDLayoutData, function(prop, key) {
       // is type correct?
      if (typeof layoutData[key] !== _FDLayoutData[key].DATA_TYPEOF && layoutData[key] !== undefined) {
        logError('In ' + _FDLayoutType + ' ' + key + ' should be ' + _FDLayout.DATA[key].DATA_TYPEOF + ' and not ' + typeof layout.layoutData[key]);
      }
      // check values for the property
      if (_.get(_FDLayout.DATA[key], 'DATA_VALUES', undefined)) {

        // manager values differently depending on TYPEOF
        switch (_FDLayoutData[key].DATA_TYPEOF) {
          case 'string':
            if (!_.includes(_FDLayoutData[key].DATA_VALUES, layoutData[key]) || _.includes(_FDLayoutData[key].DATA_VALUES, undefined)) {
              logError(key + ' should be one of those: ' + _FDLayoutData[key].DATA_VALUES);
            }
            break;
          case 'boolean':
            break;
          case 'objectsArray':
            // check if the structure of the object matches the one in the json file
            // compare keys
            var _propertyKeys = _.keys(_FDLayoutData[key].DATA_VALUES);
            var propertyKeys = _.keys(layoutData[key][0]);
            if (_.isEqual(propertyKeys, _propertyKeys)) {

            }
            break;
          default:
            break;
        }
      }

    });

    return yml;
  };

  ISFLayoutManager.prototype.buildModuleYAML = function(moduleId, moduleType, moduleData) {

  };

  function ISFLayoutConstructor(layoutType) {

    this.layoutType = layoutType;
    this.layoutData = _.get(FD.LAYOUTS[layoutType], 'DATA', undefined);

    var markup = buildEl( layoutType, '<h6>' + layoutType + '</h6>', ['isf-layout_constructor'] );
    this.DOM = {el: markup};

    this.init();
  }

  ISFLayoutConstructor.prototype.init = function() {
    // add event listeners;
    this.DOM.el.addEventListener('click', function() {

    });
  };

  ISFLayoutConstructor.prototype.initLayout = function( layoutId, layoutContainer ) {

    // build layout markup
    this.initLayoutMarkup();
    this.revealLayoutOptions();
    var l = new ISFLayout(layoutContainer);
    return l;
  };

  ISFLayoutConstructor.prototype.initLayoutMarkup = function() {
    // build layout markup -> add later
  };

  ISFLayoutConstructor.prototype.revealLayoutOptions = function() {
    // build layout markup -> add later
  };

  function ISFLayout(el) {
    this.DOM = {el: el};
    this.DOM.el.innerHTML = '<h6>i remember you well in the chelsea hotel</h6>';
  }

  var lm = new ISFLayoutManager(document.querySelector('.isf-builder--section'));

  function buildEl(type, markup, classlist) {
    var el = document.createElement('button');
    el.innerHTML = markup;
    el.dataset.layout = type;
    _.forEach(classlist, function(clss, ind) {
      el.classList.add(clss);
    });
    return el;
  }

})(window);
