document.addEventListener('DOMContentLoaded', () => {

    /* --- Primary DOM Bindings --- */
    const menuToggle = document.getElementById('menu-toggle-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const menuPanels = document.querySelectorAll('.menu-panel');
    const contactForm = document.getElementById('contact-form');
    const feedbackBox = document.getElementById('form-feedback-box');
    const siteHeader = document.querySelector('.main-header');

    /* ==========================================================
       1. SCROLL STATE CONTROLLER
       ========================================================== */
    const handleScroll = () => {
        if (window.scrollY > 50) {
            siteHeader.style.backgroundColor = 'rgba(18, 18, 18, 0.98)';
            siteHeader.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
        } else {
            siteHeader.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
            siteHeader.style.boxShadow = 'none';
        }
    };
    
    window.addEventListener('scroll', handleScroll);

    /* ==========================================================
       2. MOBILE DRAWER CONTROLLER [4]
       ========================================================== */
    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        menuToggle.setAttribute('aria-expanded',!isExpanded);
        menuToggle.classList.toggle('active');
        
        mobileDrawer.setAttribute('aria-hidden', isExpanded);
        mobileDrawer.classList.toggle('open');
    };

    const closeMenu = () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        mobileDrawer.classList.remove('open');
    };

    menuToggle.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close mobile menu if clicked outside its boundaries
    document.addEventListener('click', (e) => {
        if (!mobileDrawer.contains(e.target) &&!menuToggle.contains(e.target) && mobileDrawer.classList.contains('open')) {
            closeMenu();
        }
    });

    /* ==========================================================
       3. INTERACTIVE ACCORDION / TAB COUPLING [5, 19]
       ========================================================== */
    const switchTab = (e) => {
        const activeTrigger = e.currentTarget;
        const targetPanelId = activeTrigger.getAttribute('aria-controls');

        // Reset all selector states
        tabTriggers.forEach(trigger => {
            trigger.classList.remove('active');
            trigger.setAttribute('aria-selected', 'false');
            trigger.setAttribute('tabindex', '-1');
        });

        // Hide all panels
        menuPanels.forEach(panel => {
            panel.classList.remove('active');
            panel.setAttribute('hidden', 'true');
        });

        // Activate matching elements
        activeTrigger.classList.add('active');
        activeTrigger.setAttribute('aria-selected', 'true');
        activeTrigger.removeAttribute('tabindex');

        const activePanel = document.getElementById(targetPanelId);
        activePanel.removeAttribute('hidden');
        
        // Timeout ensures CSS height / opacity animation renders cleanly
        setTimeout(() => {
            activePanel.classList.add('active');
        }, 50);
    };

    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', switchTab);
        
        // Add arrow navigation compatibility for tablists [5]
        trigger.addEventListener('keydown', (e) => {
            const tabsArray = Array.from(tabTriggers);
            const index = tabsArray.indexOf(trigger);
            let nextTab;

            if (e.key === 'ArrowRight') {
                nextTab = tabsArray[index + 1] || tabsArray;
            } else if (e.key === 'ArrowLeft') {
                nextTab = tabsArray[index - 1] || tabsArray[tabsArray.length - 1];
            }

            if (nextTab) {
                nextTab.focus();
                nextTab.click();
            }
        });
    });

    /* ==========================================================
       4. CLIENT-SIDE MOCK SUBMISSION HANDLER
       ========================================================== */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Transmitting...';
            
            // Simulating API network transition
            setTimeout(() => {
                feedbackBox.className = 'status-box success';
                feedbackBox.textContent = 'Thank you! Your inquiry has been received. Our hospitality crew will correspond within 24 hours.';
                
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                
                // Clear success notification after delay
                setTimeout(() => {
                    feedbackBox.style.opacity = '0';
                    setTimeout(() => {
                        feedbackBox.textContent = '';
                        feedbackBox.className = 'status-box';
                        feedbackBox.style.opacity = '1';
                    }, 500);
                }, 5000);
                
            }, 1500);
        });
    }
});
