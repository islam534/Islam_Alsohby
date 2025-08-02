// Menu Toggle Functionality
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    const isExpanded = navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
    navLinks.setAttribute('aria-hidden', !isExpanded);
    if (isExpanded) {
        navLinks.style.maxHeight = navLinks.scrollHeight + 'px';
    } else {
        navLinks.style.maxHeight = '0';
    }
});

// Theme Toggle with Persistence and Icon Switch
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Load Saved Theme on Page Load
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.innerWidth <= 1280) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
            navLinks.style.maxHeight = '0';
        }
        history.pushState(null, null, targetId);
    });
});

// Load More Functionality for Dynamic Sections
const loadMoreButtons = document.querySelectorAll('.load-more');
loadMoreButtons.forEach(button => {
    button.addEventListener('click', () => {
        const section = button.closest('.section').id;
        let items = [];
        if (section === 'blog') items = document.querySelectorAll('.blog-post:not(.loaded)');
        else if (section === 'projects') items = document.querySelectorAll('.project-card:not(.loaded)');
        else if (section === 'gallery') items = document.querySelectorAll('.gallery-item:not(.loaded)');
        else if (section === 'testimonials') items = document.querySelectorAll('.testimonial-card:not(.loaded)');

        if (items.length > 0) {
            items[0].classList.add('loaded');
            items[0].style.display = 'block';
            if (items.length === 1) button.style.display = 'none';
        }
    });
});

// Contact Form Submission with Client-Side Validation
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return;
    }
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    const formData = new FormData(contactForm);
    fetch('/api/contact', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        alert(data.message);
        contactForm.reset();
        contactForm.querySelectorAll('input, textarea').forEach(input => input.classList.remove('error'));
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to send message. Please try again later.');
        contactForm.querySelectorAll('input, textarea').forEach(input => input.classList.add('error'));
    });
});

// Lazy Load Images with Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src') || img.src;
                img.src = src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                observer.unobserve(img);
