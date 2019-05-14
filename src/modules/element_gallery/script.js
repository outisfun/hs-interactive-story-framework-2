
// Plugins
var ScrollMagic = require('scrollmagic');
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');
var gsap = require('gsap');
require('browsernizr/test/touchevents');
var Modernizr = require('browsernizr'); // make sure to do this _after_ importing the tests
var Masonry = require('masonry-layout');

var getRandomInt = require('src/js/helpers/getrandomint.js');

var FRAMEWORKDATA = require('src/frameworkdata.js');

var ww = window.innerWidth;
var wh = window.innerHeight;

function ISF_Element_Gallery(el, controller) {

  this.controller = controller;

  this.DOM = {};
  this.DOM.el = document.querySelector(FRAMEWORKDATA.MODULES.element_gallery.CLASSES.EL);
  this.DOM.inner = document.querySelector(FRAMEWORKDATA.MODULES.element_gallery.CLASSES.INNER);
  this.DOM.items = Array.from( this.DOM.el.querySelectorAll(FRAMEWORKDATA.MODULES.element_gallery.CLASSES.ITEM) );

  this.options = {};
  this.options.layout = this.DOM.el.dataset.layout;
  this.options.preview = this.DOM.el.dataset.preview || false;

  console.log(this);
}

ISF_Element_Gallery.prototype.init = function() {

  this.buildLayout();
  if (this.options.preview) {
    this.buildPreview();
  }
};

ISF_Element_Gallery.prototype.buildLayout = function() {

  switch (this.options.layout) {
    case 'masonry':
      this.msnry = new Masonry( this.DOM.inner, {
        itemSelector: '.js--gallery__item'
      });
      break;
    case 'horizontal':
      var contentRect = this.DOM.inner.getBoundingClientRect();
      var move = contentRect.width - ww;
      var wipeOut = new TimelineMax()
          .to(this.DOM.inner, 4, {x: -move});

      this.scene = new ScrollMagic.Scene({
          triggerElement: this.DOM.el,
          triggerHook: 0,
          duration: contentRect.width - 2*contentRect.left
      })
          .setPin(this.DOM.el)
          .addTo(this.controller);
      break;
    default:
      break;
  }
};

ISF_Element_Gallery.prototype.buildPreview = function() {

  var self = this;

  // build preview el
  this.preview = {};
  this.preview.el = document.createElement('div');
  this.preview.el.classList.add("isf-el_gallery__preview");
  this.preview.el.classList.add("js--gallery__preview");

  this.preview.image = document.createElement('picture');
  this.preview.el.appendChild(this.preview.image);

  this.preview.nav = {};

  var prev = document.createElement('button');
  prev.classList.add('js--preview__nav');
  prev.classList.add('js--preview__nav--prev');
  this.preview.nav.prev = prev;

  var next = document.createElement('button');
  next.classList.add('js--preview__nav');
  next.classList.add('js--preview__nav--next');
  this.preview.nav.next = next;

  this.preview.el.appendChild(this.preview.nav.prev);
  this.preview.el.appendChild(this.preview.nav.next);

  this.preview.current = 0;

  this.DOM.el.appendChild(this.preview.el);

  this.preview.image.addEventListener('click', function() {
    console.log('preview click');
    self.closePreview();
  });

  this.preview.nav.prev.addEventListener('click', function() {
    if (self.updatePreviewIndex( self.preview.current - 1 )) {
      self.updatePreviewContent(self.DOM.items[ self.preview.current ]);
    }
  });

  this.preview.nav.next.addEventListener('click', function() {
    if (self.updatePreviewIndex( self.preview.current + 1 )) {
      self.updatePreviewContent(self.DOM.items[ self.preview.current ]);
    }
  });

  // add click event listeners
  this.DOM.items.forEach(function(item, ind) {

    item.addEventListener('click', function() {
      // document this.
      if (self.customFunctionOnTriggerClick !== undefined) {
        self.customFunctionOnTriggerClick();
      } else {
        self.preview.current = ind;
        self.openPreview( item );
      }
    });
  });

};

ISF_Element_Gallery.prototype.openPreview = function(trigger) {

  var self = this;
  this.updatePreviewContent(trigger);
  setTimeout(function(){
    self.preview.el.classList.add("is--open");
  }, 600);
};

ISF_Element_Gallery.prototype.updatePreviewIndex = function(ind) {
  if ((ind >= 0) && (ind <= this.DOM.items.length -1)) {
    this.preview.current = ind;
    if (ind === 0) {
      this.preview.nav.prev.classList.add("is--disabled");
    } else {
      this.preview.nav.prev.classList.remove("is--disabled");
    }
    if (ind === this.DOM.items.length - 1) {
      this.preview.nav.next.classList.add("is--disabled");
    } else {
      this.preview.nav.next.classList.remove("is--disabled");
    }
    return true;
  } else {
    return false;
  }
};

ISF_Element_Gallery.prototype.updatePreviewContent = function(trigger) {
  // fade content out
  var self = this;

  this.preview.el.classList.add('is--transitioning');
  setTimeout(function(){
    self.preview.image.classList.add('is--hidden');
    self.preview.image.innerHTML = trigger.innerHTML;
  }, 200);
  setTimeout(function(){
    self.preview.image.classList.remove('is--hidden');
    self.preview.el.classList.remove('is--transitioning');
  }, 400);
};

ISF_Element_Gallery.prototype.closePreview = function() {
  this.preview.el.classList.remove("is--open");
};

module.exports = ISF_Element_Gallery;











