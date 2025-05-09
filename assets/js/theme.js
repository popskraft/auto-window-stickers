/**
 * Theme-specific JavaScript
 * This file contains custom functionality for the site
 */
(function() {
    'use strict';
    
    console.log('Theme JS: Initializing');
    
    // Fix for removeChild errors in main.js
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function(child) {
        if (!this.contains(child)) {
            console.warn('Theme JS: Prevented removeChild error');
            return child; // Return the child without removing it
        }
        return originalRemoveChild.call(this, child);
    };
    
    // Add additional event listeners for the FAQ functionality
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
                if (!answer || !answer.classList.contains('style3')) {
                    return;
                }
                
                // Toggle active class on the answer
                answer.classList.toggle('active');
            });
        });
    });
    
})();
