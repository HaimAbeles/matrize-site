// ==================== ADVANCED ANIMATIONS WITH GSAP ====================

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, DrawSVGPlugin, MorphSVGPlugin);

// ==================== HERO SECTION ANIMATIONS ====================
function initAdvancedHeroAnimations() {
    // Split text animation for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const titleLines = heroTitle.querySelectorAll('.title-line');
        
        titleLines.forEach(line => {
            const text = line.textContent;
            line.innerHTML = '';
            
            // Split text into spans
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                line.appendChild(span);
            });
        });
        
        // Animate each character
        gsap.from('.hero-title span', {
            y: 100,
            opacity: 0,
            duration: 0.8,
            ease: 'power4.out',
            stagger: {
                amount: 0.5,
                from: 'start'
            },
            delay: 2.5
        });
    }
    
    // 3D card rotation on mouse move
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                rotationY: rotateY,
                rotationX: rotateX,
                transformPerspective: 1000,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
    
    // Infinite floating animation
    floatingCards.forEach((card, index) => {
        gsap.to(card, {
            y: '+=20',
            rotation: index % 2 === 0 ? '+=2' : '-=2',
            duration: 3 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    });
}

// ==================== SCROLL-TRIGGERED ANIMATIONS ====================
function initScrollAnimations() {
    // Fade in sections with scale
    gsap.utils.toArray('.section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            scale: 0.9,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                once: true
            }
        });
    });
    
    // Service cards stagger animation
    ScrollTrigger.batch('.service-card', {
        onEnter: elements => {
            gsap.from(elements, {
                y: 100,
                opacity: 0,
                rotation: 5,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                overwrite: 'auto'
            });
        },
        once: true,
        start: 'top 85%'
    });
    
    // Process timeline animation
    const processSteps = gsap.utils.toArray('.process-step');
    
    processSteps.forEach((step, index) => {
        const isEven = index % 2 === 0;
        
        gsap.timeline({
            scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                once: true
            }
        })
        .from(step.querySelector('.step-number'), {
            scale: 0,
            rotation: 360,
            duration: 0.6,
            ease: 'back.out(2)'
        })
        .from(step.querySelector('.step-content'), {
            x: isEven ? -100 : 100,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.3')
        .from(step.querySelector('.step-icon'), {
            scale: 0,
            duration: 0.4,
            ease: 'back.out(3)'
        }, '-=0.4');
    });
    
    // Portfolio items reveal
    ScrollTrigger.batch('.portfolio-item', {
        onEnter: elements => {
            gsap.from(elements, {
                scale: 0,
                opacity: 0,
                duration: 0.6,
                stagger: {
                    grid: 'auto',
                    amount: 0.5
                },
                ease: 'power2.out'
            });
        },
        once: true,
        start: 'top 90%'
    });
}

// ==================== MAGNETIC EFFECTS ====================
function initAdvancedMagneticEffects() {
    const magneticElements = document.querySelectorAll('.magnetic-strong');
    
    magneticElements.forEach(el => {
        const strength = el.dataset.magneticStrength || 0.5;
        
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: x * strength,
                y: y * strength,
                rotation: x * 0.1,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // Inner content counter rotation
            const inner = el.querySelector('.magnetic-inner');
            if (inner) {
                gsap.to(inner, {
                    rotation: -x * 0.1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                rotation: 0,
                duration: 0.3,
                ease: 'elastic.out(1, 0.3)'
            });
            
            const inner = el.querySelector('.magnetic-inner');
            if (inner) {
                gsap.to(inner, {
                    rotation: 0,
                    duration: 0.3,
                    ease: 'elastic.out(1, 0.3)'
                });
            }
        });
    });
}

// ==================== TEXT EFFECTS ====================
function initTextEffects() {
    // Typewriter effect for hero badge
    const badge = document.querySelector('.hero-badge');
    if (badge) {
        const text = badge.textContent;
        badge.textContent = '';
        
        gsap.to(badge, {
            text: text,
            duration: 2,
            ease: 'none',
            delay: 3
        });
    }
    
    // Word-by-word reveal for descriptions
    const descriptions = document.querySelectorAll('.reveal-words');
    
    descriptions.forEach(desc => {
        const text = desc.textContent;
        const words = text.split(' ');
        desc.innerHTML = '';
        
        words.forEach(word => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            desc.appendChild(span);
        });
        
        ScrollTrigger.create({
            trigger: desc,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(desc.querySelectorAll('span'), {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.02,
                    ease: 'power2.out'
                });
            }
        });
    });
}

// ==================== MORPHING SHAPES ====================
function initMorphingShapes() {
    // Create morphing background shapes
    const shapes = document.querySelectorAll('.morph-shape');
    
    shapes.forEach(shape => {
        const tl = gsap.timeline({ repeat: -1 });
        
        tl.to(shape, {
            morphSVG: shape.dataset.morphTo,
            duration: 4,
            ease: 'power1.inOut'
        })
        .to(shape, {
            morphSVG: shape.dataset.morphTo2,
            duration: 4,
            ease: 'power1.inOut'
        })
        .to(shape, {
            morphSVG: shape,
            duration: 4,
            ease: 'power1.inOut'
        });
    });
}

// ==================== PARTICLE CONNECTIONS ====================
function initParticleConnections() {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) return;
    
    const particles = [];
    const particleCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0.5;
        `;
        
        particlesContainer.appendChild(particle);
        
        particles.push({
            element: particle,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }
    
    // Animate particles
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
            if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
            
            gsap.set(particle.element, {
                x: particle.x,
                y: particle.y
            });
        });
        
        requestAnimationFrame(updateParticles);
    }
    
    updateParticles();
}

// ==================== CUSTOM CURSOR EFFECTS ====================
function initAdvancedCursorEffects() {
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    
    // Text hover effect
    const textElements = document.querySelectorAll('h1, h2, h3, .btn');
    
    textElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                scale: 0.5,
                duration: 0.3
            });
            gsap.to(cursorFollower, {
                scale: 1.5,
                borderWidth: '1px',
                duration: 0.3
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                scale: 1,
                duration: 0.3
            });
            gsap.to(cursorFollower, {
                scale: 1,
                borderWidth: '2px',
                duration: 0.3
            });
        });
    });
    
    // Image hover effect
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-image');
            cursorFollower.innerHTML = '<span style="font-size: 12px;">צפה</span>';
        });
        
        img.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-image');
            cursorFollower.innerHTML = '';
        });
    });
}

// ==================== SMOOTH SCROLL WITH PARALLAX ====================
function initSmoothParallax() {
    // Parallax for images
    gsap.utils.toArray('.parallax-img').forEach(img => {
        gsap.to(img, {
            yPercent: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: img,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
    
    // Parallax for background elements
    gsap.utils.toArray('.bg-element').forEach(element => {
        const speed = element.dataset.speed || 0.5;
        
        gsap.to(element, {
            y: () => -ScrollTrigger.maxScroll(window) * speed,
            ease: 'none',
            scrollTrigger: {
                start: 0,
                end: 'max',
                invalidateOnRefresh: true,
                scrub: true
            }
        });
    });
}

// ==================== LOADING SEQUENCE ====================
function initLoadingSequence() {
    const tl = gsap.timeline();
    
    // Preloader animation sequence
    tl.from('.preloader-logo', {
        scale: 0,
        rotation: 360,
        duration: 1,
        ease: 'back.out(1.7)'
    })
    .from('.preloader-text span', {
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out'
    }, '-=0.5')
    .to('.preloader-bar-fill', {
        width: '100%',
        duration: 1.5,
        ease: 'power2.inOut'
    }, '-=0.3');
}

// ==================== INTERACTIVE BACKGROUNDS ====================
function initInteractiveBackgrounds() {
    // Gradient mesh animation
    const gradientMesh = document.querySelector('.hero-gradient');
    if (gradientMesh) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            gsap.to(gradientMesh, {
                '--gradient-x': `${x * 100}%`,
                '--gradient-y': `${y * 100}%`,
                duration: 1,
                ease: 'power2.out'
            });
        });
    }
}

// ==================== ADVANCED SCROLL INDICATORS ====================
function initScrollIndicators() {
    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 9999;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);
    
    ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: self => {
            gsap.set(progressBar, {
                width: `${self.progress * 100}%`
            });
        }
    });
    
    // Section indicators
    const sections = document.querySelectorAll('.section[id]');
    const indicators = document.createElement('div');
    indicators.className = 'section-indicators';
    indicators.style.cssText = `
        position: fixed;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 100;
    `;
    
    sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.className = 'indicator-dot';
        dot.style.cssText = `
            width: 12px;
            height: 12px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            margin: 20px 0;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        dot.addEventListener('click', () => {
            gsap.to(window, {
                scrollTo: section,
                duration: 1,
                ease: 'power2.inOut'
            });
        });
        
        indicators.appendChild(dot);
        
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onToggle: self => {
                if (self.isActive) {
                    dot.style.background = 'var(--primary-color)';
                    dot.style.transform = 'scale(1.5)';
                } else {
                    dot.style.background = 'rgba(255, 255, 255, 0.3)';
                    dot.style.transform = 'scale(1)';
                }
            }
        });
    });
    
    if (window.innerWidth > 768) {
        document.body.appendChild(indicators);
    }
}

// ==================== INITIALIZE ALL ANIMATIONS ====================
document.addEventListener('DOMContentLoaded', () => {
    // Wait for fonts and images to load
    Promise.all([
        document.fonts.ready,
        ...Array.from(document.images).filter(img => !img.complete).map(img => 
            new Promise(resolve => {
                img.onload = img.onerror = resolve;
            })
        )
    ]).then(() => {
        // Initialize all animation modules
        initLoadingSequence();
        initAdvancedHeroAnimations();
        initScrollAnimations();
        initAdvancedMagneticEffects();
        initTextEffects();
        initMorphingShapes();
        initParticleConnections();
        initAdvancedCursorEffects();
        initSmoothParallax();
        initInteractiveBackgrounds();
        initScrollIndicators();
        
        // Refresh ScrollTrigger after all animations are set up
        ScrollTrigger.refresh();
    });
});

// ==================== RESPONSIVE ADJUSTMENTS ====================
let mm = gsap.matchMedia();

mm.add("(max-width: 768px)", () => {
    // Mobile-specific animations
    gsap.set('.floating-card', { clearProps: 'all' });
    gsap.set('.parallax-img', { clearProps: 'all' });
    
    // Simpler animations for mobile
    gsap.utils.toArray('.service-card').forEach(card => {
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                once: true
            }
        });
    });
});

mm.add("(min-width: 769px)", () => {
    // Desktop animations are already initialized above
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.ticker.sleep();
    } else {
        gsap.ticker.wake();
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.killTweensOf('*');
});