document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('header nav ul li a');
    const sections = document.querySelectorAll('main section[id]');
    const backToTopLink = document.querySelector('footer a[href="#hero"]');
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 70; // Fallback if CSS var is not found

    // Function to update active navigation link
    function updateActiveLink() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            // Adjust section.offsetTop to account for the sticky header
            // A section is considered "active" if its top is within a range that includes the nav height
            // and part of the viewport.
            const sectionTop = section.offsetTop - navHeight;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop - navHeight / 2 && scrollPosition < sectionBottom - navHeight / 2) { // Adjusted threshold
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // If no section is "active" by the logic (e.g., at the very bottom of the page beyond the last section's content)
        // or at the very top before the first section is fully in view under the nav.
        // We can add a fallback or ensure the logic always picks one.
        // For instance, if at the bottom, keep the last section active.
        if (!currentSectionId && scrollPosition + window.innerHeight >= document.body.offsetHeight - navHeight) {
            currentSectionId = sections[sections.length - 1].getAttribute('id');
        }
        // If at the very top, make the first link active
        if (scrollPosition < sections[0].offsetTop - navHeight) {
             currentSectionId = sections[0].getAttribute('id');
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Listen for scroll events
    window.addEventListener('scroll', updateActiveLink);

    // Set initial active link on page load
    // Consider URL hash for initial active section
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            // Wait a bit for the browser's initial scroll to hash to complete, then update
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - navHeight,
                    behavior: 'auto' // Use 'auto' for initial load to avoid weird scroll
                });
                updateActiveLink(); // Update active link after scrolling
            }, 100);
        } else {
            updateActiveLink(); // Fallback if hash is invalid
        }
    } else {
        updateActiveLink(); // Default active link
    }


    // Smooth scroll for "Back to Top" link
    if (backToTopLink) {
        backToTopLink.addEventListener('click', (e) => {
            e.preventDefault();
            const heroSection = document.querySelector('#hero');
            if (heroSection) {
                window.scrollTo({
                    top: 0, // Scroll to the very top of the page
                    behavior: 'smooth'
                });
                // Optionally, update hash and active link after scrolling
                if (history.pushState) {
                    history.pushState(null, null, '#hero');
                } else {
                    window.location.hash = '#hero';
                }
                updateActiveLink();
            }
        });
    }

    // Smooth scroll for navigation links (optional, as CSS handles it, but good for consistency and explicit control)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Ensure it's an internal link
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - navHeight,
                        behavior: 'smooth'
                    });
                     // Update hash in URL without page jump for better UX
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        window.location.hash = targetId;
                    }
                    // No need to call updateActiveLink here as the scroll event will trigger it
                }
            }
        });
    });

});
