(function () {
        const saved = localStorage.getItem('theme');
        const oslight = window.matchMedia('...').matches;
        const theme = saved || (oslight ? 'light' : 'dark');
        document.documentElement.setAttribute('data-theme', theme);
    })();

document.addEventListener('DOMContentLoaded', () => {
    /* -------------------------------------------------------
    1️⃣  Smooth scrolling for all anchor links (href="#…")
    ------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => { 
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href)

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        })
    });
    /* -------------------------------------------------------
    2️⃣  Navbar background change on scroll (adds a .scrolled class – you can style it in CSS)
    ------------------------------------------------------- */
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50 ) {
                navbar.classList.add('scrolled')
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    /* -------------------------------------------------------
    3️⃣  Active‑link highlight (Scroll‑Spy)
    ------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    function setActiveNav() {
        const scrollPos = window.scrollY + 200; // Offset so it  lights up a bit earlier
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.id;

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        })
    }
    window.addEventListener('scroll', setActiveNav);
    // Call once on load (in case the page opens at a non-top offset)
    setActiveNav();


    /* -------------------------------------------------------
    4. Theme toggle — LESSON 5 PART 3

    HOW IT WORKS:
    - Read current data-theme from <html>
    - Flip it: 'dark' → 'light' or 'light' → 'dark'
    - Write it back to <html>  → CSS vars update instantly
    - Save to localStorage     → remembered on next visit
    ------------------------------------------------------- */
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');

            const next = current === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', next);

            localStorage.setItem('theme',next);
        });
    }

    /* -------------------------------------------------------
    4️⃣  Back‑to‑top button (optional)
    ------------------------------------------------------- */
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        // Show after scrolling down a bit
        window.addEventListener('scroll', () => {
            backBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });

        // Smooth scroll to top when clicked
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* -------------------------------------------------------
    5️⃣  Contact form – fake “sending” → “sent” feedback
    ------------------------------------------------------- */
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', e =>{
            e.preventDefault();

            // Keep page from reloading
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const original = submitBtn.textContent;

            // Show loading state
            submitBtn.textContent = 'Sending';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulated network delay - replace with fetch() later
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.opacity = '1';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';

                // Reset after a couple of seconds
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.textContent = original;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1000);
        })
    }

     /* -------------------------------------------------------
    6️⃣  Scroll‑reveal (IntersectionObserver) Add class="reveal" to any element you want to animate.
    ------------------------------------------------------- */
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
            } else {
                entry.target.classList.remove("revealed");
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -10%"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* -------------------------------------------------------
    7️⃣  Typing Animation (Hero role line) Cycles through an array of phrases, typing and deleting one character at a time.
    ------------------------------------------------------- */
    const roleE1 = document.getElementById('role');
    if (roleE1) {
        const phrases = [
            'Developer',
            'Designer',
            'Problem Solver',
            'Open-source Contributor'
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let deleting = false;

        function typeWord() {
            const txt = phrases[phraseIdx];
            roleE1.textContent = deleting
                ? txt.substring(0, charIdx--)
                : txt.substring(0, ++charIdx);

            let speed = deleting ? 50 : 120;
            
            if (!deleting && charIdx === txt.length) {
                speed = 2000;
                deleting = true;
            } else if (deleting && charIdx === 0) {
                deleting = false; 
                phraseIdx = (phraseIdx + 1) % phrases.length;
                speed = 500;
            }

            setTimeout(typeWord, speed);
        }
        typeWord();
    }

    //==============================================================// 
    const skillBars = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const bar = entry.target;
            const targetWidth = bar.getAttribute('data-width');
            if (entry.isIntersecting) {
                const index = [...skillBars].indexOf(bar);

                // Small delay for a statggered feel
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, index * 250);
            } else {
                bar.style.width = '0%'; // Reset width when out of view
            }
        });
    }, {
        threshold: 0.3 // Trigger when 30% of the bar is visible
    });

    // Start observing each skill bar
    skillBars.forEach(bar => skillObserver.observe(bar));



    /* Social Links — Single Source of Truth */
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
            a.href = link.href;
            a.title = link.label;
            a.setAttribute('aria-label', link.label);
            a.className = link.className;
            if (openInNewTab && !link.href.startsWith('mailto')) {
                a.target = '_blank';
            }
            a.innerHTML = link.svg;
            container.appendChild(a);
        });
    }

    buildSocialIcons(document.getElementById('socialSidebar'));
    buildSocialIcons(document.getElementById('socialFooter'));

   /* -------------------------------------------------------
    10. Timeline — scroll reveal + dynamic segment positioning

    HOW IT WORKS:
    - timelineObserver watches each .timeline-item
    - When visible, adds "revealed" class (slides in from side)
    - updateTimeline() measures each dot's position and sets
      the left/top/height of each .timeline-segment line
      so it connects consecutive dots precisely
    ------------------------------------------------------- */
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineItems     = document.querySelectorAll('.timeline-item');
    const timelineDots      = document.querySelectorAll('.timeline-dot');
    const timelineSegments  = document.querySelectorAll('.timeline-segment');

    // Scroll reveal for each timeline card
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');    // slide IN  ←
                } else {
                    entry.target.classList.remove('revealed'); // slide OUT →
                }
            });
        }, { threshold: 0.2 });

        timelineItems.forEach(item => timelineObserver.observe(item));
    }

    // Position each segment line between consecutive dots
    function updateTimeline() {
        if (!timelineContainer || timelineDots.length < 2) return;

        const containerRect = timelineContainer.getBoundingClientRect();

        // Get center (x, y) of each dot + its radius
        const dotPositions = Array.from(timelineDots).map(dot => {
        const rect = dot.getBoundingClientRect();
            return {
                x:      rect.left - containerRect.left + rect.width  / 2,
                y:      rect.top  - containerRect.top  + rect.height / 2,
                radius: rect.height / 2  // half the dot height
            };
        });

        // Segment goes from BOTTOM EDGE of dot[i] to TOP EDGE of dot[i+1]
        // so the line fits exactly between dots without overlapping them
        timelineSegments.forEach((segment, index) => {
            const start = dotPositions[index];
            const end   = dotPositions[index + 1];
            if (!start || !end) return;

            const x      = (start.x + end.x) / 2;
            const top    = start.y + start.radius;          // bottom edge of top dot
            const height = (end.y - end.radius) - top;      // top edge of bottom dot

            segment.style.left   = `${x}px`;
            segment.style.top    = `${top}px`;
            segment.style.height = `${Math.max(0, height)}px`;
        });
    }

    requestAnimationFrame(updateTimeline);
    window.addEventListener('load',   updateTimeline);
    window.addEventListener('resize', updateTimeline);
})


