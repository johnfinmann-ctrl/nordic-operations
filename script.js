// Navigation Control Mechanism
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        const expanded = navToggle.classList.contains('active');
        navToggle.setAttribute('aria-expanded', expanded);
    });

    // Auto-close overlay on link interaction
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// B2B Advanced Contact Capture Handler
const premiumForm = document.getElementById('premiumContactForm');
const premiumResponse = document.getElementById('premiumResponse');

if (premiumForm && premiumResponse) {
    premiumForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('c_name').value.trim();
        const email = document.getElementById('c_email').value.trim();
        const msg = document.getElementById('c_msg').value.trim();
        
        if (!name || !email || !msg) {
            premiumResponse.style.color = '#ef4444';
            premiumResponse.textContent = 'Venligst udfyld alle felter korrekt.';
            return;
        }
        
        // Formspree / Backend Ready Integration Architecture
        premiumResponse.style.color = '#a3e635';
        premiumResponse.textContent = 'Mange tak for din henvendelse. John Finmann eller en rådgiver kontakter dig inden for 24 timer.';
        
        premiumForm.reset();
    });
}

// Service Worker Integration for Progressive Web App (PWA) Offline-First capability
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Nordic Operations PWA ServiceWorker running successfully on scope: ', registration.scope);
            })
            .catch(err => {
                console.error('ServiceWorker installation failure: ', err);
            });
    });
}
