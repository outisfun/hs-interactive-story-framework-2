
// Plugins
var ScrollMagic = require('scrollmagic');
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');
var gsap = require('gsap');

var YAML = require('yamljs');
var _ = require('lodash');
var FD = YAML.load('https://interactive-development.hsnb.io/src/fd.yml');

var Hammer = require('hammerjs'); // a library to manage touch events

var imagesLoaded = require('imagesloaded');

var ww = window.innerWidth;
var wh = window.innerHeight;

function ISF_Element_GalleryTwo(el, controller) {

  this.controller = controller;

  this.DOM = {};

  this.DOM.el = el;

  this.DOM.viewer = this.DOM.el.querySelector("." + FD.GALLERYTWO.CLASSES.VIEWER);
  this.DOM.viewerItems = Array.from(this.DOM.el.querySelectorAll("." + FD.GALLERYTWO.CLASSES.VIEWER_ITEM));

  this.DOM.stepsContainer = this.DOM.el.querySelector("." + FD.GALLERYTWO.CLASSES.STEPS);
  this.DOM.steps = Array.from(this.DOM.el.querySelectorAll("." + FD.GALLERYTWO.CLASSES.STEP));
  this.DOM.stepImages = Array.from(this.DOM.el.querySelectorAll(".js--gallery-two__item"));
}

ISF_Element_GalleryTwo.prototype.init = function() {
  // init main scroll magic scene
  var self = this;
  this.scrollScene = new ScrollMagic.Scene({
    triggerElement: this.DOM.el,
    triggerHook: 0,
    duration: this.DOM.el.offsetHeight - window.innerHeight
  })
    .setPin(this.DOM.viewer, { pushFollowers: false })
    .on('enter', function(e) {
      if (e.scrollDirection === 'FORWARD') {
        self.DOM.el.classList.add("is--fixed");
      }
    })
    .on('leave', function(e) {
      if (e.scrollDirection === 'REVERSE') {
        self.DOM.el.classList.remove("is--fixed");
      }
    })
    .addTo(this.controller);

  var self = this;
  _.forEach(this.DOM.steps, function(step, index) {
    var _s = new ScrollMagic.Scene({
      triggerElement: step,
      triggerHook: 0.5,
      duration: step.offsetHeight
    })
      .on('enter', function() {
        self.DOM.el.dataset.current_step = step.dataset.viewer;
      })
      .setClassToggle(self.DOM.el, "is--step-" + index)
      .addTo(self.controller);
  });

  this.setInitialValues();
  this.setImageScrollScenes();
};

ISF_Element_GalleryTwo.prototype.setInitialValues = function() {
  _.forEach(this.DOM.stepImages, function(image, index) {
    TweenLite.set(image, { opacity: 0, y: 90 });
  });
};

ISF_Element_GalleryTwo.prototype.setImageScrollScenes = function() {
  var self = this;

  _.forEach(this.DOM.steps, function(step, index) {
    var _images = Array.from(step.querySelectorAll(".js--gallery-two__item"));
    _.forEach(_images, function(image, index) {

      if (image.dataset.effect === 'parallax') {
        TweenLite.set(image, {y: window.innerHeight/5});
        var _t = new TimelineLite()
          .to(image, 1, {y: -window.innerHeight/5});

        var _p = new ScrollMagic.Scene({
          triggerElement: step,
          duration: 1.5*window.innerHeight,
          triggerHook: 'onEnter'
        })
          .on('enter', function() {
            TweenLite.to(image, 0.5, {opacity: 1, ease: Power2.easeOut });
          })
          .setTween(_t)
          .addTo(self.controller);
      } else {
        var _s = new ScrollMagic.Scene({
          triggerElement: step,
          triggerHook: 0.5
        })
          .on('enter', function() {
            TweenLite.to(image, 0.8, {opacity: 1, y: 0, ease: Power2.easeInOut });
          })
          .addTo(self.controller);
      }
    });
  });
};

var getTranslateX = function(el) {
  var style = window.getComputedStyle(el);
  var matrix = new WebKitCSSMatrix(style.webkitTransform);
  return matrix.m41;
};

var mapRange =function(num, in_min, in_max, out_min, out_max)  {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

var clamp = function(val, min, max) {
  return Math.min(Math.max(min, val), max);
};



module.exports = ISF_Element_GalleryTwo;











