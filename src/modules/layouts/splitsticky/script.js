
// Plugins
var ScrollMagic = require('scrollmagic');
var YAML = require('yamljs');
var _ = require('lodash');
var FD = YAML.load('https://interactive-development.hsnb.io/src/fd.yml');
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');
var gsap = require('gsap');

var ww = window.innerWidth;
var wh = window.innerHeight;

function ISF_Layout_SplitSticky(el, controller) {

  this.DOM = {el: el};
  this.controller = controller;
  this.DOM.sticky = this.DOM.el.querySelector( '.' + FD.SPLITSTICKY.CLASSES.STICKY );
  this.DOM.contents = this.DOM.el.querySelector(".js--split-sticky__content");
  this.DOM.contentsInner = this.DOM.el.querySelector(".js--split-sticky__content--inner");
}

ISF_Layout_SplitSticky.prototype.init = function () {

  var self = this;
  var dur = (self.DOM.el.offsetHeight > window.innerHeight) ? (self.DOM.el.offsetHeight - window.innerHeight) : window.innerHeight/2;

  var _tl = new TimelineLite()
    .to(this.DOM.contentsInner, 1, {
      scale: 0.9,
      rotationX: '8deg'
    });
  this.scene = new ScrollMagic.Scene({
    triggerElement: self.DOM.el,
    triggerHook: 0,
    duration: dur
  })
    .setTween(_tl)
    .setPin(this.DOM.sticky)
    .addTo(this.controller);
};

module.exports = ISF_Layout_SplitSticky;

