
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
  this.DOM.contentGroups = Array.from(this.DOM.viewer.querySelectorAll(".js--interactive-scroller__content__group"));
  this.steps = [];
  this.stepsScenes = [];
  this.contentGroups = {};
  this.DOM.intro = this.DOM.el.querySelector( ".group--start" );
}

ISF_Layout_InteractiveScroller.prototype.init = function(){
  this.buildIndicatorsContainer();
  this.buildProgressBar();
  this.buildSteps();
  this.activateMainScene();
  this.activateStepScenes();
};


ISF_Layout_InteractiveScroller.prototype.activateMainScene = function(){

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
      TweenLite.to(self.DOM.progressIndicator, 1, {
        width: e.progress*100 + '%', // progress is [0, 1]
        ease: Power2.easeOut
      });
    })
    .addTo(this.controller);
};

ISF_Layout_InteractiveScroller.prototype.activateStepScenes = function(){

  var self = this;
  _.forEach(this.DOM.steps, function(step, ind) {
    var contentGroup = self.DOM.contentGroups[ind];

    // build step indicator
    self.buildStepIndicator(ind, contentGroup);

    var scene = new ScrollMagic.Scene({
      triggerElement: step,
      triggerHook: 0,
      duration: step.offsetHeight
    })
      .setClassToggle( contentGroup, "is--active" )
      .addTo(self.controller);

    self.stepsScenes.push(scene);
  });
};

ISF_Layout_InteractiveScroller.prototype.buildSteps = function() {

  this.DOM.stepsContainer = document.createElement('div');
  this.DOM.stepsContainer.classList.add('isf-layout_interactive-scroller__steps');
  this.DOM.el.appendChild(this.DOM.stepsContainer);

  var self = this;
  _.forEach(this.DOM.contentGroups, function(contentGroup, ind) {
    var step = new ISF_Layout_InteractiveScrollerStep(contentGroup, ind);
    self.steps.push(step);
    self.DOM.stepsContainer.appendChild(step.DOM.el);
    step.activateStepScene();
    step.scene.addTo(self.controller);
  });
};

ISF_Layout_InteractiveScroller.prototype.buildProgressBar = function(){

  this.DOM.progressBar = document.createElement('div');
  this.DOM.progressBar.classList.add("isf-layout_interactive-scroller__progress");
  this.DOM.progressIndicator = document.createElement('span');
  this.DOM.progressIndicator.classList.add("progress__indicator");
  this.DOM.progressBar.appendChild(this.DOM.progressIndicator);
  this.DOM.indicatorsContainer.appendChild(this.DOM.progressBar);
};

ISF_Layout_InteractiveScroller.prototype.buildIndicatorsContainer = function(){

  this.DOM.indicatorsContainer = document.createElement('div');
  this.DOM.indicatorsContainer.classList.add( "isf-layout_interactive-scroller__indicators" );
  this.DOM.el.appendChild( this.DOM.indicatorsContainer );
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

function ISF_Layout_InteractiveScrollerStep (contentGroup, ind) {
  this.DOM = { contentGroup: contentGroup };
  this.buildStep(ind);
}

ISF_Layout_InteractiveScrollerStep.prototype.buildStep = function(ind) {
  var step = document.createElement('div');
  step.classList.add('isf-layout_interactive-scroller__step', 'js--interactive-scroller__step', 'step--' + ind);
  this.DOM.el = step;
};

ISF_Layout_InteractiveScrollerStep.prototype.activateStepScene = function() {
  this.scene = new ScrollMagic.Scene({
    triggerElement: this.DOM.el,
    triggerHook: 0,
    duration: this.DOM.el.offsetHeight
  })
    .setClassToggle(this.DOM.contentGroup, 'is--active');
};

module.exports = ISF_Layout_InteractiveScroller;
