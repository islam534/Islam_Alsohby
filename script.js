document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    let themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    let themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    if (!themeToggle || !themeIcon) {
        console.error('Theme toggle button or icon not found. Creating fallback.');
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle';
            themeToggle.setAttribute('aria-label', 'Toggle dark mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            navbar.appendChild(themeToggle);
            themeIcon = themeToggle.querySelector('i');
        }
    }
    if (themeToggle && themeIcon) {
        themeToggle.style.display = 'block'; // Force visibility
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            themeIcon.classList.toggle('fa-moon');
            themeIcon.classList.toggle('fa-sun');
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-mode');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    // Mobile Menu Toggle
    let menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) {
        console.error('Menu toggle or nav-links not found. Creating fallback.');
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            navbar.insertBefore(menuToggle, navbar.children[1]);
            const navLinksFallback = document.createElement('nav');
            navLinksFallback.className = 'nav-links';
            navLinksFallback.setAttribute('role', 'navigation');
            navLinksFallback.innerHTML = `
                <a href="#home" aria-label="Go to Home"><i class="fas fa-home"></i> Home</a>
                <a href="#about" aria-label="Go to About"><i class="fas fa-user"></i> About</a>
                <a href="#research" aria-label="Go to Research"><i class="fas fa-flask"></i> Research</a>
                <a href="#blog" aria-label="Go to Blog"><i class="fas fa-pen"></i> Blog</a>
                <a href="#languages" aria-label="Go to Languages"><i class="fas fa-globe"></i> Languages</a>
                <a href="#media" aria-label="Go to Media"><i class="fas fa-camera"></i> Media</a>
                <a href="#recommendations" aria-label="Go to Recommendations"><i class="fas fa-lightbulb"></i> Recommendations</a>
                <a href="#contact" aria-label="Go to Contact"><i class="fas fa-envelope"></i> Contact</a>
            `;
            navbar.insertBefore(navLinksFallback, navbar.children[2]);
        }
    }
    if (menuToggle && navLinks) {
        menuToggle.style.display = 'block'; // Force visibility
        menuToggle.addEventListener('click', () => {
            const isExpanded = navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            console.log('Form submitted:', data);
            alert('Thank you for your message! I’ll get back to you soon.');
            contactForm.reset();
        });
    }

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
