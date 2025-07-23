const { useState, useEffect } = React;

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  if (hasError) return <div className="text-starlight-white text-center p-6">An error occurred. Please refresh the page.</div>;
  return children;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="logo">Islam Alsohby <i className="fas fa-globe animate-orbit text-neon-green-500"></i></div>
      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li><a href="#home" onClick={() => setIsOpen(false)}>Home</a></li>
        <li><a href="#about" onClick={() => setIsOpen(false)}>About</a></li>
        <li><a href="#projects" onClick={() => setIsOpen(false)}>Projects</a></li>
        <li><a href="#blog" onClick={() => setIsOpen(false)}>Blog</a></li>
        <li><a href="#contact" onClick={() => setIsOpen(false)}>Contact</a></li>
      </ul>
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)} tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && setIsOpen(!isOpen)} aria-label="Toggle navigation menu">☰</div>
    </nav>
  );
};

const Hero = () => (
  <section id="home" className="hero">
    <div id="particles-js"></div>
    <div className="hero-content">
      <h1>Explore My Universe</h1>
      <p>A journey through scholarship, leadership, entrepreneurship, and athletics. <span id="date-time"></span></p>
      <a href="#about" className="cta">Start Journey</a>
    </div>
  </section>
);

const Card = ({ type, frontImage, title, description, backContent, link }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="card" onClick={() => setIsFlipped(!isFlipped)} onMouseEnter={() => setIsFlipped(true)} onMouseLeave={() => setIsFlipped(false)} tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && setIsFlipped(!isFlipped)} aria-label={title}>
      <div className="card-inner">
        <div className="card-front">
          <img src={frontImage} alt={title} loading="lazy" />
          <h3>{title} <i className={`fas ${type.includes('paper') || type === 'elp' || type === 'biab' ? 'fa-flask' : 'fa-pen'} text-neon-green-500`}></i></h3>
          <p>{description}</p>
        </div>
        <div className="card-back">
          <p>{backContent}</p>
          <a href={link} className="text-neon-green-500 hover:text-solar-orange-500 underline" aria-label={link.includes('.pdf') ? 'Download PDF' : 'Read more'}>{link.includes('.pdf') ? 'Download PDF' : 'Read More'}</a>
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
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
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
    <form id="contact-form" onSubmit={handleSubmit} aria-label="Contact form">
      <input type="text" name="name" placeholder="Your Name" required aria-required="true" />
      <input type="email" name="email" placeholder="Your Email" required aria-required="true" />
      <textarea name="message" placeholder="Your Message" required aria-required="true"></textarea>
      <button type="submit" className="cta" aria-label="Send message">Send Message</button>
      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)} role="dialog" aria-labelledby="modal-title">
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close" onClick={() => setIsModalOpen(false)} id="modal-title">×</span>
            <p>Thank you! Your message has been received. I’ll get back to you soon.</p>
          </div>
        </div>
      )}
    </form>
  );
};

const Footer = () => (
  <footer className="footer">
    <p>© 2025 Islam Alsohby. All rights reserved. <i className="fas fa-star text-solar-orange-500"></i></p>
    <button className="scroll-top" onClick={() => gsap.to(window, { duration: 1, scrollTo: 0, ease: 'power2.inOut' })} tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && gsap.to(window, { duration: 1, scrollTo: 0, ease: 'power2.inOut' })} aria-label="Scroll to top">↑</button>
  </footer>
);

const App = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cleanup = [];
    gsap.from('.hero-content', { opacity: 0, y: 50, duration: 1.5, ease: 'power3.out' });
    const heroes = gsap.utils.toArray('.hero');
    heroes.forEach(section => {
      const tween = gsap.to(section, { backgroundPositionY: '20%', ease: 'none', scrollTrigger: { trigger: section, scrub: true } });
      cleanup.push(() => tween.kill());
    });
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const tween = gsap.from(card, { scrollTrigger: card, opacity: 0, y: 50, scale: 0.95, duration: 1, ease: 'power2.out' });
      cleanup.push(() => tween.kill());
    });
    particlesJS('particles-js', {
      particles: { number: { value: 100, density: { enable: true, value_area: 800 } }, color: { value: '#00FF99' }, shape: { type: 'circle' }, opacity: { value: 0.7, random: true }, size: { value: 4, random: true }, line_linked: { enable: true, color: '#00FF99', opacity: 0.4 }, move: { enable: true, speed: 2, direction: 'none', random: true } },
      interactivity: { detectsOn: 'canvas', modes: { repulse: { distance: 200 } } },
      retina_detect: true
    });
    const handleScroll = () => {
      const scrollTopBtn = document.querySelector('.scroll-top');
      if (window.pageYOffset > 300) gsap.to(scrollTopBtn, { opacity: 1, duration: 0.3, display: 'block' });
      else gsap.to(scrollTopBtn, { opacity: 0, duration: 0.3, onComplete: () => scrollTopBtn.style.display = 'none' });
    };
    window.addEventListener('scroll', handleScroll);
    cleanup.push(() => window.removeEventListener('scroll', handleScroll));
    function updateDateTime() {
      const now = new Date();
      const options = { timeZone: 'Europe/Bucharest', hour12: false, hour: '2-digit', minute: '2-digit' };
      document.getElementById('date-time').textContent = `Updated: ${now.toLocaleDateString()} ${now.toLocaleTimeString('en-GB', options)} EEST`;
    }
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    cleanup.push(() => clearInterval(interval));
    return () => cleanup.forEach(fn => fn());
  }, []);

  const [activeTab, setActiveTab] = useState('about');

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="content">
            <p className="text-xl md:text-2xl text-starlight-white leading-7">
              I’m Islam Alsohby, a multilingual scholar fluent in <img src="https://img.icons8.com/color/24/000000/germany.png" alt="German Flag" className="inline" /> German, <img src="https://img.icons8.com/color/24/000000/spain.png" alt="Spanish Flag" className="inline" /> Spanish, <img src="https://img.icons8.com/color/24/000000/france.png" alt="French Flag" className="inline" /> French, and English. As a <i className="fas fa-users-cog text-neon-green-500"></i> leader, <i className="fas fa-lightbulb text-neon-green-500"></i> entrepreneur, <i className="fas fa-hands-helping text-neon-green-500"></i> social innovator, and <i className="fas fa-football-ball text-neon-green-500"></i> athlete, I blend critical thinking with practical impact. My journey spans philosophical research, community leadership, and athletic excellence, all shared through my projects and writings.
            </p>
          </div>
        );
      case 'projects':
        return (
          <div className="grid">
            <Card type="elp" frontImage="https://images.unsplash.com/photo-1560439513-662c5e0e7c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" title="ELP Leadership Program" description="Led team-building initiatives." backContent="Directed a 6-month leadership workshop series, enhancing team dynamics." link="elp.html" />
            <Card type="biab" frontImage="https://images.unsplash.com/photo-1581092118020-1a40c4e4b8e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" title="BIAB Community Project" description="Social impact venture." backContent="Developed a community-driven program boosting local engagement." link="biab.html" />
            <Card type="paper1" frontImage="https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" title="Social Dynamics Study" description="Research on group behavior." backContent="Analyzed social interactions with data-driven insights." link="paper1.pdf" />
            <Card type="paper2" frontImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" title="Leadership Models" description="Framework analysis." backContent="Explored effective leadership strategies with case studies." link="paper2.pdf" />
          </div>
        );
      case 'blog':
        return (
          <div className="grid">
            <Card type="dormmate" frontImage="https://images.unsplash.com/photo-1600585154526-990d8f4ad0db?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" title="Dealing with a Dormmate" description="Resolve living conflicts." backContent="Practical tips for harmony in shared spaces." link="#dormmate" />
            <Card type="napoleon" frontImage="https://images.unsplash.com/photo-1506784897864-3bb9373a7e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" title="Napoleon Complex" description="Power dynamics insight." backContent="Historical and psychological exploration." link="#napoleon" />
            <Card type="book-review" frontImage="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" title="Power of Habit Review" description="Habit formation guide." backContent="Key lessons from Charles Duhigg’s work." link="#book-review" />
            <Card type="stem-guide" frontImage="https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" title="STEM Success Guide" description="High school tips." backContent="Resources for excelling in STEM fields." link="#stem-guide" />
          </div>
        );
      case 'contact':
        return (
          <div className="content">
            <p className="text-xl md:text-2xl text-starlight-white mb-6">Let’s connect to collaborate or discuss ideas.</p>
            <ContactForm />
          </div>
        );
      default:
        return null;
    }
  };

  const articles = [
    {
      id: 'dormmate',
      title: 'Dealing with a Difficult Dormmate',
      image: 'https://images.unsplash.com/photo-1600585154526-990d8f4ad0db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      content: (
        <>
          <h3>Introduction</h3>
          <p>Living with a challenging dormmate tests patience and communication. This guide offers proven strategies for peace.</p>
          <img src="https://images.unsplash.com/photo-1581092118020-1a40c4e4b8e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Roommate Discussion" loading="lazy" />
          <h3>Communication Tips</h3>
          <p>Use "I" statements like "I need quiet at night" and schedule regular talks to prevent escalation.</p>
          <h3>Boundaries</h3>
          <p>Set rules for shared spaces, like quiet hours, and document agreements for clarity.</p>
          <img src="https://images.unsplash.com/photo-1506784897864-3bb9373a7e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Shared Space" loading="lazy" />
          <h3>Resolution</h3>
          <p>Seek mediation if needed, focusing on compromises like alternating schedules.</p>
          <h3>Conclusion</h3>
          <p>Empathy and structure turn dorm challenges into growth opportunities.</p>
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
          <p>The Napoleon Complex links perceived height disadvantages to ambition. This piece examines its roots and relevance.</p>
          <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Historical Figure" loading="lazy" />
          <h3>Historical Context</h3>
          <p>Napoleon’s conquests were fueled by a drive to overcome his stature, a classic example.</p>
          <h3>Psychological Angle</h3>
          <p>Overcompensation appears in assertive behaviors, common in leadership roles.</p>
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Leadership Scene" loading="lazy" />
          <h3>Modern Examples</h3>
          <p>Seen in competitive workplaces, influencing dynamics daily.</p>
          <h3>Conclusion</h3>
          <p>Understanding this complex enhances personal and professional strategies.</p>
        </>
      )
    },
    {
      id: 'book-review',
      title: 'Review: The Power of Habit',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      content: (
        <>
          <h3>Introduction</h3>
          <p>Charles Duhigg’s "The Power of Habit" decodes behavior patterns. This review shares insights.</p>
          <img src="https://images.unsplash.com/photo-1506784897864-3bb9373a7e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Reading" loading="lazy" />
          <h3>The Habit Loop</h3>
          <p>Cue-routine-reward drives habits, as seen in corporate training models.</p>
          <h3>Applications</h3>
          <p>Build routines like exercise or break habits like procrastination with intent.</p>
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Habit Tracking" loading="lazy" />
          <h3>Reflection</h3>
          <p>My morning routine, inspired by keystone habits, transformed my day.</p>
          <h3>Conclusion</h3>
          <p>A must-read for mastering life’s habits with practical wisdom.</p>
        </>
      )
    },
    {
      id: 'stem-guide',
      title: 'STEM High School Success',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      content: (
        <>
          <h3>Introduction</h3>
          <p>STEM education opens career doors. This guide offers a roadmap for success.</p>
          <img src="https://images.unsplash.com/photo-1506784897864-3bb9373a7e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Classroom" loading="lazy" />
          <h3>Study Habits</h3>
          <p>Daily practice with Khan Academy builds math and coding skills.</p>
          <h3>Resources</h3>
          <p>Use Coursera, labs, and mentors for hands-on learning.</p>
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Lab Work" loading="lazy" />
          <h3>Career Paths</h3>
          <p>Explore engineering or data science via career fairs and networking.</p>
          <h3>Conclusion</h3>
          <p>Dedication and resources pave the way to a STEM career.</p>
        </>
      )
    }
  ];

  return (
    <ErrorBoundary>
      <div>
        <Navbar />
        <main>
          <Hero />
          <div className="tabs">
            <button className={`tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About</button>
            <button className={`tab ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Projects</button>
            <button className={`tab ${activeTab === 'blog' ? 'active' : ''}`} onClick={() => setActiveTab('blog')}>Blog</button>
            <button className={`tab ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>Contact</button>
          </div>
          <section className="section">
            {renderContent()}
            {activeTab === 'blog' && articles.map(article => (
              <Article key={article.id} id={article.id} title={article.title} image={article.image} content={article.content} />
            ))}
          </section>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
