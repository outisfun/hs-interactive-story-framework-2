
// Plugins
var imagesLoaded = require('imagesLoaded');
var ScrollMagic = require("scrollmagic");
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');
var gsap = require("gsap");
var FRAMEWORKDATA = require('src/frameworkdata.js');

var ww = window.innerWidth;
var wh = window.innerHeight;

function ISF_Layout_SplitSticky(el, controller) {

  this.DOM = {el: el};
  this.controller = controller;
  this.DOM.sticky = document.querySelector( FRAMEWORKDATA.MODULES.layout_split_sticky.CLASSES.STICKY );
}

ISF_Layout_SplitSticky.prototype.init = function () {

  var self = this;
  var dur = (self.DOM.el.offsetHeight > window.innerHeight) ? (self.DOM.el.offsetHeight - window.innerHeight) : window.innerHeight;

  this.scene = new ScrollMagic.Scene({
    triggerElement: self.DOM.el,
    triggerHook: 0,
    duration: dur
  })
    .setPin(this.DOM.sticky)
    .addTo(this.controller);
};

module.exports = ISF_Layout_SplitSticky;

