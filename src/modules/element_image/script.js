

var ScrollMagic = require('scrollmagic');
var FRAMEWORKDATA = require('src/frameworkdata.js');

function ISF_El_Image(el, controller) {

  this.DOM = {el: el};
  //this.DOM.img = el.querySelector(CLASSES.IMAGE.IMG);

  this.controller = controller;

  this.dataset = (this.DOM.el.dataset);
  this.effects = {};

  // Effects particular to the element itself, data attributes like isf-el_tilt3d
  // var self = this;
  // for ( var attr in this.dataset ) {
  // 	if ( attr.indexOf("isf_el") !== -1 ){
  // 		//check for the string after the _ following isf-el
  // 		//the format of the data attribute is data-isf_el_EFFECT
  // 		//where the _el substring makes it an effect unique to the element
  // 		//the substring it extracts is the name of the effect, for exameple tilt3d
  // 		//the attr value is the trigger
  // 		var substr = attr.substring(attr.indexOf('isf_el') + ('isf_el').length + 1);
  // 		self.effects[substr] = self.dataset[attr];
  // 	}
  // }
}

ISF_El_Image.prototype.init = function(){
  //console.log('init image');
};

module.exports = ISF_El_Image;
