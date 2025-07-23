document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        themeIcon.classList.toggle('fa-moon');
        themeIcon.classList.toggle('fa-sun');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    // Scroll Animations
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    // Gallery Filter
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            galleryItems.forEach(item => {
                item.style.display = filter === 'all' || item.dataset.category === filter ? 'block' : 'none';
                if (item.style.display === 'block') {
                    item.classList.add('animate');
                    setTimeout(() => item.classList.remove('animate'), 300);
                }
            });
        });
    });

    // Lazy Loading Images
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, { threshold: 0.1 });

    images.forEach(img => imgObserver.observe(img));

    // Form Submission (Placeholder)
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        console.log('Form submitted:', data);
        alert('Thank you for your message! I’ll get back to you soon.');
        contactForm.reset();
    });

    // Service Worker Registration for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    }
});

// Add animation class for gallery items
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .gallery-item.animate {
        animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    img.loaded {
        animation: fadeInImg 0.5s ease-out;
    }
    @keyframes fadeInImg {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(styleSheet);
