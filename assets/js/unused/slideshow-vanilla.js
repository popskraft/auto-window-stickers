/**
 * Slideshow functionality extracted from main.js
 * This file contains only the slideshow-related code from the original main.js file
 * Converted to use vanilla JavaScript instead of jQuery
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

            case 'fade':
            case 'fade-in':
            case 'fade-out':
                this.transition.delay = this.transition.delay + this.transition.speed;
                break;

            case 'crossfade':
                this.transition.delay = this.transition.delay + (this.transition.speed * 2);
                break;

            case 'slide-left':
            case 'slide-right':
                this.transition.delay = this.transition.delay + this.transition.speed;
                break;

        }

    // Defer?
    if (this.defer) {

        // Add load event to first image.
        var img = document.createElement('img');

        img.addEventListener('load', function () {

            // Initialize slideshow.
            _this.init();

        });

        img.src = this.images[0].src;

    }
    // Otherwise?
    else {

        // Initialize slideshow.
        this.init();

    }

}

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
        if (this.navigation.next) {

            var $navNext = document.querySelector(this.navigation.next);
            
            if ($navNext) {
                $navNext.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    // Stop transitioning.
                    _this.stopTransitioning();
    
                    // Show next slide (using "default" order).
                    _this.next('default');
    
                });
            }
        }

        // Previous arrow (if allowed).
        if (this.navigation.previous) {

            var $navPrevious = document.querySelector(this.navigation.previous);
            
            if ($navPrevious) {
                $navPrevious.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    // Stop transitioning.
                    _this.stopTransitioning();
    
                    // Show previous slide (using "default" order).
                    _this.previous('default');
    
                });
            }
        }

    }

    // Swipe events (if wrapper exists).
    if (this.$wrapper) {

        this.$wrapper.addEventListener('touchstart', function(event) {

            // Stop transitioning.
            _this.stopTransitioning();

            // Record drag start.
            dragStart = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };

        });

        this.$wrapper.addEventListener('touchmove', function(event) {

            // No drag start? Bail.
            if (!dragStart)
                return;

            // Record drag end.
            dragEnd = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };

        });

        this.$wrapper.addEventListener('touchend', function(event) {

            var diffX, diffY, threshold;

            // No drag start or end? Bail.
            if (!dragStart
            ||  !dragEnd)
                return;

            // Calculate threshold.
            threshold = Math.max(
                Math.floor(0.01 * window.innerWidth),
                20
            );

            // Calculate difference.
            diffX = (dragStart.x - dragEnd.x);
            diffY = (dragStart.y - dragEnd.y);

            // Absolute values.
            diffX = Math.abs(diffX);
            diffY = Math.abs(diffY);

            // Was this a horizontal swipe?
            if (diffX > diffY
            &&  diffX > threshold) {

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

    // Set up slides.
    for (i=0; i < this.images.length; i++) {

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

        // Link URL?
        if ('linkUrl' in this.images[i]) {

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
            if (!_this.$slides[_this.pos]._linkUrl)
                return;

            // Open link URL.
            window.location.href = _this.$slides[_this.pos]._linkUrl;

        });

    // Preload?
    if (this.preload) {

        // Preload handler.
        var preloadHandler = function() {

            // Preloaded enough slides? Bail.
            if (loaded >= _this.images.length)
                return;

            // Preload next slide.
            var img = document.createElement('img');

            img.addEventListener('load', function() {

                // Increment loaded slides.
                loaded++;

                // Preload next slide.
                preloadHandler();

            });

            img.src = _this.images[loaded].src;

        };

        // Clear preload timeout.
        clearTimeout(this.preloadTimeout);

        // Set preload timeout.
        this.preloadTimeout = setTimeout(function() {

            // Start preloading.
            preloadHandler();

        }, this.wait);

    }

    // Show first slide.
    this.show(0, true);

    // Begin transitioning (if allowed).
    if (this.transition.delay !== false)
        this.startTransitioning();

};

/**
 * Shows a specific slide.
 * @param {integer} pos Position.
 * @param {boolean} firstRun First run?
 */
slideshowBackground.prototype.show = function(pos, firstRun) {

    var _this = this,
        $slide,
        $tmp,
        transitionOrder,
        transitionOrderReverse,
        transitions = {
            'fade': {
                inHandler: function(event) {

                    // Not a transition event for this slide? Bail.
                    if (event.target != $slide)
                        return;

                    // Remove event listeners.
                    $slide.removeEventListener('transitionend', transitions.fade.inHandler);
                    $slide.removeEventListener('transitioncancel', transitions.fade.inHandler);

                    // Clear inline transition.
                    $slide.style.transition = '';

                    // Add visible class.
                    $slide.classList.add('visible');

                    // Unlock.
                    _this.locked = false;

                },
                outHandler: function(event) {

                    // Not a transition event for this slide? Bail.
                    if (event.target != $tmp)
                        return;

                    // Remove event listeners.
                    $tmp.removeEventListener('transitionend', transitions.fade.outHandler);
                    $tmp.removeEventListener('transitioncancel', transitions.fade.outHandler);

                    // Remove slide.
                    $tmp.parentElement.removeChild($tmp);

                    // Unlock.
                    _this.locked = false;

                },
                init: function() {

                    var speed = _this.transition.speed;

                    // Already transitioning? Stop.
                    if (_this.locked)
                        return false;

                    // Lock.
                    _this.locked = true;

                    // Add new slide.
                    $slide = _this.$slides[pos];
                    $slide.style.opacity = 0;
                    $slide.style.transition = 'opacity ' + (speed / 1000.0) + 's ease-in-out';
                    _this.$target.appendChild($slide);

                    // Add event listeners.
                    $slide.addEventListener('transitionend', transitions.fade.inHandler);
                    $slide.addEventListener('transitioncancel', transitions.fade.inHandler);

                    // Force reflow.
                    $slide.offsetHeight;

                    // Show new slide.
                    $slide.style.opacity = 1;

                    // Add previous slide to transition out.
                    if (firstRun)
                        return true;

                    $tmp = _this.$slides[_this.lastPos];
                    $tmp.style.transition = 'opacity ' + (speed / 1000.0) + 's ease-in-out';

                    // Add event listeners.
                    $tmp.addEventListener('transitionend', transitions.fade.outHandler);
                    $tmp.addEventListener('transitioncancel', transitions.fade.outHandler);

                    // Force reflow.
                    $tmp.offsetHeight;

                    // Hide previous slide.
                    $tmp.style.opacity = 0;

                    return true;

                }
            },
            'fade-in': {
                inHandler: function(event) {

                    // Not a transition event for this slide? Bail.
                    if (event.target != $slide)
                        return;

                    // Remove event listeners.
                    $slide.removeEventListener('transitionend', transitions['fade-in'].inHandler);
                    $slide.removeEventListener('transitioncancel', transitions['fade-in'].inHandler);

                    // Clear inline transition.
                    $slide.style.transition = '';

                    // Add visible class.
                    $slide.classList.add('visible');

                    // Unlock.
                    _this.locked = false;

                },
                outHandler: function(event) {

                    // Not a transition event for this slide? Bail.
                    if (event.target != $tmp)
                        return;

                    // Remove event listeners.
                    $tmp.removeEventListener('transitionend', transitions['fade-in'].outHandler);
                    $tmp.removeEventListener('transitioncancel', transitions['fade-in'].outHandler);

                    // Remove slide.
                    $tmp.parentElement.removeChild($tmp);

                    // Unlock.
                    _this.locked = false;

                },
                init: function() {

                    var speed = _this.transition.speed;

                    // Already transitioning? Stop.
                    if (_this.locked)
                        return false;

                    // Lock.
                    _this.locked = true;

                    // Add new slide.
                    $slide = _this.$slides[pos];
                    $slide.style.opacity = 0;
                    $slide.style.transition = 'opacity ' + (speed / 1000.0) + 's ease-in-out';
                    _this.$target.appendChild($slide);

                    // Add event listeners.
                    $slide.addEventListener('transitionend', transitions['fade-in'].inHandler);
                    $slide.addEventListener('transitioncancel', transitions['fade-in'].inHandler);

                    // Force reflow.
                    $slide.offsetHeight;

                    // Show new slide.
                    $slide.style.opacity = 1;

                    // Remove previous slide.
                    if (firstRun)
                        return true;

                    $tmp = _this.$slides[_this.lastPos];
                    _this.$target.removeChild($tmp);

                    return true;

                }
            },
            'fade-out': {
                inHandler: function(event) {

                    // Not a transition event for this slide? Bail.
                    if (event.target != $slide)
                        return;

                    // Remove event listeners.
                    $slide.removeEventListener('transitionend', transitions['fade-out'].inHandler);
                    $slide.removeEventListener('transitioncancel', transitions['fade-out'].inHandler);

                    // Clear inline transition.
                    $slide.style.transition = '';

                    // Add visible class.
                    $slide.classList.add('visible');

                    // Unlock.
                    _this.locked = false;

                },
                outHandler: function(event) {

                    // Not a transition event for this slide? Bail.
                    if (event.target != $tmp)
                        return;

                    // Remove event listeners.
                    $tmp.removeEventListener('transitionend', transitions['fade-out'].outHandler);
                    $tmp.removeEventListener('transitioncancel', transitions['fade-out'].outHandler);

                    // Remove slide.
                    $tmp.parentElement.removeChild($tmp);

                    // Unlock.
                    _this.locked = false;

                },
                init: function() {

                    var speed = _this.transition.speed;

                    // Already transitioning? Stop.
                    if (_this.locked)
                        return false;

                    // Lock.
                    _this.locked = true;

                    // Add new slide.
                    $slide = _this.$slides[pos];
                    _this.$target.appendChild($slide);

                    // Add visible class.
                    $slide.classList.add('visible');

                    // Add previous slide to transition out.
                    if (firstRun)
                        return true;

                    $tmp = _this.$slides[_this.lastPos];
                    $tmp.style.transition = 'opacity ' + (speed / 1000.0) + 's ease-in-out';

                    // Add event listeners.
                    $tmp.addEventListener('transitionend', transitions['fade-out'].outHandler);
                    $tmp.addEventListener('transitioncancel', transitions['fade-out'].outHandler);

                    // Force reflow.
                    $tmp.offsetHeight;

                    // Hide previous slide.
                    $tmp.style.opacity = 0;

                    return true;

                }
            },
            'crossfade': {
                inHandler: function(event) {

                    // Not a transition event for this slide? Bail.
                    if (event.target != $slide)
                        return;

                    // Remove event listeners.
                    $slide.removeEventListener('transitionend', transitions.crossfade.inHandler);
                    $slide.removeEventListener('transitioncancel', transitions.crossfade.inHandler);

                    // Clear inline transition.
                    $slide.style.transition = '';

                    // Add visible class.
                    $slide.classList.add('visible');

                    // Unlock.
                    _this.locked = false;

                },
                outHandler: function(event) {

                    // Not a transition event for this slide? Bail.
                    if (event.target != $tmp)
                        return;

                    // Remove event listeners.
                    $tmp.removeEventListener('transitionend', transitions.crossfade.outHandler);
                    $tmp.removeEventListener('transitioncancel', transitions.crossfade.outHandler);

                    // Remove slide.
                    $tmp.parentElement.removeChild($tmp);

                    // Unlock.
                    _this.locked = false;

                },
                init: function() {

                    var speed = _this.transition.speed;

                    // Already transitioning? Stop.
                    if (_this.locked)
                        return false;

                    // Lock.
                    _this.locked = true;

                    // Add new slide.
                    $slide = _this.$slides[pos];
                    $slide.style.opacity = 0;
                    $slide.style.transition = 'opacity ' + (speed / 1000.0) + 's ease-in-out';
                    _this.$target.appendChild($slide);

                    // Add event listeners.
                    $slide.addEventListener('transitionend', transitions.crossfade.inHandler);
                    $slide.addEventListener('transitioncancel', transitions.crossfade.inHandler);

                    // Force reflow.
                    $slide.offsetHeight;

                    // Show new slide.
                    $slide.style.opacity = 1;

                    // Add previous slide to transition out.
                    if (firstRun)
                        return true;

                    $tmp = _this.$slides[_this.lastPos];
                    $tmp.classList.remove('visible');
                    $tmp.style.transition = 'opacity ' + (speed / 1000.0) + 's ease-in-out';

                    // Add event listeners.
                    $tmp.addEventListener('transitionend', transitions.crossfade.outHandler);
                    $tmp.addEventListener('transitioncancel', transitions.crossfade.outHandler);

                    // Force reflow.
                    $tmp.offsetHeight;

                    // Hide previous slide.
                    $tmp.style.opacity = 0;

                    return true;

                }
            }
        };

    // First run? Add initial slide.
    if (firstRun) {

        // Add new slide.
        $slide = this.$slides[pos];
        $slide.classList.add('visible');
        $slide.classList.add('initial');
        $slide.classList.add('top');
        this.$target.appendChild($slide);

        // Set last pos, pos.
        this.lastPos = pos;
        this.pos = pos;

        return;

    }

    // Handle transition.
    switch (this.transition.style) {

        case 'fade':
        case 'fade-in':
        case 'fade-out':
        case 'crossfade':

            // If a transition is already in progress, bail.
            if (!transitions[this.transition.style].init())
                return;

            break;

        default:
            break;

    }

    // Set last pos, pos.
    this.lastPos = this.pos;
    this.pos = pos;

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
                    order = 'random';
                    break;

                case 'default-reverse':
                    order = 'default';
                    break;

                case 'default':
                default:
                    order = 'default-reverse';
                    break;

            }
            break;

        default:
            break;

    }

    // Determine next position.
    switch (order) {

        case 'random':

            // Determine random position.
            do {
                pos = Math.floor(Math.random() * this.$slides.length);
            } while (pos == this.pos);

            break;

        case 'default-reverse':

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
 * Moves to the next slide.
 * @param {string} activeOrder Active order.
 */
slideshowBackground.prototype.next = function(activeOrder) {
    this.move(1, activeOrder);
};

/**
 * Moves to the previous slide.
 * @param {string} activeOrder Active order.
 */
slideshowBackground.prototype.previous = function(activeOrder) {
    this.move(-1, activeOrder);
};

/**
 * Starts transitioning.
 */
slideshowBackground.prototype.startTransitioning = function() {

    var _this = this;

    // Clear transition interval.
    clearInterval(this.transitionInterval);

    // Set transition interval.
    this.transitionInterval = setInterval(function() {

        // Next slide.
        _this.next();

    }, this.transition.delay);

};

/**
 * Stops transitioning.
 */
slideshowBackground.prototype.stopTransitioning = function() {

    // Clear transition interval.
    clearInterval(this.transitionInterval);

    // Clear resume timeout.
    clearTimeout(this.resumeTimeout);

    // Set resume timeout.
    if (this.transition.resume !== false) {

        var _this = this;

        this.resumeTimeout = setTimeout(function() {

            // Start transitioning.
            _this.startTransitioning();

        }, this.transition.resume);

    }

};

// Slideshow: slideshow05
(function() {
    new slideshowBackground('slideshow05', {
        target: '#slideshow05 .bg',
        wrapper: '#slideshow05',
        navigation: {
            next: '#slideshow05 .nav.next',
            previous: '#slideshow05 .nav.previous'
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
                caption: 'Exterior Window Sticker Blank',
            }
        ],
        order: 'default',
        preserveImageAspectRatio: true,
        transition: {
            style: 'fade',
            speed: 1000,
            delay: 6000,
            resume: 12000
        }
    });
})();

// Slideshow: slideshow06
(function() {
    new slideshowBackground('slideshow06', {
        target: '#slideshow06 .bg',
        wrapper: '#slideshow06',
        navigation: {
            next: '#slideshow06 .nav.next',
            previous: '#slideshow06 .nav.previous'
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
            }
        ],
        order: 'default',
        preserveImageAspectRatio: true,
        transition: {
            style: 'fade',
            speed: 1000,
            delay: 6000,
            resume: 12000
        }
    });
})();
