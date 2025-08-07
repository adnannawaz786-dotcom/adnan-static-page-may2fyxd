// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and interactions
    initializeAnimations();
    initializeNavigation();
    initializeSkillsAnimation();
    initializeContactForm();
    initializeScrollEffects();
    initializeThemeToggle();
});

// Initialize scroll-triggered animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Observe cards and other elements
    document.querySelectorAll('.card, .skill-item, .project-card').forEach(element => {
        observer.observe(element);
    });
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Skills animation
function initializeSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const percentage = progressBar.getAttribute('data-percentage') || '0';
                
                setTimeout(() => {
                    progressBar.style.width = percentage + '%';
                }, 200);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillsObserver.observe(bar);
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Basic form validation
        if (!validateForm(formObject)) {
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Form validation
function validateForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }

    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }

    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }

    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });

    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Scroll effects
function initializeScrollEffects() {
    let ticking = false;

    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add animation class
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    });
}

// Typing animation for hero text
function initializeTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const texts = ['Web Developer', 'UI/UX Designer', 'Problem Solver', 'Creative Thinker'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(typeText, typeSpeed);
    }

    typeText();
}

// Initialize typing animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeTypingAnimation, 1000);
});

// Utility function for debouncing
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

// Handle window resize
window.addEventListener('resize', debounce(function() {
    // Recalculate any size-dependent features
    console.log('Window resized');
}, 250));

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}