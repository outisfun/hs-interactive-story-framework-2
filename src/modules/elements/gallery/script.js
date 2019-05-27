
// Plugins
var ScrollMagic = require('scrollmagic');
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');
var gsap = require('gsap');
require('browsernizr/test/touchevents');
var Modernizr = require('browsernizr'); // make sure to do this _after_ importing the tests
var Masonry = require('masonry-layout');

var YAML = require('yamljs');
var _ = require('lodash');
var FD = YAML.load('https://interactive-development.hsnb.io/src/fd.yml');

var Hammer = require('hammerjs'); // a library to manage touch events


var imagesLoaded = require('imagesloaded');

var ww = window.innerWidth;
var wh = window.innerHeight;

function ISF_Element_Gallery(el, controller) {

  this.controller = controller;

  this.DOM = {};

  this.DOM.el = el;
  this.DOM.inner = this.DOM.el.querySelector('.' + FD.GALLERY.CLASSES.INNER);
  this.DOM.items = Array.from( this.DOM.el.querySelectorAll('.' + FD.GALLERY.CLASSES.ITEM) );

  this.options = {};
  this.options.layout = this.DOM.el.dataset.layout;
  this.options.preview = this.DOM.el.dataset.preview || false;

  this.useTouch = (Modernizr.touchevents) ? true : false;
}

ISF_Element_Gallery.prototype.init = function() {

  this.buildLayout();
  if (this.options.preview) {
    this.initPreview();
  }
};

ISF_Element_Gallery.prototype.buildLayout = function() {

  switch (this.options.layout) {

    // Masonry Layout
    case 'masonry':
      this.msnry = new Masonry( this.DOM.inner, {
        itemSelector: '.js--gallery__item'
      });
      break;

    // Grid: to be refined
    case 'grid':
      break;

    // Horizontal: to be refined
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

    // Prada style
    case 'prada':

      var imgHeight = 300;
      if (ww <= 767) {
        imgHeight = 420;
      } else if (ww <= 991) {
        imgHeight = 600;
      } else if (ww <= 1600) {
        imgHeight = 600;
      } else {
        imgHeight = 1000;
      }

      this.DOM.el.style.height = imgHeight + 'px';

      this.DOM.items.forEach(function(item, ind) {
        var image = item.querySelector('img');
        item.style.height = imgHeight + 'px';
        item.style.width = (image.naturalWidth*(imgHeight/image.naturalHeight)) + 'px';
      });

      var self = this;

      setTimeout(function(){
        self.horizontalBounds = { max: 0, min: - (self.DOM.inner.offsetWidth - ww) };
      }, 1000);

      if (this.useTouch) {
        this.touchManager = new Hammer.Manager( this.DOM.el );
        this.touchUtilities = {}; //object to store touch utilities
        this.touchUtilities.pan = new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 }); // pan ev listener
        this.touchManager.add( self.touchUtilities.pan );
        this.touchManager.on('panleft panright', function(e) {
          self.navigateTouch( e.velocityX * 200 );
        });
      } else {

        // build navigation units
        this.nav = [];
        var nav = document.createElement('nav');
        nav.classList.add('js--gallery__nav', 'isf-el_gallery__nav');
        var navArrowNext = document.createElement('button');
        navArrowNext.classList.add('js--gallery__nav__item');
        var navArrowPrev = navArrowNext.cloneNode(true);
        navArrowNext.classList.add('js--gallery__nav__item--next');
        navArrowPrev.classList.add('js--gallery__nav__item--prev');
        navArrowNext.innerHTML = '<svg class="flickity-button-icon" viewBox="0 0 100 100"><path d="M77,4.1 72.9,0 23,50 72.9,100 77,95.9 31.1,50 z" class="arrow" transform="translate(100, 100) rotate(180) "></path></svg>';
        navArrowPrev.innerHTML = '<svg class="flickity-button-icon" viewBox="0 0 100 100"><path d="M77,4.1 72.9,0 23,50 72.9,100 77,95.9 31.1,50 z" class="arrow"></path></svg>';
        navArrowPrev.dataset.direction = 'prev';
        navArrowNext.dataset.direction = 'next';
        nav.appendChild(navArrowPrev);
        nav.appendChild(navArrowNext);
        this.nav.push(navArrowNext, navArrowPrev);

        this.DOM.el.appendChild(nav);

        this.navCurrent = 0;

        // add event listeners
        _.forEach(this.nav, function(navitem, ind) {

          navitem.addEventListener('click', function() {
            var direction = (navitem.dataset.direction === 'prev') ? 1 : -1;
            var distance = ww/2;

            // calculate distance according to current image?
            self.navCurrent += direction;
            self.horizontalPosition = getTranslateX( self.DOM.inner );
            var adjustedDistance = self.adjustDistanceToFitBounds( distance*direction );
            TweenMax.to(self.DOM.inner, 0.5, {
              x: '+=' + adjustedDistance,
              ease: Power3.easeOut
            });

          });

        });


      }

      break;

    default:
    break;
  }
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


ISF_Element_Gallery.prototype.navigateTouch = function( distance ) {

  // adjust distance and navigate
  this.horizontalPosition = getTranslateX( this.DOM.inner );
  var adjustedDistance = this.adjustDistanceToFitBounds( distance );

  var self = this;

  TweenMax.to( this.DOM.inner, 1, {
    x: "+=" + adjustedDistance,
    ease: Power3.easeOut,
    onComplete: function(){
      self.touchUtilities.isSwiping = false;
    }
  });

};

ISF_Element_Gallery.prototype.adjustDistanceToFitBounds = function( distance ) {
  // adjust nav distance to avoid going too far
  var rangeBounds = [-ww, ww]; // you'd want panning to be tamer
  var mappedDistance = mapRange( distance, -window.innerWidth, window.innerWidth, rangeBounds[0], rangeBounds[1] );
  var clampedDistance = clamp( mappedDistance, (this.horizontalBounds.min - this.horizontalPosition), (this.horizontalBounds.max - this.horizontalPosition) ); // clamp to fit bounds
  return clampedDistance;
};

ISF_Element_Gallery.prototype.initPreview = function() {
  this.buildPreview();
  this.initPreviewEvents();
};

ISF_Element_Gallery.prototype.initPreviewEvents = function() {

  var self = this;

  this.preview.nav.close.addEventListener('click', function() {
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

  this.DOM.items.forEach(function(item, ind) {
    item.addEventListener('click', function() {
      // document this.
      if (self.customFunctionOnTriggerClick !== undefined) {
        self.customFunctionOnTriggerClick();
      } else {
        if (self.updatePreviewIndex( ind)) {
          self.openPreview( item );
        }
      }
    });
  });
};

ISF_Element_Gallery.prototype.buildPreview = function() {

  var self = this;

  // build preview el
  this.preview = {};
  this.preview.el = document.createElement('div');
  this.preview.el.classList.add("isf-el_gallery__preview");
  this.preview.el.classList.add("js--gallery__preview");

  // build preview image
  this.preview.image = document.createElement('div');
  this.preview.image.classList.add('isf-el_image__wrap');
  this.preview.el.appendChild(this.preview.image);

  // build preview nav
  this.preview.nav = {};
// build navigation units

  var prev = document.createElement('button');
  prev.classList.add('js--preview__nav', 'js--preview__nav--prev');
  prev.innerHTML ='<svg class="flickity-button-icon" viewBox="0 0 100 100"><path d="M77,4.1 72.9,0 23,50 72.9,100 77,95.9 31.1,50 z" class="arrow"></path></svg>';
  this.preview.nav.prev = prev;

  var next = document.createElement('button');
  next.classList.add('js--preview__nav', 'js--preview__nav--next');
  next.innerHTML = '<svg class="flickity-button-icon" viewBox="0 0 100 100"><path d="M77,4.1 72.9,0 23,50 72.9,100 77,95.9 31.1,50 z" class="arrow" transform="translate(100, 100) rotate(180) "></path></svg>';
  this.preview.nav.next = next;

  var close = document.createElement('button');
  close.classList.add('js--preview__nav', 'js--preview__nav--close');
  this.preview.nav.close = close;

  this.preview.el.appendChild(this.preview.nav.prev);
  this.preview.el.appendChild(this.preview.nav.next);
  this.preview.el.appendChild(this.preview.nav.close);

  // build indicators
  this.preview.indicators = [];
  var indicatorsUl = document.createElement('ul');
  indicatorsUl.classList.add('js--preview__indicators');
  this.DOM.items.forEach(function(item, ind) {
    var indicator = document.createElement('li');
    indicator.classList.add('js--preview__indicator', 'js--preview__indicator--' + ind);
    self.preview.indicators.push(indicator);
    indicatorsUl.appendChild(indicator);
  });
  this.preview.el.appendChild(indicatorsUl);
  this.preview.indicators[0].classList.add('is--current');

  // set current
  this.preview.current = 0;

  // add preview to gallery
  this.DOM.el.appendChild(this.preview.el);
};

ISF_Element_Gallery.prototype.openPreview = function(trigger) {

  var self = this;

  toggleScroll('disable');

  this.DOM.inner.classList.add('is--faded');

  this.updatePreviewContent(trigger);
  setTimeout(function(){
    self.preview.el.classList.add("is--open");
  }, 600);

};

ISF_Element_Gallery.prototype.updatePreviewIndex = function(ind) {

  if ((ind >= 0) && (ind <= this.DOM.items.length -1)) {
    this.preview.indicators[this.preview.current].classList.remove('is--current');
    this.preview.current = ind;
    this.preview.indicators[ind].classList.add('is--current');
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
  self.preview.image.classList.add('is--hidden');
  setTimeout(function(){
    self.preview.image.innerHTML = trigger.querySelector('.isf-el_image__wrap').innerHTML;
  }, 200);
  setTimeout(function(){
    self.preview.image.classList.remove('is--hidden');
    self.preview.el.classList.remove('is--transitioning');
  }, 600);
};

ISF_Element_Gallery.prototype.closePreview = function() {
  this.preview.el.classList.remove("is--open");
  this.DOM.inner.classList.remove('is--faded');
  toggleScroll('enable');
};

var toggleScroll = function(action) {
  if(action === 'disable') {
    document.querySelector('body').classList.add('no-scroll');
    document.querySelector('html').classList.add('no-scroll');
  } else if(action === 'enable') {
    document.querySelector('body').classList.remove('no-scroll');
    document.querySelector('html').classList.remove('no-scroll');
  }
};

module.exports = ISF_Element_Gallery;











