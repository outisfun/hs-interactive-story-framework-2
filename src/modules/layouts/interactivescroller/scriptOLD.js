
// Plugins
var ScrollMagic = require('scrollmagic');
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');
var YAML = require('yamljs');
var _ = require('lodash');
var gsap = require('gsap');
var Hammer = require('hammerjs'); // a library to manage touch events
require('browsernizr/test/touchevents');
var Modernizr = require('browsernizr'); // make sure to do this _after_ importing the tests

var FD = YAML.load('https://interactive-development.hsnb.io/src/fd.yml');

var ww = window.innerWidth;
var wh = window.innerHeight;

function ISF_Layout_InteractiveScroller(el, controller) {

  this.controller = controller;
  this.DOM = { el : el };
  this.DOM.viewer = this.DOM.el.querySelector('.' + FD.INTERACTIVESCROLLER.CLASSES.VIEWER );
  this.DOM.steps = Array.from(this.DOM.el.querySelectorAll('.' + FD.INTERACTIVESCROLLER.CLASSES.STEP ));
  this.stepsScenes = [];

  this.DOM.intro = this.DOM.el.querySelector( ".group--start" );
}

ISF_Layout_InteractiveScroller.prototype.init = function(){
  this.setupScrollScenes();
  this.buildIndicatorsContainer();
  this.activateSteps();
};

ISF_Layout_InteractiveScroller.prototype.setupScrollScenes = function(){
  var self = this;
  // fix the viewer on page enter
  this.scrollScene = new ScrollMagic.Scene({
    triggerElement: this.DOM.el,
    triggerHook: 0,
    duration: this.DOM.el.offsetHeight - wh
  })
    .setClassToggle(this.DOM.el, "is--fixed")
    .on('end', function() {
      self.DOM.el.classList.toggle("is--bottom");
    })
    .on('progress', function(e) {
      var p = e.progress;
      console.log('p');
      TweenLite.to(self.DOM.progressIndicator, 1, {
        width: p*100 + '%',
        ease: Power2.easeOut
      });
    })
    .addTo(this.controller);

  // add pattern background to viewer
  // this.patternBackground = new PatternBackground(this.DOM.viewer);
};

ISF_Layout_InteractiveScroller.prototype.buildIndicatorsContainer = function(){
  this.DOM.indicatorsContainer = document.createElement('div');
  this.DOM.indicatorsContainer.classList.add( "isf-layout_interactive-scroller__indicators" );
  this.DOM.el.appendChild( this.DOM.indicatorsContainer );

  this.DOM.progressBar = document.createElement('div');
  this.DOM.progressBar.classList.add("isf-layout_interactive-scroller__progress");
  this.DOM.progressIndicator = document.createElement('span');
  this.DOM.progressIndicator.classList.add("progress__indicator");
  this.DOM.progressBar.appendChild(this.DOM.progressIndicator);
  this.DOM.progressIndicator.style.backgroundColor = '#ff0000';
  this.DOM.indicatorsContainer.appendChild(this.DOM.progressBar);
};

ISF_Layout_InteractiveScroller.prototype.buildStepIndicator = function( stepNumber, stepName ){
  var indicator = document.createElement('div');
  indicator.classList.add( "indicator" );
  indicator.classList.add( "indicator--" + stepNumber );
  indicator.innerHTML = '<h6>' + stepName + '</h6>';
  this.DOM.indicatorsContainer.appendChild( indicator );
};

ISF_Layout_InteractiveScroller.prototype.updateIndicators = function( stepNumber ){

  var activeIndicator = this.DOM.indicatorsContainer.querySelector( ".indicator.is--active" );
  if( activeIndicator ) {
    activeIndicator.classList.remove("is--active");
  }
  var newIndicator = this.DOM.indicatorsContainer.querySelector( ".indicator--" + stepNumber );
  newIndicator.classList.add("is--active");
  this.DOM.progressIndicator.style.backgroundColor = '#' + this.patternBackground.cityColors[this.patternBackground.city].blobs[0];
};

ISF_Layout_InteractiveScroller.prototype.activateSteps = function(){

  var self = this;
  this.contentGroups = [];
  this.DOM.steps.forEach(function(step, ind) {
    var stepNumber = step.dataset.number;
    // exclude start and end steps
    var correspondingContentGroup = self.DOM.el.querySelector('.group--' + stepNumber);
    var timeline = new TimelineLite();

    self.buildStepIndicator( stepNumber, correspondingContentGroup.dataset.city );
    self.contentGroups.push( new ContentGroup(correspondingContentGroup) );
    var leftOrRight = (Math.random() > 0.5) ? 0 : 1;
    var toggle = (ind%2); // 0, 1, 0, 1, 0 ...

    _.forEach(self.contentGroups[ind].DOM.imgs, function(img, i) {
      var d = Math.random();
      var perc = 100 + 100*d;
      var delay = -3*(Math.abs(1 - i));
      timeline.to(img, 1, {
        top: 0,
        y: '-' + perc + '%'
      }, '-=0.8');
    });

    var scene = new ScrollMagic.Scene({
      triggerElement: step,
      triggerHook: 0,
      duration: step.offsetHeight
    })
      .on('enter', function() {
        var city = correspondingContentGroup.dataset.city;
        if (city) {

          //self.patternBackground.colorizeBlobs(city);
          self.updateIndicators( stepNumber );
          //self.contentGroups[ind].parallax();
        }

        if (ind >= 1) {
          self.contentGroups[0].DOM.el.classList.add('is--active-background');
        } else {
          self.contentGroups[0].DOM.el.classList.remove('is--active-background');
        }
      })
      .setClassToggle( correspondingContentGroup, "is--active" )
      .setTween(timeline)
      .addTo(self.controller);

    self.stepsScenes.push(scene);
  });
};

function ContentGroup(el) {
  this.DOM = {el: el};
  this.DOM.imgs = Array.from( this.DOM.el.querySelectorAll('.watch__content__image') );
}

function PatternBackground(el, ind) {
  this.DOM = {el: el};
  this.DOM.bckgr = this.DOM.el.querySelector('.js--interactive-scroller__background');
  this.blobGroups = [];
  this.city = 'global';
  this.cityColors = {
    global: {
      background: 'c8b484',
      blobs: [
        '336a2d',
        '082418',
        '1f090b'
      ]
    },
    paris: {
      background: '89b8d5',
      blobs: [
        '19345a',
        'ffffff',
        'd6191b'
      ]
    },
    london: {
      background: '000000',
      blobs: [
        'a51119',
        '5b5555',
        '352d2d'
      ]
    },
    tokyo: {
      background: '888532',
      blobs: [
        '000000',
        '312020',
        '306131'
      ]
    },
    nyc: {
      background: 'e8e8e8',
      blobs: [
        '7f4993',
        '58595b',
        '9ca0a1'
      ]
    },
    switzerland: {
      background: '000000',
      blobs: [
        '153378',
        '58595b',
        '2c2c33'
      ]
    }
  };
  this.init();
}

PatternBackground.prototype.init = function() {
  this.buildPattern();
};

PatternBackground.prototype.buildPattern = function() {
  var self = this;
  // request svg pattern file
  var client = new XMLHttpRequest();
  client.open('GET', ('https://static-ads.highsnobiety.com/2019-06-swatch/swatch-bape__pattern.svg') );

  client.onreadystatechange = function() {
    if (client.readyState == 4 && client.status == 200) {
      if (client.responseText)
      {
        // add svg to container
        self.DOM.bckgr.innerHTML = client.responseText;

        // create an array of blobs that corresponds to the structure of the cityColors blobs arrays
        var colorGroups = Array.from( self.DOM.bckgr.querySelectorAll('.pattern__color-group') );
        //self.DOM.bckgr.style.backgroundColor = '#' + self.cityColors[self.city].background;

        _.forEach(colorGroups, function(group, ind) {
          self.blobGroups[ind] = [];
          var paths = Array.from(group.querySelectorAll('path'));
          var color = self.cityColors[self.city].blobs[ind];

          _.forEach(paths, function(pth, pthInd) {
            var blob = new PatternBlob(pth);
            self.blobGroups[ind].push(blob);
          });
          self.colorizeBlobs(self.city);
        });
      }
    }
  };

  client.send();
};

PatternBackground.prototype.colorizeBlobs = function(city) {
  this.city = city;
  var self = this;
  TweenMax.to(this.DOM.bckgr, 0.65, {
    backgroundColor: '#' + this.cityColors[city].background
  });

  _.forEach(this.blobGroups, function(blobGroup, ind) {
    var color = self.cityColors[city].blobs[ind];
    _.forEach(blobGroup, function(blob, blobInd) {
      blob.colorize(color);
    });
    //self.show();
  });
};

function PatternBlob(el) {
  this.DOM = {el: el};
}

PatternBlob.prototype.colorize = function(color) {
  var self = this;
  var d = Math.random();
  //console.log(d);
  TweenLite.to(this.DOM.el, 0.4, {
    fill: '#' + color,
    delay: d,
    ease: Power2.easeIn
  });
};

module.exports = ISF_Layout_InteractiveScroller;


