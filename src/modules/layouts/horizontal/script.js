
// Plugins
var imagesLoaded = require('imagesLoaded');
var ScrollMagic = require("scrollmagic");
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');
var gsap = require("gsap");
var FRAMEWORKDATA = require('src/frameworkdata.js');

var ww = window.innerWidth;
var wh = window.innerHeight;

function ISF_Layout_Horizontal(el, controller) {

  this.DOM = {el: el};
  this.controller = controller;
  this.DOM.bckgr = this.DOM.el.querySelector(FRAMEWORKDATA.MODULES.layout_horizontal.BACKGROUND );
}

ISF_Layout_Horizontal.prototype.init = function () {

  var self = this;
  console.log('init horizontal layout');
  // var dur = (self.DOM.el.offsetHeight > window.innerHeight) ? (self.DOM.el.offsetHeight - window.innerHeight) : window.innerHeight;

  // this.scene = new ScrollMagic.Scene({
  //   triggerElement: self.DOM.el,
  //   triggerHook: 0,
  //   duration: dur
  // })
  //   .setPin(this.DOM.sticky)
  //   .addTo(this.controller);
};

module.exports = ISF_Layout_Horizontal;

