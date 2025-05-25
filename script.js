document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('main section[id]');
    const backToTopLink = document.querySelector('footer a[href="#hero"]');
    
    // Universal Side Panel Menu Elements
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidePanel = document.getElementById('mobile-menu-panel'); // Renamed for clarity
    const closeMenuBtn = document.getElementById('close-menu-btn');
    // All clickable <a> elements in the side panel
    const allSidePanelLinks = document.querySelectorAll('#mobile-menu-panel ul li a');
    // Only <a> elements that scroll to sections (internal page links)
    const sectionNavLinks = document.querySelectorAll('#mobile-menu-panel ul li a[href^="#"]');

    // Consistent header height for scroll offset calculation
    function getStickyNavHeight() {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height-universal'), 10) || 60;
    }
    
    // Function to update active navigation link in the side panel
    function updateActiveLink() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY;
        const currentNavHeight = getStickyNavHeight();

        sections.forEach(section => {
            const sectionTop = section.offsetTop - currentNavHeight;
            const sectionBottom = sectionTop + section.offsetHeight;

            // Adjust threshold for determining active section
            if (scrollPosition >= sectionTop - currentNavHeight * 0.5 && scrollPosition < sectionBottom - currentNavHeight * 0.5) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Fallback for bottom of page or very top
        if (!currentSectionId && scrollPosition + window.innerHeight >= document.body.offsetHeight - currentNavHeight) {
            currentSectionId = sections[sections.length - 1].getAttribute('id');
        }
        if (scrollPosition < sections[0].offsetTop - currentNavHeight && sections.length > 0) {
             currentSectionId = sections[0].getAttribute('id');
        }

        sectionNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Listen for scroll and resize events
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('resize', () => {
        // Close panel on resize to desktop view if open, for example
        if (window.innerWidth > 768 && sidePanel.classList.contains('is-open')) { // Assuming 768px is mobile breakpoint
            toggleSidePanel();
        }
        updateActiveLink(); // Recalculate active link based on new dimensions/offsets
    });

    // Set initial active link on page load
    function setInitialActiveState() {
        const currentNavHeight = getStickyNavHeight();
        if (window.location.hash && window.location.hash !== "#") { // Ensure hash is not empty
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
            // updateActiveLink will be triggered by scroll event
        });
    }

    // Generic smooth scroll handler for navigation links
    function handleSmoothScroll(event) {
        const targetId = this.getAttribute('href'); // 'this' refers to the link clicked
        // Ensure it's an internal section link
        if (targetId && targetId.startsWith('#') && targetId.length > 1) { 
            event.preventDefault(); // Prevent default anchor jump
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const currentNavHeight = getStickyNavHeight();
                const targetPosition = targetSection.offsetTop - currentNavHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash after scrolling is initiated
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        }
        // If it's not an internal section link (e.g. external), default behavior will apply (opening in new tab if target="_blank")
    }

    // --- Universal Side Panel Menu Functionality ---
    function toggleSidePanel() {
        const isOpen = sidePanel.classList.toggle('is-open');
        hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
        sidePanel.setAttribute('aria-hidden', (!isOpen).toString());
        document.body.classList.toggle('body-no-scroll', isOpen); 
    }

    if (hamburgerBtn && sidePanel && closeMenuBtn) {
        hamburgerBtn.addEventListener('click', toggleSidePanel);
        closeMenuBtn.addEventListener('click', toggleSidePanel);

        // Add event listeners to all links in the side panel
        allSidePanelLinks.forEach(link => {
            link.addEventListener('click', function(e) { // Use 'function' to correctly bind 'this' for handleSmoothScroll
                const href = this.getAttribute('href');
                
                // If it's a section link, handle smooth scroll
                if (href && href.startsWith('#') && href.length > 1) {
                    handleSmoothScroll.call(this, e); // Pass event and correct 'this'
                }
                // Else, it's an external link or special button; default action will proceed.
                
                // Close the panel after any link click
                if (sidePanel.classList.contains('is-open')) {
                    // Delay closing slightly to allow default action (like opening new tab)
                    setTimeout(toggleSidePanel, 100); 
                }
            });
        });
    }

    // Scroll to Top Button Functionality
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show after 300px scroll
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Optional: update hash, consistent with footer link
            if (history.pushState) {
                history.pushState(null, null, '#hero');
            } else {
                window.location.hash = '#hero';
            }
        });
    }
});
