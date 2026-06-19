'use strict';

/* ============================================================
   LensCraft Studio - Main JavaScript
   script.js | All interactive features & animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initLoadingScreen();
    initStickyNavbar();
    initActiveNavigation();
    initSmoothScrolling();
    initBackToTop();
    initScrollReveal();
    initAnimatedCounters();
    initTypingEffect();
    initGalleryFilter();
    initLightbox();
    initContactFormValidation();
    initBookingFormValidation();
    initNewsletterForm();
    initParallaxEffect();
    initMobileNavClose();
});

/* ========================
   1. Loading Screen
   ======================== */
function initLoadingScreen() {
    const loader = document.getElementById('loading-screen');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('loaded');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 600);
    });

    // Fallback: hide loader after 3 seconds max
    setTimeout(() => {
        if (loader && !loader.classList.contains('loaded')) {
            loader.classList.add('loaded');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 3000);
}

/* ========================
   2. Sticky Navbar with Color Transition
   ======================== */
function initStickyNavbar() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
}

/* ========================
   3. Active Navigation Highlighting
   ======================== */
function initActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* ========================
   4. Smooth Scrolling for Anchor Links
   ======================== */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const navbarHeight = document.getElementById('mainNavbar')?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ========================
   5. Back to Top Button
   ======================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ========================
   6. Scroll Reveal Animations
   ======================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ========================
   7. Animated Counters
   ======================== */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.counter-number');
    if (counters.length === 0) return;

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const suffix = element.getAttribute('data-suffix') || '+';

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            element.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString() + suffix;
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/* ========================
   8. Typing Effect
   ======================== */
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const text = typingElement.getAttribute('data-text') || '';
    const typeSpeed = 70;
    const deleteSpeed = 35;
    const pauseTime = 2500;

    let charIndex = 0;
    let isDeleting = false;

    function type() {
        if (!isDeleting) {
            // Typing
            typingElement.textContent = text.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === text.length) {
                // Pause at end then start deleting
                setTimeout(() => {
                    isDeleting = true;
                    type();
                }, pauseTime);
                return;
            }

            setTimeout(type, typeSpeed);
        } else {
            // Deleting
            typingElement.textContent = text.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                setTimeout(type, 500);
                return;
            }

            setTimeout(type, deleteSpeed);
        }
    }

    // Start typing after a brief delay
    setTimeout(type, 1000);
}

/* ========================
   9. Gallery Filtering
   ======================== */
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length === 0 || galleryItems.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide');
                }
            });
        });
    });
}

/* ========================
   10. Lightbox
   ======================== */
function initLightbox() {
    const lightbox = document.getElementById('galleryLightbox');
    if (!lightbox) return;

    const lightboxImg = document.getElementById('lightboxImage');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentImages = [];
    let currentIndex = 0;

    // Get all gallery images
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Get visible images for navigation
            currentImages = [];
            document.querySelectorAll('.gallery-item:not(.hide)').forEach(visibleItem => {
                const img = visibleItem.querySelector('img');
                if (img) currentImages.push(img.src);
            });

            const clickedImg = item.querySelector('img');
            if (clickedImg) {
                currentIndex = currentImages.indexOf(clickedImg.src);
                if (currentIndex === -1) currentIndex = 0;
                lightboxImg.src = clickedImg.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });

    // Previous image
    function showPrevImage() {
        if (currentImages.length === 0) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        lightboxImg.src = currentImages[currentIndex];
    }

    // Next image
    function showNextImage() {
        if (currentImages.length === 0) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        lightboxImg.src = currentImages[currentIndex];
    }

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });
}

/* ========================
   11. Contact Form Validation
   ======================== */
function initContactFormValidation() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const successAlert = document.getElementById("formSuccess");
    const errorAlert = document.getElementById("formError");
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Reset alert states
        if (successAlert) successAlert.style.display = 'none';
        if (errorAlert) errorAlert.style.display = 'none';

        // Manual validation checks
        let isValid = true;

        // Reset validation states
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        // Validate Name
        const name = form.querySelector('#contactName');
        if (name && (name.value.trim().length < 2)) {
            name.classList.add('is-invalid');
            isValid = false;
        }

        // Validate Email
        const email = form.querySelector('#contactEmail');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email.value.trim())) {
            email.classList.add('is-invalid');
            isValid = false;
        }

        // Validate Phone (optional, but if provided must be valid format)
        const phone = form.querySelector('#contactPhone');
        if (phone && phone.value.trim() !== '') {
            const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$/;
            if (!phoneRegex.test(phone.value.trim())) {
                phone.classList.add('is-invalid');
                isValid = false;
            }
        }

        // Validate Subject
        const subject = form.querySelector('#contactSubject');
        if (subject && subject.value.trim() === '') {
            subject.classList.add('is-invalid');
            isValid = false;
        }

        // Validate Message
        const message = form.querySelector('#contactMessage');
        if (message && message.value.trim().length < 10) {
            message.classList.add('is-invalid');
            isValid = false;
        }

        // Validate Privacy Checkbox
        const privacy = form.querySelector('#privacyCheck');
        if (privacy && !privacy.checked) {
            privacy.classList.add('is-invalid');
            isValid = false;
        }

        if (!isValid) {
            form.classList.add("was-validated");
            if (errorAlert) {
                errorAlert.style.display = 'block';
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        form.classList.add("was-validated");

        // If valid, submit via AJAX
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        }

        const formData = {
            name: form.querySelector('#contactName')?.value || '',
            email: form.querySelector('#contactEmail')?.value || '',
            phone: form.querySelector('#contactPhone')?.value || '',
            subject: form.querySelector('#contactSubject')?.value || '',
            service: form.querySelector('#contactService')?.value || '',
            message: form.querySelector('#contactMessage')?.value || ''
        };

        // FormSubmit AJAX endpoint
        const actionUrl = form.getAttribute('action') || 'https://formsubmit.co/vivekvakapalli23@gmail.com';
        const ajaxUrl = actionUrl.replace('formsubmit.co/', 'formsubmit.co/ajax/');

        fetch(ajaxUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server returned an error');
            }
        })
        .then(data => {
            if (successAlert) {
                successAlert.style.display = 'block';
                successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            form.reset();
            form.classList.remove("was-validated");
        })
        .catch(error => {
            console.error('Submission error:', error);
            if (errorAlert) {
                errorAlert.textContent = "There was an error sending your message. Please try again later.";
                errorAlert.style.display = 'block';
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtnText;
            }
        });
    });

    // Real-time validation feedback - remove error on input
    form.querySelectorAll('.form-control, .form-select, .form-check-input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('is-invalid');
            if (errorAlert) errorAlert.style.display = 'none';
        });
    });
}

/* ========================
   12. Newsletter Form
   ======================== */
function initNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            if (!emailInput) return;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(emailInput.value.trim())) {
                // Create and show success notification
                const toast = document.createElement('div');
                toast.className = 'alert alert-success position-fixed';
                toast.style.cssText = 'top: 100px; right: 20px; z-index: 9999; max-width: 350px; border-radius: 15px; background: rgba(212, 175, 55, 0.15); border: 1px solid var(--gold); color: var(--gold);';
                toast.innerHTML = '<i class="fas fa-check-circle me-2"></i>Thank you for subscribing! Welcome to the LensCraft family.';
                document.body.appendChild(toast);

                emailInput.value = '';

                setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => toast.remove(), 500);
                }, 3000);
            } else {
                emailInput.classList.add('is-invalid');
                emailInput.style.borderColor = '#dc3545';
                setTimeout(() => {
                    emailInput.classList.remove('is-invalid');
                    emailInput.style.borderColor = '';
                }, 2000);
            }
        });
    });
}

/* ========================
   13. Parallax Effect
   ======================== */
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Only apply on desktop
    if (window.innerWidth > 992) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroSection.style.backgroundPositionY = scrolled * 0.4 + 'px';
        }, { passive: true });
    }
}

/* ========================
   14. Mobile Nav Close on Link Click
   ======================== */
function initMobileNavClose() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navCollapse = document.querySelector('.navbar-collapse');
    const navToggler = document.querySelector('.navbar-toggler');

    if (!navCollapse || !navToggler) return;

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992 && navCollapse.classList.contains('show')) {
                navToggler.click();
            }
        });
    });
}

/* ========================
   15. Booking Form Validation & Query Parameter Select
   ======================== */
function initBookingFormValidation() {
    const form = document.getElementById("bookingForm");
    if (!form) return;

    const successAlert = document.getElementById("bookingSuccess");
    const errorAlert = document.getElementById("bookingError");
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnText = submitBtn ? submitBtn.innerHTML : 'Request Booking';

    // Dynamic Price Estimation Matrix
    const priceMatrix = {
        "Wedding Photography": { "Silver Package": 25000, "Gold Package": 50000, "Platinum Package": 75000 },
        "Pre-Wedding Shoot": { "Silver Package": 10000, "Gold Package": 20000, "Platinum Package": 30000 },
        "Birthday & Events": { "Silver Package": 8000, "Gold Package": 14000, "Platinum Package": 20000 },
        "Portrait Session": { "Silver Package": 3000, "Gold Package": 6500, "Platinum Package": 10000 },
        "Corporate Photography": { "Silver Package": 15000, "Gold Package": 30000, "Platinum Package": 50000 },
        "Videography": { "Silver Package": 20000, "Gold Package": 40000, "Platinum Package": 60000 },
        "Other": { "Silver Package": 10000, "Gold Package": 25000, "Platinum Package": 40000 }
    };

    const updatePriceEstimate = () => {
        const service = form.querySelector('#bookingEventType').value;
        const packageTier = form.querySelector('#bookingPackage').value;
        const estimateBox = document.getElementById('priceEstimateBox');
        const estimateText = document.getElementById('estimatedPrice');

        if (!estimateBox || !estimateText) return;

        if (service && packageTier) {
            estimateBox.style.display = 'block';
            if (packageTier === 'Custom Package / Quote') {
                estimateText.textContent = 'Custom Quote Requested';
            } else if (priceMatrix[service] && priceMatrix[service][packageTier]) {
                const price = priceMatrix[service][packageTier];
                estimateText.textContent = '₹' + price.toLocaleString('en-IN');
            } else {
                estimateText.textContent = 'Contact for Pricing';
            }
        } else {
            estimateBox.style.display = 'none';
        }
    };

    form.querySelector('#bookingEventType').addEventListener('change', updatePriceEstimate);
    form.querySelector('#bookingPackage').addEventListener('change', updatePriceEstimate);

    // 1. Check Query Parameters for auto-selection
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const packageParam = urlParams.get('package');

    if (serviceParam) {
        const serviceSelect = form.querySelector('#bookingEventType');
        if (serviceSelect) {
            // Find option matching the query parameter
            const options = Array.from(serviceSelect.options);
            const matchedOption = options.find(opt => opt.value.toLowerCase() === serviceParam.toLowerCase() || opt.text.toLowerCase() === serviceParam.toLowerCase() || opt.value.toLowerCase().startsWith(serviceParam.toLowerCase().substring(0, 5)));
            if (matchedOption) {
                serviceSelect.value = matchedOption.value;
            }
        }
    }

    if (packageParam) {
        const packageSelect = form.querySelector('#bookingPackage');
        if (packageSelect) {
            const options = Array.from(packageSelect.options);
            // Match substring or value
            const matchedOption = options.find(opt => opt.value.toLowerCase().includes(packageParam.toLowerCase()) || opt.text.toLowerCase().includes(packageParam.toLowerCase()));
            if (matchedOption) {
                packageSelect.value = matchedOption.value;
            }
        }
    }

    // Trigger initial estimate if values exist on load
    updatePriceEstimate();

    // 2. Form submission handler
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Reset alert states
        if (successAlert) successAlert.style.display = 'none';
        if (errorAlert) errorAlert.style.display = 'none';

        // Manual validation checks
        let isValid = true;

        // Reset validation states
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        // Validate Name
        const name = form.querySelector('#bookingName');
        if (name && (name.value.trim().length < 2)) {
            name.classList.add('is-invalid');
            isValid = false;
        }

        // Validate Email
        const email = form.querySelector('#bookingEmail');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email.value.trim())) {
            email.classList.add('is-invalid');
            isValid = false;
        }

        // Validate Mobile Number (Indian Format)
        const phone = form.querySelector('#bookingPhone');
        const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/;
        if (phone && (!phoneRegex.test(phone.value.trim().replace(/\s/g, '')) || phone.value.trim() === '')) {
            phone.classList.add('is-invalid');
            isValid = false;
        }

        // Validate Event Type
        const eventType = form.querySelector('#bookingEventType');
        if (eventType && eventType.value === '') {
            eventType.classList.add('is-invalid');
            isValid = false;
        }

        // Validate Package
        const selectedPackage = form.querySelector('#bookingPackage');
        if (selectedPackage && selectedPackage.value === '') {
            selectedPackage.classList.add('is-invalid');
            isValid = false;
        }

        // Validate Event Date
        const eventDate = form.querySelector('#bookingDate');
        if (eventDate && eventDate.value === '') {
            eventDate.classList.add('is-invalid');
            isValid = false;
        }

        // Validate Event Start & End Time
        const startTime = form.querySelector('#bookingStartTime');
        if (startTime && startTime.value === '') {
            startTime.classList.add('is-invalid');
            isValid = false;
        }

        const endTime = form.querySelector('#bookingEndTime');
        if (endTime && endTime.value === '') {
            endTime.classList.add('is-invalid');
            isValid = false;
        }

        // Validate Number of Guests
        const guests = form.querySelector('#bookingGuestsCount');
        if (guests && (guests.value === '' || parseInt(guests.value, 10) < 1)) {
            guests.classList.add('is-invalid');
            isValid = false;
        }

        // Validate Venue Location
        const location = form.querySelector('#bookingLocation');
        if (location && location.value.trim() === '') {
            location.classList.add('is-invalid');
            isValid = false;
        }

        // Validate Privacy Checkbox
        const privacy = form.querySelector('#bookingPrivacyCheck');
        if (privacy && !privacy.checked) {
            privacy.classList.add('is-invalid');
            isValid = false;
        }

        if (!isValid) {
            form.classList.add("was-validated");
            if (errorAlert) {
                errorAlert.style.display = 'block';
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        form.classList.add("was-validated");

        // Submit via AJAX
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
        }

        const formData = {
            name: name.value,
            phone: phone.value,
            email: email.value,
            photography_service: eventType.value,
            package_selection: selectedPackage.value,
            event_date: eventDate.value,
            start_time: startTime.value,
            end_time: endTime.value,
            guests_count: guests.value,
            event_venue: location.value,
            special_requirements: form.querySelector('#bookingMessage')?.value || ''
        };

        const actionUrl = form.getAttribute('action') || 'https://formsubmit.co/vivekvakapalli23@gmail.com';
        const ajaxUrl = actionUrl.replace('formsubmit.co/', 'formsubmit.co/ajax/');

        fetch(ajaxUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server error');
            }
        })
        .then(data => {
            if (successAlert) {
                successAlert.innerHTML = '<i class="fas fa-check-circle me-2"></i><strong>🎉 Booking Request Submitted Successfully!</strong><br><br>Thank you for choosing LensCraft Studio.<br>Our team will contact you within 24 hours to confirm your booking.';
                successAlert.style.display = 'block';
                successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            form.reset();
            form.classList.remove("was-validated");
            updatePriceEstimate();
        })
        .catch(error => {
            console.error('Booking submission error:', error);
            if (errorAlert) {
                errorAlert.textContent = "There was an error submitting your booking request. Please try again later.";
                errorAlert.style.display = 'block';
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtnText;
            }
        });
    });

    // Real-time validation feedback
    form.querySelectorAll('.form-control, .form-select, .form-check-input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('is-invalid');
            if (errorAlert) errorAlert.style.display = 'none';
        });
    });
}
