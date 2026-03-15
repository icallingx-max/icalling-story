// iCalling Main JavaScript

// Mobile Navigation Toggle (if needed in future)
function initMobileNav() {
    const nav = document.querySelector('nav');
    // Add mobile menu functionality here if needed
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Blog Carousel Navigation (for future enhancement)
function initBlogCarousel() {
    // Can add carousel navigation buttons here
    console.log('Blog carousel initialized');
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    initSmoothScroll();
    initBlogCarousel();
    
    console.log('✦ iCalling website initialized');
});
