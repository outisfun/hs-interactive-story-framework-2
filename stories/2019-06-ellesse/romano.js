import Hammer from 'hammerjs';

(function () {
  const el = document.getElementById('gallery');
  const slider = el.querySelectorAll('[data-hook=slider]')[0];
  const mouseEl = el.querySelectorAll('[data-hook=mouse]')[0]

  /***********
   * DRAG
   */
  let lastPosX = 0;
  let lastPosY = 0;
  let animatePosX = 0;
  let isDragging = false;
  let isAnimating = false;
  let tStart = null;
  const xFactor = parseFloat(el.getAttribute('data-x-factor')) || 1;

  function animate(timestamp) {
    const elem = slider;
    if (!tStart) tStart = timestamp;
    const progress = timestamp - tStart;
    const elemX = parseFloat(elem.style.left) || 0;
    let elemXNew = elemX - (elemX - animatePosX)/10;

    // stop it
    if (Math.round(elemXNew) === animatePosX) {
      isAnimating = false;
      elemXNew = animatePosX;
      el.classList.remove('is-dragging');
    }

    elem.style.left = `${elemXNew}px`;

    if (isAnimating) {
      window.requestAnimationFrame(animate);
    }
  }

  function handleDrag(ev, hideTypo = true) {
    const elem = slider;

    if ( ! isDragging ) {
      isDragging = true;
      lastPosX = elem.offsetLeft;
      if (hideTypo) {
        el.classList.add('is-dragging');
      }
    }
    let posX = ev.deltaX * xFactor + lastPosX;
    const boundRight = -slider.getBoundingClientRect().width + document.documentElement.clientWidth;
    if (posX > 0) {
      posX = 0;
    } else if (posX < boundRight) {
      posX = Math.round(boundRight);
    }
    animatePosX = posX;

    loadImages()
    // DRAG ENDED
    if (ev.isFinal) {
      isDragging = false;
      loadImages()
    }

    if (!isAnimating) {
      isAnimating = true;
      window.requestAnimationFrame(animate);
    }
  }

  function initDrag() {
    var mc = new Hammer(el);
    mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 }) );
    mc.on("pan", handleDrag);
  }

  // scrollGallery(0);

  window.scrollGallery = function(deltaX = 0) {
    const obj = {
      deltaX: -deltaX,
      isFinal: true,
    }
    handleDrag(obj, false);
  }
  // window.doScroll = doScroll;

  /***********
   * MOUSE
   */
  let isMouseMoving = false;
  let isMouseAnimating = false;
  let lastMousePos = [];
  let animateMousePos = [];
  let tStartMouse = null;
  let isMouseMoved = false;

  function animateMouse(timestamp) {
    const elem = mouseEl;
    if (!tStartMouse) tStartMouse = timestamp;
    const progress = timestamp - tStartMouse;
    const elemX = parseFloat(elem.style.left) || 0;
    const elemY = parseFloat(elem.style.top) || 0;
    let elemXNew = elemX - (elemX - animateMousePos[ 0 ])/10;
    let elemYNew = elemY - (elemY - animateMousePos[ 1 ])/10;

    if (Math.round(elemXNew) === animateMousePos[ 0 ] && Math.round(elemYNew) === animateMousePos[ 1 ] ) {
      isMouseAnimating = false;
      elemXNew = animateMousePos[ 0 ];
      elemYNew = animateMousePos[ 1 ];
    }

    elem.style.left = `${elemXNew}px`;
    elem.style.top = `${elemYNew}px`;

    if (isMouseAnimating) {
      window.requestAnimationFrame(animateMouse);
    }
  }

  function onMouseMove(e) {
    isMouseMoved = true;
    if (!isMouseMoving) {
      isMouseMoving = true;
      lastMousePos = [e.clientX, e.clientY];
      mouseEl.style.left = `${lastMousePos[ 0 ]}px`;
      mouseEl.style.right = `${lastMousePos[ 1 ]}px`;
      el.classList.add('is-mouse-enter');
    }

    animateMousePos = [Math.round(e.clientX), Math.round(e.clientY)];

    if (!isMouseAnimating) {
      isMouseAnimating = true;
      window.requestAnimationFrame(animateMouse);
    }
  }

  function onMouseLeave() {
    isMouseMoving = false;
    el.classList.remove('is-mouse-enter');
  }

  function initMouse() {
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mousedown", () => {
      isMouseMoved = false;
      el.classList.add('is-mouse-down')
    });
    el.addEventListener("mouseup", () => {
      if (!isMouseMoved) {
        performAdClick();
      }
      el.classList.remove('is-mouse-down')
    });
  }

  /***********
   * IMAGES
   */

  const images = Array.from(document.getElementsByClassName("gallery__image"));

  // ## image resizing
  function resizeImages() {
    images.forEach((item) => {
      item.style.width = `${item.getBoundingClientRect().height * (parseFloat(item.getAttribute('data-aspect'))/100)}px`;
    });
  }

  // ## lazyloading
  function loadImages() {
    images.forEach((item) => {
      const img = item.getElementsByTagName('img')[ 0 ];
      if (img.getAttribute('src')) return;
      if (item.getBoundingClientRect().x < window.innerWidth * 2) {
        img.onload = () => {
          item.classList.add('is-loaded');
        }
        img.setAttribute('src', img.getAttribute('data-src'));
      }
    })
  }

  // ## ad click
  function performAdClick() {
    window.open(el.getAttribute('data-click-url'));
  }

  window.onload = () => {
    resizeImages();
    loadImages();
    initMouse();
    initDrag();
  };
  window.onresize = resizeImages;

})();
Collapse




10:28 AM
