
/* ANIMATE ON SCROLL */

/* To use the effect
	-- add a data attribute data-isf_animate_on_page_enter = "effect"
	-- effects are CSS classes, for example zoom-in, fade-in. See ... for reference.
*/

var ScrollMagic = require("scrollmagic");

module.exports = function(el, effectValue, controller) {

  el.classList.add('isf-animate');
  el.classList.add('isf-animate--' + effectValue);
  el.style.transitionDelay = Math.random() + "s";

  switch (effectValue) { // fade-in, fade-in-random
  case 'fade-in-random':
    var xscene = new ScrollMagic.Scene({
      triggerElement: el,
      triggerHook: 0.6
    })
      .on('enter', function() {
        el.classList.add('is--animated');
      })
      .addTo(controller);
    break;
  default:
    break;
  }
};
