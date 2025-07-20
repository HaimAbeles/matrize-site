// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeAOS();
    initializeSwiper();
    initializeEmailJS();
    initializePreloader();
    initializeCustomCursor();
    initializeNavigation();
    initializeScrollEffects();
    initializeCounters();
    initializePortfolioFilters();
    initializeMagneticButtons();
    initializeFormHandling();
    initializeThemeToggle();
    initializeCookieNotice();
    initializeAnimations();
});

// ==================== PRELOADER ====================
function initializePreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            
            // Initialize animations after preloader
            gsap.timeline()
                .from('.hero-badge', { y: 30, opacity: 0, duration: 0.8, delay: 0.2 })
                .from('.hero-title .title-line', { y: 50, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.4')
                .from('.hero-description', { y: 30, opacity: 0, duration: 0.8 }, '-=0.4')
                .from('.hero-cta .btn', { y: 30, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.3')
                .from('.stat-item', { scale: 0, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.2');
        }, 2000);
    });
}

// ==================== CUSTOM CURSOR ====================
function initializeCustomCursor() {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const cursor = document.getElementById('cursor');
        const cursorFollower = document.getElementById('cursor-follower');
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Smooth cursor animation
        gsap.ticker.add(() => {
            const speed = 0.15;
            
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            followerX += (mouseX - followerX) * speed * 0.5;
            followerY += (mouseY - followerY) * speed * 0.5;
            
            gsap.set(cursor, { x: cursorX - 4, y: cursorY - 4 });
            gsap.set(cursorFollower, { x: followerX - 20, y: followerY - 20 });
        });
        
        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .magnetic, .tech-item, .service-card');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
    }
}

// ==================== NAVIGATION ====================
function initializeNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll header effects
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ==================== SCROLL EFFECTS ====================
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Parallax effects
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero parallax
    gsap.to('.hero-gradient', {
        yPercent: 50,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Floating cards parallax
    gsap.to('.floating-card', {
        y: -100,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}

// ==================== COUNTERS ====================
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const countUp = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.7 });
    
    counters.forEach(counter => {
        counter.textContent = '0';
        counterObserver.observe(counter);
    });
}

// ==================== PORTFOLIO FILTERS ====================
function initializePortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter items
            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    gsap.to(item, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                    item.style.display = 'block';
                } else {
                    gsap.to(item, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.5,
                        ease: 'power2.out',
                        onComplete: () => {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// ==================== MAGNETIC BUTTONS ====================
function initializeMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// ==================== FORM HANDLING ====================
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        
        // Float labels
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
        });
    }
    
    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        company: document.getElementById('company').value || 'לא צוין',
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        serviceType: document.getElementById('serviceType').value || 'לא צוין',
        budget: document.getElementById('budget').value || 'לא צוין',
        projectDescription: document.getElementById('projectDescription').value,
        to_email: 'matritza.p@gmail.com'
    };
    
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalContent = submitBtn.innerHTML;
    
    // Loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> שולח...';
    submitBtn.disabled = true;
    
    // Send email using EmailJS
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
        .then(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> נשלח בהצלחה!';
            showNotification('ההודעה נשלחה בהצלחה! נחזור אליכם תוך 24 שעות.', 'success');
            
            setTimeout(() => {
                e.target.reset();
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
            }, 3000);
        })
        .catch((error) => {
            console.error('Error:', error);
            submitBtn.innerHTML = '<i class="fas fa-times"></i> שגיאה בשליחה';
            showNotification('אירעה שגיאה. אנא נסו שוב או צרו קשר טלפוני.', 'error');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
            }, 3000);
        });
}

function handleNewsletterForm(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    // Simulate subscription
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i>';
        showNotification('נרשמת בהצלחה לניוזלטר!', 'success');
        e.target.reset();
        
        setTimeout(() => {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }, 3000);
    }, 1500);
}

function validateInput(input) {
    let isValid = true;
    
    if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
    }
    
    if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            isValid = false;
        }
    }
    
    if (input.type === 'tel' && input.value) {
        const phoneRegex = /^[\d-+().\s]+$/;
        if (!phoneRegex.test(input.value)) {
            isValid = false;
        }
    }
    
    input.style.borderColor = isValid ? '' : '#ef4444';
    return isValid;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 20px 40px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 9999;
        animation: slideDown 0.5s ease-out;
    `;
    
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// ==================== THEME TOGGLE ====================
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Animate theme change
        gsap.to('body', {
            duration: 0.3,
            ease: 'power2.inOut'
        });
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ==================== COOKIE NOTICE ====================
function initializeCookieNotice() {
    const cookieNotice = document.getElementById('cookieNotice');
    const acceptBtn = document.getElementById('acceptCookies');
    
    // Check if cookies were already accepted
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieNotice.classList.add('show');
        }, 3000);
    }
    
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieNotice.classList.remove('show');
    });
}

// ==================== ANIMATIONS ====================
function initializeAnimations() {
    // Service cards hover effect
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Tech items animation
    ScrollTrigger.batch('.tech-item', {
        onEnter: elements => {
            gsap.from(elements, {
                opacity: 0,
                scale: 0.8,
                stagger: 0.05,
                duration: 0.6,
                ease: 'back.out(1.7)'
            });
        },
        once: true
    });
    
    // Timeline animation
    gsap.utils.toArray('.process-step').forEach((step, i) => {
        ScrollTrigger.create({
            trigger: step,
            start: 'top 80%',
            onEnter: () => {
                gsap.from(step.querySelector('.step-content'), {
                    x: i % 2 === 0 ? -50 : 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
                
                gsap.from(step.querySelector('.step-number'), {
                    scale: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)',
                    delay: 0.2
                });
            }
        });
    });
    
    // Text reveal animation
    const textReveals = document.querySelectorAll('.section-title, .section-description');
    
    textReveals.forEach(text => {
        gsap.from(text, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: text,
                start: 'top 80%',
                once: true
            }
        });
    });
}

// ==================== LIBRARY INITIALIZATION ====================
function initializeAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });
}

function initializeSwiper() {
    new Swiper('.testimonials-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        breakpoints: {
            768: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 3
            }
        }
    });
}

function initializeEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS user ID
    }
}

// ==================== UTILITIES ====================
// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Performance optimization - lazy load images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});