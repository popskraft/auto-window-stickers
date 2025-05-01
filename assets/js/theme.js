/**
 * Navigation Active Link Highlighter
 * This script adds active/inactive classes to navigation links based on current section
 * No classes are added on the home page (when no hash is present)
 */
(function() {
    'use strict';

    console.log('Navigation Highlighter: Initializing');

    // Function to update navigation links based on current hash
    function updateNavLinks() {
        // Get current hash (without the #)
        const currentHash = window.location.hash.replace('#', '');

        // Find all navigation menus
        const navMenus = document.querySelectorAll('ul.main-nav');

        // If we're on the home page (no hash), remove all active/inactive classes
        if (!currentHash) {
            navMenus.forEach(menu => {
                const listItems = menu.querySelectorAll('li');
                listItems.forEach(item => {
                    item.classList.remove('active', 'inactive');
                });
            });
            console.log('Navigation Highlighter: On home page - removed all classes');
            return;
        }

        // If we have a hash (not on home page), proceed with normal behavior
        navMenus.forEach(menu => {
            // Get all links in this menu
            const links = menu.querySelectorAll('a');

            // Process each link
            links.forEach(link => {
                // Get the link's href and extract the hash part
                const linkHash = link.getAttribute('href').replace('#', '');

                // Get the parent li element
                const listItem = link.closest('li');

                if (linkHash === currentHash) {
                    // This link matches the current hash - make it active
                    listItem.classList.add('active');
                    listItem.classList.remove('inactive');
                } else {
                    // This link doesn't match - make it inactive
                    listItem.classList.remove('active');
                    listItem.classList.add('inactive');
                }
            });
        });

        console.log(`Navigation Highlighter: Updated for hash '${currentHash}'`);
    }

    // Update on page load
    document.addEventListener('DOMContentLoaded', function() {
        updateNavLinks();
    });

    // Update when hash changes
    window.addEventListener('hashchange', function() {
        updateNavLinks();
    });

    // Also update after a short delay to ensure everything is loaded
    window.addEventListener('load', function() {
        setTimeout(updateNavLinks, 100);
    });
})();



/**
 * Slider Auto-Rotation Blocker
 * This script prevents automatic rotation in slideshows with the productSlider class
 * while preserving manual navigation functionality
 * Safari-compatible version
 */
(function() {
    'use strict';

    console.log('Custom Slider Init: Loading Safari-compatible slider blocker');

    // Store the original setInterval function
    const originalSetInterval = window.setInterval;

    // Flag to track if we're inside a slideshow context
    let slideshowContextActive = false;

    // Find all slideshow elements on the page
    const slideshowElements = document.querySelectorAll('.productSlider.slideshow');
    if (slideshowElements.length > 0) {
        console.log(`Custom Slider Init: Found ${slideshowElements.length} slideshow elements`);
        slideshowContextActive = true;
    }

    // Override setInterval to block slideshow timers
    window.setInterval = function(callback, delay) {
        // If this looks like a slideshow timer (typical delay between 1-30 seconds)
        // and we have slideshows on the page
        if (slideshowContextActive && delay >= 1000 && delay <= 30000) {
            // Try to detect if this is a slideshow timer
            let isSlideshow = false;

            // Method 1: Check stack trace if available
            try {
                const stack = new Error().stack;
                if (stack && stack.toString().includes('slideshow')) {
                    isSlideshow = true;
                }
            } catch (e) {
                // Stack trace not available or errored
            }

            // Method 2: Always block timers with common slideshow delays
            if (delay === 3000 || delay === 5000 || delay === 6000) {
                isSlideshow = true;
            }

            if (isSlideshow) {
                console.log(`Custom Slider Init: Blocked potential slideshow timer with delay ${delay}ms`);
                // Return a fake timer ID that won't cause errors if cleared
                return 999999;
            }
        }

        // Otherwise, call the original function
        return originalSetInterval.apply(this, arguments);
    };

    // Store the original setTimeout function
    const originalSetTimeout = window.setTimeout;

    // Override setTimeout to intercept any that might be related to slideshow initialization
    window.setTimeout = function(callback, delay, ...args) {
        // Wrap all callbacks to catch removeChild errors
        const safeCallback = function() {
            try {
                // Monkey patch Node.removeChild to prevent errors
                const originalRemoveChild = Node.prototype.removeChild;
                Node.prototype.removeChild = function(child) {
                    if (!this.contains(child)) {
                        console.log('Custom Slider Init: Prevented removeChild error');
                        return child; // Return the child without removing it
                    }
                    return originalRemoveChild.call(this, child);
                };

                // Call the original callback
                callback();

                // Restore original removeChild
                Node.prototype.removeChild = originalRemoveChild;
            } catch (e) {
                console.log('Custom Slider Init: Caught error in setTimeout callback', e);
            }
        };

        // Call with our safe callback
        return originalSetTimeout.call(this, safeCallback, delay, ...args);
    };

    // Function to ensure sliders don't auto-rotate
    function stopSliderAutoRotation() {
        const sliders = document.querySelectorAll('.productSlider.slideshow');

        sliders.forEach(slider => {
            // Remove any playing classes
            slider.querySelectorAll('.is-playing').forEach(el => {
                el.classList.remove('is-playing');
            });
        });
    }

    // Set up multiple checkpoints
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(stopSliderAutoRotation, 100);
        setTimeout(stopSliderAutoRotation, 1500);
    });

    window.addEventListener('load', function() {
        setTimeout(stopSliderAutoRotation, 100);
        setTimeout(stopSliderAutoRotation, 1000);
    });
})();


/**
 * FAQ Toggler
 * This script toggles active classes on FAQ questions and answers when a question is clicked.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ titles within faqBody
    const faqTitles = document.querySelectorAll('#faqBody .style2');

    // Add click event listener to each title
    faqTitles.forEach(title => {
        title.addEventListener('click', function() {
            // Toggle active class on the title
            this.classList.toggle('active');

            // Get the next element (answer)
            const answer = this.nextElementSibling;

            // If it's not an answer (style3), skip it
            if (!answer || !answer.classList.contains('style3')) { // Added check for existence of answer
                return;
            }

            // Toggle active class on the answer
            answer.classList.toggle('active');
        });
    });
});
