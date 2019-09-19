
var _ = require('lodash');
var YAML = require('yamljs');
var FD = YAML.load('https://interactive-development.hsnb.io/src/fd.yml');

var ScrollMagic = require('scrollmagic');
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');
var gsap = require('gsap');
require('browsernizr/test/touchevents');
var Modernizr = require('browsernizr'); // make sure to do this _after_ importing the tests

var bodyScrollLock = require('body-scroll-lock');
var disableBodyScroll = bodyScrollLock.disableBodyScroll;
var enableBodyScroll = bodyScrollLock.enableBodyScroll;

var Hammer = require('hammerjs'); // a library to manage touch events
var imagesLoaded = require('imagesloaded');

var ww = window.innerWidth;
var wh = window.innerHeight;

var galleryHorizontal = require('gllry/gallery-horizontal.js');

var extend = function( a, b ) {
  for( var key in b ) {
    a[key] = b[key];
  }
  return a;
};

function ISF_Element_Gllry(el, controller) {

  this.controller = controller;
  this.DOM = {};

  this.DOM.el = el;
  this.DOM.inner = this.DOM.el.querySelector(".js--gllry--inner");
  this.DOM.itemsWrap = this.DOM.el.querySelector(".js--gllry__items");
  this.DOM.items = Array.from( this.DOM.el.querySelectorAll(".js--gllry__item") );

  this.opts = {};
  this.opts.layout = this.DOM.el.dataset.layout;

  this.useTouch = (Modernizr.touchevents) ? true : false;
}

ISF_Element_Gllry.prototype.init = function() {

  switch (this.opts.layout) {
  case 'horizontal':
    extend(this, galleryHorizontal);
    this._init();
  }

};

// ISF_Element_Gllry.prototype.buildLayout = function() {

//   switch (this.options.layout) {
// };

// var getTranslateX = function(el) {
//   var style = window.getComputedStyle(el);
//   var matrix = new WebKitCSSMatrix(style.webkitTransform);
//   return matrix.m41;
// };

// var mapRange =function(num, in_min, in_max, out_min, out_max)  {
//   return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
// };

// var clamp = function(val, min, max) {
//   return Math.min(Math.max(min, val), max);
// };

module.exports = ISF_Element_Gllry;











