document.addEventListener('DOMContentLoaded', () => {
    // Initialize portfolio modules
    initThemeToggle();
    initMobileMenu();
    initScrollSpy();
    initProjectFilters();
    initContactForm();
    initCanvasBackground();
    initSkillAnimations();
    initScrollReveal();
    initTypewriterEffect();
});

/* ==========================================================================
   DARK/LIGHT THEME CONTROLLER
   ========================================================================== */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Retrieve saved theme or check system preferences
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    if (savedTheme) {
        body.className = savedTheme;
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.className = 'dark-theme';
        } else {
            body.className = 'light-theme';
        }
    }

    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('portfolio-theme', 'light-theme');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('portfolio-theme', 'dark-theme');
        }
        
        // Notify canvas background that the theme has updated
        updateCanvasThemeColors();
    });
}

/* ==========================================================================
   MOBILE MENU CONTROLLER
   ========================================================================== */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('mobile-open');
        mobileMenuToggle.classList.toggle('mobile-open-btn');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking on nav link items
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('mobile-open');
            mobileMenuToggle.classList.remove('mobile-open-btn');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ==========================================================================
   SCROLL SPY & NAVIGATION HIGHLIGHTS
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const options = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the active middle portion
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
}

/* ==========================================================================
   PROJECTS FILTER CONTROLLER
   ========================================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state class on filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('fade-out');
                } else {
                    card.classList.add('fade-out');
                }
            });
        });
    });
}

/* ==========================================================================
   INTERACTIVE CANVAS BACKGROUND
   ========================================================================== */
let particleColor = 'rgba(139, 92, 246, 0.15)';
let lineColor = 'rgba(6, 182, 212, 0.08)';

function updateCanvasThemeColors() {
    const isLight = document.body.classList.contains('light-theme');
    if (isLight) {
        particleColor = 'rgba(109, 40, 217, 0.08)';
        lineColor = 'rgba(8, 145, 178, 0.05)';
    } else {
        particleColor = 'rgba(139, 92, 246, 0.12)';
        lineColor = 'rgba(6, 182, 212, 0.06)';
    }
}

function initCanvasBackground() {
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');
    
    updateCanvasThemeColors();

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const maxParticles = 65;
    const connectionDistance = 120;
    
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2 + 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off canvas boundaries
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction push/pull effect
            if (mouse.x != null && mouse.y != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    // Gently push particles away from mouse pointer
                    this.x -= dx / dist * force * 1.2;
                    this.y -= dy / dist * force * 1.2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }
    }

    // Populate particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, idx) => {
            p.update();
            p.draw();

            // Check distance to draw connecting nodes
            for (let j = idx + 1; j < particles.length; j++) {
                const other = particles[j];
                const dx = p.x - other.x;
                const dy = p.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const alpha = (connectionDistance - dist) / connectionDistance;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = alpha * 0.8;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   SKILLS BAR PROGRESS TRIGGER ANIMATIONS
   ========================================================================== */
function initSkillAnimations() {
    const skillsSection = document.getElementById('about');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const options = {
        root: null,
        rootMargin: '0px 0px -15% 0px', // Trigger slightly before the section comes fully into view
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    bar.classList.add('animate');
                });
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, options);

    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

/* ==========================================================================
   SCROLL REVEAL (FADE-IN TRIGGERS)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const options = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger when element is 10% inside viewport
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, options);

    revealElements.forEach(el => {
        observer.observe(el);
    });
}

/* ==========================================================================
   TYPEWRITER TYPING EFFECT (HERO)
   ========================================================================== */
function initTypewriterEffect() {
    const typingSpan = document.getElementById('typing-text');
    if (!typingSpan) return;

    const phrases = [
        'Frontend Developer',
        'UI Designer',
        'Problem Solver',
        'AI Enthusiast'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            // Remove letters
            typingSpan.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // Delete faster
        } else {
            // Add letters
            typingSpan.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 120; // Normal typing speed
        }

        // Handle states transition
        if (!isDeleting && charIdx === currentPhrase.length) {
            // Finished typing the phrase, pause before deleting
            isDeleting = true;
            typingSpeed = 2000; // Pause duration
        } else if (isDeleting && charIdx === 0) {
            // Finished deleting, move to next phrase
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 500; // Small delay before typing next
        }

        setTimeout(type, typingSpeed);
    }

    // Begin loop
    setTimeout(type, 1000);
}

/* ==========================================================================
   CONTACT FORM VALIDATION & HANDLING
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const formFeedback = document.getElementById('form-feedback');

    // Form Field Selectors
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    // Clear error highlights on input focus
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            input.parentElement.classList.remove('invalid');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isFormValid = true;

        // Name Validation
        if (nameInput.value.trim() === '') {
            nameInput.parentElement.classList.add('invalid');
            isFormValid = false;
        } else {
            nameInput.parentElement.classList.remove('invalid');
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailInput.parentElement.classList.add('invalid');
            isFormValid = false;
        } else {
            emailInput.parentElement.classList.remove('invalid');
        }

        // Message Validation
        if (messageInput.value.trim() === '') {
            messageInput.parentElement.classList.add('invalid');
            isFormValid = false;
        } else {
            messageInput.parentElement.classList.remove('invalid');
        }

        // If form valid, start submit sequence
        if (isFormValid) {
            submitFormMock();
        }
    });

    function submitFormMock() {
        // Show loading spinner
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        btnSpinner.classList.remove('hidden');
        formFeedback.className = 'form-feedback hidden';

        // Mock ajax call (1.5s delay)
        setTimeout(() => {
            // Success response
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            btnSpinner.classList.add('hidden');
            
            formFeedback.textContent = 'Thank you! Your message has been sent successfully. I will get back to you shortly.';
            formFeedback.className = 'form-feedback success';
            formFeedback.classList.remove('hidden');

            // Reset form input values
            form.reset();
        }, 1500);
    }
}
