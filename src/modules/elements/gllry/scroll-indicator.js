var _ = require('lodash');
var gsap = require('gsap');

function XPR_ScrollIndicator(el, opts) {
  this.DOM = { containerEl: el || document.querySelector('body') };
  var _opts = {
    type: 'vertical',
    text: 'Scroll'
  };
  this.opts = _.merge(_opts, opts);
  this.isVisible = true;
  this.init();
}

XPR_ScrollIndicator.prototype.init = function() {
  this.buildMarkup();
  this.setStyles();
  this.toggleOnScroll();
};

XPR_ScrollIndicator.prototype.buildMarkup = function() {
  this.DOM.el = document.createElement('div');
  this.DOM.el.classList.add('xpr-nav--scroll');

  var _scrText = document.createElement('span');
  _scrText.classList.add('xpr-nav--scroll--text');
  _scrText.innerHTML = this.opts.text;

  var _scrLine = document.createElement('span');
  _scrLine.classList.add((this.opts.type === 'vertical') ? 'xpr-nav--scroll--line' : 'xpr-nav--scroll--line-side');

  this.DOM.el.appendChild(_scrText);
  this.DOM.el.appendChild(_scrLine);

  this.DOM.containerEl.appendChild(this.DOM.el);
};

XPR_ScrollIndicator.prototype.setStyles = function() {
  if (this.opts.type === 'vertical') {
    TweenLite.set(this.DOM.el, {
      bottom: '0%',
      left: '50%',
      x: '-50%'
    });
  } else if (this.opts.type === 'horizontal') {
    TweenLite.set(this.DOM.el, {
      left: '0%',
      top: '50vh',
      y: '-50%',
      position: 'absolute'
    });

    // TweenLite.set(this.DOM.el.querySelector(".xpr-nav--scroll--line"), {
    //   rotation: '90deg'
    // });
  }
};

XPR_ScrollIndicator.prototype.toggleOnScroll = function() {
  var self = this;

  if (this.opts.type === 'vertical') {
    window.addEventListener('scroll', function(e) {
      var pos = window.scrollY;

      if (pos > 100 && self.isVisible ) {
        self.toggle(false);
      } else if (pos <= 100 && !self.isVisible ) {
        self.toggle(true);
      }
    });
  }
};

XPR_ScrollIndicator.prototype.toggle = function(trueOrFalse) {
  console.log("toggle!");
  var self = this;
  TweenLite.to(this.DOM.el, 0.35, {
    opacity: trueOrFalse ? 1 : 0,
    onComplete: function() {
      self.isVisible = trueOrFalse;
    }
  });
};

module.exports = XPR_ScrollIndicator;
