      content: (
        <>
          <h3 className="text-xl md:text-2xl font-semibold text-pearl-glow mt-6 mb-2">Introduction</h3>
          <p className="text-pearl-glow">The term 'Napoleon Complex' explores how individuals of shorter stature may compensate with heightened ambition or aggression, inspired by Napoleon Bonaparte.</p>
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Historical Figure" loading="lazy" className="w-full h-64 object-cover rounded-xl mt-4 mb-4 shadow-lg" />
          <h3 className="text-xl md:text-2xl font-semibold text-pearl-glow mt-6 mb-2">Historical Context</h3>
          <p className="text-pearl-glow">Napoleon’s military success challenges the stereotype, suggesting confidence rather than insecurity drove his conquests.</p>
          <h3 className="text-xl md:text-2xl font-semibold text-pearl-glow mt-6 mb-2">Psychological Insights</h3>
          <p className="text-pearl-glow">Studies indicate this complex may stem from social perceptions rather than inherent traits, affecting leadership styles.</p>
          <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Psychological Study" loading="lazy" className="w-full h-64 object-cover rounded-xl mt-4 mb-4 shadow-lg" />
          <h3 className="text-xl md:text-2xl font-semibold text-pearl-glow mt-6 mb-2">Conclusion</h3>
          <p className="text-pearl-glow">Understanding this phenomenon highlights the interplay between perception and performance in leadership.</p>
        </>
      )
    },
    {
      id: 'book-review',
      title: 'Review: The Power of Habit',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      content: (
        <>
          <h3 className="text-xl md:text-2xl font-semibold text-pearl-glow mt-6 mb-2">Overview</h3>
          <p className="text-pearl-glow">Charles Duhigg’s 'The Power of Habit' unveils how habits shape our lives, offering actionable insights.</p>
          <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Book Cover" loading="lazy" className="w-full h-64 object-cover rounded-xl mt-4 mb-4 shadow-lg" />
          <h3 className="text-xl md:text-2xl font-semibold text-pearl-glow mt-6 mb-2">Key Takeaways</h3>
          <p className="text-pearl-glow">The habit loop—cue, routine, reward—provides a framework to build positive behaviors and break bad ones.</p>
          <h3 className="text-xl md:text-2xl font-semibold text-pearl-glow mt-6 mb-2">Personal Impact</h3>
          <p className="text-pearl-glow">Applying these principles has transformed my productivity and decision-making processes.</p>
          <img src="https://images.unsplash.com/photo-1506784897864-3bb9373a7e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Habit Tracking" loading="lazy" className="w-full h-64 object-cover rounded-xl mt-4 mb-4 shadow-lg" />
          <h3 className="text-xl md:text-2xl font-semibold text-pearl-glow mt-6 mb-2">Conclusion</h3>
          <p className="text-pearl-glow">A must-read for anyone seeking to master their habits and unlock potential.</p>
        </>
      )
    },
    {
      id: 'stem-guide',
      title: 'STEM Success Guide',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      content: (
        <>
          <h3 className="text-xl md:text-2xl font-semibold text-pearl-glow mt-6 mb-2">Introduction</h3>
          <p className="text-pearl-glow">This guide equips high school students with tools to excel in STEM fields.</p>
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="STEM Lab" loading="lazy" className="w-full h-64 object-cover rounded-xl mt-4 mb-4 shadow-lg" />
          <h3 className="text-xl md:text-2xl font-semibold text-pearl-glow mt-6 mb-2">Study Strategies</h3>
          <p className="text-pearl-glow">Focus on active learning, such as problem-solving and group projects, to deepen understanding.</p>
          <h3 className="text-xl md:text-2xl font-semibold text-pearl-glow mt-6 mb-2">Resources</h3>
          <p className="text-pearl-glow">Utilize online platforms like Khan Academy and participate in STEM clubs for hands-on experience.</p>
          <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="STEM Workshop" loading="lazy" className="w-full h-64 object-cover rounded-xl mt-4 mb-4 shadow-lg" />
          <h3 className="text-xl md:text-2xl font-semibold text-pearl-glow mt-6 mb-2">Conclusion</h3>
          <p className="text-pearl-glow">With dedication and the right tools, STEM success is within reach.</p>
        </>
      )
    }
  ];

  return (
    <ErrorBoundary>
      <Navbar />
      <main>
        <Hero />
        <section className="section relative" role="region" aria-label="Content section">
          <div className="tabs">
            <button className={`tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About</button>
            <button className={`tab ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Projects</button>
            <button className={`tab ${activeTab === 'blog' ? 'active' : ''}`} onClick={() => setActiveTab('blog')}>Blog</button>
            <button className={`tab ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>Gallery</button>
            <button className={`tab ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>Contact</button>
          </div>
          {renderContent()}
        </section>
        {articles.map(article => (
          <Article key={article.id} id={article.id} title={article.title} image={article.image} content={article.content} />
        ))}
      </main>
      <Footer />
      <div className="fixed bottom-4 right-4 z-50">
        <button id="theme-toggle" className="p-3 bg-void-black/70 rounded-full text-pearl-glow hover:bg-luminous-emerald-500/20 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-luminous-emerald-500" onClick={toggleTheme} aria-label="Toggle theme">
          <i className="fas fa-adjust"></i>
        </button>
      </div>
      <div id="gallery-modal" className="modal hidden">
        <div className="modal-content max-w-4xl p-6 rounded-xl">
          <span className="close absolute top-4 right-4 text-pearl-glow text-2xl cursor-pointer hover:text-radiant-amber-500 transition-colors">×</span>
          <img id="modal-image" className="w-full h-auto rounded-lg" alt="Gallery Image" />
          <p id="modal-caption" className="text-pearl-glow mt-4 text-center"></p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
