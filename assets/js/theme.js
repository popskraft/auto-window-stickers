/**
 * Theme-specific JavaScript
 * Consolidates custom behaviours originally injected inline.
 */
(function () {
	'use strict';

	if (typeof console !== 'undefined' && console.log) {
		console.log('Theme JS: Initializing');
	}

	// ---------------------------------------------------------------------------
	// Utilities
	// ---------------------------------------------------------------------------
	const originalRemoveChild = Node.prototype.removeChild;
	Node.prototype.removeChild = function (child) {
		if (child && !this.contains(child)) {
			if (console && console.warn) {
				console.warn('Theme JS: Prevented removeChild error');
			}
			return child;
		}
		return originalRemoveChild.call(this, child);
	};

	function onReady(fn) {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', fn, { once: true });
		} else {
			fn();
		}
	}

	// ---------------------------------------------------------------------------
	// Navigation active state highlighter (hash-based)
	// ---------------------------------------------------------------------------
	function updateNavLinks() {
		const currentHash = window.location.hash.replace('#', '').toLowerCase();
		const navMenus = document.querySelectorAll('ul.main-nav');

		navMenus.forEach(menu => {
			const listItems = Array.from(menu.querySelectorAll('li'));

			if (!listItems.length) {
				return;
			}

			listItems.forEach(item => item.classList.remove('active', 'inactive'));

			if (!currentHash) {
				return;
			}

			let hasActive = false;
			menu.querySelectorAll('a[href^="#"]').forEach(link => {
				const listItem = link.closest('li');
				if (!listItem) {
					return;
				}
				const linkHash = link.getAttribute('href').replace('#', '').toLowerCase();
				if (linkHash && linkHash === currentHash) {
					listItem.classList.add('active');
					listItem.classList.remove('inactive');
					hasActive = true;
				}
			});

			if (hasActive) {
				listItems.forEach(item => {
					if (!item.classList.contains('active')) {
						item.classList.add('inactive');
					}
				});
			}
		});

		if (console && console.log) {
			const logHash = currentHash ? `'${currentHash}'` : 'home';
			console.log(`Navigation Highlighter: updated for ${logHash}`);
		}
	}

	function initNavigationHighlighter() {
		if (console && console.log) {
			console.log('Navigation Highlighter: Initializing');
		}
		updateNavLinks();

		window.addEventListener('hashchange', updateNavLinks);
		window.addEventListener('load', function () {
			setTimeout(updateNavLinks, 100);
		});
	}

	// ---------------------------------------------------------------------------
	// Sticky navigation clone
	// ---------------------------------------------------------------------------
	function initStickyNavigation() {
		const navSticky = document.getElementById('navSticky');
		if (!navSticky || document.getElementById('stickyNavContainer')) {
			return;
		}

		const stickyNavContainer = document.createElement('div');
		stickyNavContainer.id = 'stickyNavContainer';
		stickyNavContainer.className = 'sticky-nav-container';

		const navClone = navSticky.cloneNode(true);
		navClone.id = 'navStickyClone';
		stickyNavContainer.appendChild(navClone);
		document.body.appendChild(stickyNavContainer);

		let scrollThreshold = window.innerHeight * 1.5;

		function handleScroll() {
			if (window.scrollY > scrollThreshold) {
				stickyNavContainer.classList.add('visible');
			} else {
				stickyNavContainer.classList.remove('visible');
			}
		}

		window.addEventListener('scroll', handleScroll);
		handleScroll();

		window.addEventListener('resize', function () {
			scrollThreshold = window.innerHeight * 1.5;
			handleScroll();
		});

		// Ensure the cloned menu shares the correct active state
		updateNavLinks();

		if (console && console.log) {
			console.log('Sticky Navigation initialized with 1.5x viewport threshold');
		}
	}

	// ---------------------------------------------------------------------------
	// FAQ accordion logic
	// ---------------------------------------------------------------------------
	function initFaqAccordion() {
		const faqTitles = document.querySelectorAll('#faqBody .style-2');
		if (!faqTitles.length) {
			return;
		}

		document.querySelectorAll('#faqBody .style-3').forEach(answer => {
			answer.classList.remove('active', 'visible');
			answer.removeAttribute('style');
		});

		faqTitles.forEach(title => {
			title.addEventListener('click', function () {
				this.classList.toggle('active');
				const answer = this.nextElementSibling;
				if (!answer || !answer.classList.contains('style-3')) {
					return;
				}
				answer.classList.toggle('active');
				answer.classList.toggle('visible');
			});
		});
	}

	// ---------------------------------------------------------------------------
	// Slider auto-rotation blocker (Safari-safe)
	// ---------------------------------------------------------------------------
	function initSliderAutoRotationBlocker() {
		if (console && console.log) {
			console.log('Custom Slider Init: Loading Safari-compatible slider blocker');
		}

		const originalSetInterval = window.setInterval;
		const originalSetTimeout = window.setTimeout;
		let slideshowContextActive = false;

		function detectSlideshows() {
			const slideshows = document.querySelectorAll('.productSlider.slideshow');
			if (slideshows.length > 0) {
				slideshowContextActive = true;
				if (console && console.log) {
					console.log(`Custom Slider Init: Found ${slideshows.length} slideshow elements`);
				}
			}
		}

		detectSlideshows();
		document.addEventListener('DOMContentLoaded', detectSlideshows);
		window.addEventListener('load', detectSlideshows);

		window.setInterval = function (callback, delay) {
			if (typeof callback !== 'function') {
				return originalSetInterval.apply(this, arguments);
			}

			if (slideshowContextActive && typeof delay === 'number' && delay >= 1000 && delay <= 30000) {
				let isSlideshow = false;
				try {
					const stack = new Error().stack;
					if (stack && stack.toString().includes('slideshow')) {
						isSlideshow = true;
					}
				} catch (e) {
					// ignore
				}

				if (delay === 3000 || delay === 5000 || delay === 6000) {
					isSlideshow = true;
				}

				if (isSlideshow) {
					if (console && console.log) {
						console.log(`Custom Slider Init: Blocked potential slideshow timer with delay ${delay}ms`);
					}
					return 999999;
				}
			}

			return originalSetInterval.apply(this, arguments);
		};

		window.setTimeout = function (callback, delay) {
			if (typeof callback !== 'function') {
				return originalSetTimeout.apply(this, arguments);
			}

			const args = Array.prototype.slice.call(arguments, 2);
			const safeCallback = function () {
				try {
					callback.apply(this, args);
				} catch (e) {
					if (console && console.log) {
						console.log('Custom Slider Init: Caught error in setTimeout callback', e);
					}
				}
			};

			return originalSetTimeout.call(this, safeCallback, delay);
		};

		function stopSliderAutoRotation() {
			document.querySelectorAll('.productSlider.slideshow').forEach(slider => {
				slider.querySelectorAll('.is-playing').forEach(el => {
					el.classList.remove('is-playing');
				});
			});
		}

		document.addEventListener('DOMContentLoaded', function () {
			setTimeout(stopSliderAutoRotation, 100);
			setTimeout(stopSliderAutoRotation, 1500);
		});

		window.addEventListener('load', function () {
			setTimeout(stopSliderAutoRotation, 100);
			setTimeout(stopSliderAutoRotation, 1000);
		});
	}

	// ---------------------------------------------------------------------------
	// Early animate override (prevents long loading state)
	// ---------------------------------------------------------------------------
	function initEarlyAnimateOverride() {
		function markReadyNow() {
			const body = document.body;
			if (!body) {
				return;
			}

			body.classList.remove('is-loading');
			body.classList.remove('with-loader');

			if (!body.classList.contains('is-ready')) {
				body.classList.add('is-playing');
				setTimeout(function () {
					body.classList.remove('is-playing');
					body.classList.add('is-ready');
				}, 750);
			}
		}

		function hideLoaderIfPresent() {
			const body = document.body;
			if (!body) {
				return;
			}
			const loader = document.getElementById('loader');
			if (loader) {
				loader.style.display = 'none';
				loader.style.visibility = 'hidden';
				loader.style.opacity = '0';
			}
		}

		function kickScrollHandlers() {
			let pulses = 0;
			const maxPulses = 40;
			const timer = setInterval(function () {
				pulses += 1;
				try {
					window.dispatchEvent(new Event('resize'));
					window.dispatchEvent(new Event('scroll'));
				} catch (e) {
					// ignore
				}
				if (pulses >= maxPulses) {
					clearInterval(timer);
				}
			}, 50);

			let rafPulses = 0;
			(function rafTick() {
				try {
					window.dispatchEvent(new Event('resize'));
					window.dispatchEvent(new Event('scroll'));
				} catch (e) {
					// ignore
				}
				if (++rafPulses < 10) {
					requestAnimationFrame(rafTick);
				}
			})();
		}

		function setupObservers() {
			const body = document.body;
			if (!body) {
				return;
			}

			const classObserver = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					if (mutation.type === 'attributes' && mutation.attributeName === 'class' && body.classList.contains('with-loader')) {
						body.classList.remove('with-loader');
					}
				});
			});
			classObserver.observe(body, { attributes: true, attributeFilter: ['class'] });

			const childObserver = new MutationObserver(function () {
				hideLoaderIfPresent();
			});
			childObserver.observe(body, { childList: true });
		}

		function init() {
			try {
				markReadyNow();
				hideLoaderIfPresent();
				setupObservers();
				kickScrollHandlers();
			} catch (e) {
				if (console && console.warn) {
					console.warn('early-animate-override failed:', e);
				}
			}
		}

		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', init, { once: true });
		} else {
			init();
		}
	}

	// ---------------------------------------------------------------------------
	// Execute initialisers
	// ---------------------------------------------------------------------------
	initSliderAutoRotationBlocker();
	initEarlyAnimateOverride();

	onReady(function () {
		initNavigationHighlighter();
		initStickyNavigation();
		initFaqAccordion();
	});
})();
