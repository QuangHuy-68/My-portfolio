let revealObserver;
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

        container.innerHTML = '';

        result.data.forEach(project => {
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
                                .map(tech => `<span>${tech.trim()}</span>`)
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
                            ? `
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
            revealObserver.observe(article);
        });

    } catch (error) {
        console.error('Projects error:', error);

        container.innerHTML = `
            <p>Unable to load projects.</p>
        `;
    }

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
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineItems     = document.querySelectorAll('.timeline-item');
    const timelineDots      = document.querySelectorAll('.timeline-dot');
    const timelineSegments  = document.querySelectorAll('.timeline-segment');

    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('revealed', entry.isIntersecting);
            });
        }, { threshold: 0.2 });

        timelineItems.forEach(item => timelineObserver.observe(item));
    }

    function updateTimeline() {
        if (!timelineContainer || timelineDots.length < 2) return;

        const containerRect = timelineContainer.getBoundingClientRect();

        const dotPositions = Array.from(timelineDots).map(dot => {
            const rect = dot.getBoundingClientRect();
            return {
                x:      rect.left - containerRect.left + rect.width  / 2,
                y:      rect.top  - containerRect.top  + rect.height / 2,
                radius: rect.height / 2
            };
        });

        timelineSegments.forEach((segment, index) => {
            const start = dotPositions[index];
            const end   = dotPositions[index + 1];
            if (!start || !end) return;

            const x      = (start.x + end.x) / 2;
            const top    = start.y + start.radius;
            const height = (end.y - end.radius) - top;

            segment.style.left   = `${x}px`;
            segment.style.top    = `${top}px`;
            segment.style.height = `${Math.max(0, height)}px`;
        });
    }

    requestAnimationFrame(updateTimeline);
    window.addEventListener('load',   updateTimeline);
    window.addEventListener('resize', updateTimeline);


    
}); // ← closes DOMContentLoaded
