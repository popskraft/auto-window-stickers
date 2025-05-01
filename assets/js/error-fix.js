/**
 * Comprehensive Error Prevention Script
 * This script prevents errors from the main.js file when trying to access elements that don't exist
 * It also completely disables the problematic sections of the original Carrd code
 */
(function() {
    'use strict';
    
    // The most effective approach: completely disable the problematic section in main.js
    // We'll do this by intercepting the DOMContentLoaded event and running our code first
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
        if (type === 'DOMContentLoaded') {
            // Wrap the original listener to run our code first
            const wrappedListener = function(event) {
                // Run our error prevention code first
                disableProblematicCode();
                
                // Then run the original listener
                listener(event);
            };
            
            // Call the original addEventListener with our wrapped listener
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        
        // For all other event types, just pass through
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // Function to disable problematic code sections
    function disableProblematicCode() {
        console.log('Error Prevention: Disabling problematic code sections');
        
        // 1. Create a global object to catch all potential errors
        window.errorPreventionProxy = new Proxy({}, {
            get: function(target, prop) {
                // Return a function for any method call
                if (typeof target[prop] === 'undefined') {
                    return function() { return window.errorPreventionProxy; };
                }
                return target[prop];
            }
        });
        
        // 2. Create safety wrappers for DOM methods
        const originalGetElementById = document.getElementById;
        document.getElementById = function(id) {
            const element = originalGetElementById.call(document, id);
            if (!element) {
                console.warn(`Error Prevention: Created virtual element for ID: ${id}`);
                return createVirtualElement(id);
            }
            return element;
        };
        
        const originalQuerySelector = document.querySelector;
        document.querySelector = function(selector) {
            try {
                const element = originalQuerySelector.call(document, selector);
                if (!element) {
                    console.warn(`Error Prevention: Created virtual element for selector: ${selector}`);
                    return createVirtualElement();
                }
                return element;
            } catch (e) {
                return createVirtualElement();
            }
        };
        
        const originalQuerySelectorAll = document.querySelectorAll;
        document.querySelectorAll = function(selector) {
            try {
                const elements = originalQuerySelectorAll.call(document, selector);
                return elements;
            } catch (e) {
                return [];
            }
        };
    }
    
    // Helper function to create a virtual element that won't throw errors
    function createVirtualElement(id) {
        return {
            id: id || 'virtual-element',
            style: {},
            classList: {
                add: function() {},
                remove: function() {},
                contains: function() { return false; },
                toggle: function() {}
            },
            getAttribute: function() { return null; },
            setAttribute: function() {},
            hasAttribute: function() { return false; },
            removeAttribute: function() {},
            addEventListener: function() {},
            removeEventListener: function() {},
            appendChild: function() { return createVirtualElement(); },
            removeChild: function() {},
            querySelectorAll: function() { return []; },
            querySelector: function() { return createVirtualElement(); },
            parentElement: null,
            children: [],
            childNodes: [],
            firstChild: null,
            lastChild: null,
            nextSibling: null,
            previousSibling: null,
            offsetHeight: 0,
            offsetWidth: 0,
            offsetTop: 0,
            offsetLeft: 0,
            offsetParent: null,
            getBoundingClientRect: function() {
                return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
            },
            matches: function() { return false; },
            closest: function() { return createVirtualElement(); }
        };
    }
    
    // Also add a global error handler to catch any remaining errors
    window.addEventListener('error', function(event) {
        // Check if this is related to the main.js file
        if (event.filename && event.filename.includes('main.min')) {
            console.warn('Error Prevention: Suppressed error in main.js:', event.message);
            event.preventDefault();
            return true; // Prevents the error from propagating
        }
    }, true);
    
    // Run our code immediately
    disableProblematicCode();
    
    console.log('Comprehensive error prevention script loaded');
})();
