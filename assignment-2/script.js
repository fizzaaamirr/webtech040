// ===== RESPONSIVE NAVIGATION MENU =====

// Get elements
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navLinks = document.getElementById('navLinks');
const navLinksItems = document.querySelectorAll('.nav-links a');

// Toggle menu on hamburger click
hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});
