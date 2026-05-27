/* ============================================
   DENUNCIE - VIOLÊNCIA RACIAL
   JavaScript - Interactive Features
   ============================================ */

// ============================================
// 1. DOM ELEMENTS & STATE
// ============================================

const entryScreen = document.getElementById('entryScreen');
const enterButton = document.getElementById('enterButton');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const backToTopBtn = document.getElementById('backToTop');
const reportForm = document.getElementById('reportForm');
const successModal = document.getElementById('successModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const heroContent = document.getElementById('heroContent');
const scrollIndicator = document.getElementById('scrollIndicator');
const faqButtons = document.querySelectorAll('.faq-button');
const revealElements = document.querySelectorAll('.reveal-text, .reveal-card');
const navLinks = document.querySelectorAll('.nav-link');

// ============================================
// 2. ENTRY SCREEN
// ============================================

function hideEntryScreen() {
    if (entryScreen) {
        entryScreen.classList.add('hidden');
    }
}

if (enterButton) {
    enterButton.addEventListener('click', hideEntryScreen);
}

// ============================================
// 3. NAVBAR FUNCTIONALITY
// ============================================

// Hamburger Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// 4. SMOOTH SCROLLING
// ============================================

function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const offsetTop = element.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Scroll to report section from hero button
document.querySelector('.btn-hero').addEventListener('click', (e) => {
    e.preventDefault();
    smoothScroll('#report-call');
});

// Smooth scroll for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            smoothScroll(href);
        }
    });
});

// ============================================
// 5. SCROLL REVEAL ANIMATIONS
// ============================================

function revealOnScroll() {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        // If element is in viewport
        if (elementTop < window.innerHeight && elementBottom > 0) {
            // Add delay based on element position for cascade effect
            const delay = element.offsetTop / 1000;
            setTimeout(() => {
                element.classList.add('visible');
            }, delay * 50);
        }
    });
}

// Trigger reveal on scroll
window.addEventListener('scroll', () => {
    revealOnScroll();
}, { passive: true });

// Initial reveal check
revealOnScroll();

// ============================================
// 6. BACK TO TOP BUTTON
// ============================================

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// 7. FAQ ACCORDION
// ============================================

faqButtons.forEach(button => {
    button.addEventListener('click', () => {
        const isActive = button.getAttribute('aria-expanded') === 'true';
        
        // Close all other items
        faqButtons.forEach(otherButton => {
            if (otherButton !== button && otherButton.getAttribute('aria-expanded') === 'true') {
                otherButton.setAttribute('aria-expanded', 'false');
                otherButton.parentElement.classList.remove('active');
            }
        });
        
        // Toggle current item
        button.setAttribute('aria-expanded', !isActive);
        button.parentElement.classList.toggle('active');
    });
});

// ============================================
// 8. FORM VALIDATION & SUBMISSION
// ============================================

class FormValidator {
    constructor(form) {
        this.form = form;
        this.errors = {};
    }

    validate() {
        this.errors = {};
        
        // Get form values
        const city = this.form.querySelector('#city').value.trim();
        const state = this.form.querySelector('#state').value;
        const reportType = this.form.querySelector('#reportType').value;
        const description = this.form.querySelector('#description').value.trim();
        const date = this.form.querySelector('#date').value;
        
        // Validate required fields
        if (!city) this.errors.city = 'Cidade é obrigatória';
        if (!state) this.errors.state = 'Estado é obrigatório';
        if (!reportType) this.errors.reportType = 'Tipo de denúncia é obrigatório';
        if (!description || description.length < 10) {
            this.errors.description = 'Descreva com pelo menos 10 caracteres';
        }
        if (!date) this.errors.date = 'Data é obrigatória';
        
        // Validate date is not in future
        if (date) {
            const selectedDate = new Date(date);
            const today = new Date();
            if (selectedDate > today) {
                this.errors.date = 'A data não pode ser no futuro';
            }
        }
        
        return Object.keys(this.errors).length === 0;
    }

    showErrors() {
        // Remove previous error styles
        this.form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.style.borderColor = '';
        });

        // Add error styles
        Object.keys(this.errors).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.style.borderColor = '#ef4444';
            }
        });

        // Show alert with first error
        if (Object.keys(this.errors).length > 0) {
            const firstError = Object.values(this.errors)[0];
            alert(`Erro no formulário:\n${firstError}`);
        }
    }
}

// Form submission handler
if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const validator = new FormValidator(reportForm);
        
        if (validator.validate()) {
            // Get form data
            const formData = new FormData(reportForm);
            const data = {
                name: formData.get('name') || 'Anônimo',
                anonymous: formData.get('anonymous') === 'on',
                city: formData.get('city'),
                state: formData.get('state'),
                reportType: formData.get('reportType'),
                description: formData.get('description'),
                date: formData.get('date'),
                location: formData.get('location'),
                timestamp: new Date().toISOString()
            };

            // Simulate saving to localStorage (no backend required)
            const existingReports = JSON.parse(localStorage.getItem('reports') || '[]');
            existingReports.push(data);
            localStorage.setItem('reports', JSON.stringify(existingReports));

            console.log('Report submitted:', data);
            console.log('Total reports:', existingReports.length);

            // Show success modal
            showSuccessModal();

            // Reset form
            reportForm.reset();
            
            // Scroll to modal
            setTimeout(() => {
                smoothScroll('.modal-content');
            }, 100);
        } else {
            validator.showErrors();
        }
    });
}

// ============================================
// 9. SUCCESS MODAL
// ============================================

function showSuccessModal() {
    if (successModal) {
        successModal.classList.add('active');
        
        // Add animation to modal content
        const modalContent = successModal.querySelector('.modal-content');
        modalContent.style.animation = 'none';
        setTimeout(() => {
            modalContent.style.animation = '';
        }, 10);
    }
}

function closeSuccessModal() {
    if (successModal) {
        successModal.classList.remove('active');
    }
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeSuccessModal);
}

// Close modal when clicking outside
if (successModal) {
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeSuccessModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSuccessModal();
    }
});

// ============================================
// 10. SCROLL INDICATOR
// ============================================

if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        smoothScroll('#report-call');
    });
}

// ============================================
// 11. PARALLAX EFFECT
// ============================================

const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const parallaxSpeed = 0.5;
        
        hero.style.backgroundPosition = `center ${scrollPosition * parallaxSpeed}px`;
    }, { passive: true });
}

// ============================================
// 12. HERO TEXT ANIMATIONS
// ============================================

function animateHeroText() {
    const titleLines = document.querySelectorAll('.title-line');
    const subtitleLines = document.querySelectorAll('.subtitle-highlight');
    
    titleLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.2}s`;
    });
    
    subtitleLines.forEach((line, index) => {
        line.style.animationDelay = `${0.4 + index * 0.2}s`;
    });
}

// Wait for page load then animate
window.addEventListener('load', animateHeroText);

// ============================================
// 13. INPUT FOCUS EFFECTS
// ============================================

const formInputs = document.querySelectorAll('.form-input, .form-textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.boxShadow = `inset 0 0 0 2px var(--color-primary)`;
    });

    input.addEventListener('blur', () => {
        input.parentElement.style.boxShadow = 'none';
    });
});

// ============================================
// 14. BUTTON RIPPLE EFFECT
// ============================================

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        // Optional: Add ripple animation CSS
        button.style.overflow = 'hidden';
    });
});

// ============================================
// 15. LAZY LOAD OPTIMIZATION
// ============================================

// Intersection Observer for performance optimization
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.willChange = 'transform';
        } else {
            entry.target.style.willChange = 'auto';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ============================================
// 16. CONTACT LINK HANDLING
// ============================================

// Handle anonymous message card click
const anonymousMessage = document.querySelector('.anonymous-message');
if (anonymousMessage) {
    anonymousMessage.addEventListener('click', () => {
        smoothScroll('#report-form');
    });

    anonymousMessage.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            smoothScroll('#report-form');
        }
    });
}

// ============================================
// 17. ACCESSIBILITY ENHANCEMENTS
// ============================================

// Add keyboard navigation to cards
document.querySelectorAll('.security-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            card.click();
        }
    });
});

// ============================================
// 18. PERFORMANCE MONITORING
// ============================================

// Log performance metrics
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        console.log(`Page loaded in ${pageLoadTime}ms`);
        
        // Optional: Send to analytics
        // analytics.track('page_load_time', { duration: pageLoadTime });
    });
}

// ============================================
// 19. DARK MODE CHECK
// ============================================

// Check for dark mode preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}

// Listen for dark mode changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

// ============================================
// 20. UTILITY FUNCTIONS
// ============================================

// Debounce function for scroll events
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
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Copy to clipboard utility
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied:', text);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// ============================================
// 21. REPORT DATA MANAGEMENT
// ============================================

class ReportManager {
    static getAllReports() {
        return JSON.parse(localStorage.getItem('reports') || '[]');
    }

    static getReportCount() {
        return this.getAllReports().length;
    }

    static clearReports() {
        localStorage.setItem('reports', JSON.stringify([]));
    }

    static exportReportsAsJSON() {
        const reports = this.getAllReports();
        const dataStr = JSON.stringify(reports, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reports-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    static getStatistics() {
        const reports = this.getAllReports();
        const stats = {
            total: reports.length,
            byType: {},
            byState: {},
            anonymous: reports.filter(r => r.anonymous).length
        };

        reports.forEach(report => {
            stats.byType[report.reportType] = (stats.byType[report.reportType] || 0) + 1;
            stats.byState[report.state] = (stats.byState[report.state] || 0) + 1;
        });

        return stats;
    }
}

// Log statistics for demonstration
console.log('Report Statistics:', ReportManager.getStatistics());

// ============================================
// 22. INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page fully loaded and ready');
    
    // Initialize any additional features
    initializeAnimations();
});

function initializeAnimations() {
    // Add any additional initialization code here
    console.log('Animations initialized');
}

// ============================================
// 23. ERROR HANDLING
// ============================================

window.addEventListener('error', (event) => {
    console.error('An error occurred:', event.error);
    // You could send this to an error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
});

// ============================================
// 24. END OF FILE
// ============================================

console.log('✊ Denuncie - Anti-Racism Campaign Website');
console.log('Violence against children and teenagers is not acceptable.');
console.log('Report now: 100');
