

var ScrollMagic = require('scrollmagic');
var YAML = require('yamljs');
var _ = require('lodash');
var FD = YAML.load('https://interactive-development.hsnb.io/src/fd.yml');

function ISF_El_Image_Group(el, controller) {

  this.DOM = {el: el};
  //this.DOM.img = el.querySelector(CLASSES.IMAGE.IMG);

  this.controller = controller;

  this.dataset = (this.DOM.el.dataset);
  this.effects = {};

}

ISF_El_Image_Group.prototype.init = function(){
  // console.log('init image group');
};

module.exports = ISF_El_Image_Group;
