let revealObserver;
let allProjects = [];
let projectSearchTerm = '';

async function loadProjects() {
    const container = document.getElementById('projectsGrid');

    if (!container) return;

    try {
        const response = await fetch('/api/projects');

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Failed to load projects');
        }

        allProjects = Array.isArray(result.data)
            ? result.data
            : [];
        
        renderProjects();
    
    } catch (error) {
        console.error('Projects error:', error);

        container.innerHTML = `
            <p>Unable to load projects.</p>
        `;
    }
}

function renderProjects() {
    const container = document.getElementById('projectsGrid');

    if (!container) return;

    const filteredProjects = allProjects.filter(project => {
        const title = (project.title || '').toLowerCase();
        const description = (project.description || '').toLowerCase();
        const techStack = (project.tech_stack || '').toLowerCase();

        return (
            !projectSearchTerm ||
            title.includes(projectSearchTerm) ||
            description.includes(projectSearchTerm) ||
            techStack.includes(projectSearchTerm)
        );
    });

    container.innerHTML = '';

    if (filteredProjects.length === 0) {
        container.innerHTML = `
            <p class="projects-empty">
                No projects found.
            </p>
        `;
        return;
    }

    filteredProjects.forEach(project => {
        const article = document.createElement('article');

        article.className = 'project-card reveal';


        article.innerHTML = `
            <div class="project-card-content">

                <div class="project-label">
                    <span class="project-dot"></span>
                    PROJECT
                </div>

                <h3>${project.title}</h3>
                
                <p class="project-description">
                    ${project.description}
                </p>

                <div class="project-tech">
                    ${
                        project.tech_stack
                            ? project.tech_stack
                                .split(',')
                                .map(
                                    tech => 
                                        `<span>${tech.trim()}</span>`
                                )
                                .join('')
                            : ''
                    }
                </div>

                <div class="project-links">

                    <a 
                        href="project.html?id=${project.id}"
                        class="project-btn project-btn-primary"
                    >
                        View Project
                        <span>→</span>
                    </a>

                    ${
                        project.github_url
                            ?`
                                <a 
                                    href="${project.github_url}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="project-btn project-btn-secondary"
                                >
                                    GitHub
                                    <span>↗</span>
                                </a>
                            `
                            : ''
                    }
                </div>
            </div>
        `;

        container.appendChild(article);
        if (revealObserver) {
            revealObserver.observe(article);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    /* -------------------------------------------------------
       7️⃣  Scroll‑reveal (IntersectionObserver)
          Add class="reveal" to any element you want to animate.
    ------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');

    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('revealed', entry.isIntersecting);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -10%' });

    revealElements.forEach(el => revealObserver.observe(el));

    loadProjects();

    /* -------------------------------------------------------
   7️⃣ About — Reveal + Typing Animation
    ------------------------------------------------------- */
    const aboutSection = document.getElementById('about');
    const aboutTyping = document.getElementById('aboutTyping');

    if (aboutSection && aboutTyping) {
        const aboutText = 
            "I'm a Data Science student passionate about data, software development, and technology.\n\n" +
            "I enjoy turning ideas into practical applications while continuously learning new technologies and solving real-world problems.";
        let typingTimer = null;    
        let isTyping = false;

        function startAboutTyping() {
            // Reset text
            aboutTyping.textContent = '';

            // Clear previous timer
            if (typingTimer) {
                clearTimeout(typingTimer);
            }

            let index = 0;
            isTyping = true;

            function typeAbout() {
                if (!isTyping) {
                    return;
                }

                if (index >= aboutText.length) {
                    isTyping = false;
                    return;
                }

                aboutTyping.textContent += aboutText.charAt(index);
                index++;

                typingTimer = setTimeout(typeAbout, 30);
            }

            typeAbout();
        }

        function resetAboutTyping() {
            isTyping = false;
            if (typingTimer) {
                clearTimeout(typingTimer);
                typingTimer = null;
            }

            aboutTyping.textContent = '';
        }

        const aboutObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {

                    // Wait for reveal animation
                    setTimeout(() => {
                        startAboutTyping();
                    }, 500);

                    } else {

                        // Leaving About → reset
                        resetAboutTyping();
                    }
                });
            },
            {
                threshold: 0.35
            }
        );

        aboutObserver.observe(aboutSection);
    }


    /* -------------------------------------------------------
       1️⃣  Smooth scrolling for all anchor links (href="#…")
    ------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* -------------------------------------------------------
       2️⃣  Navbar background change on scroll
    ------------------------------------------------------- */
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    /* -------------------------------------------------------
       3️⃣  Active‑link highlight (Scroll‑Spy)
    ------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    function setActiveNav() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top    = section.offsetTop;
            const height = section.offsetHeight;
            const id     = section.id;

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNav);
    setActiveNav();

    /* -------------------------------------------------------
       4️⃣  Theme toggle
          - Reads current data-theme from <html>
          - Flips it: 'dark' ↔ 'light'
          - Writes back to <html>  → CSS vars update instantly
          - Saves to localStorage  → remembered on next visit
    ------------------------------------------------------- */
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next    = current === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    /* -------------------------------------------------------
       5️⃣  Back‑to‑top button
    ------------------------------------------------------- */
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            backBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });

        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* -------------------------------------------------------
       6️⃣  Contact form — REAL email via POST /api/contact
    ------------------------------------------------------- */
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', async e => {
            // Stop the browser from refreshing the page
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const original  = submitBtn.textContent;

            // ── Loading state ──
            submitBtn.textContent   = 'Sending…';
            submitBtn.disabled      = true;
            submitBtn.style.opacity = '0.7';

            // ── Collect form values ──
            const payload = {
                name:    document.getElementById('name').value.trim(),
                email:   document.getElementById('email').value.trim(),
                message: document.getElementById('message').value.trim(),
            };

            try {
                // ── Send POST request to our Express server ──
                //    fetch() is the modern way to make HTTP requests from JS
                //    method: 'POST'         → we're SENDING data
                //    headers: ...           → tell server we're sending JSON
                //    body: JSON.stringify() → convert object to JSON string
                const response = await fetch('/api/contact', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(payload)
                });

                // ── Parse the JSON response from the server ──
                const data = await response.json();

                if (data.success) {
                    // ✅ Success
                    submitBtn.textContent      = 'Message Sent! ✓';
                    submitBtn.style.opacity    = '1';
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';

                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.textContent      = original;
                        submitBtn.style.background = '';
                        submitBtn.disabled         = false;
                    }, 2500);
                } else {
                    // ❌ Server returned an error
                    submitBtn.textContent      = data.error || 'Something went wrong';
                    submitBtn.style.opacity    = '1';
                    submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #f97316)';

                    setTimeout(() => {
                        submitBtn.textContent      = original;
                        submitBtn.style.background = '';
                        submitBtn.disabled         = false;
                    }, 3000);
                }

            } catch (err) {
                // ❌ Network error (server not running, no internet, etc.)
                console.error('Contact error:', err);
                submitBtn.textContent      = 'Network error — try again';
                submitBtn.style.opacity    = '1';
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #f97316)';

                setTimeout(() => {
                    submitBtn.textContent      = original;
                    submitBtn.style.background = '';
                    submitBtn.disabled         = false;
                }, 3000);
            }
        });
    }

    

    /* -------------------------------------------------------
       8️⃣  Typing Animation (Hero role line)
          Cycles through phrases, typing and deleting one char at a time.
    ------------------------------------------------------- */
    const roleEl = document.getElementById('role');
    if (roleEl) {
        const phrases = [
            'Developer',
            'Designer',
            'Problem Solver',
            'Open-source Contributor'
        ];
        let phraseIdx = 0;
        let charIdx   = 0;
        let deleting  = false;

        function typeWord() {
            const txt = phrases[phraseIdx];
            roleEl.textContent = deleting
                ? txt.substring(0, charIdx--)
                : txt.substring(0, ++charIdx);

            let speed = deleting ? 50 : 120;

            if (!deleting && charIdx === txt.length) {
                speed    = 2000;
                deleting = true;
            } else if (deleting && charIdx === 0) {
                deleting  = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                speed     = 500;
            }

            setTimeout(typeWord, speed);
        }
        typeWord();
    }

    /* -------------------------------------------------------
       9️⃣  Animated skill bars (IntersectionObserver)
    ------------------------------------------------------- */
    const skillBars    = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const bar         = entry.target;
            const targetWidth = bar.getAttribute('data-width');

            if (entry.isIntersecting) {
                const index = [...skillBars].indexOf(bar);
                setTimeout(() => { bar.style.width = targetWidth + '%'; }, index * 250);
            } else {
                bar.style.width = '0%';
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    /* -------------------------------------------------------
       🔟  Social links — Single Source of Truth
    ------------------------------------------------------- */
    const socialLinks = [
        {
            href: 'https://github.com/',
            label: 'GitHub',
            className: 'github',
            svg: `<svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>`
        },
        {
            href: 'https://linkedin.com/',
            label: 'LinkedIn',
            className: 'linkedin',
            svg: `<svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>`
        },
        {
            href: 'mailto:hello@example.com',
            label: 'Email',
            className: 'email',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>`
        }
    ];

    function buildSocialIcons(container, openInNewTab = true) {
        if (!container) return;
        socialLinks.forEach(link => {
            const a = document.createElement('a');
            a.href  = link.href;
            a.title = link.label;
            a.setAttribute('aria-label', link.label);
            a.className = link.className;
            if (openInNewTab && !link.href.startsWith('mailto')) {
                a.target = '_blank';
                a.rel    = 'noopener noreferrer';
            }
            a.innerHTML = link.svg;
            container.appendChild(a);
        });
    }

    buildSocialIcons(document.getElementById('socialSidebar'));
    buildSocialIcons(document.getElementById('socialFooter'));

    /* -------------------------------------------------------
       1️⃣1️⃣  Timeline — scroll reveal + dynamic segment lines
    ------------------------------------------------------- */
    const timeline = document.querySelector('.timeline');

    if(timeline) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineProgress = document.querySelector('.timeline-rail-progress');

        timelineItems.forEach(item => {
            revealObserver.observe(item);
});

        /* Active item */
        const timelineActiveObserver = new IntersectionObserver( 
            (entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    
                    timelineItems.forEach(item => {
                        item.classList.remove('active');
                    });

                    entry.target.classList.add('active');
                });
            },
            {
                rootMargin: '-38% 0px -48% 0px',
                threshold: 0
            }
        );
        timelineItems.forEach(item => { 
            timelineActiveObserver.observe(item);
        });

        /* Scroll progress */
        function updateTimelineProgress() {
            if (!timelineProgress) return;
            const rect = timeline.getBoundingClientRect();
            const viewportPoint = window.innerHeight * 0.55;
            const start = rect.top;
            const end = rect.bottom;
            const distance = end - start;

            if (distance <= 0) return;
            const progress = ((viewportPoint - start) / distance) * 100;
            
            const clamped = Math.max(0, Math.min(100, progress));
            timelineProgress.style.height = `${clamped}%`;
        }

        window.addEventListener('scroll', updateTimelineProgress, { passive: true });
        window.addEventListener('resize', updateTimelineProgress);
        updateTimelineProgress();
    }


    /* -------------------------------------------------------
    Scroll Progress
    ------------------------------------------------------- */

    const scrollProgress =
        document.getElementById('scrollProgress');

    let progressTarget = 0;
    let progressCurrent = 0;
    let progressTicking = false;

    function calculateScrollProgress() {

        if (!scrollProgress) return;

        const scrollTop = window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight;

        const viewportHeight =
            window.innerHeight;

        const scrollableHeight =
            documentHeight - viewportHeight;

        if (scrollableHeight <= 0) {
            progressTarget = 0;
            return;
        }

        progressTarget =
            (scrollTop / scrollableHeight) * 100;

        progressTarget = Math.max(
            0,
            Math.min(100, progressTarget)
        );

        if (!progressTicking) {
            progressTicking = true;
            requestAnimationFrame(animateScrollProgress);
        }
    }

    function animateScrollProgress() {

        if (!scrollProgress) {
            progressTicking = false;
            return;
        }

        const difference =
            progressTarget - progressCurrent;

        progressCurrent += difference * 0.12;

        scrollProgress.style.width =
            `${progressCurrent}%`;

        if (Math.abs(difference) > 0.01) {

            requestAnimationFrame(
                animateScrollProgress
            );

        } else {

            progressCurrent = progressTarget;
            scrollProgress.style.width =
                `${progressCurrent}%`;

            progressTicking = false;
        }
    }

    window.addEventListener(
        'scroll',
        calculateScrollProgress,
        { passive: true }
    );

    window.addEventListener(
        'resize',
        calculateScrollProgress
    );

    calculateScrollProgress();


    /* -------------------------------------------------------
    Navbar Search
    ------------------------------------------------------- */

    const navSearch = document.querySelector('.nav-search');
    const searchToggle = document.getElementById('searchToggle');
    const projectSearch = document.getElementById('projectSearch');

    if (navSearch && searchToggle && projectSearch) {
        
        searchToggle.addEventListener('click', () => {
            
            navSearch.classList.toggle('open');

            if (navSearch.classList.contains('open')) {
                setTimeout(() => {
                    projectSearch.focus();
                }, 100);
            }
        });

        document.addEventListener('click', (event) => {

            if (!navSearch.contains(event.target)) {
                navSearch.classList.remove('open');
            }
        });

        projectSearch.addEventListener('input', (event) => {
            projectSearchTerm = event.target.value
                .trim()
                .toLowerCase();

            renderProjects();

            if (projectSearchTerm) {
                const projectsSection =
                    document.getElementById('projects');

                if (projectsSection) {
                    projectsSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }

}); // ← closes DOMContentLoaded
