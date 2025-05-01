/**
 * Simple Slideshow Implementation
 * A lightweight slideshow implementation that works with the existing HTML structure
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    console.log('Simple Slideshow: Initializing');
    
    // Find all slideshows on the page
    const slideshows = document.querySelectorAll('.productSlider.slideshow');
    
    if (slideshows.length === 0) {
        console.log('Simple Slideshow: No slideshows found');
        return;
    }
    
    console.log(`Simple Slideshow: Found ${slideshows.length} slideshows`);
    
    // Initialize each slideshow
    slideshows.forEach(function(slideshow) {
        initializeSlideshow(slideshow);
    });
    
    function initializeSlideshow(slideshow) {
        const id = slideshow.id;
        const slidesContainer = slideshow.querySelector('.bg');
        const slides = slidesContainer.querySelectorAll('[role="img"]');
        const nextButton = slideshow.querySelector('.nav.next');
        const prevButton = slideshow.querySelector('.nav.previous');
        
        let currentIndex = 0;
        
        console.log(`Simple Slideshow: Initializing slideshow ${id} with ${slides.length} slides`);
        
        // Make sure at least one slide is visible initially
        if (slides.length > 0 && !slides[0].classList.contains('visible')) {
            slides[0].classList.add('visible', 'top', 'initial');
        }
        
        // Add click handlers to navigation buttons
        if (nextButton) {
            nextButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showNextSlide();
                console.log(`Simple Slideshow: Next button clicked in ${id}, showing slide ${currentIndex + 1}`);
            });
            console.log(`Simple Slideshow: Added next button handler for ${id}`);
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showPrevSlide();
                console.log(`Simple Slideshow: Previous button clicked in ${id}, showing slide ${currentIndex + 1}`);
            });
            console.log(`Simple Slideshow: Added previous button handler for ${id}`);
        }
        
        function showNextSlide() {
            // Hide current slide
            slides[currentIndex].classList.remove('visible', 'top', 'initial');
            
            // Increment index (with wrapping)
            currentIndex = (currentIndex + 1) % slides.length;
            
            // Show new slide
            slides[currentIndex].classList.add('visible');
        }
        
        function showPrevSlide() {
            // Hide current slide
            slides[currentIndex].classList.remove('visible', 'top', 'initial');
            
            // Decrement index (with wrapping)
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            
            // Show new slide
            slides[currentIndex].classList.add('visible');
        }
    }
});
