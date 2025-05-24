document.addEventListener('DOMContentLoaded', () => {
    const desktopNavLinks = document.querySelectorAll('header nav.desktop-nav ul li a');
    const sections = document.querySelectorAll('main section[id]');
    const backToTopLink = document.querySelector('footer a[href="#hero"]');
    
    // Hamburger Menu Elements
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu-panel ul li a');

    // Determine navHeight dynamically based on current viewport (for sticky header offset)
    function getStickyNavHeight() {
        const desktopNavHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 70;
        const mobileNavHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height-mobile'), 10) || 60;
        return window.innerWidth <= 768 ? mobileNavHeight : desktopNavHeight;
    }
    
    // Function to update active navigation link for both desktop and mobile
    function updateActiveLink() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY;
        const currentNavHeight = getStickyNavHeight();

        sections.forEach(section => {
            const sectionTop = section.offsetTop - currentNavHeight;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop - currentNavHeight / 2 && scrollPosition < sectionBottom - currentNavHeight / 2) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (!currentSectionId && scrollPosition + window.innerHeight >= document.body.offsetHeight - currentNavHeight) {
            currentSectionId = sections[sections.length - 1].getAttribute('id');
        }
        if (scrollPosition < sections[0].offsetTop - currentNavHeight && sections.length > 0) {
             currentSectionId = sections[0].getAttribute('id');
        }

        // Update desktop links
        desktopNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
        // Update mobile links
        mobileMenuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Listen for scroll events
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('resize', updateActiveLink); // Update on resize as navHeight might change

    // Set initial active link on page load
    function setInitialActiveState() {
        const currentNavHeight = getStickyNavHeight();
        if (window.location.hash) {
            const targetSection = document.querySelector(window.location.hash);
            if (targetSection) {
                setTimeout(() => {
                    window.scrollTo({
                        top: targetSection.offsetTop - currentNavHeight,
                        behavior: 'auto' 
                    });
                    updateActiveLink(); 
                }, 100);
            } else {
                updateActiveLink(); 
            }
        } else {
            updateActiveLink(); 
        }
    }
    setInitialActiveState();


    // Smooth scroll for "Back to Top" link
    if (backToTopLink) {
        backToTopLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0, 
                behavior: 'smooth'
            });
            if (history.pushState) {
                history.pushState(null, null, '#hero');
            } else {
                window.location.hash = '#hero';
            }
            // updateActiveLink(); // Scroll event will handle this
        });
    }

    // Generic smooth scroll handler for navigation links
    function handleSmoothScroll(e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const currentNavHeight = getStickyNavHeight();
                window.scrollTo({
                    top: targetSection.offsetTop - currentNavHeight,
                    behavior: 'smooth'
                });
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        }
    }

    // Apply smooth scroll to desktop navigation links
    desktopNavLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });

    // --- Hamburger Menu Functionality ---
    function toggleMobileMenu() {
        const isOpen = mobileMenuPanel.classList.toggle('is-open');
        hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
        mobileMenuPanel.setAttribute('aria-hidden', (!isOpen).toString());
        document.body.classList.toggle('body-no-scroll', isOpen); // Toggle scroll lock on body
    }

    if (hamburgerBtn && mobileMenuPanel && closeMenuBtn) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);
        closeMenuBtn.addEventListener('click', toggleMobileMenu);

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Close the menu first
                if (mobileMenuPanel.classList.contains('is-open')) {
                    toggleMobileMenu();
                }
                // Then handle smooth scroll (using the generic handler)
                handleSmoothScroll.call(this, e); 
            });
        });
    }
});
