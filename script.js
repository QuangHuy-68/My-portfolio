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
    4️⃣  Back‑to‑top button (optional)
    ------------------------------------------------------- */
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        // Show after scrolling down a bit
        window.addEventListener('scroll', () => {
            backBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
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
    const revealEls = document.querySelectorAll('.reveal');
    console.log(revealEls);
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop watching once shown
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Start a bit earlier
    });

    revealEls.forEach(el => revealObserver.observe(el));

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
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-width');

                // Small delay for a statggered feel
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, 200);

                observer.unobserve(bar); // Only animate once
            }
        });
    }, {
        threshold: 0.3 // Trigger when 30% of the bar is visible
    });

    // Start observing each skill bar
    skillBars.forEach(bar => skillObserver.observe(bar));
});

