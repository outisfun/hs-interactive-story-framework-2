
var ScrollMagic = require('scrollmagic');
var gsap = require("gsap");

var createDOMEl = function(type, className, content) {
  var el = document.createElement(type);
  el.className = className || '';
  el.innerHTML = content || '';
  return el;
};

var extend = function( a, b ) {
  for( var key in b ) {
    if( b.hasOwnProperty( key ) ) {
      a[key] = b[key];
    }
  }
  return a;
};

/* BLOCK REVEALER */

function BRevealer(el, options) {
  this.DOM = {el: el};
  this.options = extend({}, this.options);
  this.isRevealed = false; // avoid revealing it on every page enter
  //overwrites them?
  extend(this.options, options);
  this.init();
}

BRevealer.prototype.options = {
  // If true, then the content will be hidden until it´s "revealed".
  isContentHidden: true
};

BRevealer.prototype.init = function() {
  this.layout();
};

BRevealer.prototype.layout = function() {
  var position = getComputedStyle(this.DOM.el).position;
  if( position !== 'fixed' && position !== 'absolute' && position !== 'relative' ) {
    this.DOM.el.style.position = 'relative';
  }
  // Content element.
  this.content = createDOMEl('div', 'block-revealer__content', this.DOM.el.innerHTML);
  if( this.options.isContentHidden) {
    this.content.style.opacity = 0;
  }
  // Revealer element (the one that animates)
  this.revealer = createDOMEl('div', 'block-revealer__element');
  this.DOM.el.classList.add('block-revealer');
  this.DOM.el.innerHTML = '';
  this.DOM.el.appendChild(this.content);
  this.DOM.el.appendChild(this.revealer);
};

BRevealer.prototype.getTransformSettings = function(direction) {
  var origin, origin_2, tX, tY;
  switch (direction) {
  case 'lr' :
    tX = 0;
    tY = 1;
    origin = '0 50%';
    origin_2 = '100% 50%';
    break;
  case 'rl' :
    tX = 0;
    tY = 1;
    origin = '100% 50%';
    origin_2 = '0 50%';
    break;
  case 'tb' :
    tX = 1;
    tY = 0;
    origin = '50% 0';
    origin_2 = '50% 100%';
    break;
  case 'bt' :
    tX = 1;
    tY = 0;
    origin = '50% 100%';
    origin_2 = '50% 0';
    break;
  default :
    tX = 0;
    tY = 1;
    origin = '0 50%';
    origin_2 = '100% 50%';
    break;
  }

  return {
    // transform value.
    tX: tX,
    tY: tY,
    // initial and halfway/final transform origin.
    origin: {initial: origin, halfway: origin_2}
  };
};

BRevealer.prototype.hide = function(revealSettings) {
  // Do nothing if currently animating.
  if( this.isAnimating ) {
    return false;
  }
  this.isAnimating = true;

  // rewrite this
  var defaults = {
      easing: Expo.easeOut,
      delay: 0,
      bgcolor: '#f0f0f0',
      direction: 'bt',
      coverArea: 0
    },
    revealSettings = revealSettings || this.options.revealSettings,
    direction = revealSettings.direction || defaults.direction,
    transformSettings = this.getTransformSettings(direction);

  this.revealer.style.WebkitTransform = this.revealer.style.transform =  transformSettings.val;
  this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin =  transformSettings.origin.initial;

  // Set the Revealer´s background color.
  this.revealer.style.backgroundColor = revealSettings.bgcolor || defaults.bgcolor;

  // Show it. By default the revealer element has opacity = 0 (CSS).
  this.revealer.style.opacity = 1;

  //expand the block
  var self = this;
  var t = transformSettings.transform;
  var d = Math.random()/2;
  TweenMax.fromTo(this.revealer, this.options.revealSettings.duration,
    {
      scaleX: transformSettings.tX,
      scaleY: transformSettings.tY
    },
    {
      scaleX: 1,
      scaleY: 1,
      transformOrigin: transformSettings.origin.initial,
      ease: Expo.easeOut,
      onComplete: function() {
        //make element visible
        self.content.style.opacity = 0;
        self.isAnimating = false;
        TweenMax.fromTo(self.revealer, self.options.revealSettings.duration,
          {
            scaleX: 1,
            scaleY: 1
          },
          {
            scaleX: transformSettings.tX,
            scaleY: transformSettings.tY,
            transformOrigin: transformSettings.origin.halfway,
            ease: Expo.easeOut
          }
        );
      }
    }
  );
};
/**
 * Reveal animation. If revealSettings is passed, then it will overwrite the options.revealSettings.
 */
BRevealer.prototype.reveal = function(revealSettings) {
  // Do nothing if currently animating.
  if( this.isAnimating ) {
    return false;
  }
  this.isAnimating = true;

  // Set the revealer element´s transform and transform origin.
  var defaults = {
      easing: Expo.easeOut,
      delay: 0,
      bgcolor: '#f0f0f0',
      direction: 'tb',
      coverArea: 0
    },
    revealSettings = revealSettings || this.options.revealSettings,
    direction = revealSettings.direction || defaults.direction,
    transformSettings = this.getTransformSettings(direction);

  this.revealer.style.WebkitTransform = this.revealer.style.transform =  transformSettings.val;
  this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin =  transformSettings.origin.initial;

  // Set the Revealer´s background color.
  this.revealer.style.backgroundColor = revealSettings.bgcolor || defaults.bgcolor;

  // Show it. By default the revealer element has opacity = 0 (CSS).
  this.revealer.style.opacity = 1;
  //expand the block
  var self = this;
  var t = transformSettings.transform;
  var d = Math.random()/2;
  TweenMax.fromTo(this.revealer, this.options.revealSettings.duration,
    {
      scaleX: transformSettings.tX,
      scaleY: transformSettings.tY
    },
    {
      scaleX: 1,
      scaleY: 1,
      transformOrigin: transformSettings.origin.initial,
      ease: Expo.easeOut,
      onComplete: function() {
        //make element visible
        self.content.style.opacity = 1;
        self.isAnimating = false;
        TweenMax.fromTo(self.revealer, self.options.revealSettings.duration,
          {
            scaleX: 1,
            scaleY: 1
          },
          {
            scaleX: transformSettings.tX,
            scaleY: transformSettings.tY,
            transformOrigin: transformSettings.origin.halfway,
            ease: Expo.easeOut
          }
        );
      }
    }
  );
};

module.exports = BRevealer;






























