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
        
        // Reset all answers initially
        const faqAnswers = document.querySelectorAll('#faqBody .collapse-target');
        faqAnswers.forEach(answer => {
            // Remove any inline styles that might be interfering
            answer.removeAttribute('style');
            // Remove any visible class
            answer.classList.remove('visible');
        });
        
        // Add click event listeners to all FAQ questions
        faqQuestions.forEach(question => {
            question.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent any default behavior
                
                // Toggle active class on the question
                this.classList.toggle('active');
                
                // Get the next element (answer)
                const answer = this.nextElementSibling;
                
                // If it's not an answer with collapse-target class, try to find it
                if (!answer || !answer.classList.contains('collapse-target')) {
                    console.warn('FAQ: Could not find answer element directly after question');
                    return;
                }
                
                // Clear any existing inline styles first
                answer.removeAttribute('style');
                
                // Toggle visibility class on the answer
                if (this.classList.contains('active')) {
                    // Show answer
                    answer.classList.add('visible');
                    console.log('FAQ: Showing answer');
                } else {
                    // Hide answer
                    answer.classList.remove('visible');
                    console.log('FAQ: Hiding answer');
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
        
        // Sticky Navigation functionality
        const navSticky = document.getElementById('navSticky');
        if (navSticky) {
            // Create a standalone sticky nav container that will be fixed to the top
            const stickyNavContainer = document.createElement('div');
            stickyNavContainer.id = 'stickyNavContainer';
            stickyNavContainer.className = 'sticky-nav-container';
            
            // Clone the navigation for the sticky version
            const navClone = navSticky.cloneNode(true);
            navClone.id = 'navStickyClone';
            stickyNavContainer.appendChild(navClone);
            document.body.appendChild(stickyNavContainer);
            
            // Calculate threshold as 1.5 times the viewport height
            let scrollThreshold = window.innerHeight * 1.5;
            
            // Function to handle scroll event
            function handleScroll() {
                // Only show sticky nav when scrolled past 1.5 times the viewport height
                if (window.scrollY > scrollThreshold) {
                    stickyNavContainer.classList.add('visible');
                } else {
                    stickyNavContainer.classList.remove('visible');
                }
            }
            
            // Add scroll event listener
            window.addEventListener('scroll', handleScroll);
            
            // Initial check in case page is loaded scrolled down
            handleScroll();
            
            // Handle window resize to recalculate threshold
            window.addEventListener('resize', function() {
                // Recalculate threshold on window resize
                scrollThreshold = window.innerHeight * 1.5;
                
                // Re-check scroll position
                handleScroll();
            });
            
            console.log('Sticky Navigation initialized with 1.5x viewport threshold');
        }
    });
})();
