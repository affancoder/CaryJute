document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const parallaxContent = document.querySelector('.parallax-content');
    const scrollTopBtn = document.getElementById('scroll-top');
    const heroBlobs = document.querySelectorAll('.animate-blob');

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let outlineX = 0;
    let outlineY = 0;
    const isMobileQuery = window.matchMedia('(max-width: 768px)');
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || isMobileQuery.matches;

    // Increased speed (smoothing factor) to reduce lag
    const speed = 0.25;

    if (!isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        const animateCursor = () => {
            // Smoothly follow for dot (faster)
            dotX += (mouseX - dotX) * 0.8;
            dotY += (mouseY - dotY) * 0.8;
            
            cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

            // Smoothly follow for outline (slightly slower but fast)
            const distX = mouseX - outlineX;
            const distY = mouseY - outlineY;

            outlineX += distX * speed;
            outlineY += distY * speed;

            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;

            // Subtle Mouse-Parallax for Hero Blobs
            heroBlobs.forEach((blob, index) => {
                const factor = (index + 1) * 35;
                const x = (mouseX - window.innerWidth / 2) / factor;
                const y = (mouseY - window.innerHeight / 2) / factor;
                
                blob.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });

            requestAnimationFrame(animateCursor);
        };
        animateCursor();
    } else {
        // Hide custom cursor elements if on touch device
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // --- Premium Mobile Interactions ---
    const interactiveElements = document.querySelectorAll('a, button, .product-card');

    interactiveElements.forEach(el => {
        // 1. Tap Feedback (Scale down on touch)
        el.addEventListener('touchstart', () => {
            el.classList.add('tap-active');
        }, { passive: true });

        el.addEventListener('touchend', () => {
            el.classList.remove('tap-active');
        }, { passive: true });

        el.addEventListener('touchcancel', () => {
            el.classList.remove('tap-active');
        }, { passive: true });

        // 2. Magnetic Hover Effect (Only for non-touch devices)
        if (!isTouchDevice) {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const strength = 12;
                const moveX = x / strength;
                const moveY = y / strength;
                
                if (el.classList.contains('product-card')) {
                    el.style.transform = `translate(${moveX}px, ${moveY - 12}px)`;
                } else {
                    el.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
            });

            el.addEventListener('mouseleave', () => {
                el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.transform = '';
                document.body.classList.remove('cursor-hover');
            });

            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
        }
    });

    // 3. Mobile Product Card Tap-to-Reveal
    if (isTouchDevice) {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // If the user taps the "View Product" button, let it bubble up to its own handler
                if (e.target.closest('.view-product-btn')) return;

                // Toggle the tap-reveal class
                const isRevealed = card.classList.contains('tap-reveal');
                
                // Close all other cards first
                productCards.forEach(c => c.classList.remove('tap-reveal'));
                
                if (!isRevealed) {
                    card.classList.add('tap-reveal');
                    e.preventDefault(); // Prevent accidental navigation if it were a link
                }
            });
        });

        // Close revealed card if tapping outside
        document.addEventListener('touchstart', (e) => {
            if (!e.target.closest('.product-card')) {
                productCards.forEach(c => c.classList.remove('tap-reveal'));
            }
        }, { passive: true });
    }

    // --- Parallax & Reveal Animation ---
    const aboutSection = document.getElementById('about');
    const aboutBg = aboutSection.querySelector('.parallax-bg');
    const aboutText = aboutSection.querySelector('.parallax-text');
    const processSection = document.getElementById('process');
    const processVideo = processSection?.querySelector('.video-parallax');
    const reveals = document.querySelectorAll('.reveal');

    // 1. Intersection Observer for Reveal on Scroll
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // --- Stats Count-Up Animation ---
    const statsSection = document.getElementById('brand-statement');
    const statsElements = statsSection?.querySelectorAll('[data-count]') || [];
    
    const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            
            const currentCount = Math.floor(easeProgress * (target - start) + start);
            
            // Format number if needed (e.g., adding + or ,)
            if (target === 1000) {
                el.innerText = currentCount.toLocaleString() + '+';
            } else if (target === 15) {
                el.innerText = currentCount + '+';
            } else {
                el.innerText = currentCount;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Final value check
                if (target === 1000) el.innerText = '1,000+';
                else if (target === 15) el.innerText = '15+';
            }
        };

        requestAnimationFrame(animate);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statsElements.forEach(el => countUp(el));
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // 2. Scroll Effects (Navbar, Parallax, ScrollTop)
    const handleScrollEffects = () => {
        const scrolled = window.scrollY;
        const viewHeight = window.innerHeight;

        // Hero Parallax
        if (parallaxContent && scrolled < viewHeight) {
            parallaxContent.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
            parallaxContent.style.opacity = 1 - (scrolled / (viewHeight * 0.8));
        }

        // About Section Parallax
        if (aboutSection) {
            const sectionTop = aboutSection.offsetTop;
            const sectionHeight = aboutSection.offsetHeight;
            
            if (scrolled + viewHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
                const relativeScroll = scrolled + viewHeight - sectionTop;
                const scrollPercent = relativeScroll / (viewHeight + sectionHeight);
                
                const bgMove = (scrollPercent * 150) - 75;
                if (aboutBg) aboutBg.style.transform = `translate3d(0, ${bgMove}px, 0)`;
                
                const textMove = (scrollPercent * 50) - 25;
                if (aboutText) aboutText.style.transform = `translate3d(0, ${textMove}px, 0)`;
            }
        }

        // Process Section Video Parallax
        if (processSection && processVideo) {
            const sectionTop = processSection.offsetTop;
            const sectionHeight = processSection.offsetHeight;
            
            if (scrolled + viewHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
                const relativeScroll = scrolled + viewHeight - sectionTop;
                const scrollPercent = relativeScroll / (viewHeight + sectionHeight);
                const move = (scrollPercent * 40) - 20;
                processVideo.style.transform = `translate3d(0, ${move}px, 0)`;
            }
        }

        // Navbar effect & Scroll Top visibility
        if (scrolled > 300) {
            navbar.classList.add('scrolled');
            scrollTopBtn.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            scrollTopBtn.classList.remove('visible');
        }
    };

    // Use requestAnimationFrame for smoother scroll performance
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScrollEffects();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    handleScrollEffects(); // Initial check

    // --- Scroll to Top Click ---
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Mobile Menu ---
    menuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('active');
        
        if (isOpen) {
            mobileMenu.classList.remove('active');
            menuIcon.setAttribute('d', 'M4 6h16M4 12h16m-7 6h7');
        } else {
            mobileMenu.classList.add('active');
            menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
        }
    });

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuIcon.setAttribute('d', 'M4 6h16M4 12h16m-7 6h7');
        });
    });

    // --- Product Slider ---
    const productSlider = document.getElementById('product-slider');
    const slideLeft = document.getElementById('slide-left');
    const slideRight = document.getElementById('slide-right');

    if (productSlider && slideLeft && slideRight) {
        const getScrollAmount = () => {
            const card = productSlider.querySelector('.product-card');
            if (!card) return 400; // Fallback
            const cardWidth = card.offsetWidth;
            const gap = 32; // gap-8 = 2rem = 32px
            return (cardWidth + gap) * 1.5; // Scroll roughly 1.5 cards
        };

        slideLeft.addEventListener('click', () => {
            productSlider.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });

        slideRight.addEventListener('click', () => {
            productSlider.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });

        // Optional: Hide/Show buttons based on scroll position
        const toggleButtons = () => {
            const isAtStart = productSlider.scrollLeft <= 10;
            const isAtEnd = productSlider.scrollLeft + productSlider.clientWidth >= productSlider.scrollWidth - 10;
            
            slideLeft.style.opacity = isAtStart ? '0.3' : '1';
            slideLeft.style.pointerEvents = isAtStart ? 'none' : 'auto';
            
            slideRight.style.opacity = isAtEnd ? '0.3' : '1';
            slideRight.style.pointerEvents = isAtEnd ? 'none' : 'auto';
        };

        productSlider.addEventListener('scroll', toggleButtons);
        window.addEventListener('resize', toggleButtons);
        toggleButtons(); // Initial call
    }

    // --- Dynamic Sliding Text ---
    const row1 = document.getElementById('marquee-row-1');
    const row2 = document.getElementById('marquee-row-2');
    
    if (row1 && row2) {
        let currentPos1 = 0;
        let currentPos2 = -50; // Start row 2 offset for contrast
        let baseSpeed = 0.05; // Very slow base speed
        let scrollSpeed = 0;
        let lastScrollY = window.scrollY;
        let isHoveringMarquee = false;

        // Mouse interaction for desktop
        let mouseXPercent = 0.5;
        if (!isTouchDevice) {
            window.addEventListener('mousemove', (e) => {
                mouseXPercent = e.clientX / window.innerWidth;
            }, { passive: true });
        }

        const marqueeContainers = document.querySelectorAll('.animate-marquee-slow, .animate-marquee-reverse-slow, #marquee-row-1, #marquee-row-2');
        marqueeContainers.forEach(container => {
            const parent = container.parentElement;
            parent.addEventListener('mouseenter', () => isHoveringMarquee = true);
            parent.addEventListener('mouseleave', () => isHoveringMarquee = false);
        });

        const animateMarquee = () => {
            if (!isHoveringMarquee) {
                // 1. Calculate Scroll Speed Influence
                const currentScrollY = window.scrollY;
                const scrollDiff = Math.abs(currentScrollY - lastScrollY);
                scrollSpeed += (scrollDiff * 0.1 - scrollSpeed) * 0.1; // Smooth it
                lastScrollY = currentScrollY;

                // 2. Mouse Position Influence (Desktop only)
                const mouseFactor = isTouchDevice ? 1 : (0.5 + mouseXPercent);

                // 3. Final Speed Calculation
                const finalSpeed = (baseSpeed + scrollSpeed * 0.05) * mouseFactor;

                // Update Positions
                currentPos1 -= finalSpeed;
                currentPos2 += finalSpeed;

                // Seamless loop at 50% (since we repeat content once in HTML)
                if (currentPos1 <= -50) currentPos1 = 0;
                if (currentPos2 >= 0) currentPos2 = -50;

                row1.style.transform = `translate3d(${currentPos1}%, 0, 0)`;
                row2.style.transform = `translate3d(${currentPos2}%, 0, 0)`;
            }

            // Decay scroll speed influence when idle
            scrollSpeed *= 0.95;

            requestAnimationFrame(animateMarquee);
        };
        animateMarquee();
    }

    // --- Product Modal ---
    const productModal = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');
    const viewProductBtns = document.querySelectorAll('.view-product-btn');
    const zoomOverlay = document.getElementById('zoom-overlay');

    if (productModal && modalImage && closeModal) {
        viewProductBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click if any
                const productCard = btn.closest('.product-card');
                const productImg = productCard.querySelector('img');
                
                modalImage.src = productImg.src;
                modalImage.alt = productImg.alt;
                
                // Reset zoom state
                modalImage.classList.remove('zoomed', 'cursor-zoom-out');
                modalImage.classList.add('cursor-zoom-in');
                zoomOverlay.classList.remove('active');
                
                productModal.classList.add('active');
                document.body.classList.add('modal-open');
            });
        });

        const handleCloseModal = () => {
            productModal.classList.remove('active');
            document.body.classList.remove('modal-open');
            // Small delay to clear src after animation
            setTimeout(() => {
                modalImage.src = '';
            }, 500);
        };

        closeModal.addEventListener('click', handleCloseModal);
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) handleCloseModal();
        });

        // ESC key to close
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && productModal.classList.contains('active')) {
                handleCloseModal();
            }
        });

        // Zoom Interaction
        modalImage.addEventListener('click', (e) => {
            e.stopPropagation();
            const isZoomed = modalImage.classList.toggle('zoomed');
            modalImage.classList.toggle('cursor-zoom-in', !isZoomed);
            modalImage.classList.toggle('cursor-zoom-out', isZoomed);
            zoomOverlay.classList.toggle('active', isZoomed);
        });
    }

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const statusMessage = document.getElementById('status-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            
            // UI Feedback during submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="flex items-center justify-center gap-2"><svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending...</span>';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactForm.reset();
                    contactForm.classList.add('hidden');
                    formStatus.classList.remove('hidden');
                    formStatus.classList.add('bg-emerald-50', 'border', 'border-emerald-100');
                    statusMessage.innerText = "Thank you! Your message has been sent successfully.";
                    statusMessage.classList.add('text-emerald-800');
                } else {
                    const data = await response.json();
                    throw new Error(data.errors?.[0]?.message || "Form submission failed.");
                }
            } catch (error) {
                formStatus.classList.remove('hidden');
                formStatus.classList.add('bg-red-50', 'border', 'border-red-100');
                statusMessage.innerText = "Oops! Something went wrong. Please try again later.";
                statusMessage.classList.add('text-red-800');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
