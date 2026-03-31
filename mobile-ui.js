document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const slideMenu = document.getElementById('mobile-slide-menu');
    const closeSlideMenuBtn = document.getElementById('close-slide-menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const slideMenuLinksContainer = document.querySelector('.slide-menu-links');

    // --- Populate Slide-out Menu from Desktop Nav ---
    if (slideMenuLinksContainer) {
        const desktopNav = document.querySelector('header + nav');
        if (desktopNav) {
            desktopNav.querySelectorAll('button').forEach(btn => {
                const link = document.createElement('a');
                link.href = '#'; // Prevent page reload
                link.textContent = btn.innerText;
                
                // Copy the original onclick behavior
                if (btn.onclick) {
                    link.onclick = (e) => {
                        e.preventDefault();
                        btn.onclick(); // Execute the original function
                        closeMenu(); // Close menu after click
                    };
                }
                slideMenuLinksContainer.appendChild(link);
            });
        }
    }

    // --- Menu Toggle Logic ---
    const openMenu = () => {
        if (slideMenu) slideMenu.classList.add('open');
        if (menuOverlay) menuOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    const closeMenu = () => {
        if (slideMenu) slideMenu.classList.remove('open');
        if (menuOverlay) menuOverlay.classList.remove('open');
        document.body.style.overflow = ''; // Restore scroll
    };

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMenu);
    if (closeSlideMenuBtn) closeSlideMenuBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // --- PWA Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => console.log('ServiceWorker registration successful.'))
                .catch(err => console.log('ServiceWorker registration failed: ', err));
        });
    }
});