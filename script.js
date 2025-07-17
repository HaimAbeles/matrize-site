// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.preloader-progress');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + '%';
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = 'visible';
                    initAnimations();
                }, 500);
            }, 300);
        }
    }, 100);
});

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    }, 100);
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Magnetic hover effect for interactive elements
const magneticElements = document.querySelectorAll('a, button');
magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        elem.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    elem.addEventListener('mouseleave', () => {
        elem.style.transform = 'translate(0, 0)';
    });
});

// Navigation
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Mobile menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Particles.js configuration
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#ffffff'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: false
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// Initialize animations
function initAnimations() {
    // GSAP ScrollTrigger animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero animations
        gsap.from('.hero-badge', {
            y: -50,
            opacity: 0,
            duration: 1,
            delay: 0.5
        });
        
        gsap.from('.hero-title .title-line', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            delay: 0.7
        });
        
        gsap.from('.hero-subtitle', {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 1.3
        });
        
        gsap.from('.hero-buttons .btn', {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            delay: 1.5,
            ease: 'back.out(1.7)'
        });
        
        // Scroll-triggered animations
        gsap.utils.toArray('.solution-card').forEach((card, i) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 1,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%'
                }
            });
        });
        
        gsap.utils.toArray('.industry-card').forEach((card, i) => {
            gsap.from(card, {
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%'
                }
            });
        });
        
        // Metric counters animation
        const metrics = document.querySelectorAll('.metric-value');
        metrics.forEach(metric => {
            const target = parseInt(metric.getAttribute('data-target'));
            
            ScrollTrigger.create({
                trigger: metric,
                start: 'top 80%',
                onEnter: () => {
                    animateCounter(metric, target);
                }
            });
        });
    }
}

// Counter animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 20);
}

// Infrastructure tabs
const categoryTabs = document.querySelectorAll('.category-tab');
const contentPanels = document.querySelectorAll('.content-panel');

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');
        
        // Update active states
        categoryTabs.forEach(t => t.classList.remove('active'));
        contentPanels.forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(category).classList.add('active');
    });
});

// ROI Calculator
const roiInputs = document.querySelectorAll('#employees, #hourlyRate, #hoursSaved');
roiInputs.forEach(input => {
    input.addEventListener('input', calculateROI);
});

function calculateROI() {
    const employees = parseInt(document.getElementById('employees').value) || 0;
    const hourlyRate = parseInt(document.getElementById('hourlyRate').value) || 0;
    const hoursSaved = parseInt(document.getElementById('hoursSaved').value) || 0;
    
    const weeklySavings = employees * hourlyRate * hoursSaved;
    const yearlySavings = weeklySavings * 52;
    
    document.getElementById('roiValue').textContent = '₪' + yearlySavings.toLocaleString();
}

// Pricing toggle
const billingToggle = document.getElementById('billingToggle');
const priceAmounts = document.querySelectorAll('.amount');

billingToggle.addEventListener('change', () => {
    priceAmounts.forEach(amount => {
        const monthly = amount.getAttribute('data-monthly');
        const yearly = amount.getAttribute('data-yearly');
        
        if (billingToggle.checked && yearly) {
            amount.textContent = yearly;
        } else if (monthly) {
            amount.textContent = monthly;
        }
    });
});

// Form handling
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Add loading state
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> שולח...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> נשלח בהצלחה!';
        submitBtn.style.background = 'var(--gradient-accent)';
        
        setTimeout(() => {
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    }, 2000);
});

// Demo modal
const demoModal = document.getElementById('demoModal');
const demoButtons = document.querySelectorAll('[href="#demo"]');
const closeModal = document.querySelector('.close-modal');

demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        demoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

closeModal.addEventListener('click', () => {
    demoModal.style.display = 'none';
    document.body.style.overflow = '';
});

window.addEventListener('click', (e) => {
    if (e.target === demoModal) {
        demoModal.style.display = 'none';
        document.body.style.overflow = '';
    }
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

// Chart.js configurations for metrics
if (typeof Chart !== 'undefined') {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        },
        scales: {
            x: { display: false },
            y: { display: false }
        }
    };
    
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['', '', '', '', '', ''],
                datasets: [{
                    data: [20, 35, 45, 60, 75, 87],
                    borderColor: '#10B981',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: {
                        target: 'origin',
                        above: 'rgba(16, 185, 129, 0.1)'
                    }
                }]
            },
            options: chartOptions
        });
    }
    
    // Cost Chart
    const costCtx = document.getElementById('costChart');
    if (costCtx) {
        new Chart(costCtx, {
            type: 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    data: [100, 85, 70, 58],
                    backgroundColor: 'rgba(236, 72, 153, 0.5)',
                    borderColor: '#EC4899',
                    borderWidth: 2
                }]
            },
            options: chartOptions
        });
    }
    
    // Speed Chart
    const speedCtx = document.getElementById('speedChart');
    if (speedCtx) {
        new Chart(speedCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [75, 25],
                    backgroundColor: ['#6366F1', 'rgba(99, 102, 241, 0.1)'],
                    borderWidth: 0
                }]
            },
            options: {
                ...chartOptions,
                cutout: '70%'
            }
        });
    }
    
    // Satisfaction Chart
    const satisfactionCtx = document.getElementById('satisfactionChart');
    if (satisfactionCtx) {
        new Chart(satisfactionCtx, {
            type: 'radar',
            data: {
                labels: ['Quality', 'Speed', 'Support', 'Value', 'Innovation'],
                datasets: [{
                    data: [95, 88, 99, 92, 96],
                    borderColor: '#4FACFE',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    borderWidth: 2
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    r: {
                        display: false,
                        max: 100
                    }
                }
            }
        });
    }
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.trust-badges, .section-header, .pricing-card');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});