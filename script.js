// Initialize variables
const navToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
const loadMorePosts = document.querySelector('#loadMorePosts');
const loadMoreProjects = document.querySelector('#loadMoreProjects');
let postsLoaded = 5;
let projectsLoaded = 4;

// Toggle Mobile Menu
navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
    navLinks.classList.toggle('active');
});

// Toggle Theme
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Search Functionality
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        performSearch(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            performSearch(query);
        }
    }
});

function performSearch(query) {
    const resultsGrid = document.querySelector('#searchResultsGrid');
    resultsGrid.innerHTML = '';
    const posts = document.querySelectorAll('.blog-post, .project-post');
    posts.forEach(post => {
        const title = post.querySelector('h3 a').textContent.toLowerCase();
        const excerpt = post.querySelector('.blog-excerpt, .project-excerpt')?.textContent.toLowerCase() || '';
        if (title.includes(query) || excerpt.includes(query)) {
            const clone = post.cloneNode(true);
            resultsGrid.appendChild(clone);
        }
    });
    if (resultsGrid.children.length === 0) {
        resultsGrid.innerHTML = '<p>No results found.</p>';
    }
    searchInput.value = '';
}

// Load More Posts
loadMorePosts.addEventListener('click', () => {
    const posts = document.querySelectorAll('.blog-post');
    for (let i = postsLoaded; i < postsLoaded + 5 && i < posts.length; i++) {
        posts[i].style.display = 'block';
    }
    postsLoaded += 5;
    if (postsLoaded >= posts.length) {
        loadMorePosts.style.display = 'none';
    }
});

// Load More Projects
loadMoreProjects.addEventListener('click', () => {
    const projects = document.querySelectorAll('.project-post');
    for (let i = projectsLoaded; i < projectsLoaded + 4 && i < projects.length; i++) {
        projects[i].style.display = 'block';
    }
    projectsLoaded += 4;
    if (projectsLoaded >= projects.length) {
        loadMoreProjects.style.display = 'none';
    }
});

// Form Submission Handling with Validation
const commentForm = document.querySelector('#comment-form');
if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#comment-name').value.trim();
        const email = document.querySelector('#comment-email').value.trim();
        const text = document.querySelector('#comment-text').value.trim();
        if (validateForm(name, email, text)) {
            addComment(name, email, text);
            commentForm.reset();
        }
    });
}

function validateForm(name, email, text) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || name.length < 2) {
        alert('Name must be at least 2 characters.');
        return false;
    }
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email.');
        return false;
    }
    if (!text || text.length < 10) {
        alert('Comment must be at least 10 characters.');
        return false;
    }
    return true;
}

function addComment(name, email, text) {
    const commentsGrid = document.querySelector('#commentsGrid');
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment-item');
    commentDiv.innerHTML = `<p class="comment-text">${text} – ${name}</p><p class="comment-date">${new Date().toLocaleDateString()}</p>`;
    commentsGrid.appendChild(commentDiv);
    commentsGrid.scrollTop = commentsGrid.scrollHeight;
}

// Newsletter Form Handling with Validation
const newsletterForm = document.querySelector('#newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#newsletter-email').value.trim();
        if (validateEmail(email)) {
            alert(`Subscribed with ${email}!`);
            newsletterForm.reset();
        }
    });
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email.');
        return false;
    }
    return true;
}

// Contact Form Handling with Validation
const contactBlogForm = document.querySelector('#contact-blog-form');
if (contactBlogForm) {
    contactBlogForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#contact-name').value.trim();
        const email = document.querySelector('#contact-email').value.trim();
        const message = document.querySelector('#contact-message').value.trim();
        if (validateContactForm(name, email, message)) {
            alert(`Message sent from ${name} (${email}): ${message}`);
            contactBlogForm.reset();
        }
    });
}

function validateContactForm(name, email, message) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || name.length < 2) {
        alert('Name must be at least 2 characters.');
        return false;
    }
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email.');
        return false;
    }
    if (!message || message.length < 10) {
        alert('Message must be at least 10 characters.');
        return false;
    }
    return true;
}

const contactProjectsForm = document.querySelector('#contact-projects-form');
if (contactProjectsForm) {
    contactProjectsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#contact-name').value.trim();
        const email = document.querySelector('#contact-email').value.trim();
        const message = document.querySelector('#contact-message').value.trim();
        if (validateContactForm(name, email, message)) {
            alert(`Message sent from ${name} (${email}): ${message}`);
            contactProjectsForm.reset();
        }
    });
}

// Smooth Scroll to Sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize on Load
window.addEventListener('load', () => {
    const posts = document.querySelectorAll('.blog-post');
    posts.forEach((post, index) => {
        if (index >= postsLoaded) post.style.display = 'none';
    });
    const projects = document.querySelectorAll('.project-post');
    projects.forEach((project, index) => {
        if (index >= projectsLoaded) project.style.display = 'none';
    });
});

// Dynamic Time Update
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { timeZone: 'Europe/Helsinki' });
    document.querySelectorAll('.footer-content p')[1].textContent = `Last Updated: ${timeString}, ${now.toLocaleDateString()}`;
}
setInterval(updateTime, 1000);
updateTime();

// Animation on Scroll
function revealOnScroll() {
    const sections = document.querySelectorAll('.section');
    const windowHeight = window.innerHeight;
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < windowHeight - 100) {
            section.classList.add('active');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();
