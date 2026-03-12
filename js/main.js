// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Create backdrop element
    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-backdrop';
    backdrop.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999; opacity: 0; visibility: hidden; transition: all 0.3s ease;';
    document.body.appendChild(backdrop);

    if (mobileMenuBtn && navLinks) {
        // Toggle menu
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            body.style.overflow = isActive ? 'hidden' : '';

            // Toggle backdrop
            if (isActive) {
                backdrop.style.opacity = '1';
                backdrop.style.visibility = 'visible';
            } else {
                backdrop.style.opacity = '0';
                backdrop.style.visibility = 'hidden';
            }
        });

        // Close menu when clicking backdrop
        backdrop.addEventListener('click', function() {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            body.style.overflow = '';
            backdrop.style.opacity = '0';
            backdrop.style.visibility = 'hidden';
        });

        // Close menu when clicking a non-dropdown link
        navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                body.style.overflow = '';
                backdrop.style.opacity = '0';
                backdrop.style.visibility = 'hidden';
            });
        });
    }

    // Mobile dropdown toggle
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Only handle on mobile
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.closest('.nav-dropdown');
                // Close other dropdowns
                document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                    if (dropdown !== parent) {
                        dropdown.classList.remove('active');
                    }
                });
                // Toggle this dropdown
                parent.classList.toggle('active');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Header shadow on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                header.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            }
        });
    }

    // Animated counter for stats
    const animateCounter = (element, target, duration, suffix = '') => {
        let start = 0;
        const increment = target / (duration / 16); // 60fps
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + suffix;
            }
        }, 16);
    };

    // Observe stats section
    const statsSection = document.querySelector('.intro .stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach((stat, index) => {
                        const text = stat.textContent;
                        if (text.includes('%')) {
                            const value = parseInt(text);
                            animateCounter(stat, value, 2000, '%');
                        } else if (text.includes('x')) {
                            const value = parseInt(text);
                            animateCounter(stat, value, 2000, 'x');
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // Logo scroll buttons
    const logoGrid = document.querySelector('.logo-grid');
    const scrollLeftBtn = document.querySelector('.logo-scroll-left');
    const scrollRightBtn = document.querySelector('.logo-scroll-right');

    if (logoGrid && scrollLeftBtn && scrollRightBtn) {
        const updateScrollBtns = () => {
            scrollLeftBtn.classList.toggle('hidden', logoGrid.scrollLeft <= 0);
            scrollRightBtn.classList.toggle('hidden', logoGrid.scrollLeft + logoGrid.clientWidth >= logoGrid.scrollWidth - 1);
        };

        scrollLeftBtn.addEventListener('click', () => {
            logoGrid.scrollBy({ left: -200, behavior: 'smooth' });
        });
        scrollRightBtn.addEventListener('click', () => {
            logoGrid.scrollBy({ left: 200, behavior: 'smooth' });
        });

        logoGrid.addEventListener('scroll', updateScrollBtns);
        window.addEventListener('resize', updateScrollBtns);
        updateScrollBtns();
    }

    // Pricing Calculator
    const sqftInput = document.getElementById('sqft-input');
    const calculatedPrice = document.getElementById('calculated-price');
    const minimumNote = document.getElementById('minimum-note');

    if (sqftInput && calculatedPrice) {
        sqftInput.addEventListener('input', function() {
            const sqft = parseInt(this.value) || 0;

            if (sqft === 0) {
                calculatedPrice.textContent = '$300';
                minimumNote.textContent = '';
                return;
            }

            const calculatedAmount = sqft * 0.14;
            const finalPrice = Math.max(calculatedAmount, 300);

            // Format price
            calculatedPrice.textContent = '$' + Math.round(finalPrice).toLocaleString();

            // Show minimum note if applicable
            if (finalPrice === 300 && calculatedAmount < 300) {
                minimumNote.textContent = '($300 minimum applies)';
            } else {
                minimumNote.textContent = '';
            }
        });
    }
});
