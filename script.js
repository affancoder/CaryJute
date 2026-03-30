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
    let outlineX = 0;
    let outlineY = 0;

    const speed = 0.15;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        // 1. Subtle Mouse-Parallax for Hero Blobs
        heroBlobs.forEach((blob, index) => {
            const factor = (index + 1) * 20;
            const x = (mouseX - window.innerWidth / 2) / factor;
            const y = (mouseY - window.innerHeight / 2) / factor;
            
            blob.style.transition = 'none'; // Instant response
            blob.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    const animateCursor = () => {
        const distX = mouseX - outlineX;
        const distY = mouseY - outlineY;

        outlineX += distX * speed;
        outlineY += distY * speed;

        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // 2. Magnetic Hover Effect
    const magnetics = document.querySelectorAll('a, button, .product-card');
    magnetics.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Disable transition during mouse move for instant response
            el.style.transition = 'none';
            
            const strength = 15;
            el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
            
            if (el.classList.contains('product-card')) {
                el.style.transform += ` translateY(-12px)`;
            }
        });

        el.addEventListener('mouseleave', () => {
            // Re-enable transition for smooth reset
            el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.transform = '';
            document.body.classList.remove('cursor-hover');
        });

        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
    });

    // --- Parallax & Reveal Animation ---
    const aboutSection = document.getElementById('about');
    const aboutBg = aboutSection.querySelector('.parallax-bg');
    const aboutText = aboutSection.querySelector('.parallax-text');
    const reveals = document.querySelectorAll('.reveal');

    // 1. Intersection Observer for Reveal on Scroll
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve after revealing to keep performance high
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // 2. Scroll Effects (Navbar, Parallax, ScrollTop)
    const handleScrollEffects = () => {
        const scrolled = window.scrollY;
        const viewHeight = window.innerHeight;

        // Hero Parallax
        if (parallaxContent && scrolled < viewHeight) {
            parallaxContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            parallaxContent.style.opacity = 1 - (scrolled / (viewHeight * 0.8));
        }

        // About Section Parallax
        const sectionTop = aboutSection.offsetTop;
        const sectionHeight = aboutSection.offsetHeight;
        
        if (scrolled + viewHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
            const relativeScroll = scrolled + viewHeight - sectionTop;
            const scrollPercent = relativeScroll / (viewHeight + sectionHeight);
            
            const bgMove = (scrollPercent * 150) - 75;
            aboutBg.style.transform = `translateY(${bgMove}px)`;
            
            const textMove = (scrollPercent * 50) - 25;
            aboutText.style.transform = `translateY(${textMove}px)`;
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
