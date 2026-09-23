/* ═══════════════════════════════════════════════════════
   TETRA STUDIO — Script
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // --- HEADER SCROLL ---
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // --- BURGER MENU ---
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

    burgerBtn.addEventListener('click', function () {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            burgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- SCROLL REVEAL ---
    const revealElements = document.querySelectorAll('[data-reveal]');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;

        revealElements.forEach(function (el) {
            const rect = el.getBoundingClientRect();
            const delay = parseInt(el.dataset.delay) || 0;

            if (rect.top < windowHeight * 0.88) {
                setTimeout(function () {
                    el.classList.add('revealed');
                }, delay);
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    window.addEventListener('load', revealOnScroll);

    // --- PARALLAX ---
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    function handleParallax() {
        const scrollY = window.scrollY;

        parallaxElements.forEach(function (el) {
            const speed = parseFloat(el.dataset.parallax);
            const rect = el.parentElement.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const offset = (centerY - window.innerHeight / 2) * speed;

            el.style.transform = el.classList.contains('tetra-symbol--massive')
                ? 'translate(-50%, calc(-50% + ' + offset + 'px))'
                : 'translateY(' + offset + 'px)';
        });
    }

    window.addEventListener('scroll', handleParallax, { passive: true });

    // --- SLOW ROTATION FOR HERO SYMBOL ---
    const heroSymbol = document.querySelector('.hero__symbol-bg .tetra-symbol');
    let rotation = 0;

    function rotateHeroSymbol() {
        rotation += 0.02;
        if (heroSymbol) {
            heroSymbol.style.transform = 'translate(-50%, -50%) rotate(' + rotation + 'deg)';
        }
        requestAnimationFrame(rotateHeroSymbol);
    }

    rotateHeroSymbol();

    // --- CREATORS FILTER ---
    const categoryFilters = document.querySelectorAll('#categoryFilters .filter-btn');
    const locationFilters = document.querySelectorAll('#locationFilters .filter-btn');
    const creatorCards = document.querySelectorAll('.creator-card');
    let activeCategory = 'all';
    let activeLocation = 'all';

    function filterCreators() {
        creatorCards.forEach(function (card) {
            const categories = card.dataset.category.split(',');
            const location = card.dataset.location;

            const matchCategory = activeCategory === 'all' || categories.includes(activeCategory);
            const matchLocation = activeLocation === 'all' || location === activeLocation;

            if (matchCategory && matchLocation) {
                card.classList.remove('hidden');
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(function () {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.classList.add('hidden');
            }
        });
    }

    categoryFilters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            categoryFilters.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            activeCategory = this.dataset.filter;
            filterCreators();
        });
    });

    locationFilters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            locationFilters.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            activeLocation = this.dataset.filter;
            filterCreators();
        });
    });

    // Add transition to creator cards
    creatorCards.forEach(function (card) {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });

    // --- CREATOR MODAL (FORM) ---
    const creatorModal = document.getElementById('creatorModal');
    const openCreatorForm = document.getElementById('openCreatorForm');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    const creatorForm = document.getElementById('creatorForm');

    if (openCreatorForm) {
        openCreatorForm.addEventListener('click', function () {
            creatorModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeModal() {
        creatorModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    if (creatorForm) {
        creatorForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Solicitud enviada correctamente. Te contactaremos pronto.');
            closeModal();
            this.reset();
        });
    }

    // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- HOVER TILT ON CREATOR CARDS ---
    creatorCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
            this.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        card.addEventListener('mouseenter', function () {
            this.style.transition = 'transform 0.1s ease';
        });
    });

    // --- HERO TITLE ANIMATION ---
    const heroTitleLines = document.querySelectorAll('.hero__title-line');

    function animateHeroTitle() {
        heroTitleLines.forEach(function (line, index) {
            setTimeout(function () {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    heroTitleLines.forEach(function (line) {
        line.style.opacity = '0';
        line.style.transform = 'translateY(60px)';
        line.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    setTimeout(animateHeroTitle, 300);

    // --- SERVICES HOVER IMAGE POSITIONING ---
    const serviceItems = document.querySelectorAll('.services__item');

    serviceItems.forEach(function (item) {
        item.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const img = this.querySelector('.services__hover-img');
            if (img) {
                img.style.left = (x - 100) + 'px';
            }
        });
    });

    // --- CREATOR CARD CLICK TO EXPAND ---
    creatorCards.forEach(function (card) {
        card.addEventListener('click', function () {
            const name = this.querySelector('.creator-card__name').textContent;
            const role = this.querySelector('.creator-card__role').textContent;
            const cats = this.querySelector('.creator-card__cats').textContent;
            const loc = this.querySelector('.creator-card__loc').textContent;
            const img = this.querySelector('.creator-card__img img').src;

            // Create profile modal
            const profileModal = document.createElement('div');
            profileModal.className = 'modal active';
            profileModal.innerHTML = '<div class="modal__overlay"></div>' +
                '<div class="modal__content" style="max-width:800px;padding:0;overflow:hidden;">' +
                '<button class="modal__close" style="color:white;z-index:10;">&times;</button>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;min-height:500px;">' +
                '<div style="position:relative;"><img src="' + img + '" style="width:100%;height:100%;object-fit:cover;">' +
                '<div style="position:absolute;top:16px;left:16px;width:32px;height:32px;opacity:0.6;">' +
                '<img src="logos/tetralogSFblanco.png" style="width:100%;height:100%;object-fit:contain;"></div>' +
                '</div>' +
                '<div style="padding:48px;display:flex;flex-direction:column;justify-content:center;background:#F8F9F8;">' +
                '<h2 style="font-size:2rem;font-weight:700;letter-spacing:0.05em;margin-bottom:8px;">' + name + '</h2>' +
                '<p style="font-size:0.65rem;letter-spacing:0.15em;color:#797877;margin-bottom:24px;">' + role + '</p>' +
                '<p style="font-size:0.75rem;letter-spacing:0.1em;color:#4A4A4A;margin-bottom:8px;">' + cats + '</p>' +
                '<p style="font-size:0.75rem;letter-spacing:0.1em;color:#797877;margin-bottom:32px;">' + loc + '</p>' +
                '<div style="display:flex;flex-direction:column;gap:12px;margin-bottom:32px;">' +
                '<div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(0,0,0,0.08);">' +
                '<span style="font-size:0.65rem;letter-spacing:0.1em;color:#797877;">INSTAGRAM</span>' +
                '<span style="font-size:0.75rem;font-weight:600;">@' + name.toLowerCase() + '</span></div>' +
                '<div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(0,0,0,0.08);">' +
                '<span style="font-size:0.65rem;letter-spacing:0.1em;color:#797877;">TIKTOK</span>' +
                '<span style="font-size:0.75rem;font-weight:600;">@' + name.toLowerCase() + '</span></div>' +
                '</div>' +
                '<p style="font-size:0.6rem;letter-spacing:0.15em;color:#797877;margin-bottom:8px;">TIPOS DE CONTENIDO</p>' +
                '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:32px;">' +
                '<span style="font-size:0.6rem;letter-spacing:0.1em;padding:6px 12px;border:1px solid rgba(0,0,0,0.1);">UGC</span>' +
                '<span style="font-size:0.6rem;letter-spacing:0.1em;padding:6px 12px;border:1px solid rgba(0,0,0,0.1);">REELS</span>' +
                '<span style="font-size:0.6rem;letter-spacing:0.1em;padding:6px 12px;border:1px solid rgba(0,0,0,0.1);">STORIES</span>' +
                '<span style="font-size:0.6rem;letter-spacing:0.1em;padding:6px 12px;border:1px solid rgba(0,0,0,0.1);">PHOTO</span>' +
                '</div>' +
                '<a href="#contacto" style="display:inline-flex;align-items:center;gap:8px;font-size:0.7rem;font-weight:600;letter-spacing:0.15em;padding:14px 28px;background:#000;color:#F8F9F8;text-align:center;justify-content:center;transition:all 0.3s;" ' +
                'onmouseover="this.style.background=\'#4A4A4A\'" onmouseout="this.style.background=\'#000\'">' +
                'TRABAJAR CON ' + name + ' &rarr;</a>' +
                '</div></div></div>';

            document.body.appendChild(profileModal);
            document.body.style.overflow = 'hidden';

            // Close profile modal
            const closeBtn = profileModal.querySelector('.modal__close');
            const overlay = profileModal.querySelector('.modal__overlay');

            function closeProfile() {
                profileModal.classList.remove('active');
                setTimeout(function () {
                    profileModal.remove();
                    document.body.style.overflow = '';
                }, 400);
            }

            closeBtn.addEventListener('click', closeProfile);
            overlay.addEventListener('click', closeProfile);
        });
    });

    // --- CLIENT LOGOS ANIMATION ---
    const clientLogos = document.querySelectorAll('.client-logo');

    clientLogos.forEach(function (logo, index) {
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(20px)';
        logo.style.transition = 'opacity 0.6s ease ' + (index * 80) + 'ms, transform 0.6s ease ' + (index * 80) + 'ms';
    });

    function revealClientLogos() {
        clientLogos.forEach(function (logo) {
            const rect = logo.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                logo.style.opacity = '1';
                logo.style.transform = 'translateY(0)';
            }
        });
    }

    window.addEventListener('scroll', revealClientLogos, { passive: true });
    window.addEventListener('load', revealClientLogos);

    // --- EXPOSE RE-INIT FOR ADMIN ---
    window.TetraInit = function () {
        // Re-attach scroll reveals
        const newRevealElements = document.querySelectorAll('[data-reveal]:not(.revealed)');
        function reCheckReveal() {
            const wh = window.innerHeight;
            newRevealElements.forEach(function (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top < wh * 0.88) {
                    const delay = parseInt(el.dataset.delay) || 0;
                    setTimeout(function () { el.classList.add('revealed'); }, delay);
                }
            });
        }
        window.addEventListener('scroll', reCheckReveal, { passive: true });
        reCheckReveal();

        // Re-attach creator card click
        document.querySelectorAll('.creator-card').forEach(function (card) {
            if (card.dataset.tetraInit) return;
            card.dataset.tetraInit = '1';
            card.addEventListener('click', function () {
                const name = this.querySelector('.creator-card__name').textContent;
                const role = this.querySelector('.creator-card__role').textContent;
                const cats = this.querySelector('.creator-card__cats').textContent;
                const loc = this.querySelector('.creator-card__loc').textContent;
                const img = this.querySelector('.creator-card__img img').src;
                const profileModal = document.createElement('div');
                profileModal.className = 'modal active';
                profileModal.innerHTML = '<div class="modal__overlay"></div>' +
                    '<div class="modal__content" style="max-width:800px;padding:0;overflow:hidden;">' +
                    '<button class="modal__close" style="color:white;z-index:10;">&times;</button>' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr;min-height:500px;">' +
                    '<div style="position:relative;"><img src="' + img + '" style="width:100%;height:100%;object-fit:cover;">' +
                    '</div>' +
                    '<div style="padding:48px;display:flex;flex-direction:column;justify-content:center;background:#F8F9F8;">' +
                    '<h2 style="font-size:2rem;font-weight:700;letter-spacing:0.05em;margin-bottom:8px;">' + name + '</h2>' +
                    '<p style="font-size:0.65rem;letter-spacing:0.15em;color:#797877;margin-bottom:24px;">' + role + '</p>' +
                    '<p style="font-size:0.75rem;letter-spacing:0.1em;color:#4A4A4A;margin-bottom:8px;">' + cats + '</p>' +
                    '<p style="font-size:0.75rem;letter-spacing:0.1em;color:#797877;margin-bottom:32px;">' + loc + '</p>' +
                    '<a href="#contacto" style="display:inline-flex;align-items:center;gap:8px;font-size:0.7rem;font-weight:600;letter-spacing:0.15em;padding:14px 28px;background:#000;color:#F8F9F8;text-align:center;justify-content:center;">TRABAJAR CON ' + name + ' &rarr;</a>' +
                    '</div></div></div>';
                document.body.appendChild(profileModal);
                document.body.style.overflow = 'hidden';
                profileModal.querySelector('.modal__close').addEventListener('click', function () {
                    profileModal.classList.remove('active');
                    setTimeout(function () { profileModal.remove(); document.body.style.overflow = ''; }, 400);
                });
                profileModal.querySelector('.modal__overlay').addEventListener('click', function () {
                    profileModal.classList.remove('active');
                    setTimeout(function () { profileModal.remove(); document.body.style.overflow = ''; }, 400);
                });
            });
        });

        // Re-attach service hover
        document.querySelectorAll('.services__item').forEach(function (item) {
            item.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const img = this.querySelector('.services__hover-img');
                if (img) img.style.left = (x - 100) + 'px';
            });
        });
    };

})();
