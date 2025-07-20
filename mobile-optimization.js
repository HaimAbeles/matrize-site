// ==================== MOBILE OPTIMIZATION & TESTING ====================

// Mobile detection utilities
const MobileDetect = {
    // Check if device is mobile
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Check if device is tablet
    isTablet: () => {
        return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
    },
    
    // Check if device supports touch
    isTouchDevice: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    // Get device type
    getDeviceType: () => {
        if (MobileDetect.isMobile()) return 'mobile';
        if (MobileDetect.isTablet()) return 'tablet';
        return 'desktop';
    },
    
    // Get viewport size
    getViewportSize: () => {
        return {
            width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        };
    }
};

// Mobile-specific optimizations
class MobileOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        if (MobileDetect.isMobile() || MobileDetect.isTablet()) {
            this.optimizeForMobile();
            this.setupTouchHandlers();
            this.optimizeAnimations();
            this.optimizeImages();
            this.setupViewportHeight();
        }
        
        // Setup resize handler
        this.setupResizeHandler();
    }
    
    optimizeForMobile() {
        // Add mobile class to body
        document.body.classList.add('is-mobile');
        
        // Disable hover effects on touch devices
        if (MobileDetect.isTouchDevice()) {
            document.body.classList.add('touch-device');
            
            // Convert hover states to click states
            this.convertHoverToClick();
        }
        
        // Optimize scroll performance
        this.optimizeScroll();
        
        // Reduce particle count for performance
        this.reduceParticles();
    }
    
    setupTouchHandlers() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Improve tap responsiveness
        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', () => {
                FastClick.attach(document.body);
            }, false);
        }
        
        // Handle touch events for swipe
        this.setupSwipeHandlers();
    }
    
    setupSwipeHandlers() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Minimum swipe distance
            const minSwipeDistance = 50;
            
            if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 0) {
                    // Swipe right - navigate to previous section
                    this.navigateToPreviousSection();
                } else {
                    // Swipe left - navigate to next section
                    this.navigateToNextSection();
                }
            }
        };
    }
    
    optimizeAnimations() {
        // Reduce animation complexity on mobile
        if (MobileDetect.isMobile()) {
            // Disable parallax on mobile
            gsap.utils.toArray('[data-parallax]').forEach(el => {
                gsap.set(el, { clearProps: 'transform' });
            });
            
            // Simplify scroll animations
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.scrub) {
                    trigger.disable();
                }
            });
            
            // Reduce animation duration
            gsap.globalTimeline.timeScale(1.5);
        }
    }
    
    optimizeImages() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load appropriate image size based on viewport
                    const viewport = MobileDetect.getViewportSize();
                    if (viewport.width <= 768 && img.dataset.srcMobile) {
                        img.src = img.dataset.srcMobile;
                    } else {
                        img.src = img.dataset.src;
                    }
                    
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    setupViewportHeight() {
        // Fix for mobile viewport height
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }
    
    convertHoverToClick() {
        // Convert hover interactions to click for touch devices
        const hoverElements = document.querySelectorAll('.service-card, .portfolio-item, .team-member');
        
        hoverElements.forEach(el => {
            el.addEventListener('click', function(e) {
                // Remove active class from other elements
                hoverElements.forEach(other => {
                    if (other !== this) {
                        other.classList.remove('touch-active');
                    }
                });
                
                // Toggle active class
                this.classList.toggle('touch-active');
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.service-card, .portfolio-item, .team-member')) {
                hoverElements.forEach(el => el.classList.remove('touch-active'));
            }
        });
    }
    
    optimizeScroll() {
        // Smooth scroll with touch momentum
        let isScrolling = false;
        
        document.addEventListener('touchstart', () => {
            isScrolling = true;
        });
        
        document.addEventListener('touchend', () => {
            isScrolling = false;
        });
        
        // Optimize scroll performance
        let ticking = false;
        function updateScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Update scroll-dependent elements
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', updateScroll, { passive: true });
    }
    
    reduceParticles() {
        // Reduce particle count for better performance
        if (window.ParticlesBackground) {
            const particlesConfig = document.querySelector('#particles-canvas');
            if (particlesConfig) {
                particlesConfig.dataset.particleCount = '30'; // Reduce from 100
            }
        }
    }
    
    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('is-resizing');
            
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove('is-resizing');
                this.handleResize();
            }, 250);
        });
    }
    
    handleResize() {
        const viewport = MobileDetect.getViewportSize();
        
        // Update CSS variables
        document.documentElement.style.setProperty('--viewport-width', `${viewport.width}px`);
        document.documentElement.style.setProperty('--viewport-height', `${viewport.height}px`);
        
        // Refresh animations
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }
    
    navigateToNextSection() {
        const sections = document.querySelectorAll('.section[id]');
        const currentSection = Array.from(sections).find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
        });
        
        if (currentSection) {
            const currentIndex = Array.from(sections).indexOf(currentSection);
            if (currentIndex < sections.length - 1) {
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
    
    navigateToPreviousSection() {
        const sections = document.querySelectorAll('.section[id]');
        const currentSection = Array.from(sections).find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
        });
        
        if (currentSection) {
            const currentIndex = Array.from(sections).indexOf(currentSection);
            if (currentIndex > 0) {
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            memory: 0,
            loadTime: 0
        };
        
        if (MobileDetect.isMobile()) {
            this.startMonitoring();
        }
    }
    
    startMonitoring() {
        // Monitor FPS
        let lastTime = performance.now();
        let frames = 0;
        
        const checkFPS = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
                
                // Adjust quality if FPS is low
                if (this.metrics.fps < 30) {
                    this.reduceQuality();
                }
            }
            
            requestAnimationFrame(checkFPS);
        };
        
        checkFPS();
        
        // Monitor page load time
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now();
            console.log(`Page loaded in ${this.metrics.loadTime}ms`);
        });
    }
    
    reduceQuality() {
        // Disable non-essential animations
        document.body.classList.add('reduce-motion');
        
        // Reduce particle effects
        if (window.particlesJS) {
            window.particlesJS.particles.number.value = 20;
        }
        
        // Disable background animations
        gsap.globalTimeline.pause();
    }
}

// Mobile-specific styles
const mobileStyles = `
    /* Touch device optimizations */
    .touch-device .service-card:hover,
    .touch-device .portfolio-item:hover {
        transform: none;
    }
    
    .touch-device .service-card.touch-active,
    .touch-device .portfolio-item.touch-active {
        transform: translateY(-10px);
    }
    
    /* Reduce motion for performance */
    .reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    /* iOS-specific fixes */
    @supports (-webkit-touch-callout: none) {
        .hero {
            min-height: -webkit-fill-available;
        }
    }
    
    /* Prevent horizontal scroll on mobile */
    .is-mobile {
        overflow-x: hidden;
    }
    
    /* Optimize for thumb reach */
    @media (max-width: 768px) {
        .nav-menu {
            padding-bottom: env(safe-area-inset-bottom);
        }
        
        .back-to-top {
            bottom: calc(20px + env(safe-area-inset-bottom));
        }
    }
`;

// Inject mobile styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileStyles;
document.head.appendChild(styleSheet);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new MobileOptimizer();
    new PerformanceMonitor();
});

// Export utilities
window.MobileDetect = MobileDetect;
window.MobileOptimizer = MobileOptimizer;