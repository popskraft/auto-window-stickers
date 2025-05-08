// Slideshow Background Class
class SlideshowBackground {
    constructor(id, settings) {
        this.id = id;
        this.settings = Object.assign({
            target: null,
            wait: 0,
            defer: false,
            order: 'default',
            transition: {
                style: 'crossfade',
                speed: 875,
                delay: 5000
            },
            images: []
        }, settings);

        this.pos = 0;
        this.lastPos = 0;
        this.target = document.querySelector(this.settings.target);
        this.slides = [];
        this.timer = null;
        this.paused = false;

        // Only initialize if we have both a target and images
        if (this.target && this.settings.images && this.settings.images.length > 0) {
            this.init();
        } else {
            console.warn('SlideshowBackground: Missing target element or images');
        }
    }

    init() {
        // Clear any existing slides
        this.target.innerHTML = '';

        // Create slides
        for (let image of this.settings.images) {
            if (!image || !image.src) continue;

            let slide = document.createElement('div');
            slide.className = 'slide';
            slide.style.backgroundImage = `url(${image.src})`;
            slide.style.backgroundPosition = image.position || 'center';
            this.target.appendChild(slide);
            this.slides.push(slide);
        }

        // Only proceed if we have slides
        if (this.slides.length > 0) {
            // Show first slide
            this.slides[0].classList.add('visible');

            // Start timer if we have more than one slide
            if (this.slides.length > 1 && this.settings.transition.delay > 0) {
                this.timer = setInterval(() => this.next(), this.settings.transition.delay);
            }
        } else {
            console.warn('SlideshowBackground: No valid slides created');
        }
    }

    next() {
        if (!this.slides || this.slides.length < 2) return;

        this.lastPos = this.pos;
        this.pos = (this.pos + 1) % this.slides.length;
        this.transition();
    }

    transition() {
        if (!this.slides || !this.slides[this.lastPos] || !this.slides[this.pos]) return;

        this.slides[this.lastPos].classList.remove('visible');
        this.slides[this.pos].classList.add('visible');
    }
}

// Cover Slider Initialization
function initCoverSlider() {
    console.log('Initializing cover slider...');
    const target = document.getElementById('coverSlider');
    
    if (!target) {
        console.warn('Cover slider target not found');
        return;
    }

    console.log('Creating slideshow background...');
    const slideshowBackground = document.createElement('div');
    slideshowBackground.className = 'slideshow-background';
    target.insertBefore(slideshowBackground, target.firstChild);

    if (!window.sliderConfig || !window.sliderConfig.images || !window.sliderConfig.images.length) {
        console.warn('No slider images found in configuration:', window.sliderConfig);
        return;
    }

    console.log('Creating slider with images:', window.sliderConfig.images);
    new SlideshowBackground('coverSlider', {
        target: '#coverSlider > .slideshow-background',
        wait: 0,
        defer: false,
        order: 'default',
        transition: {
            style: 'crossfade',
            speed: 875,
            delay: 5000,
        },
        images: window.sliderConfig.images
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initCoverSlider);
