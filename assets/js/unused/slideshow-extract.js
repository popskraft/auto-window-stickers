/**
 * Slideshow functionality extracted from main.js
 * This file contains only the slideshow-related code from the original main.js file
 */

// Slideshow backgrounds.
/**
 * Slideshow background.
 * @param {string} id ID.
 * @param {object} settings Settings.
 */
function slideshowBackground(id, settings) {

    var _this = this;

    // Settings.
    if (!('images' in settings)
        || !('target' in settings))
        return;

    this.id = id;
    this.wait = ('wait' in settings ? settings.wait : 0);
    this.defer = ('defer' in settings ? settings.defer : false);
    this.navigation = ('navigation' in settings ? settings.navigation : false);
    this.order = ('order' in settings ? settings.order : 'default');
    this.preserveImageAspectRatio = ('preserveImageAspectRatio' in settings ? settings.preserveImageAspectRatio : false);
    this.transition = ('transition' in settings ? settings.transition : { style: 'crossfade', speed: 1000, delay: 6000, resume: 12000 });
    this.images = settings.images;

    // Properties.
    this.preload = true;
    this.locked = false;
    // Use document.querySelector instead of jQuery
    this.$target = document.querySelector(settings.target);
    this.$wrapper = ('wrapper' in settings ? document.querySelector(settings.wrapper) : null);
    this.pos = 0;
    this.lastPos = 0;
    this.$slides = [];
    this.img = document.createElement('img');
    this.preloadTimeout = null;
    this.resumeTimeout = null;
    this.transitionInterval = null;

    // Using preserveImageAspectRatio and transition style is crossfade? Force to regular fade.
    if (this.preserveImageAspectRatio
        && this.transition.style == 'crossfade')
        this.transition.style = 'fade';

    // Adjust transition delay (if in use).
    if (this.transition.delay !== false)
        switch (this.transition.style) {

            case 'crossfade':
                this.transition.delay = Math.max(this.transition.delay, this.transition.speed * 2);
                break;


            case 'fade':
                this.transition.delay = Math.max(this.transition.delay, this.transition.speed * 3);
                break;

            case 'instant':
            default:
                break;

        }

    // Force navigation to false if a wrapper wasn't provided.
    if (!this.$wrapper)
        this.navigation = false;

    // Defer?
    if (this.defer) {

        // Add to scroll events.
        scrollEvents.add({
            element: this.$target,
            enter: function() {
                _this.preinit();
            }
        });

    }

    // Otherwise ...
    else {

        // Preinit immediately.
        this.preinit();

    }

};

/**
 * Gets the speed class name for a given speed.
 * @param {int} speed Speed.
 * @return {string} Speed class name.
 */
slideshowBackground.prototype.speedClassName = function(speed) {

    switch (speed) {

        case 1:
            return 'slow';

        default:
        case 2:
            return 'normal';

        case 3:
            return 'fast';

    }

};

/**
 * Pre-initializes the slideshow background.
 */
slideshowBackground.prototype.preinit = function() {

    var _this = this;

    // Preload?
    if (this.preload) {

        // Mark as loading (after delay).
        this.preloadTimeout = setTimeout(function() {
            _this.$target.classList.add('is-loading');
        }, this.transition.speed);

        // Init after a delay (to prevent load events from holding up main load event).
        setTimeout(function() {
            _this.init();
        }, 0);

    }

    // Otherwise ...
    else {

        // Init immediately.
        this.init();

    }

};

/**
 * Initializes the slideshow background.
 */
slideshowBackground.prototype.init = function() {

    var _this = this,
        loaded = 0,
        hasLinks = false,
        dragStart = null,
        dragEnd = null,
        $slide, intervalId, i;

    // Apply classes.
    this.$target.classList.add('slideshow-background');
    this.$target.classList.add(this.transition.style);

    // Create navigation (if enabled).
    if (this.navigation) {

        // Next arrow (if allowed).
        this.$next = document.createElement('div');
        this.$next.classList.add('nav', 'next');
        this.$next.addEventListener('click', function(event) {

            // Stop transitioning.
            _this.stopTransitioning();

            // Show next slide (using "default" order).
            _this.next('default');

        });
        this.$wrapper.appendChild(this.$next);

        // Previous arrow (if allowed).
        this.$previous = document.createElement('div');
        this.$previous.classList.add('nav', 'previous');
        this.$previous.addEventListener('click', function(event) {

            // Stop transitioning.
            _this.stopTransitioning();

            // Show previous slide (using "default" order).
            _this.previous('default');

        });
        this.$wrapper.appendChild(this.$previous);

        // Swiping.
        this.$wrapper.addEventListener('touchstart', function(event) {

            // More than two touches? Bail.
            if (event.touches.length > 1)
                return;

            // Record drag start.
            dragStart = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };

        });

        this.$wrapper.addEventListener('touchmove', function(event) {

            var dx, dy;

            // No drag start, or more than two touches? Bail.
            if (!dragStart
                || event.touches.length > 1)
                return;

            // Record drag end.
            dragEnd = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };

            // Determine deltas.
            dx = dragStart.x - dragEnd.x;
            dy = dragStart.y - dragEnd.y;

            // Doesn't exceed threshold? Bail.
            if (Math.abs(dx) < 50)
                return;

            // Prevent default.
            event.preventDefault();

            // Positive value? Move to next.
            if (dx > 0) {

                // Stop transitioning.
                _this.stopTransitioning();

                // Show next slide (using "default" order).
                _this.next('default');

            }

            // Negative value? Move to previous.
            else if (dx < 0) {

                // Stop transitioning.
                _this.stopTransitioning();

                // Show previous slide (using "default" order).
                _this.previous('default');

            }

        });

        this.$wrapper.addEventListener('touchend', function(event) {

            // Clear drag start, end.
            dragStart = null;
            dragEnd = null;

        });

    }

    // Create slides.
    for (i = 0; i < this.images.length; i++) {

        // Preload?
        if (this.preload) {

            // Create img.
            this.$img = document.createElement('img');
            this.$img.src = this.images[i].src;
            this.$img.addEventListener('load', function(event) {

                // Increment loaded count.
                loaded++;

            });

        }

        // Create slide.
        $slide = document.createElement('div');
        // Ensure image path starts with a slash for static files
        var imageSrc = this.images[i].src;
        if (imageSrc && !imageSrc.startsWith('/') && !imageSrc.startsWith('http')) {
            // If it's a relative path, make it absolute from root
            imageSrc = '/' + imageSrc.replace(/^assets\/images\//, 'images/');
        }
        $slide.style.backgroundImage = 'url(\'' + imageSrc + '\')';
        $slide.style.backgroundPosition = this.images[i].position;
        $slide.style.backgroundRepeat = 'no-repeat';
        $slide.style.backgroundSize = (this.preserveImageAspectRatio ? 'contain' : 'cover');
        $slide.setAttribute('role', 'img');
        $slide.setAttribute('aria-label', this.images[i].caption);
        this.$target.appendChild($slide);

        // Apply motion classes (if applicable).
        if (this.images[i].motion != 'none') {

            $slide.classList.add(this.images[i].motion);
            $slide.classList.add(this.speedClassName(this.images[i].speed));

        }

        // Link URL provided?
        if ('linkUrl' in this.images[i]) {

            // Set cursor style to pointer.
            $slide.style.cursor = 'pointer';

            // Set linkUrl property on slide.
            $slide._linkUrl = this.images[i].linkUrl;

            // Mark hasLinks as true.
            hasLinks = true;

        }

        // Add to array.
        this.$slides.push($slide);

    }

    // Has links? Add click event listener to target.
    if (hasLinks)
        this.$target.addEventListener('click', function(event) {

            var slide;

            // Target doesn't have linkUrl property? Bail.
            if (!('_linkUrl' in event.target))
                return;

            // Get slide.
            slide = event.target;

            // Onclick provided?
            if ('onclick' in slide._linkUrl) {

                // Run handler.
                (slide._linkUrl.onclick)(event);

                return;

            }

            // Href provided?
            if ('href' in slide._linkUrl) {

                // URL is a hash URL?
                if (slide._linkUrl.href.charAt(0) == '#') {

                    // Go to hash URL.
                    window.location.href = slide._linkUrl.href;

                    return;

                }

                // Target provided and it's "_blank"? Open URL in new tab.
                if ('target' in slide._linkUrl
                    && slide._linkUrl.target == '_blank')
                    window.open(slide._linkUrl.href);

                // Otherwise, just go to URL.
                else
                    window.location.href = slide._linkUrl.href;

            }

        });

    // Determine starting position.
    switch (this.order) {

        case 'random':

            // Randomly pick starting position.
            this.pos = (Math.ceil(Math.random() * this.$slides.length) - 1);

            break;

        case 'reverse':

            // Start at end.
            this.pos = this.$slides.length - 1;

            break;

        case 'default':
        default:

            // Start at beginning.
            this.pos = 0;

            break;

    }

    // Update last position.
    this.lastPos = this.pos;

    // Preload?
    if (this.preload)
        intervalId = setInterval(function() {

            // All images loaded?
            if (loaded >= _this.images.length) {

                // Stop checking.
                clearInterval(intervalId);

                // Clear loading.
                clearTimeout(_this.preloadTimeout);
                _this.$target.classList.remove('is-loading');

                // Start.
                _this.start();

            }

        }, 250);

    // Otherwise ...
    else {

        // Start.
        this.start();

    }

};

/**
 * Moves to an adjacent slide.
 * @param {int} direction Direction (1 = forwards, -1 = backwards).
 * @param {string} activeOrder Active order.
 */
slideshowBackground.prototype.move = function(direction, activeOrder) {

    var pos, order;

    // No active order provided? Fall back on default.
    if (!activeOrder)
        activeOrder = this.order;

    // Determine effective order based on chosen direction.
    switch (direction) {

        // Forwards: use active order as-is.
        case 1:
            order = activeOrder;
            break;

        // Backwards: inverse active order.
        case -1:
            switch (activeOrder) {

                case 'random':
                    // Extract image URL from inline style
                    var bgImage = this.$slides[this.pos].style.backgroundImage;
                    var src = bgImage.replace(/^url\(['"](.*)['"]\)$/, '$1');
                    
                    // Ensure path starts with a slash for static files
                    if (src && !src.startsWith('/') && !src.startsWith('http')) {
                        // If it's a relative path, make it absolute from root
                        src = '/' + src.replace(/^assets\/images\//, 'images/');
                    }
                    order = 'random';
                    break;

                case 'reverse':
                    order = 'default';
                    break;

                case 'default':
                default:
                    order = 'reverse';
                    break;

            }

            break;

        // Anything else: bail.
        default:
            return;

    }

    // Determine new position based on effective order.
    switch (order) {

        case 'random':

            // Randomly pick position.
            for (;;) {

                pos = (Math.ceil(Math.random() * this.$slides.length) - 1);

                // Didn't pick current position? Stop.
                if (pos != this.pos)
                    break;

            }

            break;

        case 'reverse':

            // Decrement position.
            pos = this.pos - 1;

            // Wrap to end if necessary.
            if (pos < 0)
                pos = this.$slides.length - 1;

            break;

        case 'default':
        default:

            // Increment position.
            pos = this.pos + 1;

            // Wrap to beginning if necessary.
            if (pos >= this.$slides.length)
                pos = 0;

            break;

    }

    // Show pos.
    this.show(pos);

};

/**
 * Moves to next slide.
 * @param {string} activeOrder Active order.
 */
slideshowBackground.prototype.next = function(activeOrder) {

    // Move forwards.
    this.move(1, activeOrder);

};

/**
 * Moves to previous slide.
 * @param {string} activeOrder Active order.
 */
slideshowBackground.prototype.previous = function(activeOrder) {

    // Move backwards.
    this.move(-1, activeOrder);

};

/**
 * Shows a slide.
 * @param {int} pos Position.
 */
slideshowBackground.prototype.show = function(pos) {

    var _this = this;

    // Locked? Bail.
    if (this.locked)
        return;

    // Capture current position.
    this.lastPos = this.pos;

    // Switch to new position.
    this.pos = pos;

    // Perform transition.
    switch (this.transition.style) {

        case 'instant':

            // Swap top slides.
            this.$slides[this.lastPos].classList.remove('top');
            this.$slides[this.pos].classList.add('top');

            // Show current slide.
            this.$slides[this.pos].classList.add('visible');

            // Start playing current slide.
            this.$slides[this.pos].classList.add('is-playing');

            // Hide last slide.
            this.$slides[this.lastPos].classList.remove('visible');
            this.$slides[this.lastPos].classList.remove('initial');

            // Stop playing last slide.
            this.$slides[this.lastPos].classList.remove('is-playing');

            break;

        case 'crossfade':

            // Lock.
            this.locked = true;

            // Swap top slides.
            this.$slides[this.lastPos].classList.remove('top');
            this.$slides[this.pos].classList.add('top');

            // Show current slide.
            this.$slides[this.pos].classList.add('visible');

            // Start playing current slide.
            this.$slides[this.pos].classList.add('is-playing');

            // Wait for fade-in to finish.
            setTimeout(function() {

                // Hide last slide.
                _this.$slides[_this.lastPos].classList.remove('visible');
                _this.$slides[_this.lastPos].classList.remove('initial');

                // Stop playing last slide.
                _this.$slides[_this.lastPos].classList.remove('is-playing');

                // Unlock.
                _this.locked = false;

            }, this.transition.speed);

            break;

        case 'fade':

            // Lock.
            this.locked = true;

            // Hide last slide.
            this.$slides[this.lastPos].classList.remove('visible');

            // Wait for fade-out to finish.
            setTimeout(function() {

                // Stop playing last slide.
                _this.$slides[_this.lastPos].classList.remove('is-playing');

                // Swap top slides.
                _this.$slides[_this.lastPos].classList.remove('top');
                _this.$slides[_this.pos].classList.add('top');

                // Start playing current slide.
                _this.$slides[_this.pos].classList.add('is-playing');

                // Show current slide.
                _this.$slides[_this.pos].classList.add('visible');

                // Unlock.
                _this.locked = false;

            }, this.transition.speed);

            break;

        default:
            break;

    }

};

/**
 * Starts the slideshow.
 */
slideshowBackground.prototype.start = function() {

    var _this = this;

    // Prepare initial slide.
    this.$slides[_this.pos].classList.add('visible');
    this.$slides[_this.pos].classList.add('top');
    this.$slides[_this.pos].classList.add('initial');
    this.$slides[_this.pos].classList.add('is-playing');

    // Single slide? Bail.
    if (this.$slides.length == 1)
        return;

    // Wait (if needed).
    setTimeout(function() {

        // Start transitioning.
        _this.startTransitioning();

    }, this.wait);

};

/**
 * Starts transitioning.
 */
slideshowBackground.prototype.startTransitioning = function() {

    var _this = this;

    // Delay not in use? Bail.
    if (this.transition.delay === false)
        return;

    // Start transition interval.
    this.transitionInterval = setInterval(function() {

        // Move to next slide.
        _this.next();

    }, this.transition.delay);

};

/**
 * Stops transitioning.
 */
slideshowBackground.prototype.stopTransitioning = function() {

    var _this = this;

    // Clear transition interval.
    clearInterval(this.transitionInterval);

    // Resume in use?
    if (this.transition.resume !== false) {

        // Clear resume timeout (if one already exists).
        clearTimeout(this.resumeTimeout);

        // Set resume timeout.
        this.resumeTimeout = setTimeout(function() {

            // Start transitioning.
            _this.startTransitioning();

        }, this.transition.resume);

    }

};

// Slideshow initialization for slideshow05
(function() {

    new slideshowBackground('slideshow05', {
        target: '#slideshow05 .bg',
        wrapper: '#slideshow05 .content',
        wait: 0,
        defer: false,
        navigation: true,
        order: 'default',
        preserveImageAspectRatio: true,
        transition: {
            style: 'fade',
            speed: 500,
            delay: 3000,
            resume: 3000,
        },
        images: [
            {
                src: '/images/slideshow05-09c25a8a.jpg',
                position: 'center',
                motion: 'none',
                speed: 2,
                caption: 'Exterior Window Sticker Blank',
            },
            {
                src: '/images/slideshow05-dc3af612.jpg',
                position: 'center',
                motion: 'none',
                speed: 2,
                caption: 'Exterior Window Sticker Blank',
            },
            {
                src: '/images/slideshow05-77503dcc.jpg',
                position: 'center',
                motion: 'none',
                speed: 2,
                caption: 'Untitled',
            },
        ]
    });

})();

// Slideshow initialization for slideshow06
(function() {

    new slideshowBackground('slideshow06', {
        target: '#slideshow06 .bg',
        wrapper: '#slideshow06 .content',
        wait: 0,
        defer: false,
        navigation: true,
        order: 'default',
        preserveImageAspectRatio: true,
        transition: {
            style: 'crossfade',
            speed: 500,
            delay: 3000,
            resume: 3000,
        },
        images: [
            {
                src: '/images/slideshow06-0cd21dcf.jpg',
                position: 'center',
                motion: 'none',
                speed: 2,
                caption: 'Exterior Window Sticker Custom',
            },
            {
                src: '/images/slideshow06-f74c3c8c.jpg',
                position: 'center',
                motion: 'none',
                speed: 2,
                caption: 'Exterior Window Sticker Custom',
            },
            {
                src: '/images/slideshow06-40899e5c.jpg',
                position: 'center',
                motion: 'none',
                speed: 2,
                caption: 'Exterior Window Sticker Custom',
            },
        ]
    });

})();
