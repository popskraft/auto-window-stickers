/**
 * Targeted Error Prevention Script
 * This script prevents specific errors from the main.js file without disabling animations
 * It only creates virtual elements for missing DOM elements that would cause errors
 */
(function() {
    'use strict';
    
    console.log('Targeted error prevention script loaded');
    
    // Create safety wrappers for DOM methods that only activate when needed
    const originalGetElementById = document.getElementById;
    document.getElementById = function(id) {
        const element = originalGetElementById.call(document, id);
        if (!element) {
            // Only create virtual elements for specific problematic IDs
            // You can add more IDs here if needed
            const problematicIds = ['slideshow05', 'slideshow06', 'slideshow07'];
            if (problematicIds.includes(id)) {
                console.warn(`Error Prevention: Created virtual element for missing ID: ${id}`);
                return createVirtualElement(id);
            }
        }
        return element;
    };
    
    // Helper function to create a minimal virtual element that won't throw errors
    // but still allows animations to work on real elements
    function createVirtualElement(id) {
        const virtualElement = document.createElement('div');
        virtualElement.id = id || 'virtual-element';
        virtualElement.style.display = 'none';
        virtualElement.setAttribute('data-virtual', 'true');
        
        // Add it to the DOM but hidden, so it can be found but won't affect layout
        document.body.appendChild(virtualElement);
        
        return virtualElement;
    }
    
    // Add a global error handler to catch specific errors without affecting animations
    window.addEventListener('error', function(event) {
        // Only suppress specific errors from main.js
        if (event.filename && event.filename.includes('main.') && 
            event.message && event.message.includes('Cannot read properties of null')) {
            console.warn('Error Prevention: Suppressed null property error in main.js');
            event.preventDefault();
            return true; // Prevents the error from propagating
        }
    }, true);
    
})();
