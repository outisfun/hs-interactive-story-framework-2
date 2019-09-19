
// Plugins
var ScrollMagic = require('scrollmagic');
var YAML = require('yamljs');
var _ = require('lodash');
var FD = YAML.load('https://interactive-development.hsnb.io/src/fd.yml');
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');
var gsap = require('gsap');

var ww = window.innerWidth;
var wh = window.innerHeight;

function ISF_Layout_Floater(el, controller) {

  this.DOM = {el: el};
  this.controller = controller;
  this.DOM.triggers = Array.from(this.DOM.el.querySelectorAll(".floater-trigger"));
  this.DOM.scenesContainer = this.DOM.el.querySelector(".js--floater__scenes");
  this.DOM.scenes = Array.from(this.DOM.el.querySelectorAll(".js--floater__scene"));
  this.DOM.sceneItems = Array.from(this.DOM.el.querySelectorAll(".js--floater__scene__item"));
  this.sceneTimelines = [];
  this.scenes = [];
}

ISF_Layout_Floater.prototype.init = function () {

  var self = this;

  _.forEach(this.DOM.sceneItems, function(item, index) {
    var _h = item.dataset.horizontal_pos;
    TweenLite.set(item, { y: '50%', x: '-50%', top: '100%', left: _h + '%', scale: 0.8, rotationX: '-20deg', opacity: 0 });
  });

  _.forEach(this.DOM.scenes, function(scene, index) {

    TweenLite.set(scene, {
      perspective: '1000px',
      transformStyle: 'preserve-3d'
    });

    var _items = scene.querySelectorAll(".js--floater__scene__item");
    var _tl = new TimelineLite();

    _.forEach(_items, function(item, index) {
      var _h = item.dataset.horizontal_pos;
      _tl.fromTo(item, 2,
        { y: '50%', x: '-50%', top: '100%', left: _h + '%', scale: 0.9, rotationX: '-20deg', opacity: 0 },
        {top: '50%', y: '-50%', scale: 1, opacity: 1, rotationX: '0deg', ease: Power2.easeOut}, 0);
      _tl.to(item, 1,
        {top: 0, y: '-50%', scale: 0.9, opacity: 0, rotationX: '20deg', ease: Power2.easeIn}, "+=1");
    });

    self.sceneTimelines.push(_tl);
  });

  _.forEach(this.DOM.triggers, function(trigger, index) {
    var _s = new ScrollMagic.Scene({
      triggerElement: trigger,
      duration: window.innerHeight*1.5,
      triggerHook: 'onEnter'
    })
      .setTween(self.sceneTimelines[index])
      .addTo(self.controller);

    self.scenes.push(_s);
  });

  this.scrollScene = new ScrollMagic.Scene({
    triggerElement: this.DOM.el,
    triggerHook: 0,
    duration: this.DOM.el.offsetHeight - window.innerHeight
  })
    .setPin(this.DOM.scenesContainer, {pushFollowers: false})
    .setClassToggle(this.DOM.el, "is--fixed")
    .addTo(this.controller);
};

module.exports = ISF_Layout_Floater;

