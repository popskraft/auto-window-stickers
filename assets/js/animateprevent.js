
  /*
  * Early Animate Override
  * Purpose: Start page animations on DOM ready instead of full window load
  * Usage: Include this script anywhere on the page (head/body). It does not
  * modify existing files and coexists with assets/main.js from Carrd.
  */
  (function () {
  function markReadyNow() {
  var body = document.body;
  if (!body) return;
  
  // Remove loading state early so CSS transitions/animations can run.
  body.classList.remove('is-loading');
  
  // Prevent showing the loader if Carrd adds it later.
  body.classList.remove('with-loader');
  
  // Mirror Carrd's transition to ready state without waiting for window load.
  // Add a short "playing" phase for parity with main.js timings.
  if (!body.classList.contains('is-ready')) {
  body.classList.add('is-playing');
  setTimeout(function () {
  body.classList.remove('is-playing');
  body.classList.add('is-ready');
  }, 750);
  }
  }
  
  function hideLoaderIfPresent() {
  var body = document.body;
  if (!body) return;
  
  // If loader exists, ensure it stays hidden (do not remove the node to avoid
  // errors when main.js tries to remove it on window load).
  var loader = document.getElementById('loader');
  if (loader) {
  loader.style.display = 'none';
  loader.style.visibility = 'hidden';
  loader.style.opacity = '0';
  }
  }
  
  function kickScrollHandlers() {
  // Nudge scroll/resize handlers a few times so that any observers
  // registered by assets/main.js after our script runs will execute
  // without waiting for full window load or user scroll.
  var pulses = 0;
  var maxPulses = 40; // ~2s at 50ms
  var timer = setInterval(function () {
  pulses++;
  try {
  window.dispatchEvent(new Event('resize'));
  window.dispatchEvent(new Event('scroll'));
  } catch (e) {}
  if (pulses >= maxPulses) clearInterval(timer);
  }, 50);
  
  // Also schedule a few animation-frame pulses for good measure.
  var rafPulses = 0;
  (function rafTick() {
  try {
  window.dispatchEvent(new Event('resize'));
  window.dispatchEvent(new Event('scroll'));
  } catch (e) {}
  if (++rafPulses < 10) requestAnimationFrame(rafTick);
  })();
  }
  
  function setupObservers() {
  var body = document.body;
  if (!body) return;
  
  // Observe class changes to strip any late-added "with-loader" class.
  var classObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (m) {
  if (m.type === 'attributes' && m.attributeName === 'class') {
  if (body.classList.contains('with-loader')) {
  body.classList.remove('with-loader');
  }
  }
  });
  });
  classObserver.observe(body, { attributes: true, attributeFilter: ['class'] });
  
  // Observe children to hide the loader if/when it gets inserted.
  var childObserver = new MutationObserver(function () {
  hideLoaderIfPresent();
  });
  childObserver.observe(body, { childList: true });
  }
  
  // Run as soon as DOM is ready (or immediately if already ready).
  function init() {
  try {
  markReadyNow();
  hideLoaderIfPresent();
  setupObservers();
  kickScrollHandlers();
  } catch (e) {
  // Fail-safe: do not break the page if anything goes wrong.
  // eslint-disable-next-line no-console
  console && console.warn && console.warn('early-animate-override failed:', e);
  }
  }
  
  if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
  // DOM is already parsed.
  init();
  }
  })();