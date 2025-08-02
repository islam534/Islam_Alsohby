// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const loadMoreBlog = document.getElementById('loadMoreBlog');
const loadMoreProjects = document.getElementById('loadMoreProjects');
const loadMoreGallery = document.getElementById('loadMoreGallery');
const loadMoreTestimonials = document.getElementById('loadMoreTestimonials');
const blogGrid = document.getElementById('blogGrid');
const projectGrid = document.getElementById('projectGrid');
const galleryGrid = document.getElementById('galleryGrid');
const testimonialsGrid = document.getElementById('testimonialsGrid');
const resourcesGrid = document.getElementById('resourcesGrid');
const contactForm = document.getElementById('contact-form');

// State
let blogPage = 1;
let projectPage = 1;
let galleryPage = 1;
let testimonialPage = 1;
const itemsPerPage = 3;

// Socket.IO Connection
const socket = io();

// Event Listeners
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetch(`/search?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                blogGrid.innerHTML = '';
                data.forEach(item => {
                    const article = document.createElement('article');
                    article.className = 'blog-post';
                    article.innerHTML = `
                        <img src="${item.image}" alt="${item.title}" class="blog-image">
                        <div class="blog-content">
                            <h3>${item.title}</h3>
                            <p class="thesis">${item.thesis}</p>
                            <p class="blog-summary">${item.summary}</p>
                            <div class="blog-meta">
                                <span><i class="fas fa-calendar"></i> ${item.date}</span>
                                <span><i class="fas fa-clock"></i> ${item.readTime}</span>
                                <span><i class="fas fa-eye"></i> ${item.views}</span>
                            </div>
                            <div class="blog-actions">
                                <a href="${item.link}" class="read-more" aria-label="Read ${item.title} Article">Read Full Article</a>
                                <button class="like-button" data-id="${item._id}" aria-label="Like this article"><i class="fas fa-thumbs-up"></i> Like</button>
                                <button class="comment-button" data-id="${item._id}" aria-label="Comment on this article"><i class="fas fa-comment"></i> Comment</button>
                            </div>
                            <div class="comment-section" data-id="${item._id}" style="display:none;">
                                <textarea placeholder="Add your comment..." aria-label="Add a comment"></textarea>
                                <button class="submit-comment" aria-label="Submit Comment">Submit</button>
                            </div>
                        </div>
                    `;
                    blogGrid.appendChild(article);
                });
                attachEventListeners();
            })
            .catch(error => console.error('Search error:', error));
    }
});

loadMoreBlog.addEventListener('click', () => loadContent('blog', blogPage + 1));
loadMoreProjects.addEventListener('click', () => loadContent('projects', projectPage + 1));
loadMoreGallery.addEventListener('click', () => loadContent('gallery', galleryPage + 1));
loadMoreTestimonials.addEventListener('click', () => loadContent('testimonials', testimonialPage + 1));

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    fetch('/contact', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        contactForm.reset();
    })
    .catch(error => console.error('Contact error:', error));
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    loadContent('blog', blogPage);
    loadContent('projects', projectPage);
    loadContent('gallery', galleryPage);
    loadContent('testimonials', testimonialPage);
    loadContent('resources', 1);
});

// Load Content Function
function loadContent(type, page) {
    fetch(`/${type}?page=${page}&limit=${itemsPerPage}`)
        .then(response => response.json())
        .then(data => {
            const grid = {
                blog: blogGrid,
                projects: projectGrid,
                gallery: galleryGrid,
                testimonials: testimonialsGrid,
                resources: resourcesGrid
            }[type];
            data.forEach(item => {
                const element = document.createElement('div');
                element.className = `${type === 'resources' ? 'resource-card' : `${type}-card`}`;
                element.innerHTML = getTemplate(type, item);
                grid.appendChild(element);
            });
            if (type === 'blog') blogPage = page;
            if (type === 'projects') projectPage = page;
            if (type === 'gallery') galleryPage = page;
            if (type === 'testimonials') testimonialPage = page;
            if (data.length < itemsPerPage) {
                document.getElementById(`loadMore${type.charAt(0).toUpperCase() + type.slice(1)}`).style.display = 'none';
            }
            attachEventListeners();
        })
        .catch(error => console.error(`${type} load error:`, error));
}

// Templates
function getTemplate(type, item) {
    switch (type) {
        case 'blog':
            return `
                <img src="${item.image}" alt="${item.title}" class="blog-image">
                <div class="blog-content">
                    <h3>${item.title}</h3>
                    <p class="thesis">${item.thesis}</p>
                    <p class="blog-summary">${item.summary}</p>
                    <div class="blog-meta">
                        <span><i class="fas fa-calendar"></i> ${item.date}</span>
                        <span><i class="fas fa-clock"></i> ${item.readTime}</span>
                        <span><i class="fas fa-eye"></i> ${item.views}</span>
                    </div>
                    <div class="blog-actions">
                        <a href="${item.link}" class="read-more" aria-label="Read ${item.title} Article">Read Full Article</a>
                        <button class="like-button" data-id="${item._id}" aria-label="Like this article"><i class="fas fa-thumbs-up"></i> Like (${item.likes || 0})</button>
                        <button class="comment-button" data-id="${item._id}" aria-label="Comment on this article"><i class="fas fa-comment"></i> Comment</button>
                    </div>
                    <div class="comment-section" data-id="${item._id}" style="display:none;">
                        <textarea placeholder="Add your comment..." aria-label="Add a comment"></textarea>
                        <button class="submit-comment" aria-label="Submit Comment">Submit</button>
                        <div class="comments-list"></div>
                    </div>
                </div>
            `;
        case 'projects':
            return `
                <img src="${item.image}" alt="${item.title}" class="project-image">
                <div class="project-content">
                    <h3>${item.title}</h3>
                    <p class="project-description">${item.description}</p>
                    <div class="project-meta">
                        <span><i class="fas fa-code"></i> ${item.tech}</span>
                        <span><i class="fas fa-calendar"></i> ${item.date}</span>
                        <span><i class="fas fa-users"></i> ${item.team}</span>
                    </div>
                    <div class="project-actions">
                        <a href="${item.pdf}" class="project-link" aria-label="Download ${item.title} PDF">Download PDF</a>
                        <button class="project-demo" data-id="${item._id}" aria-label="View ${item.title} Demo">View Live Demo</button>
                    </div>
                </div>
            `;
        case 'gallery':
            return `
                <img src="${item.image}" alt="${item.caption}" class="gallery-image">
                <p class="gallery-caption">${item.caption}</p>
                <button class="gallery-enlarge" data-id="${item._id}" aria-label="Enlarge ${item.caption} Image">Enlarge</button>
            `;
        case 'testimonials':
            return `
                <p class="testimonial-text">${item.text}</p>
                <p class="testimonial-author">${item.author}</p>
            `;
        case 'resources':
            return `
                <h3>${item.category}</h3>
                <ul>
                    ${item.items.map(i => `<li><a href="${i.link}" target="_blank">${i.title}</a></li>`).join('')}
                </ul>
            `;
        default:
            return '';
    }
}

// Event Delegation
function attachEventListeners() {
    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            fetch(`/like/${id}`, { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    button.textContent = `Like (${data.likes})`;
                });
        });
    });

    document.querySelectorAll('.comment-button').forEach(button => {
        button.addEventListener('click', () => {
            const section = button.nextElementSibling;
            section.style.display = section.style.display === 'none' ? 'block' : 'none';
        });
    });

    document.querySelectorAll('.submit-comment').forEach(button => {
        button.addEventListener('click', () => {
            const section = button.parentElement;
            const textarea = section.querySelector('textarea');
            const comment = textarea.value.trim();
            if (comment) {
                fetch(`/comment/${section.getAttribute('data-id')}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment })
                })
                .then(response => response.json())
                .then(data => {
                    textarea.value = '';
                    loadComments(section.getAttribute('data-id'), section.querySelector('.comments-list'));
                });
            }
        });
    });

    document.querySelectorAll('.project-demo').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            window.open(`/demo/${id}`, '_blank');
        });
    });

    document.querySelectorAll('.gallery-enlarge').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            fetch(`/gallery/${id}`)
                .then(response => response.json())
                .then(data => {
                    alert(`Enlarged Image: ${data.image}`);
                });
        });
    });
}

// Load Comments
function loadComments(id, container) {
    fetch(`/comments/${id}`)
        .then(response => response.json())
        .then(comments => {
            container.innerHTML = comments.map(c => `<p>${c.text} - ${c.author}</p>`).join('');
        });
}

// Real-time Updates
socket.on('newComment', (data) => {
    const section = document.querySelector(`.comment-section[data-id="${data.postId}"]`);
    if (section) {
        loadComments(data.postId, section.querySelector('.comments-list'));
    }
});

socket.on('newLike', (data) => {
    const button = document.querySelector(`.like-button[data-id="${data.postId}"]`);
    if (button) {
        button.textContent = `Like (${data.likes})`;
    }
});
