document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', navList.classList.contains('active'));
    });

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-mode');

    const loadMoreButtons = document.querySelectorAll('.load-more');
    loadMoreButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const section = button.id === 'loadMore' ? document.querySelector(button.closest('section').classList.contains('blog') ? '#blogGrid' : '#projectGrid') : null;
            if (section) {
                const offset = section.children.length;
                const response = await fetch(`/api/${section.id.replace('Grid', '')}?offset=${offset}`);
                const data = await response.json();
                data.forEach(item => {
                    const div = document.createElement('div');
                    div.innerHTML = item.html;
                    section.appendChild(div);
                });
                if (data.length === 0) button.disabled = true;
            }
        });
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(reg => console.log('SW registered:', reg)).catch(err => console.log('SW error:', err));
    }
});
