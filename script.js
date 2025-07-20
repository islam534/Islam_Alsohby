const { useState, useEffect } = React;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="logo">Islam Alsohby <i className="fas fa-globe animate-spin-slow"></i></div>
      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li><a href="#home" onClick={() => setIsOpen(false)}>Home</a></li>
        <li><a href="projects.html" onClick={() => setIsOpen(false)}>Projects</a></li>
        <li><a href="blog.html" onClick={() => setIsOpen(false)}>Blog</a></li>
        <li><a href="#contact" onClick={() => setIsOpen(false)}>Contact</a></li>
      </ul>
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>☰</div>
    </nav>
  );
};

const Hero = ({ bgImage, title, subheading, children }) => (
  <section className="hero" style={{ backgroundImage: `url(${bgImage})` }}>
    <div id="particles-js"></div>
    <div className="hero-content">
      <h1>{title}</h1>
      <p>{subheading} <span id="date-time"></span></p>
      {children}
    </div>
  </section>
);

const Card = ({ type, frontImage, title, description, backContent, link }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="card" onClick={() => setIsFlipped(!isFlipped)} onMouseEnter={() => setIsFlipped(true)} onMouseLeave={() => setIsFlipped(false)}>
      <div className="card-inner">
        <div className="card-front">
          <img src={frontImage} alt={title} />
          <h3>{title} <i className={`fas ${type === 'elp' || type === 'biab' || type.includes('paper') ? 'fa-flask' : 'fa-pen'}`}></i></h3>
          <p>{description}</p>
        </div>
        <div className="card-back">
          <p>{backContent}</p>
          <a href={link}>{link.includes('.pdf') ? 'Download PDF' : 'Learn More'}</a>
        </div>
      </div>
    </div>
  );
};

const ContactForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const message = form.message.value;
    if (name && email && message) {
      gsap.fromTo('#contact-form', { scale: 1, opacity: 1 }, {
        scale: 1.1, opacity: 0.7, duration: 0.3, onComplete: () => {
          setIsModalOpen(true);
          form.reset();
          gsap.to('#contact-form', { scale: 1, opacity: 1, duration: 0.3 });
        }
      });
    } else {
      alert('Please fill in all fields.');
    }
  };
  return (
    <form id="contact-form" onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <textarea name="message" placeholder="Your Message" required></textarea>
      <button type="submit" className="cta">Send Message</button>
      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close" onClick={() => setIsModalOpen(false)}>×</span>
            <p>Thank you! Your message has been sent. I’ll reply soon.</p>
          </div>
        </div>
      )}
    </form>
  );
};

const Footer = () => (
  <footer className="footer">
    <p>© 2025 Islam Alsohby. All rights reserved. <i className="fas fa-heart"></i></p>
    <button className="scroll-top" onClick={() => gsap.to(window, { duration: 1, scrollTo: 0, ease: 'power2.inOut' })}>↑</button>
  </footer>
);

const App = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.hero').forEach(section => {
      const img = section.querySelector('img');
      if (img) gsap.to(img, { y: '-20%', ease: 'none', scrollTrigger: { trigger: section, scrub: true } });
    });
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      gsap.from(card, { scrollTrigger: card, opacity: 0, y: 40, scale: 0.95, duration: 1, ease: 'power2.out' });
    });
    particlesJS('particles-js', {
      particles: { number: { value: 80, density: { enable: true, value_area: 800 } }, color: { value: '#76FF03' }, shape: { type: 'circle' }, opacity: { value: 0.5, random: true }, size: { value: 3, random: true }, line_linked: { enable: false }, move: { enable: true, speed: 2, direction: 'none', random: true } },
      interactivity: { detectsOn: 'canvas', modes: { repulse: { distance: 150 } } },
      retina_detect: true
    });
    window.addEventListener('scroll', () => {
      const scrollTopBtn = document.querySelector('.scroll-top');
      if (window.pageYOffset > 500) gsap.to(scrollTopBtn, { opacity: 1, duration: 0.3, display: 'block' });
      else gsap.to(scrollTopBtn, { opacity: 0, duration: 0.3, onComplete: () => scrollTopBtn.style.display = 'none' });
    });
    function updateDateTime() {
      const now = new Date();
      const options = { timeZone: 'Europe/Bucharest', hour12: false, hour: '2-digit', minute: '2-digit' };
      document.getElementById('date-time').textContent = `Last updated: ${now.toLocaleDateString()} ${now.toLocaleTimeString('en-GB', options)} EEST`;
    }
    updateDateTime();
    setInterval(updateDateTime, 60000);
  }, []);

  const openModal = (type) => {
    let content = '';
    switch (type) {
      case 'projects': content = 'Dive into my innovative projects and research papers.'; break;
      case 'blog': content = 'Explore my thoughts, reflections, and educational guides.'; break;
    }
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `<div class="modal-content"><span class="close" onclick="this.parentElement.parentElement.remove()">×</span><p>${content}</p></div>`;
    document.body.appendChild(modal);
    gsap.from(modal, { scale: 0, opacity: 0, duration: 0.5 });
    modal.addEventListener('click', () => gsap.to(modal, { scale: 0, opacity: 0, duration: 0.5, onComplete: () => modal.remove() }));
  };

  const renderCards = (type) => {
    const cards = {
      projects: [
        { type: 'elp', frontImage: 'https://images.unsplash.com/photo-1560439513-662c5e0e7c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'ELP Experience', description: 'Mentorship and leadership lessons.', backContent: 'Detailed insights from my ELP journey.', link: 'elp.html' },
        { type: 'biab', frontImage: 'https://images.unsplash.com/photo-1581092118020-1a40c4e4b8e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'BIAB Program', description: 'My BIAB initiative experience.', backContent: 'Explore my contributions to BIAB.', link: 'biab.html' },
        { type: 'paper1', frontImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'Research Paper 1', description: 'A study on [topic].', backContent: 'Download my first research paper.', link: 'paper1.pdf' },
        { type: 'paper2', frontImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'Research Paper 2', description: 'A study on [topic].', backContent: 'Access my second research paper.', link: 'paper2.pdf' }
      ],
      blog: [
        { type: 'dormmate', frontImage: 'https://images.unsplash.com/photo-1600585154526-990d8f4ad0db?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'Dealing with a Difficult Dormmate', description: 'Strategies for tough living situations.', backContent: 'Tips and reflections on conflict resolution.', link: '#dormmate' },
        { type: 'napoleon', frontImage: 'https://images.unsplash.com/photo-1506784897864-3bb9373a7e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'The Napoleon Complex', description: 'Exploring power dynamics.', backContent: 'Analysis of personality and history.', link: '#napoleon' },
        { type: 'book-review', frontImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'Book Review: The Power of Habit', description: 'Key takeaways from my reading.', backContent: 'Summary of Charles Duhigg’s work.', link: '#book-review' },
        { type: 'stem-guide', frontImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'STEM High School Guide', description: 'A guide to excelling in STEM.', backContent: 'Advice for STEM students.', link: '#stem-guide' }
      ]
    };
    return cards[type].map(card => <Card key={card.type} {...card} onClick={() => openModal(type)} />);
  };

  const About = () => (
    <section className="about">
      <h2>About Me</h2>
      <p>I'm Islam Alsohby, fluent in <img src="https://img.icons8.com/color/24/000000/germany.png" alt="German Flag" /> German, <img src="https://img.icons8.com/color/24/000000/spain.png" alt="Spanish Flag" /> Spanish, <img src="https://img.icons8.com/color/24/000000/france.png" alt="French Flag" /> French, and English. With a passion for philosophy, critical thinking, and social impact, I thrive as a <i className="fas fa-users-cog"></i> leader, <i className="fas fa-lightbulb"></i> entrepreneur, <i className="fas fa-hands-helping"></i> social activist, and <i className="fas fa-football-ball"></i> football player. I share my insights through research, blogs, and projects.</p>
    </section>
  );

  const Article = ({ id, title, image, content }) => (
    <section id={id} className="article">
      <h2>{title}</h2>
      <img src={image} alt={title} />
      <div className="article-content">{content}</div>
      <button className="back-to-top" onClick={() => gsap.to(window, { duration: 1, scrollTo: 0, ease: 'power2.inOut' })}>Back to Top</button>
    </section>
  );

  const articles = [
    {
      id: 'dormmate',
      title: 'Dealing with a Difficult Dormmate',
      image: 'https://images.unsplash.com/photo-1600585154526-990d8f4ad0db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      content: (
        <>
          <h3>Introduction</h3>
          <p>Living with a difficult dormmate can test your patience and communication skills. This article offers practical strategies to manage conflicts and foster a peaceful environment, drawn from personal experiences and expert advice.</p>
          <h3>Communication Strategies</h3>
          <p>Start with open dialogue. Use "I" statements like "I feel uneasy when the room is noisy" to express concerns without blaming. Schedule regular talks to address issues early and prevent escalation.</p>
          <h3>Establishing Boundaries</h3>
          <p>Set clear rules, such as quiet hours from 10 PM to 6 AM or shared space usage. A written agreement can reinforce these boundaries, ensuring mutual respect and reducing misunderstandings.</p>
          <h3>Resolving Conflicts</h3>
          <p>If tensions rise, involve a neutral party like a resident advisor. Focus on compromise—perhaps alternating study times or sharing chores—to find a workable solution for both.</p>
          <h3>Conclusion</h3>
          <p>Navigating a difficult dormmate situation requires empathy, clear communication, and proactive boundary-setting. These steps can turn challenges into opportunities for personal growth and better relationships.</p>
        </>
      )
    },
    {
      id: 'napoleon',
      title: 'The Napoleon Complex',
      image: 'https://images.unsplash.com/photo-1506784897864-3bb9373a7e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      content: (
        <>
          <h3>Introduction</h3>
          <p>The Napoleon Complex, often associated with short stature and overcompensation, explores how perceived inadequacies shape behavior. This article examines its historical roots and modern implications.</p>
          <h3>Historical Roots</h3>
          <p>Napoleon Bonaparte, standing about 5’2”, leveraged his height-driven ambition to conquer Europe, showcasing how perceived weakness can fuel extraordinary drive.</p>
          <h3>Psychological Insights</h3>
          <p>Research indicates individuals may exhibit assertiveness or aggression to counter feelings of inferiority, a trait observable in competitive workplaces or social groups.</p>
          <h3>Everyday Examples</h3>
          <p>From overzealous managers to assertive peers, this complex influences daily interactions, often subtly altering group dynamics and leadership styles.</p>
          <h3>Conclusion</h3>
          <p>The Napoleon Complex offers a lens to understand power, perception, and human motivation, enriching our approach to personal and professional relationships.</p>
        </>
      )
    },
    {
      id: 'book-review',
      title: 'Book Review: The Power of Habit',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      content: (
        <>
          <h3>Introduction</h3>
          <p>"The Power of Habit" by Charles Duhigg unravels the science behind habits and their impact on our lives. This review highlights key takeaways and personal reflections.</p>
          <h3>The Habit Loop</h3>
          <p>Duhigg’s core concept—the cue-routine-reward loop—explains habit formation, backed by studies and examples like how Starbucks trains employees.</p>
          <h3>Applying the Lessons</h3>
          <p>The book provides actionable steps to build habits (e.g., daily exercise) and break bad ones (e.g., smoking), offering a blueprint for self-improvement.</p>
          <h3>Personal Impact</h3>
          <p>I adopted the keystone habit idea, creating a morning routine that enhances my focus and productivity, aligning with Duhigg’s insights.</p>
          <h3>Conclusion</h3>
          <p>"The Power of Habit" is an insightful guide for mastering behavior change, making it a valuable read for anyone seeking personal growth.</p>
        </>
      )
    },
    {
      id: 'stem-guide',
      title: 'STEM High School Guide',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      content: (
        <>
          <h3>Introduction</h3>
          <p>A STEM education in high school lays the foundation for future success. This guide offers practical tips for students to excel in science, technology, engineering, and math.</p>
          <h3>Effective Study Habits</h3>
          <p>Consistency is key—study math and coding daily using resources like Khan Academy. Practice problem-solving to build confidence and skills.</p>
          <h3>Utilizing Resources</h3>
          <p>Explore online courses on Coursera, participate in school labs, and seek mentors to gain hands-on experience and deepen knowledge.</p>
          <h3>Planning Career Paths</h3>
          <p>Consider fields like engineering or data science. Attend career fairs and network with professionals to open doors to future opportunities.</p>
          <h3>Conclusion</h3>
          <p>With dedication, the right study habits, and resource use, a STEM high school journey can lead to a rewarding and innovative career.</p>
        </>
      )
    }
  ];

  return (
    <div>
      <Navbar />
      <main>
        <Hero bgImage="https://images.unsplash.com/photo-1506784897864-3bb9373a7e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" title="Welcome to My Universe" subheading="A journey of a multilingual scholar, leader, entrepreneur, and athlete." />
        <About />
        <section id="preview" className="preview">
          <h2>Explore My Journey</h2>
          <div className="grid">{renderCards('projects').slice(0, 2).concat(renderCards('blog').slice(0, 2))}</div>
        </section>
        <section id="contact" className="contact">
          <h2>Contact Me</h2>
          <p>Let’s connect for collaborations or inquiries.</p>
          <ContactForm />
        </section>
      </main>
      <Footer />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
