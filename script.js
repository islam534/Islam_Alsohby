document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle with animation
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    gsap.fromTo('.nav-links li', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 });
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });
  });

  // Fade-in animation with GSAP
  const cards = document.querySelectorAll('.fade-in');
  cards.forEach(card => {
    gsap.from(card, {
      scrollTrigger: card,
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 1,
      ease: 'power2.out'
    });
  });

  // Contact form validation
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      if (name && email && message) {
        gsap.fromTo('#contact-form', { scale: 1, opacity: 1 }, {
          scale: 1.1, opacity: 0.7, duration: 0.3, onComplete: () => {
            alert('Thank you! Your message has been sent. I’ll reply soon.');
            form.reset();
            gsap.to('#contact-form', { scale: 1, opacity: 1, duration: 0.3 });
          }
        });
      } else {
        alert('Please fill in all fields.');
      }
    });
  }

  // Parallax effect with GSAP
  gsap.utils.toArray('.parallax-bg').forEach(img => {
    gsap.to(img, {
      y: '-20%',
      ease: 'none',
      scrollTrigger: {
        trigger: img.parentElement,
        scrub: true
      }
    });
  });

  // Scroll to top button
  const scrollTopBtn = document.querySelector('.scroll-top');
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      gsap.to(scrollTopBtn, { opacity: 1, duration: 0.3, display: 'block' });
    } else {
      gsap.to(scrollTopBtn, { opacity: 0, duration: 0.3, onComplete: () => scrollTopBtn.style.display = 'none' });
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    gsap.to(window, { duration: 1, scrollTo: 0, ease: 'power2.inOut' });
  });

  // Particle animation
  particlesJS('particles-js', {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: '#76FF03' },
      shape: { type: 'circle' },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: false },
      move: { enable: true, speed: 2, direction: 'none', random: true }
    },
    interactivity: { detectsOn: 'canvas', modes: { repulse: { distance: 150 } } },
    retina_detect: true
  });

  // Real-time date and time
  function updateDateTime() {
    const now = new Date();
    const options = { timeZone: 'Europe/Bucharest', hour12: false, hour: '2-digit', minute: '2-digit' };
    document.getElementById('date-time').textContent = `Last updated: ${now.toLocaleDateString()} ${now.toLocaleTimeString('en-GB', options)} EEST`;
  }
  updateDateTime();
  setInterval(updateDateTime, 60000);

  // Modal functionality
  const modal = document.getElementById('modal');
  const modalText = document.getElementById('modal-text');
  const closeBtn = document.querySelector('.close');

  function openModal(type) {
    let content = '';
    switch (type) {
      case 'projects': content = 'Dive into my innovative projects and research papers.'; break;
      case 'blog': content = 'Explore my thoughts, reflections, and educational guides.'; break;
      case 'elp': content = 'ELP taught me leadership through mentorship—details inside.'; break;
      case 'biab': content = 'BIAB was a transformative experience in community impact.'; break;
      case 'paper1': content = 'Research Paper 1: A deep dive into [topic].'; break;
      case 'paper2': content = 'Research Paper 2: Exploring [topic] further.'; break;
      case 'dormmate': content = 'Learn how I navigated a challenging dormmate situation.'; break;
      case 'napoleon': content = 'An analysis of the Napoleon Complex in daily life.'; break;
      case 'book': content = 'Review of [Book Title] with key insights.'; break;
      case 'stem': content = 'STEM Guide: Practical steps for high school success.'; break;
    }
    modalText.textContent = content;
    modal.style.display = 'flex';
    gsap.from(modal, { scale: 0, opacity: 0, duration: 0.5 });
  }

  closeBtn.addEventListener('click', () => {
    gsap.to(modal, { scale: 0, opacity: 0, duration: 0.5, onComplete: () => modal.style.display = 'none' });
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      gsap.to(modal, { scale: 0, opacity: 0, duration: 0.5, onComplete: () => modal.style.display = 'none' });
    }
  });
});
