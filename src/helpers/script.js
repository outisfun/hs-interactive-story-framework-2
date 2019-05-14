( function(window) {

    'use strict';

    var FRAMEWORKDATA = require('frameworkdata.js');
    var imagesLoaded = require('imagesLoaded'); // make sure they're loaded before init
    var ScrollMagic = require('scrollmagic');
    var constructors = {};

    /* require modules */

    /* require effects */

    var X_AnimateOnPageEnter = require('modules/effect_animate_on_page_enter/script.js');

    var interactiveStory;


    function ISF_Story(el){
        this.DOM = {el: el};
        this.controller = new ScrollMagic.Controller();
        this.modules = [];
        this.effects = {
          animate_on_page_enter : X_AnimateOnPageEnter
        };
        this.init();
    }

    ISF_Story.prototype.init = function(){

        var self = this;

        // loop through modules and see if there are any to init
        for (var mod in FRAMEWORKDATA.MODULES) {

          var els = Array.from(document.querySelectorAll(FRAMEWORKDATA.MODULES[mod].CLASSES.EL));

          if ((els.length !== 0) && (constructors[mod])) {
            els.forEach(function(elem, ind) {
              // init constructor
              self.modules.push(new constructors[mod](elem, self.controller));
              // check for effects
              for (var attr in elem.dataset) {
                if (isAttributeEffect(attr) && elem.dataset[attr]) {
                  var applyEffect = self.effects[attr.replace('x_', '')];
                  applyEffect( elem, elem.dataset[attr], self.controller );
                }
              }
            });
          }

        }

        // init modules
        this.modules.forEach(function(mod, ind) {
          if (typeof mod.init === 'function') {
            mod.init();
          }
        });

        // temporary: preview nav trigger
        if (document.querySelector(".dropdown-toggle")) {
          document.querySelector(".dropdown-toggle").addEventListener('click', function() {
            document.querySelector("#isf-preview__nav").classList.toggle('is--open');
          });
        }

    };

    function isAttributeEffect( attr ) {
      // effects are data attributes like data-x_animate_on_page_enter
      return (attr.includes('x_')) ? true : false;
    }

    imagesLoaded( document.getElementById("isf-interactive-story"), function() {
        interactiveStory = new ISF_Story(document.getElementById( "isf-interactive-story" ));
    });

})(window);
