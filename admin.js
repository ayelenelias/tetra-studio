/* ═══════════════════════════════════════════════════════
   TETRA STUDIO — Admin Panel (v2)
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    var STORAGE_KEY = 'tetra_cms';
    var PASS = 'tetra2026';

    // ─── DEFAULT DATA ───
    function defaults() {
        return {
            hero: {
                title1: 'TETRA',
                title2: 'STUDIO',
                subtitle: 'CREAMOS\nIDENTIDADES.\nCREAMOS \nCONTENIDO.',
                description: 'Estudio creativo centrado en marcas, diseño, desarrollo y creación de contenido.'
            },
            intro: {
                title1: 'WE CREATE',
                title2: 'WITH PURPOSE.',
                text: 'En TETRA unimos tecnología, creatividad y estrategia para convertir ideas en soluciones digitales, marcas y experiencias que generan impacto.',
                texts: [
                    'En TETRA unimos tecnología, creatividad y estrategia para convertir ideas en soluciones digitales, marcas y experiencias que generan impacto.'
                ]
            },
            services: {
                title1: '¿QUE',
                title2: 'REALIZAMOS?',
                items: [
                    { num: '01', name: 'BRANDING', desc: 'Identidad visual, estrategia y construcción de marca.', img: 'uploads/service-branding.jpg' },
                    { num: '02', name: 'DESARROLLO', desc: 'Desarrollo de software, sistemas, automatizaciones.', img: 'uploads/service-branding.jpg' },
                    { num: '03', name: 'WEB', desc: 'Landing pages, sitios web, tiendas online.', img: 'uploads/service-branding.jpg' },
                    { num: '04', name: 'CREACIÓN DE CONTENIDO', desc: 'Producción de contenido para marcas.', img: 'uploads/service-branding.jpg' },
                    { num: '05', name: 'GESTIÓN DE REDES', desc: 'Manejamos tus redes para mayor alcance.', img: 'uploads/service-branding.jpg' },
                    { num: '06', name: 'MARKETING', desc: 'Estrategias, publicidades, conexion con influencers.', img: 'uploads/service-branding.jpg' }
                ]
            },
            creators: {
                title1: 'TETRA',
                title2: 'CREATORS',
                intro: 'Conectamos marcas con creators seleccionadas para producir contenido auténtico, relevante y alineado con cada identidad.',
                manifesto: 'THE PEOPLE\nBEHIND THE\nCONTENT.',
                items: [
                    { name: 'SOL', role: 'CONTENT CREATOR', cats: 'TODOS', catFilter: 'todos', loc: 'TUCUMÁN', locFilter: 'tucuman', instagram: 'supercuutee', img: 'uploads/creator-sol.jpg' },
                    { name: 'LOUR', role: 'CONTENT CREATOR', cats: 'TODOS', catFilter: 'todos', loc: 'TUCUMÁN', locFilter: 'buenos-aires', instagram: 'lourmorales', img: 'uploads/creator-lour.jpg' },
                    { name: 'MAIA', role: 'CONTENT CREATOR', cats: 'TODOS', catFilter: 'todos', loc: 'TUCUMÁN', locFilter: 'Tucuman', instagram: '_maiatorress', img: 'uploads/creator-maia.jpg' }
                ]
            },
            projects: {
                title1: 'PROYECTOS.',
                title2: '',
                items: [
                    { name: 'CAFS', type: 'PAGINA WEB', year: '2026', img: 'uploads/project-cafs.jpg', size: 'large' },
                    { name: 'CUKIES', type: 'BRANDING', year: '2026', img: 'uploads/project-cukies.jpg', size: 'tall' },
                    { name: 'CONFIMED', type: 'SISTEMA', year: '2026', img: 'uploads/project-confimed.jpg', size: 'normal' },
                    { name: 'LABORATORIO SUIZO', type: 'SISTEMA', year: '2026', img: 'uploads/project-laboratorio-suizo.jpg', size: 'wide' }
                ]
            },
            manifesto: {
                title: 'LAS IDEAS\nNECESITAN FORMAS.',
                words: 'PENSAMOS.\nDISEÑAMOS.\nDESARROLLAMOS.\nCONECTAMOS.'
            },
            about: {
                title1: '¿QUÉ ES',
                title2: 'TETRA?',
                text1: 'Un equipo que combina tecnología, diseño y estrategia para transformar ideas en soluciones digitales.',
                text2: 'Trabajamos de forma cercana con nuestros clientes, desde la primera idea hasta la implementación, acompañando cada etapa del proceso.',
                texts: [
                    'Un equipo que combina tecnología, diseño y estrategia para transformar ideas en soluciones digitales.',
                    'Creamos sitios web, tiendas online, sistemas, automatizaciones y experiencias digitales, pero nuestro trabajo va más allá de desarrollar: buscamos entender cada proyecto, detectar sus necesidades y construir soluciones que realmente aporten valor.',
                    'Trabajamos de forma cercana con nuestros clientes, desde la primera idea hasta la implementación, acompañando cada etapa del proceso.'
                ],
                img1: '',
                img2: '',
                images: []
            },
            process: {
                title1: '¿CÓMO',
                title2: 'TRABAJAMOS?',
                steps: [
                    { num: '01', name: 'DESCUBRIR', desc: 'Entendemos el contexto.' },
                    { num: '02', name: 'DEFINIR', desc: 'Encontramos la dirección.' },
                    { num: '03', name: 'CREAR', desc: 'Transformamos las ideas.' },
                    { num: '04', name: 'LANZAMIENTO', desc: 'Llevamos el proyecto al mundo.' },
                    { num: '05', name: 'CREACIÓN DE CONTENIDO', desc: 'Generamos contenido con creators seleccionados.' }
                ]
            },
            clients: {
                title1: 'MARCAS CON',
                title2: 'LAS QUE TRABAJAMOS.',
                logos: ['CAFS', 'CONFIMED', 'CUKIES', 'LABORATORIO SUIZO']
            },
            contact: {
                title1: 'CREEMOS',
                title2: 'ALGO',
                title3: 'JUNTOS.',
                text1: '¿Tenés una idea, una marca o un proyecto?',
                text2: 'LOOKING FOR A CREATOR?',
                email: 'tetra.studio26@gmail.com',
                instagram: 'https://www.instagram.com/tetra.tuc/',
                tiktok: 'https://tiktok.com/@tetra.studio',
                whatsapp: '+5493815456354'
            },
            footer: {
                name: 'TETRA STUDIO',
                tagline: 'Creative studio for brands with something to say.',
                copyright: '© 2026 TETRA STUDIO. All rights reserved.'
            }
        };
    }

    function sanitizeCreators(data) {
        if (!data || !data.creators || !Array.isArray(data.creators.items)) return data;
        var map = { 'sol': 'supercuutee', 'lour': 'lourmorales', 'maia': '_maiatorress' };
        data.creators.items.forEach(function(c) {
            delete c.tiktok;
            var key = String(c.name || '').trim().toLowerCase();
            if (map[key] && (!c.instagram || c.instagram === key)) {
                c.instagram = map[key];
            }
        });
        return data;
    }

    // ─── STORAGE ───
    function load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            console.log('CMS load:', raw ? 'found ' + raw.length + ' bytes' : 'EMPTY (no data)');
            if (raw) {
                var parsed = JSON.parse(raw);
                return sanitizeCreators(deepMerge(defaults(), parsed));
            }
        } catch (e) { console.error('CMS load error', e); }
        return sanitizeCreators(defaults());
    }

    function save() {
        var localOk = false;
        if (localStorageAvailable) {
            try {
                var data = JSON.stringify(D);
                localStorage.setItem(STORAGE_KEY, data);
                localOk = (localStorage.getItem(STORAGE_KEY) === data);
                console.log('CMS save:', localOk ? 'OK' : 'FALLO VERIFY', 'bytes:', data.length);
            } catch (e) {
                console.warn('CMS save localStorage warning:', e.name, e.message);
            }
        }
        serverPush(D);
        return localOk || serverAvailable();
    }

    // ─── SERVER SYNC (MySQL vía api.php en XAMPP o /api/data) ───
    function getApiUrl() {
        return 'api.php';
    }

    function serverAvailable() {
        return typeof window.fetch === 'function';
    }

    function serverPush(obj) {
        if (!serverAvailable()) return;
        try {
            fetch(getApiUrl(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(obj)
            }).then(function(r) {
                if (!r.ok) {
                    // Fallback a /api/data si api.php no responde
                    return fetch('/api/data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(obj)
                    });
                }
            }).catch(function() { /* offline o sin backend: se sigue usando localStorage */ });
        } catch (e) { /* ignorar */ }
    }

    function serverSync() {
        if (!serverAvailable()) return;
        fetch(getApiUrl())
            .then(function(r) {
                if (r.ok) return r.json();
                return fetch('/api/data').then(function(r2) { return r2.ok ? r2.json() : null; });
            })
            .then(function(remote) {
                if (!remote || typeof remote !== 'object') return;
                // El SERVER / MySQL es la fuente de verdad: cada save() POSTea el objeto completo.
                var merged = deepMerge(deepMerge(defaults(), D), remote);
                D = sanitizeCreators(merged);
                ensureIntroTexts();
                ensureAboutTexts();
                if (!D.site) D.site = {};
                D.site.loadedFromServer = true;
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(D)); } catch (e) {}
                applyToPage();
                if (ui && ui.bodyEl) {
                    ui.bodyEl.innerHTML = renderTabContent(currentTab);
                }
                showStatus('Sincronizado con MySQL ✓');
            })
            .catch(function(err) {
                console.warn('Sync notice:', err && err.message);
            });
    }

    function ensureIntroTexts() {
        if (!D.intro) D.intro = {};
        if (!Array.isArray(D.intro.texts) || D.intro.texts.length === 0) {
            if (D.intro.text) {
                var lines = D.intro.text.split('\n\n').map(function(s){ return s.trim(); }).filter(Boolean);
                D.intro.texts = lines.length ? lines : [D.intro.text];
            } else {
                D.intro.texts = ['Tetra Studio combina estrategia, diseño, contenido y comunicación para transformar ideas en marcas relevantes y experiencias visuales memorables.'];
            }
        }
    }

    function ensureAboutTexts() {
        if (!D.about) D.about = {};
        if (!Array.isArray(D.about.texts) || D.about.texts.length === 0) {
            var list = [];
            if (D.about.text1) {
                D.about.text1.split('\n').map(function(s){ return s.trim(); }).filter(Boolean).forEach(function(p){
                    list.push(p);
                });
            }
            if (D.about.text2) {
                D.about.text2.split('\n').map(function(s){ return s.trim(); }).filter(Boolean).forEach(function(p){
                    if (list.indexOf(p) === -1) list.push(p);
                });
            }
            if (list.length === 0) {
                list = [
                    'Somos un estudio creativo que trabaja entre estrategia, diseño, contenido y comunicación.',
                    'Creamos identidades y experiencias visuales que ayudan a las marcas a encontrar una voz propia.'
                ];
            }
            D.about.texts = list;
        }
    }

    function ensureAboutImages() {
        if (!D.about) D.about = {};
        if (!Array.isArray(D.about.images)) {
            var imgs = [];
            if (D.about.img1) imgs.push(D.about.img1);
            if (D.about.img2) imgs.push(D.about.img2);
            if (imgs.length === 0 && D.about.img1 === undefined && D.about.img2 === undefined) {
                imgs = [
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
                    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80'
                ];
            }
            D.about.images = imgs;
        }
        D.about.img1 = D.about.images[0] || '';
        D.about.img2 = D.about.images[1] || '';
    }

    function deepMerge(target, source) {
        var out = Object.assign({}, target);
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && target[key]) {
                    out[key] = deepMerge(target[key], source[key]);
                } else {
                    out[key] = source[key];
                }
            }
        }
        return out;
    }

    var D = load(); // Global data object
    ensureIntroTexts();
    ensureAboutTexts();
    ensureAboutImages();
    var ui = null;
    var currentTab = 'hero';
    var loggedIn = false;

    // ─── localStorage CHECK ───
    function checkLocalStorage() {
        try {
            var testKey = '__tetra_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('localStorage no disponible:', e.message);
            return false;
        }
    }
    var localStorageAvailable = checkLocalStorage();

    // ─── HELPERS ───
    function $(sel, ctx) { return (ctx || document).querySelector(sel); }
    function $$(sel, ctx) { return (ctx || document).querySelectorAll(sel); }
    function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function h(tag, attrs, children) {
        var el = document.createElement(tag);
        if (attrs) Object.keys(attrs).forEach(function(k) {
            if (k === 'className') el.className = attrs[k];
            else if (k === 'textContent') el.textContent = attrs[k];
            else if (k === 'innerHTML') el.innerHTML = attrs[k];
            else el.setAttribute(k, attrs[k]);
        });
        if (children) {
            if (typeof children === 'string') el.innerHTML = children;
            else if (Array.isArray(children)) children.forEach(function(c) { if (c) el.appendChild(c); });
            else el.appendChild(children);
        }
        return el;
    }

    function showStatus(msg, isError) {
        var el = $('#adminStatus');
        if (!el) return;
        el.textContent = msg || 'Guardado';
        el.classList.toggle('error', !!isError);
        el.classList.add('show');
        clearTimeout(el._t);
        el._t = setTimeout(function () { el.classList.remove('show'); }, 2500);
    }

    // ─── SET NESTED VALUE (safe) ───
    function setVal(obj, path, val) {
        var parts = path.split('.');
        var cur = obj;
        for (var i = 0; i < parts.length - 1; i++) {
            var k = parts[i];
            if (cur[k] === undefined || cur[k] === null) {
                cur[k] = isNaN(parts[i + 1]) ? {} : [];
            }
            cur = cur[k];
        }
        cur[parts[parts.length - 1]] = val;
    }

    // ─── FILE TO BASE64 ───
    function toBase64(file, cb) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                var c = document.createElement('canvas');
                var maxW = 800, w = img.width, h2 = img.height;
                if (w > maxW) { h2 = (maxW / w) * h2; w = maxW; }
                c.width = w; c.height = h2;
                c.getContext('2d').drawImage(img, 0, 0, w, h2);
                cb(c.toDataURL('image/jpeg', 0.75));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // ─── SVG PATH FOR LOGO ───
    var LOGO_BLACK = 'logos/TETRAlogSF.png';
    var LOGO_WHITE = 'logos/tetralogSFblanco.png';

    // ═══════════════════════════════════════════════════════
    // APPLY DATA TO PAGE
    // ═══════════════════════════════════════════════════════
    function applyToPage() {
        // Hero
        var el;
        el = $('.hero__title'); if (el) el.innerHTML = '<span class="hero__title-line">' + esc(D.hero.title1) + '</span><span class="hero__title-line">' + esc(D.hero.title2) + '</span>';
        el = $('.hero__subtitle'); if (el) el.innerHTML = D.hero.subtitle.split('\n').map(function(l){return '<span>'+esc(l)+'</span>';}).join('');
        el = $('.hero__description');
        if (el && D.hero.description) {
            if (D.hero.description.indexOf('<') === -1) {
                el.innerHTML = esc(D.hero.description).replace(/\n/g, '<br>');
            } else {
                el.innerHTML = D.hero.description;
            }
        }

        // Intro
        el = $('.intro__title'); if (el) el.innerHTML = '<span>' + esc(D.intro.title1) + '</span><span>' + esc(D.intro.title2) + '</span>';
        ensureIntroTexts();
        var introRight = $('.intro__right');
        if (introRight) {
            var introHtml = D.intro.texts.map(function(t) {
                return '<p class="intro__text">' + esc(t).replace(/\n/g, '<br>') + '</p>';
            }).join('');
            introRight.innerHTML = introHtml + '<a href="#about" class="btn btn--outline">CONOC&Eacute; TETRA <span>&rarr;</span></a>';
        }

        // Services
        el = $('.services__title'); if (el) el.innerHTML = '<span>' + esc(D.services.title1) + '</span><span>' + esc(D.services.title2) + '</span>';
        el = $('.services__list');
        if (el) {
            el.innerHTML = D.services.items.map(function(s,i){
                return '<div class="services__item" data-reveal data-delay="'+(i*100)+'">' +
                    '<span class="services__number">'+esc(s.num)+'</span>' +
                    '<h3 class="services__name">'+esc(s.name)+'</h3>' +
                    '<p class="services__desc">'+esc(s.desc)+'</p>' +
                    '<div class="services__hover-img" style="background-image:url(\''+s.img+'\')"></div></div>';
            }).join('');
        }

        // Creators
        el = $('.creators__title'); if (el) el.innerHTML = '<span>' + esc(D.creators.title1) + '</span><span>' + esc(D.creators.title2) + '</span>';
        el = $('.creators__intro-text'); if (el) el.textContent = D.creators.intro;
        el = $('.creators__manifesto-title'); if (el) el.innerHTML = D.creators.manifesto.split('\n').map(function(l){return '<span>'+esc(l)+'</span>';}).join('');
        el = $('.creators__catalog');
        if (el) {
            el.innerHTML = D.creators.items.map(function(c,i){
                var insta = (c.instagram || '').replace(/^@/, '');
                var instaHtml = insta ? '<a href="https://www.instagram.com/'+esc(insta)+'/" target="_blank" rel="noopener" class="creator-card__instagram" onclick="event.stopPropagation()">@'+esc(insta)+' <span>&nearr;</span></a>' : '';
                return '<div class="creator-card" data-category="'+esc(c.catFilter)+'" data-location="'+esc(c.locFilter)+'" data-instagram="'+esc(insta)+'" data-reveal data-delay="'+(i*100)+'">' +
                    '<div class="creator-card__img"><img src="'+c.img+'" alt="'+esc(c.name)+'" loading="lazy">' +
                    '<div class="creator-card__symbol"><img src="'+LOGO_BLACK+'" alt=""></div></div>' +
                    '<div class="creator-card__info"><h4 class="creator-card__name">'+esc(c.name)+'</h4>' +
                    '<span class="creator-card__role">'+esc(c.role)+'</span>' +
                    '<span class="creator-card__cats">'+esc(c.cats)+'</span>' +
                    '<span class="creator-card__loc">'+esc(c.loc)+'</span>' +
                    instaHtml + '</div></div>';
            }).join('');
        }

        // Projects
        el = $('.projects__title'); if (el) el.innerHTML = '<span>' + esc(D.projects.title1) + '</span><span>' + esc(D.projects.title2) + '</span>';
        el = $('.projects__grid');
        if (el) {
            el.innerHTML = D.projects.items.map(function(p,i){
                var sc = p.size==='large'?' project-item--large':p.size==='tall'?' project-item--tall':p.size==='wide'?' project-item--wide':'';
                return '<div class="project-item'+sc+'" data-reveal data-delay="'+(i*100)+'">' +
                    '<div class="project-item__img"><img src="'+p.img+'" alt="'+esc(p.name)+'" loading="lazy"></div>' +
                    '<div class="project-item__info"><span class="project-item__name">'+esc(p.name)+'</span>' +
                    '<span class="project-item__type">'+esc(p.type)+'</span>' +
                    '<span class="project-item__year">'+esc(p.year)+'</span></div>' +
                    '<div class="project-item__symbol"><img src="'+LOGO_BLACK+'" alt=""></div></div>';
            }).join('');
        }

        // Manifesto
        el = $('.manifesto__title'); if (el) el.innerHTML = D.manifesto.title.split('\n').map(function(l,i){return '<span data-reveal data-delay="'+(i*150)+'">'+esc(l)+'</span>';}).join('');
        el = $('.manifesto__words'); if (el) el.innerHTML = D.manifesto.words.split('\n').map(function(l,i){return '<span data-reveal data-delay="'+(450+i*100)+'">'+esc(l)+'</span>';}).join('');

        // About
        el = $('.about__title'); if (el) el.innerHTML = '<span>' + esc(D.about.title1) + '</span><span>' + esc(D.about.title2) + '</span>';
        ensureAboutTexts();
        ensureAboutImages();
        var aboutRight = $('.about__right');
        if (aboutRight) {
            var aboutHtml = D.about.texts.map(function(t) {
                return '<p class="about__text">' + esc(t).replace(/\n/g, '<br>') + '</p>';
            }).join('');

            var imagesHtml = '';
            if (Array.isArray(D.about.images) && D.about.images.length > 0) {
                imagesHtml = '<div class="about__images">' +
                    D.about.images.map(function(src, idx) {
                        var offsetClass = (idx % 2 === 1) ? ' about__img--offset' : '';
                        var delay = 300 + ((idx % 6) * 100);
                        return '<div class="about__img' + offsetClass + '" data-reveal data-delay="' + delay + '">' +
                            '<img src="' + src + '" alt="Studio" loading="lazy">' +
                        '</div>';
                    }).join('') +
                '</div>';
            }

            aboutRight.innerHTML = aboutHtml + imagesHtml;
        }

        // Process
        el = $('.process__title'); if (el) el.innerHTML = '<span>' + esc(D.process.title1) + '</span><span>' + esc(D.process.title2) + '</span>';
        var stepsContainer = $('.process__steps');
        if (stepsContainer && Array.isArray(D.process.steps)) {
            stepsContainer.innerHTML = D.process.steps.map(function(s, i) {
                return '<div class="process__step" data-reveal data-delay="' + (i * 100) + '">' +
                    '<span class="process__step-num">' + esc(s.num) + '</span>' +
                    '<div class="process__step-line"></div>' +
                    '<h3 class="process__step-name">' + esc(s.name) + '</h3>' +
                    '<p class="process__step-desc">' + esc(s.desc) + '</p>' +
                '</div>';
            }).join('');
        }

        // Clients
        el = $('.clients__title'); if (el) el.innerHTML = '<span>' + esc(D.clients.title1) + '</span><span>' + esc(D.clients.title2) + '</span>';
        el = $('.clients__logos');
        if (el) el.innerHTML = D.clients.logos.map(function(l){return '<div class="client-logo"><span>'+esc(l)+'</span></div>';}).join('');

        // Contact
        el = $('.contact__title'); if (el) el.innerHTML = '<span>' + esc(D.contact.title1) + '</span><span>' + esc(D.contact.title2) + '</span><span>' + esc(D.contact.title3) + '</span>';
        var contactTexts = $$('.contact__text');
        if (contactTexts[0]) contactTexts[0].textContent = D.contact.text1;
        if (contactTexts[1]) contactTexts[1].textContent = D.contact.text2;

        var cleanPhone = (D.contact && D.contact.whatsapp) ? String(D.contact.whatsapp).replace(/[^0-9]/g, '') : '5493815456354';
        var waUrl = 'https://wa.me/' + cleanPhone;

        var contactHablemos = $('.contact__btn-whatsapp, .contact__btn-email');
        if (contactHablemos) {
            contactHablemos.href = waUrl;
            contactHablemos.target = '_blank';
            contactHablemos.rel = 'noopener';
        }

        var headerCta = $('.header__cta');
        if (headerCta) {
            headerCta.href = waUrl;
            headerCta.target = '_blank';
            headerCta.rel = 'noopener';
        }

        var mobileCta = $('.mobile-menu__cta');
        if (mobileCta) {
            mobileCta.href = waUrl;
            mobileCta.target = '_blank';
            mobileCta.rel = 'noopener';
        }

        // Footer
        el = $('.footer__name'); if (el) el.textContent = D.footer.name;
        el = $('.footer__tagline'); if (el) el.textContent = D.footer.tagline;
        el = $('.footer__bottom span'); if (el) el.textContent = D.footer.copyright;

        var footInsta = $('.footer__link-instagram');
        if (footInsta && D.contact && D.contact.instagram) footInsta.href = D.contact.instagram;

        var footTiktok = $('.footer__link-tiktok');
        if (footTiktok && D.contact && D.contact.tiktok) footTiktok.href = D.contact.tiktok;

        var footEmail = $('.footer__link-email');
        if (footEmail && D.contact && D.contact.email) footEmail.href = 'mailto:' + D.contact.email;

        var footWhatsapp = $('.footer__link-whatsapp');
        if (footWhatsapp) {
            footWhatsapp.href = waUrl;
        }

        // Re-init reveals and filters
        if (window.TetraInit) window.TetraInit();
        if (window.TetraFilterCreators) window.TetraFilterCreators();
    }

    // ═══════════════════════════════════════════════════════
    // BUILD ADMIN UI
    // ═══════════════════════════════════════════════════════
    function buildPanel() {
        // Create all elements
        var loginEl = h('div', {className: 'admin-login', id: 'adminLogin'}, [
            h('div', {className: 'admin-login__box'}, [
                h('div', {className: 'admin-login__title', textContent: 'ACCESO ADMIN'}),
                h('input', {className: 'admin-login__input', id: 'adminPass', type: 'password', placeholder: 'Contraseña'}),
                h('button', {className: 'admin-login__btn', id: 'adminLoginBtn', textContent: 'ENTRAR'}),
                h('div', {className: 'admin-login__error', id: 'adminError', textContent: 'Contraseña incorrecta'})
            ])
        ]);

        var triggerEl = h('button', {className: 'admin-trigger', id: 'adminTrigger', title: 'Admin (Ctrl+Shift+A)', textContent: '⚙'});

        var overlayEl = h('div', {className: 'admin-overlay', id: 'adminOverlay'});

        var statusEl = h('div', {className: 'admin-status', id: 'adminStatus', textContent: 'Guardado'});

        // Tabs
        var tabNames = ['hero','intro','services','creators','projects','manifesto','about','process','clients','contact','data'];
        var tabLabels = ['HERO','INTRO','SERVICIOS','CREATORS','PROYECTOS','MANIFIESTO','ABOUT','PROCESO','CLIENTES','CONTACTO','DATOS'];
        var tabsContainer = h('div', {className: 'admin-tabs', id: 'adminTabs'});
        tabNames.forEach(function(name, i) {
            var tab = h('div', {className: 'admin-tab' + (i===0?' active':''), 'data-tab': name, textContent: tabLabels[i]});
            tabsContainer.appendChild(tab);
        });

        var bodyEl = h('div', {className: 'admin-body', id: 'adminBody'});

        var footerEl = h('div', {className: 'admin-footer'}, [
            h('button', {className: 'admin-btn admin-btn--primary admin-btn--full', id: 'adminSaveBtn', textContent: 'GUARDAR CAMBIOS'})
        ]);

        var panelEl = h('div', {className: 'admin-panel', id: 'adminPanel'}, [
            h('div', {className: 'admin-panel__header'}, [
                h('span', {className: 'admin-panel__header-title', textContent: 'TETRA CMS'}),
                h('button', {className: 'admin-panel__close', id: 'adminClose', innerHTML: '&times;'})
            ]),
            tabsContainer,
            bodyEl,
            footerEl
        ]);

        document.body.appendChild(loginEl);
        document.body.appendChild(triggerEl);
        document.body.appendChild(overlayEl);
        document.body.appendChild(statusEl);
        document.body.appendChild(panelEl);

        // Inject CSS
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'admin.css';
        document.head.appendChild(link);

        return { loginEl: loginEl, triggerEl: triggerEl, overlayEl: overlayEl, panelEl: panelEl, bodyEl: bodyEl, tabsContainer: tabsContainer };
    }

    // ─── RENDER TAB CONTENT ───
    function renderTabContent(tabName) {
        var html = '';
        switch(tabName) {
            case 'hero':
                html = '<div class="admin-section-title">HERO</div>' +
                    input('hero.title1', 'TÍTULO LÍNEA 1', D.hero.title1) +
                    input('hero.title2', 'TÍTULO LÍNEA 2', D.hero.title2) +
                    textarea('hero.subtitle', 'SUBTÍTULO (una línea por renglón)', D.hero.subtitle) +
                    textarea('hero.description', 'DESCRIPCIÓN (admite saltos de línea / párrafos)', D.hero.description);
                break;
            case 'intro':
                ensureIntroTexts();
                html = '<div class="admin-section-title">INTRO</div>' +
                    input('intro.title1', 'TÍTULO LÍNEA 1', D.intro.title1) +
                    input('intro.title2', 'TÍTULO LÍNEA 2', D.intro.title2) +
                    '<div class="admin-subtitle-bar"><span class="admin-subtitle">PÁRRAFOS DE TEXTO</span></div>';
                D.intro.texts.forEach(function(txt, i) {
                    html += '<div class="admin-card">' +
                        '<div class="admin-card__header">' +
                            '<span class="admin-card__title">PÁRRAFO ' + (i + 1) + '</span>' +
                            (D.intro.texts.length > 1 ? '<span class="admin-card__delete" data-delete-intro-paragraph="' + i + '">ELIMINAR</span>' : '') +
                        '</div>' +
                        textarea('intro.texts.' + i, 'TEXTO', txt) +
                    '</div>';
                });
                html += '<button class="admin-btn admin-btn--secondary admin-btn--full" id="addIntroParagraph">+ AGREGAR PÁRRAFO</button>';
                break;
            case 'services':
                html = '<div class="admin-section-title">SERVICIOS</div>' +
                    input('services.title1', 'TÍTULO LÍNEA 1', D.services.title1) +
                    input('services.title2', 'TÍTULO LÍNEA 2', D.services.title2);
                D.services.items.forEach(function(s, i) {
                    html += '<div class="admin-card"><div class="admin-card__header"><span class="admin-card__title">'+esc(s.num)+' — '+esc(s.name)+'</span><span class="admin-card__delete" data-delete-service="'+i+'">ELIMINAR</span></div>' +
                        '<div class="admin-grid-2">' +
                        input('services.items.'+i+'.name', 'NOMBRE', s.name) +
                        input('services.items.'+i+'.num', 'NÚMERO', s.num) + '</div>' +
                        input('services.items.'+i+'.desc', 'DESCRIPCIÓN', s.desc) +
                        '<div class="admin-group"><label class="admin-group__label">IMAGEN (hover)</label>' +
                        '<div class="admin-image-upload"><input type="file" accept="image/*" data-upload-service="'+i+'">' +
                        (s.img ? '<img class="admin-image-upload__preview" src="'+s.img+'">' : '') +
                        '<div class="admin-image-upload__text"><strong>Click para subir imagen</strong></div></div></div></div>';
                });
                html += '<button class="admin-btn admin-btn--secondary admin-btn--full" id="addService">+ AGREGAR SERVICIO</button>';
                break;
            case 'creators':
                html = '<div class="admin-section-title">TETRA CREATORS</div>' +
                    input('creators.title1', 'TÍTULO LÍNEA 1', D.creators.title1) +
                    input('creators.title2', 'TÍTULO LÍNEA 2', D.creators.title2) +
                    textarea('creators.intro', 'TEXTO INTRO', D.creators.intro) +
                    textarea('creators.manifesto', 'MANIFIESTO (una línea por renglón)', D.creators.manifesto);
                D.creators.items.forEach(function(c, i) {
                    var isTodos = String(c.catFilter || '').toLowerCase() === 'todos' || String(c.catFilter || '').toLowerCase() === 'all';
                    var isTodasLoc = String(c.locFilter || '').toLowerCase() === 'todas' || String(c.locFilter || '').toLowerCase() === 'all';
                    html += '<div class="admin-card"><div class="admin-card__header"><span class="admin-card__title">'+esc(c.name)+'</span><span class="admin-card__delete" data-delete-creator="'+i+'">ELIMINAR</span></div>' +
                        '<div class="admin-grid-2">' +
                        input('creators.items.'+i+'.name', 'NOMBRE', c.name) +
                        input('creators.items.'+i+'.role', 'ROL', c.role) + '</div>' +
                        input('creators.items.'+i+'.cats', 'CATEGORÍAS (texto visible en tarjeta, ej: FASHION, UGC o TODOS)', c.cats) +
                        '<div class="admin-grid-2">' +
                        '<div class="admin-group">' +
                            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
                                '<label class="admin-group__label" style="margin-bottom:0;">CATEGORÍA (filtro)</label>' +
                                '<button type="button" class="admin-btn admin-btn--secondary" data-set-all-cats="'+i+'" style="padding:2px 8px;font-size:0.62rem;letter-spacing:0.05em;border-color:rgba(0,0,0,0.2);cursor:pointer;" title="Poner en todas las categorías">★ PONER "TODOS"</button>' +
                            '</div>' +
                            '<select class="admin-group__select" data-select-cat="'+i+'" style="margin-bottom:8px;">' +
                                '<option value="">-- Seleccionar categoría rápida --</option>' +
                                '<option value="todos"'+(isTodos ? ' selected' : '')+'>TODOS (Aparece en todas las categorías)</option>' +
                                '<option value="fashion">FASHION</option>' +
                                '<option value="beauty">BEAUTY</option>' +
                                '<option value="lifestyle">LIFESTYLE</option>' +
                                '<option value="food">FOOD</option>' +
                                '<option value="travel">TRAVEL</option>' +
                                '<option value="fitness">FITNESS</option>' +
                                '<option value="ugc">UGC</option>' +
                                '<option value="product">PRODUCT</option>' +
                                '<option value="social">SOCIAL MEDIA</option>' +
                            '</select>' +
                            '<input class="admin-group__input" data-field="creators.items.'+i+'.catFilter" value="'+esc(c.catFilter)+'" placeholder="todos (o varias: fashion, ugc)">' +
                            '<span style="display:block;font-size:0.65rem;color:#797877;margin-top:4px;">Usa <strong>todos</strong> para mostrar en cualquier filtro.</span>' +
                        '</div>' +
                        '<div class="admin-group">' +
                            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
                                '<label class="admin-group__label" style="margin-bottom:0;">UBICACIÓN (filtro)</label>' +
                                '<button type="button" class="admin-btn admin-btn--secondary" data-set-all-locs="'+i+'" style="padding:2px 8px;font-size:0.62rem;letter-spacing:0.05em;border-color:rgba(0,0,0,0.2);cursor:pointer;">TODAS</button>' +
                            '</div>' +
                            '<select class="admin-group__select" data-select-loc="'+i+'" style="margin-bottom:8px;">' +
                                '<option value="">-- Seleccionar ubicación rápida --</option>' +
                                '<option value="todas"'+(isTodasLoc ? ' selected' : '')+'>TODAS (Aparece en todas las ciudades)</option>' +
                                '<option value="tucuman">TUCUMÁN</option>' +
                                '<option value="buenos-aires">BUENOS AIRES</option>' +
                                '<option value="cordoba">CÓRDOBA</option>' +
                                '<option value="rosario">ROSARIO</option>' +
                                '<option value="otras">OTRAS</option>' +
                            '</select>' +
                            '<input class="admin-group__input" data-field="creators.items.'+i+'.locFilter" value="'+esc(c.locFilter)+'" placeholder="todas, tucuman, buenos-aires...">' +
                        '</div>' +
                        '</div>' +
                        input('creators.items.'+i+'.loc', 'UBICACIÓN (display)', c.loc) +
                        input('creators.items.'+i+'.instagram', 'INSTAGRAM (ej: supercuutee o @supercuutee)', c.instagram || '') +
                        '<div class="admin-group"><label class="admin-group__label">FOTO</label>' +
                        '<div class="admin-image-upload"><input type="file" accept="image/*" data-upload-creator="'+i+'">' +
                        (c.img ? '<img class="admin-image-upload__preview" src="'+c.img+'">' : '') +
                        '<div class="admin-image-upload__text"><strong>Click para subir foto</strong></div></div></div></div>';
                });
                html += '<button class="admin-btn admin-btn--secondary admin-btn--full" id="addCreator">+ AGREGAR CREATOR</button>';
                break;
            case 'projects':
                html = '<div class="admin-section-title">PROYECTOS</div>' +
                    input('projects.title1', 'TÍTULO LÍNEA 1', D.projects.title1) +
                    input('projects.title2', 'TÍTULO LÍNEA 2', D.projects.title2);
                D.projects.items.forEach(function(p, i) {
                    html += '<div class="admin-card"><div class="admin-card__header"><span class="admin-card__title">'+esc(p.name)+' — '+esc(p.type)+'</span><span class="admin-card__delete" data-delete-project="'+i+'">ELIMINAR</span></div>' +
                        '<div class="admin-grid-2">' +
                        input('projects.items.'+i+'.name', 'NOMBRE', p.name) +
                        input('projects.items.'+i+'.type', 'TIPO', p.type) + '</div>' +
                        '<div class="admin-grid-2">' +
                        input('projects.items.'+i+'.year', 'AÑO', p.year) +
                        '<div class="admin-group"><label class="admin-group__label">TAMAÑO</label>' +
                        '<select class="admin-group__select" data-field="projects.items.'+i+'.size">' +
                        '<option value="normal"'+(p.size==='normal'?' selected':'')+'>Normal</option>' +
                        '<option value="large"'+(p.size==='large'?' selected':'')+'>Grande</option>' +
                        '<option value="tall"'+(p.size==='tall'?' selected':'')+'>Alto</option>' +
                        '<option value="wide"'+(p.size==='wide'?' selected':'')+'>Ancho</option>' +
                        '</select></div></div>' +
                        '<div class="admin-group"><label class="admin-group__label">IMAGEN</label>' +
                        '<div class="admin-image-upload"><input type="file" accept="image/*" data-upload-project="'+i+'">' +
                        (p.img ? '<img class="admin-image-upload__preview" src="'+p.img+'">' : '') +
                        '<div class="admin-image-upload__text"><strong>Click para subir imagen</strong></div></div></div></div>';
                });
                html += '<button class="admin-btn admin-btn--secondary admin-btn--full" id="addProject">+ AGREGAR PROYECTO</button>';
                break;
            case 'manifesto':
                html = '<div class="admin-section-title">MANIFIESTO</div>' +
                    textarea('manifesto.title', 'TÍTULO (una línea por renglón)', D.manifesto.title) +
                    textarea('manifesto.words', 'PALABRAS CLAVE (una línea por renglón)', D.manifesto.words);
                break;
            case 'about':
                ensureAboutTexts();
                ensureAboutImages();
                html = '<div class="admin-section-title">ABOUT</div>' +
                    input('about.title1', 'TÍTULO LÍNEA 1', D.about.title1) +
                    input('about.title2', 'TÍTULO LÍNEA 2', D.about.title2) +
                    '<div class="admin-subtitle-bar"><span class="admin-subtitle">PÁRRAFOS DE TEXTO</span></div>';
                D.about.texts.forEach(function(txt, i) {
                    html += '<div class="admin-card">' +
                        '<div class="admin-card__header">' +
                            '<span class="admin-card__title">PÁRRAFO ' + (i + 1) + '</span>' +
                            (D.about.texts.length > 1 ? '<span class="admin-card__delete" data-delete-about-paragraph="' + i + '">ELIMINAR</span>' : '') +
                        '</div>' +
                        textarea('about.texts.' + i, 'TEXTO', txt) +
                    '</div>';
                });
                html += '<button class="admin-btn admin-btn--secondary admin-btn--full" id="addAboutParagraph" style="margin-bottom:32px;">+ AGREGAR PÁRRAFO</button>' +
                    '<div class="admin-subtitle-bar"><span class="admin-subtitle">FOTOS DE LA SECCIÓN ABOUT</span></div>';

                if (D.about.images.length === 0) {
                    html += '<p style="font-size:0.75rem;color:#797877;margin-bottom:16px;">No hay fotos en la sección About actualmente.</p>';
                } else {
                    D.about.images.forEach(function(imgSrc, i) {
                        html += '<div class="admin-card">' +
                            '<div class="admin-card__header">' +
                                '<span class="admin-card__title">FOTO ' + (i + 1) + '</span>' +
                                '<span class="admin-card__delete" data-delete-about-img="' + i + '">ELIMINAR FOTO</span>' +
                            '</div>' +
                            '<div class="admin-group" style="margin-bottom:0;">' +
                                '<div class="admin-image-upload">' +
                                    '<input type="file" accept="image/*" data-upload-about-img="' + i + '">' +
                                    (imgSrc ? '<img class="admin-image-upload__preview" src="' + imgSrc + '">' : '') +
                                    '<div class="admin-image-upload__text"><strong>Click para cambiar o colocar foto</strong><br><span style="font-size:0.68rem;color:#797877;">o arrastra un archivo aquí</span></div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
                    });
                }

                html += '<label class="admin-btn admin-btn--secondary admin-btn--full" style="cursor:pointer;margin-bottom:28px;text-align:center;display:block;">' +
                    '+ COLOCAR / AGREGAR NUEVA FOTO' +
                    '<input type="file" accept="image/*" id="addAboutImageInput" style="display:none;">' +
                '</label>';
                break;
            case 'process':
                if (!Array.isArray(D.process.steps)) D.process.steps = [];
                html = '<div class="admin-section-title">PROCESO</div>' +
                    input('process.title1', 'TÍTULO LÍNEA 1', D.process.title1) +
                    input('process.title2', 'TÍTULO LÍNEA 2', D.process.title2) +
                    '<div class="admin-subtitle-bar"><span class="admin-subtitle">PASOS DEL PROCESO</span></div>';
                D.process.steps.forEach(function(s, i) {
                    html += '<div class="admin-card"><div class="admin-card__header">' +
                        '<span class="admin-card__title">PASO ' + esc(s.num) + ' — ' + esc(s.name) + '</span>' +
                        '<span class="admin-card__delete" data-delete-step="' + i + '">ELIMINAR</span></div>' +
                        '<div class="admin-grid-2">' +
                        input('process.steps.' + i + '.name', 'NOMBRE', s.name) +
                        input('process.steps.' + i + '.num', 'NÚMERO', s.num) + '</div>' +
                        input('process.steps.' + i + '.desc', 'DESCRIPCIÓN', s.desc) + '</div>';
                });
                html += '<button class="admin-btn admin-btn--secondary admin-btn--full" id="addProcessStep">+ AGREGAR PASO</button>';
                break;
            case 'clients':
                html = '<div class="admin-section-title">CLIENTES</div>' +
                    input('clients.title1', 'TÍTULO LÍNEA 1', D.clients.title1) +
                    input('clients.title2', 'TÍTULO LÍNEA 2', D.clients.title2) +
                    textarea('clients.logos', 'LOGOS (uno por línea)', Array.isArray(D.clients.logos) ? D.clients.logos.join('\n') : String(D.clients.logos || ''));
                break;
            case 'contact':
                html = '<div class="admin-section-title">CONTACTO Y CANALES</div>' +
                    input('contact.title1', 'TÍTULO LÍNEA 1', D.contact.title1) +
                    input('contact.title2', 'TÍTULO LÍNEA 2', D.contact.title2) +
                    input('contact.title3', 'TÍTULO LÍNEA 3', D.contact.title3) +
                    input('contact.text1', 'TEXTO 1', D.contact.text1) +
                    input('contact.text2', 'TEXTO 2', D.contact.text2) +
                    input('contact.email', 'EMAIL DE CONTACTO', D.contact.email || 'tetra.studio26@gmail.com') +
                    input('contact.instagram', 'URL INSTAGRAM', D.contact.instagram || 'https://instagram.com/tetra.studio') +
                    input('contact.tiktok', 'URL TIKTOK', D.contact.tiktok || 'https://tiktok.com/@tetra.studio') +
                    input('contact.whatsapp', 'WHATSAPP / TELÉFONO', D.contact.whatsapp || '');
                break;
            case 'data':
                html = '<div class="admin-section-title">GESTIÓN DE DATOS</div>' +
                    '<p style="font-size:0.75rem;color:#797877;line-height:1.6;margin-bottom:20px;">Exporta o importa todos los datos del CMS.</p>' +
                    '<div class="admin-actions">' +
                    '<button class="admin-btn admin-btn--primary" id="exportData">EXPORTAR JSON</button>' +
                    '<label class="admin-btn admin-btn--secondary" style="cursor:pointer;">IMPORTAR JSON<input type="file" accept=".json" id="importData" style="display:none;"></label>' +
                    '<button class="admin-btn admin-btn--danger" id="resetData">RESTAURAR DEFAULT</button></div>';
                break;
        }
        return html;
    }

    // ─── INPUT HELPERS ───
    function input(field, label, value) {
        return '<div class="admin-group"><label class="admin-group__label">'+label+'</label><input class="admin-group__input" data-field="'+field+'" value="'+esc(value)+'"></div>';
    }
    function textarea(field, label, value) {
        return '<div class="admin-group"><label class="admin-group__label">'+label+'</label><textarea class="admin-group__textarea" data-field="'+field+'">'+esc(value)+'</textarea></div>';
    }
    function imgUpload(field, label, src) {
        return '<div class="admin-group"><label class="admin-group__label">'+label+'</label><div class="admin-image-upload"><input type="file" accept="image/*" data-upload-field="'+field+'">' +
            (src ? '<img class="admin-image-upload__preview" src="'+src+'">' : '') +
            '<div class="admin-image-upload__text"><strong>Click para subir</strong></div></div></div>';
    }

    // ═══════════════════════════════════════════════════════
    // INIT
    // ═══════════════════════════════════════════════════════
    function init() {
        ui = buildPanel();

        // Warn if localStorage is not available
        if (!localStorageAvailable) {
            showStatus('⚠ localStorage no disponible - los cambios no se guardarán');
        }

        // Apply saved data to page
        applyToPage();

        // Try to sync with the backend (async, no-op if offline)
        serverSync();

        // Load initial tab
        ui.bodyEl.innerHTML = renderTabContent('hero');

        // ─── LOGIN ───
        ui.triggerEl.addEventListener('click', function () {
            if (loggedIn) { openPanel(); return; }
            ui.loginEl.classList.add('active');
            $('#adminPass').value = '';
            $('#adminError').classList.remove('show');
            setTimeout(function () { $('#adminPass').focus(); }, 300);
        });

        $('#adminLoginBtn').addEventListener('click', doLogin);
        $('#adminPass').addEventListener('keydown', function(e) { if (e.key==='Enter') doLogin(); });

        function doLogin() {
            if ($('#adminPass').value === PASS) {
                loggedIn = true;
                ui.loginEl.classList.remove('active');
                openPanel();
            } else {
                $('#adminError').classList.add('show');
            }
        }

        // ─── KEYBOARD SHORTCUT ───
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) { e.preventDefault(); ui.triggerEl.click(); }
            if (e.key === 'Escape' && ui.panelEl.classList.contains('active')) closePanel();
        });

        // ─── PANEL OPEN/CLOSE ───
        function openPanel() {
            ui.panelEl.classList.add('active');
            ui.overlayEl.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closePanel() {
            ui.panelEl.classList.remove('active');
            ui.overlayEl.classList.remove('active');
            document.body.style.overflow = '';
            if (window.location.hash === '#admin') {
                if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
                }
            }
        }

        // ─── HASH ROUTING (#admin) ───
        function checkAdminHash() {
            if (window.location.hash === '#admin') {
                if (loggedIn) {
                    openPanel();
                } else {
                    ui.triggerEl.click();
                }
            }
        }
        checkAdminHash();
        window.addEventListener('hashchange', checkAdminHash);

        $('#adminClose').addEventListener('click', closePanel);
        ui.overlayEl.addEventListener('click', closePanel);

        // ─── SAVE BUTTON ───
        $('#adminSaveBtn').addEventListener('click', function() {
            var saved = save();
            showStatus(saved ? 'Guardado ✓' : 'Error: no se pudo guardar', !saved);
        });

        // ─── TABS ───
        $$('.admin-tab', ui.tabsContainer).forEach(function(tab) {
            tab.addEventListener('click', function() {
                $$('.admin-tab', ui.tabsContainer).forEach(function(t){t.classList.remove('active');});
                tab.classList.add('active');
                currentTab = tab.dataset.tab;
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
            });
        });

        // ─── INPUT CHANGES (event delegation on body) ───
        ui.bodyEl.addEventListener('input', function(e) {
            var field = e.target.dataset.field;
            if (!field) return;
            var value = e.target.value;

            try {
                if (field === 'clients.logos') {
                    setVal(D, field, value.split('\n').filter(function(l){return l.trim();}));
                } else {
                    setVal(D, field, value);
                }
                if (field.indexOf('about.texts.') === 0 && Array.isArray(D.about.texts)) {
                    D.about.text1 = D.about.texts[0] || '';
                    D.about.text2 = D.about.texts[1] || '';
                }
                if (field.indexOf('intro.texts.') === 0 && Array.isArray(D.intro.texts)) {
                    D.intro.text = D.intro.texts[0] || '';
                }
                var saved = save();
                applyToPage();
                showStatus(saved ? 'Guardado ✓' : 'Error: almacenamiento lleno', !saved);
            } catch(err) {
                console.error('CMS error:', err);
                showStatus('Error al guardar', true);
            }
        });

        ui.bodyEl.addEventListener('change', function(e) {
            // Quick select for Creator category
            var selectCat = e.target.dataset.selectCat;
            if (selectCat !== undefined && e.target.value) {
                var cIdx = parseInt(selectCat);
                var val = e.target.value;
                if (D.creators && D.creators.items && D.creators.items[cIdx]) {
                    D.creators.items[cIdx].catFilter = val;
                    if (val === 'todos') {
                        D.creators.items[cIdx].cats = 'TODOS';
                    } else if (!D.creators.items[cIdx].cats || D.creators.items[cIdx].cats === 'CATEGORÍA' || D.creators.items[cIdx].cats === 'TODOS') {
                        D.creators.items[cIdx].cats = val.toUpperCase();
                    }
                    var saved = save();
                    applyToPage();
                    ui.bodyEl.innerHTML = renderTabContent(currentTab);
                    showStatus(saved ? (val === 'todos' ? 'Categoría establecida a TODOS ✓' : 'Categoría actualizada ✓') : 'Error al guardar', !saved);
                }
                return;
            }

            // Quick select for Creator location
            var selectLoc = e.target.dataset.selectLoc;
            if (selectLoc !== undefined && e.target.value) {
                var lIdx = parseInt(selectLoc);
                var lval = e.target.value;
                if (D.creators && D.creators.items && D.creators.items[lIdx]) {
                    D.creators.items[lIdx].locFilter = lval;
                    if (lval === 'todas') {
                        D.creators.items[lIdx].loc = 'TODAS';
                    }
                    var saved = save();
                    applyToPage();
                    ui.bodyEl.innerHTML = renderTabContent(currentTab);
                    showStatus(saved ? 'Ubicación actualizada ✓' : 'Error al guardar', !saved);
                }
                return;
            }

            var field = e.target.dataset.field;
            if (!field) return;
            try {
                setVal(D, field, e.target.value);
                if (field.indexOf('about.texts.') === 0 && Array.isArray(D.about.texts)) {
                    D.about.text1 = D.about.texts[0] || '';
                    D.about.text2 = D.about.texts[1] || '';
                }
                if (field.indexOf('intro.texts.') === 0 && Array.isArray(D.intro.texts)) {
                    D.intro.text = D.intro.texts[0] || '';
                }
                var saved = save();
                applyToPage();
                showStatus(saved ? 'Guardado ✓' : 'Error: almacenamiento lleno', !saved);
            } catch(err) {
                console.error('CMS error:', err);
            }
        });

        // ─── IMAGE UPLOADS ───
        ui.bodyEl.addEventListener('change', function(e) {
            var file = e.target.files && e.target.files[0];
            if (!file) return;

            // Add new About photo
            if (e.target.id === 'addAboutImageInput') {
                toBase64(file, function(b64) {
                    ensureAboutImages();
                    D.about.images.push(b64);
                    D.about.img1 = D.about.images[0] || '';
                    D.about.img2 = D.about.images[1] || '';
                    var saved = save();
                    applyToPage();
                    ui.bodyEl.innerHTML = renderTabContent(currentTab);
                    showStatus(saved ? 'Foto agregada a About ✓' : 'Error: almacenamiento lleno', !saved);
                });
                return;
            }

            // Change existing About photo
            var aboutImgIdx = e.target.dataset.uploadAboutImg;
            if (aboutImgIdx !== undefined) {
                toBase64(file, function(b64) {
                    ensureAboutImages();
                    var idx = parseInt(aboutImgIdx);
                    D.about.images[idx] = b64;
                    D.about.img1 = D.about.images[0] || '';
                    D.about.img2 = D.about.images[1] || '';
                    var saved = save();
                    applyToPage();
                    ui.bodyEl.innerHTML = renderTabContent(currentTab);
                    showStatus(saved ? 'Foto de About actualizada ✓' : 'Error: almacenamiento lleno', !saved);
                });
                return;
            }

            // Direct field upload (legacy)
            var uploadField = e.target.dataset.uploadField;
            if (uploadField) {
                toBase64(file, function(b64) {
                    setVal(D, uploadField, b64);
                    var saved = save();
                    applyToPage();
                    ui.bodyEl.innerHTML = renderTabContent(currentTab);
                    showStatus(saved ? 'Imagen actualizada ✓' : 'Error: almacenamiento lleno', !saved);
                });
                return;
            }

            // Service upload
            var si = e.target.dataset.uploadService;
            if (si !== undefined) {
                toBase64(file, function(b64) {
                    D.services.items[parseInt(si)].img = b64;
                    var saved = save(); applyToPage();
                    ui.bodyEl.innerHTML = renderTabContent(currentTab);
                    showStatus(saved ? 'Imagen actualizada ✓' : 'Error: almacenamiento lleno', !saved);
                });
                return;
            }

            // Creator upload
            var ci = e.target.dataset.uploadCreator;
            if (ci !== undefined) {
                toBase64(file, function(b64) {
                    D.creators.items[parseInt(ci)].img = b64;
                    var saved = save(); applyToPage();
                    ui.bodyEl.innerHTML = renderTabContent(currentTab);
                    showStatus(saved ? 'Imagen actualizada ✓' : 'Error: almacenamiento lleno', !saved);
                });
                return;
            }

            // Project upload
            var pi = e.target.dataset.uploadProject;
            if (pi !== undefined) {
                toBase64(file, function(b64) {
                    D.projects.items[parseInt(pi)].img = b64;
                    var saved = save(); applyToPage();
                    ui.bodyEl.innerHTML = renderTabContent(currentTab);
                    showStatus(saved ? 'Imagen actualizada ✓' : 'Error: almacenamiento lleno', !saved);
                });
                return;
            }
        });

        // ─── DELETE ITEMS ───
        ui.bodyEl.addEventListener('click', function(e) {
            var del;

            // Quick actions for Creator
            var setAllCats = e.target.dataset.setAllCats;
            if (setAllCats !== undefined) {
                var catIdx = parseInt(setAllCats);
                if (D.creators && D.creators.items && D.creators.items[catIdx]) {
                    D.creators.items[catIdx].catFilter = 'todos';
                    D.creators.items[catIdx].cats = 'TODOS';
                    var saved = save();
                    applyToPage();
                    ui.bodyEl.innerHTML = renderTabContent(currentTab);
                    showStatus(saved ? 'Categoría establecida a TODOS ✓' : 'Error al guardar', !saved);
                }
                return;
            }

            var setAllLocs = e.target.dataset.setAllLocs;
            if (setAllLocs !== undefined) {
                var locIdx = parseInt(setAllLocs);
                if (D.creators && D.creators.items && D.creators.items[locIdx]) {
                    D.creators.items[locIdx].locFilter = 'todas';
                    D.creators.items[locIdx].loc = 'TODAS';
                    var saved = save();
                    applyToPage();
                    ui.bodyEl.innerHTML = renderTabContent(currentTab);
                    showStatus(saved ? 'Ubicación establecida a TODAS ✓' : 'Error al guardar', !saved);
                }
                return;
            }

            del = e.target.dataset.deleteService;
            if (del !== undefined && confirm('¿Eliminar este servicio?')) {
                D.services.items.splice(parseInt(del), 1);
                var saved = save(); applyToPage();
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
                showStatus(saved ? 'Servicio eliminado' : 'Error al guardar', !saved);
                return;
            }

            del = e.target.dataset.deleteCreator;
            if (del !== undefined && confirm('¿Eliminar este creator?')) {
                D.creators.items.splice(parseInt(del), 1);
                var saved = save(); applyToPage();
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
                showStatus(saved ? 'Creator eliminado' : 'Error al guardar', !saved);
                return;
            }

            del = e.target.dataset.deleteProject;
            if (del !== undefined && confirm('¿Eliminar este proyecto?')) {
                D.projects.items.splice(parseInt(del), 1);
                var saved = save(); applyToPage();
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
                showStatus(saved ? 'Proyecto eliminado' : 'Error al guardar', !saved);
                return;
            }

            del = e.target.dataset.deleteStep;
            if (del !== undefined && confirm('¿Eliminar este paso?')) {
                if (Array.isArray(D.process.steps)) {
                    D.process.steps.splice(parseInt(del), 1);
                    D.process.steps.forEach(function(s, idx) { s.num = String(idx + 1).padStart(2, '0'); });
                    var saved = save(); applyToPage();
                    ui.bodyEl.innerHTML = renderTabContent(currentTab);
                    showStatus(saved ? 'Paso eliminado' : 'Error al guardar', !saved);
                }
                return;
            }

            del = e.target.dataset.deleteAboutParagraph;
            if (del !== undefined && confirm('¿Eliminar este párrafo?')) {
                ensureAboutTexts();
                D.about.texts.splice(parseInt(del), 1);
                D.about.text1 = D.about.texts[0] || '';
                D.about.text2 = D.about.texts[1] || '';
                var saved = save(); applyToPage();
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
                showStatus(saved ? 'Párrafo eliminado' : 'Error al guardar', !saved);
                return;
            }

            del = e.target.dataset.deleteAboutImg;
            if (del !== undefined && confirm('¿Eliminar esta foto de la sección About?')) {
                ensureAboutImages();
                D.about.images.splice(parseInt(del), 1);
                D.about.img1 = D.about.images[0] || '';
                D.about.img2 = D.about.images[1] || '';
                var saved = save(); applyToPage();
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
                showStatus(saved ? 'Foto eliminada de About ✓' : 'Error al guardar', !saved);
                return;
            }

            del = e.target.dataset.deleteIntroParagraph;
            if (del !== undefined && confirm('¿Eliminar este párrafo?')) {
                ensureIntroTexts();
                D.intro.texts.splice(parseInt(del), 1);
                D.intro.text = D.intro.texts[0] || '';
                var saved = save(); applyToPage();
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
                showStatus(saved ? 'Párrafo eliminado' : 'Error al guardar', !saved);
                return;
            }

            // Add buttons
            if (e.target.id === 'addService') {
                var n = String(D.services.items.length + 1).padStart(2, '0');
                D.services.items.push({num: n, name: 'NUEVO SERVICIO', desc: 'Descripción.', img: ''});
                var saved = save(); applyToPage();
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
                showStatus(saved ? 'Servicio agregado' : 'Error al guardar', !saved);
                return;
            }
            if (e.target.id === 'addCreator') {
                D.creators.items.push({name: 'NUEVO CREATOR', role: 'CONTENT CREATOR', cats: 'TODOS', catFilter: 'todos', loc: 'UBICACIÓN', locFilter: 'todas', instagram: '', img: ''});
                var saved = save(); applyToPage();
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
                showStatus(saved ? 'Creator agregado' : 'Error al guardar', !saved);
                return;
            }
            if (e.target.id === 'addProject') {
                D.projects.items.push({name: 'NUEVO PROYECTO', type: 'BRANDING', year: '2026', img: '', size: 'normal'});
                var saved = save(); applyToPage();
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
                showStatus(saved ? 'Proyecto agregado' : 'Error al guardar', !saved);
                return;
            }
            if (e.target.id === 'addProcessStep') {
                if (!Array.isArray(D.process.steps)) D.process.steps = [];
                var nStep = String(D.process.steps.length + 1).padStart(2, '0');
                D.process.steps.push({num: nStep, name: 'NUEVO PASO', desc: 'Descripción del paso.'});
                var saved = save(); applyToPage();
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
                showStatus(saved ? 'Paso agregado' : 'Error al guardar', !saved);
                return;
            }
            if (e.target.id === 'addAboutParagraph') {
                ensureAboutTexts();
                D.about.texts.push('Nuevo párrafo sobre nosotros.');
                D.about.text1 = D.about.texts[0] || '';
                D.about.text2 = D.about.texts[1] || '';
                var saved = save(); applyToPage();
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
                showStatus(saved ? 'Párrafo agregado' : 'Error al guardar', !saved);
                return;
            }
            if (e.target.id === 'addIntroParagraph') {
                ensureIntroTexts();
                D.intro.texts.push('Nuevo texto de introducción.');
                D.intro.text = D.intro.texts[0] || '';
                var saved = save(); applyToPage();
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
                showStatus(saved ? 'Párrafo agregado' : 'Error al guardar', !saved);
                return;
            }

            // Data management
            if (e.target.id === 'exportData') {
                var blob = new Blob([JSON.stringify(D, null, 2)], {type: 'application/json'});
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url; a.download = 'tetra-cms-' + new Date().toISOString().slice(0,10) + '.json';
                a.click(); URL.revokeObjectURL(url);
                showStatus('JSON exportado');
                return;
            }
            if (e.target.id === 'resetData') {
                if (confirm('¿Restaurar todos los datos por defecto?')) {
                    D = defaults();
                    ensureIntroTexts();
                    ensureAboutTexts();
                    var saved = save(); applyToPage();
                    ui.bodyEl.innerHTML = renderTabContent(currentTab);
                    showStatus(saved ? 'Datos restaurados' : 'Error al guardar', !saved);
                }
                return;
            }
        });

        // Import
        ui.bodyEl.addEventListener('change', function(e) {
            if (e.target.id === 'importData') {
                var file = e.target.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function(ev) {
                    try {
                        D = deepMerge(defaults(), JSON.parse(ev.target.result));
                        ensureIntroTexts();
                        ensureAboutTexts();
                        var saved = save(); applyToPage();
                        ui.bodyEl.innerHTML = renderTabContent(currentTab);
                        showStatus(saved ? 'Datos importados ✓' : 'Error: almacenamiento lleno', !saved);
                    } catch(err) { alert('Error: archivo JSON inválido'); }
                };
                reader.readAsText(file);
            }
        });

        // (Creator modals and card interactions are handled by script.js)
    }

    // ─── BOOT ───
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
