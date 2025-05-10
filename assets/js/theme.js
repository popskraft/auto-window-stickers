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
        // Fix for FAQ container - remove collapse class
        const faqContainer = document.getElementById('faqBody');
        if (faqContainer) {
            faqContainer.classList.remove('collapse');
        }
        
        // FAQ Accordion
        const faqQuestions = document.querySelectorAll('#faqBody .style2');
        
        // Hide all answers initially
        const faqAnswers = document.querySelectorAll('#faqBody .collapse-target');
        faqAnswers.forEach(answer => {
            answer.style.display = 'none';
        });
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                // Toggle active class on the question
                this.classList.toggle('active');
                
                // Get the next element (answer)
                const answer = this.nextElementSibling;
                
                // If it's not an answer with collapse-target class, skip it
                if (!answer || !answer.classList.contains('collapse-target')) {
                    return;
                }
                
                // Toggle display of the answer
                if (answer.style.display === 'none' || answer.style.display === '') {
                    answer.style.display = 'block';
                } else {
                    answer.style.display = 'none';
                }
            });
        });
    });
    
    // Navigation menu active state handler
    document.addEventListener('DOMContentLoaded', function() {
        const navLinks = document.querySelectorAll('#links02.main-nav li a');
        const currentPath = window.location.pathname;
        let hasActiveItem = false;
        
        // First pass: check if any link should be active
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            const sectionName = linkPath.replace(/\//g, '').trim(); // e.g., 'exterior' or 'interior'
            
            // Check if current path starts with the link path (section match)
            // or if it contains the section name (for product pages within a section)
            if (currentPath.startsWith(linkPath) || 
                currentPath.includes('/' + sectionName + '/')) {
                link.parentElement.classList.add('active');
                hasActiveItem = true;
            }
        });
        
        // Only apply inactive class to other items if we have an active item
        if (hasActiveItem) {
            navLinks.forEach(link => {
                if (!link.parentElement.classList.contains('active')) {
                    link.parentElement.classList.add('inactive');
                }
            });
        }
    });
})();
