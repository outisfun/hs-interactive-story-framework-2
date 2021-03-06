
// Plugins
var ScrollMagic = require('scrollmagic');
var YAML = require('yamljs');
var _ = require('lodash');
var FD = YAML.load('https://interactive-development.hsnb.io/src/fd.yml');

var ww = window.innerWidth;
var wh = window.innerHeight;

function ISF_Layout_Chapter(el, controller) {

  this.controller = controller;
  this.DOM = { el : el };
  this.DOM.header = this.DOM.el.querySelector('.' + FD.CHAPTER.CLASSES.HEADER);
  this.DOM.contents = this.DOM.el.querySelector('.' + FD.CHAPTER.CLASSES.CONTENT);
  this.chapterContentGroupScenes = [];
}

ISF_Layout_Chapter.prototype.init = function () {
  this.fixHeader();
};

ISF_Layout_Chapter.prototype.fixHeader = function () {

  var self = this;

  this.chapterHeaderScene = new ScrollMagic.Scene({
    triggerElement: this.DOM.header,
    triggerHook: 0,
    duration: this.DOM.el.offsetHeight - wh,
  })
    .setClassToggle(this.DOM.el, "is--fixed")
    .on('end', function() {
      self.DOM.el.classList.toggle("is--bottom");
    })
    .addTo(this.controller);
};

module.exports = ISF_Layout_Chapter;
