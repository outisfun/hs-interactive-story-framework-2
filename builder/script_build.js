

// logic:
// init layout manager on build layout area
// on click
// -- open layout types -> click
// -- init layout builder
// ---- init layout options
// ---- init layout content

const yaml = require('js-yaml');
var fs = require('fs');
var resolve = require('resolve');


function processFile() {
    console.log(content);
}

( function(window) {

  'use strict';

  var _ = require('lodash');
  var FRAMEWORKDATA = require('frameworkdata.js');

  function ISFLayoutManager(el) {

    this.DOM = {el: el};
    this.DOM.layoutsContainer = this.DOM.el.querySelector('.isf-builder__layouts');
    this.DOM.layouts = [];

    this.layouts = _.pickBy(FRAMEWORKDATA.MODULES, function(value, key) {
      return _.includes(key, 'layout_');
    });

    var self = this;

    _.forOwn(this.layouts, function(value, key) {
      var l = buildEl('isf-lm__layout', key.replace('layout_', ''), '<h6>' + key.replace('layout_', '') + '</h6>');
      //console.log(layer);
      console.log(value);
      self.DOM.layouts.push(l);
      self.DOM.layoutsContainer.appendChild(l);
    });

  }

  var lm = new ISFLayoutManager(document.querySelector('.isf-builder--section'));

  function buildEl(typeClass, elId, markup) {
    var el = document.createElement('button');
    el.innerHTML = markup;
    el.classList.add(typeClass);
    el.dataset.layout = elId;
    return el;
  }

})(window);
