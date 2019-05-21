var yaml = require('js-yaml');
var AML = require('yamljs');
var _ = require('lodash');

// parse frameworkdata as js and require it.
var FD = YAML.load('../src/fd.yml');

var TEMPLATES = require('../src/templates.js'); // reconsider namespace?

var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;

( function(window) {

  'use strict';

  function ISFLayoutManager(el) {

    this.DOM = {el: el};
    this.DOM.dashboard = this.DOM.el.querySelector('.isf-builder__dashboard');
    this.DOM.layoutConstructors = this.DOM.el.querySelector('.isf-builder__dashboard__layout-constructors');
    this.DOM.preview = this.DOM.el.querySelector('.isf-builder__preview');

    // an object to store modules added to the story
    this.DOM.story = {};
    this.DOM.story.layouts = [];

    this.layoutConstructors = [];
    this.layouts = [];

    var self = this;

    // Iterate over Framework layouts and add triggers for each type
    _.forOwn(FD.LAYOUTS, function(layout, key) {

      var lc = new ISFLayoutConstructor(key);

      self.layoutConstructors.push(lc);
      self.DOM.layoutConstructors.appendChild(lc.DOM.el);

      // manage layout constructor events through layout manager
      lc.DOM.el.addEventListener('click', function(e) {
        var l = lc.initLayout('test_id');
        self.DOM.preview.appendChild(l.DOM.el);
        self.DOM.story.layouts.push(l);
      });
    });
  }

  function ISFLayoutConstructor(layoutType) {

    var markup = buildEl( layoutType, '<h6>' + layoutType + '</h6>', ['isf-layout_constructor'] );
    this.DOM = {el: markup};

    this.layoutType = layoutType;

    var _fdLayoutData = _.get(FD.LAYOUTS[layoutType], 'DATA', undefined);
    this._fdLayoutData = _fdLayoutData;

    var self = this;

    // add sample content based on property types
    // _.forOwn(FD.LAYOUTS[layoutType].DATA, function(property, key) {

    //   // assign sample content
    //   switch (property.DATA_TYPEOF) {
    //     case 'string':
    //       self.layoutData[key] = 'The sorrows of pain and regret are left to the dead and the dying.';
    //       break;
    //     case 'imgsrc':
    //       self.layoutData[key] = 'http://placehold.it/1600x800';
    //       break;
    //     case 'boolean':
    //       self.layoutData[key] = false;
    //       break;
    //     default:
    //       break;
    //   }
    // });
  }

  ISFLayoutConstructor.prototype.initLayout = function(layoutId) {
    //this.revealOptions();
    return new ISFLayout(this.layoutType, this._fdLayoutData);
  };

  ISFLayoutConstructor.revealOptions = function() {

  };

  function ISFLayout(layoutType, _fdData) {

    this.DOM = {};
    this.DOM.el = document.createElement('div');

    this.layoutData = {};
    this.layoutControls = {};
    var self = this;
    // add sample content based on property types
    _.forOwn( _fdData, function(property, key) {

      var layoutControlsObj = {};
      // assign sample content
      switch (property.DATA_TYPEOF) {
        case 'string':
          self.layoutData[key] = 'The sorrows of pain and regret are left to the dead and the dying.';
          break;
        case 'imgsrc':
          self.layoutData[key] = 'http://placehold.it/1600x800';
          break;
        case 'boolean':
          self.layoutData[key] = false;
          break;
        default:
          break;
      }
      // build controls
      self.layoutControls[key] = self.buildControls(property.DATA_TYPEOF);
    });

    var layoutMarkup = TEMPLATES['layout_' + _.lowerCase(layoutType)]( this.layoutData );
    this.DOM.el.innerHTML = layoutMarkup;
    //this.id = id;

    // init options
    //this.layoutData = layoutData;
    // this.layoutControls = {};

    // iterate over props and construct options
    var layoutControlsEl = document.createElement('div');
    // generate controls for each property
    _.forOwn(this.layoutData, function(property, key) {
      self.layoutControls[key] = document.createElement('button');
      layoutControlsEl.appendChild( self.layoutControls[key] );
    });
    this.DOM.el.appendChild(layoutControlsEl);
  }

  ISFLayout.prototype.buildControls = function( controlId, controlOptions ){
    var reg_form = forms.create({
        username: fields.string({ required: true }),
        password: fields.password({ required: validators.required('You definitely want a password') }),
        confirm:  fields.password({
            required: validators.required('don\'t you know your own password?'),
            validators: [validators.matchField('password')]
        }),
        email: fields.email()
    });
    console.log( reg_form.toHTML() );
  };

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
