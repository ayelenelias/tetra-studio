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
        if (header) {
            if (scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // --- BURGER MENU ---
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta, .mobile-menu__symbol a') : [];

    function closeMobileMenu() {
        if (burgerBtn) burgerBtn.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // --- SCROLL REVEAL ---
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealElements = document.querySelectorAll('[data-reveal]:not(.revealed)');

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
    function handleParallax() {
        const scrollY = window.scrollY;
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(function (el) {
            const speed = parseFloat(el.dataset.parallax);
            if (!el.parentElement) return;
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
    let activeCategory = 'all';
    let activeLocation = 'all';

    function filterCreators() {
        const cards = document.querySelectorAll('.creators__catalog .creator-card');
        cards.forEach(function (card) {
            const rawCat = card.dataset.category || '';
            const categories = rawCat.split(',').map(function (s) { return s.trim().toLowerCase(); });
            const location = (card.dataset.location || '').trim().toLowerCase();

            const targetCat = activeCategory.toLowerCase();
            const targetLoc = activeLocation.toLowerCase();

            const matchCategory = targetCat === 'all' || targetCat === 'todos' ||
                categories.indexOf('all') !== -1 || categories.indexOf('todos') !== -1 ||
                categories.indexOf(targetCat) !== -1;

            const matchLocation = targetLoc === 'all' || targetLoc === 'todas' || targetLoc === 'todos' ||
                location === 'all' || location === 'todas' || location === 'todos' || location === targetLoc;

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

    window.TetraFilterCreators = filterCreators;

    categoryFilters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            categoryFilters.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            activeCategory = this.dataset.filter || 'all';
            filterCreators();
        });
    });

    locationFilters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            locationFilters.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            activeLocation = this.dataset.filter || 'all';
            filterCreators();
        });
    });

    // --- CREATOR MODAL (REQUEST FORM) ---
    const creatorModal = document.getElementById('creatorModal');
    const openCreatorForm = document.getElementById('openCreatorForm');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    const creatorForm = document.getElementById('creatorForm');

    function openModal() {
        if (!creatorModal) return;
        creatorModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!creatorModal) return;
        creatorModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (openCreatorForm) {
        openCreatorForm.addEventListener('click', openModal);
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    function postCreatorRequest(url, payload) {
        return fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(function (response) {
            return response.json().catch(function () { return {}; }).then(function (data) {
                if (!response.ok) {
                    const error = new Error(data.error || 'No pudimos enviar la solicitud');
                    error.status = response.status;
                    error.fallbackEmail = data.fallbackEmail || '';
                    throw error;
                }
                return data;
            });
        });
    }

    function sendCreatorRequest(payload) {
        return postCreatorRequest('api.php?action=contact', payload).catch(function (primaryError) {
            if (primaryError.status !== 404) throw primaryError;
            return postCreatorRequest('/api/contact', payload);
        });
    }

    function showCreatorFormStatus(message, type, fallbackEmail) {
        const status = document.getElementById('creatorFormStatus');
        if (!status) return;
        status.className = 'form-status' + (type ? ' form-status--' + type : '');
        status.textContent = message || '';
        if (fallbackEmail) {
            status.appendChild(document.createTextNode(' '));
            const link = document.createElement('a');
            link.href = 'mailto:' + fallbackEmail;
            link.textContent = fallbackEmail;
            status.appendChild(link);
        }
    }

    if (creatorForm) {
        creatorForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const submitButton = document.getElementById('creatorSubmitBtn');
            const form = this;
            const payload = {
                brand: String(formData.get('brand') || '').trim(),
                email: String(formData.get('email') || '').trim(),
                contentType: formData.get('contentType') || '',
                category: formData.get('category') || '',
                creatorCount: formData.get('creatorCount') || '1',
                budget: formData.get('budget') || '',
                date: formData.get('date') || '',
                description: formData.get('description') || '',
                website: formData.get('website') || ''
            };

            submitButton.disabled = true;
            submitButton.textContent = 'ENVIANDO...';
            showCreatorFormStatus('Estamos enviando tu solicitud...', 'pending');

            sendCreatorRequest(payload).then(function () {
                form.reset();
                showCreatorFormStatus('¡Solicitud enviada! Te responderemos a la brevedad.', 'success');
            }).catch(function (error) {
                const fallback = error.fallbackEmail || form.dataset.recipient || 'tetra.studio26@gmail.com';
                showCreatorFormStatus(error.message + '. También podés escribirnos a', 'error', fallback);
            }).then(function () {
                submitButton.disabled = false;
                submitButton.innerHTML = 'ENVIAR SOLICITUD <span>&rarr;</span>';
            });
        });
    }

    // --- SMOOTH SCROLL FOR ALL ANCHOR LINKS (DELEGATED) ---
    function scrollToTarget(target) {
        if (!target) return;
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });
    }

    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href) return;

        // Skip admin hash triggers (managed by admin.js)
        if (href === '#admin') return;

        // Scroll to top
        if (href === '#' || href === '#hero' || href === '#top') {
            e.preventDefault();
            closeMobileMenu();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        try {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                closeMobileMenu();
                scrollToTarget(target);
            }
        } catch (err) {
            // Ignore invalid CSS selector syntax
        }
    });

    // --- HOVER TILT ON CREATOR CARDS (DELEGATED) ---
    document.addEventListener('mousemove', function (e) {
        const card = e.target.closest('.creator-card');
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transition = 'transform 0.1s ease';
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });

    document.addEventListener('mouseout', function (e) {
        const card = e.target.closest('.creator-card');
        if (!card) return;
        if (!card.contains(e.relatedTarget)) {
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
        }
    });

    // --- SERVICES HOVER IMAGE POSITIONING (DELEGATED) ---
    document.addEventListener('mousemove', function (e) {
        const item = e.target.closest('.services__item');
        if (!item) return;

        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const img = item.querySelector('.services__hover-img');
        if (img) {
            img.style.left = (x - 100) + 'px';
        }
    });

    // --- CREATOR CARD CLICK TO EXPAND PROFILE MODAL ---
    document.addEventListener('click', function (e) {
        const card = e.target.closest('.creator-card');
        if (!card) return;
        // Don't open if clicking inside admin panel or login
        if (e.target.closest('.admin-panel') || e.target.closest('.admin-login')) return;
        // Don't open profile modal if clicking directly on the Instagram button
        if (e.target.closest('.creator-card__instagram')) return;

        const nameEl = card.querySelector('.creator-card__name');
        const roleEl = card.querySelector('.creator-card__role');
        const catsEl = card.querySelector('.creator-card__cats');
        const locEl = card.querySelector('.creator-card__loc');
        const imgEl = card.querySelector('.creator-card__img img');

        if (!nameEl) return;

        const name = nameEl.textContent.trim();
        const role = roleEl ? roleEl.textContent.trim() : 'CONTENT CREATOR';
        const cats = catsEl ? catsEl.textContent.trim() : '';
        const loc = locEl ? locEl.textContent.trim() : '';
        const img = imgEl ? imgEl.src : '';
        const instagramMap = {
            'sol': 'supercuutee',
            'lour': 'lourmorales',
            'maia': '_maiatorress'
        };
        const rawInsta = card.dataset.instagram || instagramMap[name.toLowerCase()] || name.toLowerCase().replace(/\s+/g, '');
        const instaHandle = rawInsta.replace(/^@/, '');
        const instaUrl = 'https://www.instagram.com/' + instaHandle + '/';

        // Remove any existing profile modal first
        const existing = document.querySelector('.creator-profile-modal');
        if (existing) existing.remove();

        const profileModal = document.createElement('div');
        profileModal.className = 'modal active creator-profile-modal';
        profileModal.innerHTML = '<div class="modal__overlay"></div>' +
            '<div class="modal__content creator-profile-modal__content">' +
            '<button class="creator-profile-modal__close" aria-label="Cerrar">&times;</button>' +
            '<div class="creator-profile-modal__grid">' +
            '<div class="creator-profile-modal__image-col">' +
            '<img src="' + img + '" alt="' + name + '" class="creator-profile-modal__img">' +
            '<div class="creator-profile-modal__watermark">' +
            '<img src="logos/tetralogSFblanco.png" alt="" class="tetra-symbol"></div>' +
            '</div>' +
            '<div class="creator-profile-modal__body">' +
            '<h2 class="creator-profile-modal__name">' + name + '</h2>' +
            '<p class="creator-profile-modal__role">' + role + '</p>' +
            '<div class="creator-profile-modal__meta">' +
            (cats ? '<span class="creator-profile-modal__cat">' + cats + '</span>' : '') +
            (loc ? '<span class="creator-profile-modal__loc">' + loc + '</span>' : '') +
            '</div>' +
            '<div class="creator-profile-modal__socials">' +
            '<div class="creator-profile-modal__social-item">' +
            '<span class="creator-profile-modal__social-label">INSTAGRAM</span>' +
            '<a href="' + instaUrl + '" target="_blank" rel="noopener" class="creator-profile-modal__social-link">@' + instaHandle + ' <span class="creator-profile-modal__arrow">&nearr;</span></a>' +
            '</div>' +
            '</div>' +
            '<div class="creator-profile-modal__tags-wrap">' +
            '<span class="creator-profile-modal__tags-label">TIPOS DE CONTENIDO</span>' +
            '<div class="creator-profile-modal__tags">' +
            '<span class="creator-tag">UGC</span>' +
            '<span class="creator-tag">REELS</span>' +
            '<span class="creator-tag">STORIES</span>' +
            '<span class="creator-tag">PHOTO</span>' +
            '</div>' +
            '</div>' +
            '<a href="#contacto" class="btn btn--primary creator-work-btn">' +
            'TRABAJAR CON ' + name + ' <span>&rarr;</span></a>' +
            '</div></div></div>';

        document.body.appendChild(profileModal);
        document.body.style.overflow = 'hidden';

        function closeProfile() {
            profileModal.classList.remove('active');
            setTimeout(function () {
                profileModal.remove();
                document.body.style.overflow = '';
            }, 300);
        }

        const closeBtn = profileModal.querySelector('.creator-profile-modal__close');
        const overlay = profileModal.querySelector('.modal__overlay');
        const workBtn = profileModal.querySelector('.creator-work-btn');

        if (closeBtn) closeBtn.addEventListener('click', closeProfile);
        if (overlay) overlay.addEventListener('click', closeProfile);

        if (workBtn) {
            workBtn.addEventListener('click', function (ev) {
                ev.preventDefault();
                closeProfile();
                const contactSection = document.getElementById('contacto');
                if (contactSection) {
                    setTimeout(function () {
                        scrollToTarget(contactSection);
                    }, 100);
                }
            });
        }
    });

    // Close modals on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
            closeModal();
            const profileModal = document.querySelector('.creator-profile-modal');
            if (profileModal) {
                profileModal.classList.remove('active');
                setTimeout(function () {
                    profileModal.remove();
                    document.body.style.overflow = '';
                }, 300);
            }
        }
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

    // --- CLIENT LOGOS ANIMATION ---
    function revealClientLogos() {
        const clientLogos = document.querySelectorAll('.client-logo');
        clientLogos.forEach(function (logo, index) {
            if (!logo.dataset.animated) {
                logo.dataset.animated = '1';
                logo.style.opacity = '0';
                logo.style.transform = 'translateY(20px)';
                logo.style.transition = 'opacity 0.6s ease ' + (index * 80) + 'ms, transform 0.6s ease ' + (index * 80) + 'ms';
            }
            const rect = logo.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                logo.style.opacity = '1';
                logo.style.transform = 'translateY(0)';
            }
        });
    }

    window.addEventListener('scroll', revealClientLogos, { passive: true });
    window.addEventListener('load', revealClientLogos);

    // --- EXPOSE RE-INIT FOR ADMIN / CMS ---
    window.TetraInit = function () {
        revealOnScroll();
        revealClientLogos();
        filterCreators();
    };

})();
