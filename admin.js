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
            hero: { title1: 'TETRA', title2: 'STUDIO', subtitle: 'WE CREATE\nIDENTITIES.\nWE CREATE\nCONTENT.', description: 'Creative studio focused on brands, design<br>and visual communication.' },
            intro: { title1: 'WE CREATE', title2: 'WITH PURPOSE.', text: 'Tetra Studio combina estrategia, diseño, contenido y comunicación para transformar ideas en marcas relevantes y experiencias visuales memorables.' },
            services: {
                title1: 'WHAT', title2: 'WE DO',
                items: [
                    { num: '01', name: 'BRANDING', desc: 'Identidad visual, estrategia y construcción de marca.', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80' },
                    { num: '02', name: 'ART DIRECTION', desc: 'Conceptualización y dirección visual.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80' },
                    { num: '03', name: 'GRAPHIC DESIGN', desc: 'Diseño gráfico y sistemas visuales.', img: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80' },
                    { num: '04', name: 'CONTENT CREATION', desc: 'Producción de contenido para marcas.', img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80' },
                    { num: '05', name: 'SOCIAL MEDIA', desc: 'Contenido y comunicación para plataformas digitales.', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80' },
                    { num: '06', name: 'CAMPAIGNS', desc: 'Campañas creativas y piezas publicitarias.', img: 'https://images.unsplash.com/photo-1533750349088-cd871a92f17e?w=800&q=80' }
                ]
            },
            creators: {
                title1: 'TETRA', title2: 'CREATORS',
                intro: 'Conectamos marcas con creators seleccionados para producir contenido auténtico, relevante y alineado con cada identidad.',
                manifesto: 'THE PEOPLE\nBEHIND THE\nCONTENT.',
                items: [
                    { name: 'SOFÍA', role: 'CONTENT CREATOR', cats: 'BEAUTY / FASHION / LIFESTYLE', catFilter: 'fashion,ugc', loc: 'TUCUMÁN', locFilter: 'tucuman', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80' },
                    { name: 'MARTINA', role: 'CONTENT CREATOR', cats: 'FASHION / UGC / LIFESTYLE', catFilter: 'fashion,ugc,lifestyle', loc: 'BUENOS AIRES', locFilter: 'buenos-aires', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80' },
                    { name: 'VALENTINA', role: 'CONTENT CREATOR', cats: 'BEAUTY / UGC / TRAVEL', catFilter: 'beauty,ugc,travel', loc: 'CÓRDOBA', locFilter: 'cordoba', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80' },
                    { name: 'CAMILA', role: 'CONTENT CREATOR', cats: 'FOOD / LIFESTYLE', catFilter: 'food,lifestyle', loc: 'ROSARIO', locFilter: 'rosario', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80' },
                    { name: 'LUCAS', role: 'CONTENT CREATOR', cats: 'FITNESS / UGC', catFilter: 'fitness,ugc', loc: 'BUENOS AIRES', locFilter: 'buenos-aires', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80' },
                    { name: 'ISABELA', role: 'CONTENT CREATOR', cats: 'PRODUCT / SOCIAL MEDIA / FASHION', catFilter: 'product,social,fashion', loc: 'TUCUMÁN', locFilter: 'tucuman', img: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80' },
                    { name: 'MATEO', role: 'CONTENT CREATOR', cats: 'TRAVEL / LIFESTYLE / UGC', catFilter: 'travel,lifestyle,ugc', loc: 'MENDOZA', locFilter: 'otras', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
                    { name: 'LUCÍA', role: 'CONTENT CREATOR', cats: 'BEAUTY / SOCIAL MEDIA / FASHION', catFilter: 'beauty,social,fashion', loc: 'CÓRDOBA', locFilter: 'cordoba', img: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&q=80' }
                ]
            },
            projects: {
                title1: 'SELECTED', title2: 'WORK',
                items: [
                    { name: 'LUMIÈRE', type: 'BRANDING', year: '2026', img: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&q=80', size: 'large' },
                    { name: 'VERDE', type: 'CONTENT', year: '2026', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80', size: 'tall' },
                    { name: 'FORMA', type: 'CAMPAIGN', year: '2025', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', size: 'normal' },
                    { name: 'NØVA', type: 'BRANDING / CONTENT', year: '2025', img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80', size: 'wide' },
                    { name: 'AURA', type: 'CAMPAIGN', year: '2025', img: 'https://images.unsplash.com/photo-1533750349088-cd871a92f17e?w=600&q=80', size: 'tall' }
                ]
            },
            manifesto: { title: 'IDEAS\nNEED\nFORM.', words: 'STRATEGY.\nDESIGN.\nCONTENT.\nIDENTITY.' },
            about: {
                title1: 'ABOUT', title2: 'TETRA',
                text1: 'Somos un estudio creativo que trabaja entre estrategia, diseño, contenido y comunicación.',
                text2: 'Creamos identidades y experiencias visuales que ayudan a las marcas a encontrar una voz propia.',
                img1: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
                img2: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80'
            },
            process: {
                title1: 'HOW', title2: 'WE WORK',
                steps: [
                    { num: '01', name: 'DISCOVER', desc: 'Entendemos el contexto.' },
                    { num: '02', name: 'DEFINE', desc: 'Encontramos la dirección.' },
                    { num: '03', name: 'CREATE', desc: 'Transformamos las ideas.' },
                    { num: '04', name: 'LAUNCH', desc: 'Llevamos el proyecto al mundo.' },
                    { num: '05', name: 'CREATE CONTENT', desc: 'Generamos contenido con creators seleccionados.' }
                ]
            },
            clients: { title1: 'BRANDS', title2: "WE'VE WORKED WITH", logos: ['BRAND', 'STUDIO', 'FORMA', 'LUXE', 'aura', 'NØVA', 'VERDE', 'MODA'] },
            contact: { title1: "LET'S", title2: 'CREATE', title3: 'TOGETHER.', text1: '¿Tenés una idea, una marca o un proyecto?', text2: 'LOOKING FOR A CREATOR?' },
            footer: { name: 'TETRA STUDIO', tagline: 'Creative studio for brands with something to say.', copyright: '© 2026 TETRA STUDIO. All rights reserved.' }
        };
    }

    // ─── STORAGE ───
    function load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            console.log('CMS load:', raw ? 'found ' + raw.length + ' bytes' : 'EMPTY (no data)');
            if (raw) {
                var parsed = JSON.parse(raw);
                return deepMerge(defaults(), parsed);
            }
        } catch (e) { console.error('CMS load error', e); }
        return defaults();
    }

    function save() {
        if (!localStorageAvailable) {
            console.warn('CMS: localStorage no disponible');
            return false;
        }
        try {
            var data = JSON.stringify(D);
            localStorage.setItem(STORAGE_KEY, data);
            // Verify write
            var verify = localStorage.getItem(STORAGE_KEY);
            var ok = verify === data;
            console.log('CMS save:', ok ? 'OK' : 'FALLO VERIFY', 'bytes:', data.length);
            serverPush(D);
            return ok;
        } catch (e) {
            console.error('CMS save error:', e.name, e.message);
            return false;
        }
    }

    // ─── SERVER SYNC (backend /api/data) ───
    function serverAvailable() {
        return typeof window.fetch === 'function';
    }
    function serverPush(obj) {
        if (!serverAvailable()) return;
        try {
            fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(obj)
            }).then(function(r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
            }).catch(function() { /* offline o sin backend: se sigue usando localStorage */ });
        } catch (e) { /* ignorar */ }
    }
    function serverSync() {
        if (!serverAvailable()) return;
        fetch('/api/data')
            .then(function(r) { return r.ok ? r.json() : null; })
            .then(function(remote) {
                if (!remote || typeof remote !== 'object') return;
                var merged = deepMerge(deepMerge(defaults(), remote), D);
                D = merged;
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(D)); } catch (e) {}
                applyToPage();
                ui.bodyEl.innerHTML = renderTabContent(currentTab);
                showStatus('Sincronizado con el servidor ✓');
            })
            .catch(function() { /* sin backend */ });
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
        el = $('.hero__description'); if (el) el.innerHTML = D.hero.description;

        // Intro
        el = $('.intro__title'); if (el) el.innerHTML = '<span>' + esc(D.intro.title1) + '</span><span>' + esc(D.intro.title2) + '</span>';
        el = $('.intro__text'); if (el) el.textContent = D.intro.text;

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
                return '<div class="creator-card" data-category="'+esc(c.catFilter)+'" data-location="'+esc(c.locFilter)+'" data-reveal data-delay="'+(i*100)+'">' +
                    '<div class="creator-card__img"><img src="'+c.img+'" alt="'+esc(c.name)+'" loading="lazy">' +
                    '<div class="creator-card__symbol"><img src="'+LOGO_BLACK+'" alt=""></div></div>' +
                    '<div class="creator-card__info"><h4 class="creator-card__name">'+esc(c.name)+'</h4>' +
                    '<span class="creator-card__role">'+esc(c.role)+'</span>' +
                    '<span class="creator-card__cats">'+esc(c.cats)+'</span>' +
                    '<span class="creator-card__loc">'+esc(c.loc)+'</span></div></div>';
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
        var aboutTexts = $$('.about__text');
        if (aboutTexts[0]) aboutTexts[0].textContent = D.about.text1;
        if (aboutTexts[1]) aboutTexts[1].textContent = D.about.text2;
        var aboutImgs = $$('.about__img img');
        if (aboutImgs[0]) aboutImgs[0].src = D.about.img1;
        if (aboutImgs[1]) aboutImgs[1].src = D.about.img2;

        // Process
        el = $('.process__title'); if (el) el.innerHTML = '<span>' + esc(D.process.title1) + '</span><span>' + esc(D.process.title2) + '</span>';
        var steps = $$('.process__step');
        D.process.steps.forEach(function(s,i){
            if (steps[i]) {
                steps[i].querySelector('.process__step-num').textContent = s.num;
                steps[i].querySelector('.process__step-name').textContent = s.name;
                steps[i].querySelector('.process__step-desc').textContent = s.desc;
            }
        });

        // Clients
        el = $('.clients__title'); if (el) el.innerHTML = '<span>' + esc(D.clients.title1) + '</span><span>' + esc(D.clients.title2) + '</span>';
        el = $('.clients__logos');
        if (el) el.innerHTML = D.clients.logos.map(function(l){return '<div class="client-logo"><span>'+esc(l)+'</span></div>';}).join('');

        // Contact
        el = $('.contact__title'); if (el) el.innerHTML = '<span>' + esc(D.contact.title1) + '</span><span>' + esc(D.contact.title2) + '</span><span>' + esc(D.contact.title3) + '</span>';
        var contactTexts = $$('.contact__text');
        if (contactTexts[0]) contactTexts[0].textContent = D.contact.text1;
        if (contactTexts[1]) contactTexts[1].textContent = D.contact.text2;

        // Footer
        el = $('.footer__name'); if (el) el.textContent = D.footer.name;
        el = $('.footer__tagline'); if (el) el.textContent = D.footer.tagline;
        el = $('.footer__bottom span'); if (el) el.textContent = D.footer.copyright;

        // Re-init reveals
        if (window.TetraInit) window.TetraInit();
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
        var tabNames = ['hero','intro','services','creators','projects','about','process','clients','contact','data'];
        var tabLabels = ['HERO','INTRO','SERVICIOS','CREATORS','PROYECTOS','ABOUT','PROCESO','CLIENTES','CONTACTO','DATOS'];
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
                    textarea('hero.description', 'DESCRIPCIÓN (usar <br> para salto)', D.hero.description);
                break;
            case 'intro':
                html = '<div class="admin-section-title">INTRO</div>' +
                    input('intro.title1', 'TÍTULO LÍNEA 1', D.intro.title1) +
                    input('intro.title2', 'TÍTULO LÍNEA 2', D.intro.title2) +
                    textarea('intro.text', 'TEXTO', D.intro.text);
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
                    html += '<div class="admin-card"><div class="admin-card__header"><span class="admin-card__title">'+esc(c.name)+'</span><span class="admin-card__delete" data-delete-creator="'+i+'">ELIMINAR</span></div>' +
                        '<div class="admin-grid-2">' +
                        input('creators.items.'+i+'.name', 'NOMBRE', c.name) +
                        input('creators.items.'+i+'.role', 'ROL', c.role) + '</div>' +
                        input('creators.items.'+i+'.cats', 'CATEGORÍAS (display)', c.cats) +
                        '<div class="admin-grid-2">' +
                        input('creators.items.'+i+'.catFilter', 'CATEGORÍA (filtro)', c.catFilter) +
                        input('creators.items.'+i+'.locFilter', 'UBICACIÓN (filtro)', c.locFilter) + '</div>' +
                        input('creators.items.'+i+'.loc', 'UBICACIÓN (display)', c.loc) +
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
            case 'about':
                html = '<div class="admin-section-title">ABOUT</div>' +
                    input('about.title1', 'TÍTULO LÍNEA 1', D.about.title1) +
                    input('about.title2', 'TÍTULO LÍNEA 2', D.about.title2) +
                    textarea('about.text1', 'TEXTO 1', D.about.text1) +
                    textarea('about.text2', 'TEXTO 2', D.about.text2) +
                    imgUpload('about.img1', 'IMAGEN 1', D.about.img1) +
                    imgUpload('about.img2', 'IMAGEN 2', D.about.img2);
                break;
            case 'process':
                html = '<div class="admin-section-title">PROCESO</div>' +
                    input('process.title1', 'TÍTULO LÍNEA 1', D.process.title1) +
                    input('process.title2', 'TÍTULO LÍNEA 2', D.process.title2);
                D.process.steps.forEach(function(s, i) {
                    html += '<div class="admin-card"><div class="admin-grid-2">' +
                        input('process.steps.'+i+'.name', 'NOMBRE', s.name) +
                        input('process.steps.'+i+'.num', 'NÚMERO', s.num) + '</div>' +
                        input('process.steps.'+i+'.desc', 'DESCRIPCIÓN', s.desc) + '</div>';
                });
                break;
            case 'clients':
                html = '<div class="admin-section-title">CLIENTES</div>' +
                    input('clients.title1', 'TÍTULO LÍNEA 1', D.clients.title1) +
                    input('clients.title2', 'TÍTULO LÍNEA 2', D.clients.title2) +
                    textarea('clients.logos', 'LOGOS (uno por línea)', D.clients.logos.join('\n'));
                break;
            case 'contact':
                html = '<div class="admin-section-title">CONTACTO</div>' +
                    input('contact.title1', 'TÍTULO LÍNEA 1', D.contact.title1) +
                    input('contact.title2', 'TÍTULO LÍNEA 2', D.contact.title2) +
                    input('contact.title3', 'TÍTULO LÍNEA 3', D.contact.title3) +
                    input('contact.text1', 'TEXTO 1', D.contact.text1) +
                    input('contact.text2', 'TEXTO 2', D.contact.text2);
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
        var ui = buildPanel();
        var loggedIn = false;
        var currentTab = 'hero';

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
            if (e.ctrlKey && e.shiftKey && e.key === 'A') { e.preventDefault(); ui.triggerEl.click(); }
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
        }

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
                var saved = save();
                applyToPage();
                showStatus(saved ? 'Guardado ✓' : 'Error: almacenamiento lleno', !saved);
            } catch(err) {
                console.error('CMS error:', err);
                showStatus('Error al guardar', true);
            }
        });

        ui.bodyEl.addEventListener('change', function(e) {
            var field = e.target.dataset.field;
            if (!field) return;
            try {
                setVal(D, field, e.target.value);
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

            // Direct field upload (about images)
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
                D.creators.items.push({name: 'NUEVO CREATOR', role: 'CONTENT CREATOR', cats: 'CATEGORÍA', catFilter: 'lifestyle', loc: 'UBICACIÓN', locFilter: 'buenos-aires', img: ''});
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
                    D = defaults(); var saved = save(); applyToPage();
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
                        var saved = save(); applyToPage();
                        ui.bodyEl.innerHTML = renderTabContent(currentTab);
                        showStatus(saved ? 'Datos importados ✓' : 'Error: almacenamiento lleno', !saved);
                    } catch(err) { alert('Error: archivo JSON inválido'); }
                };
                reader.readAsText(file);
            }
        });

        // ─── CREATOR CARD CLICKS (on page) ───
        document.addEventListener('click', function(e) {
            var card = e.target.closest('.creator-card');
            if (!card || e.target.closest('.admin-panel')) return;

            var name = card.querySelector('.creator-card__name');
            var role = card.querySelector('.creator-card__role');
            var cats = card.querySelector('.creator-card__cats');
            var loc = card.querySelector('.creator-card__loc');
            var img = card.querySelector('.creator-card__img img');
            if (!name) return;

            var modal = h('div', {className: 'modal active'});
            modal.innerHTML = '<div class="modal__overlay"></div>' +
                '<div class="modal__content" style="max-width:800px;padding:0;overflow:hidden;">' +
                '<button class="modal__close" style="color:white;z-index:10;position:absolute;top:16px;right:16px;">&times;</button>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;min-height:500px;">' +
                '<div style="position:relative;"><img src="'+img.src+'" style="width:100%;height:100%;object-fit:cover;">' +
                '<div style="position:absolute;top:16px;left:16px;width:32px;height:32px;"><img src="'+LOGO_WHITE+'" style="width:100%;height:100%;object-fit:contain;opacity:0.6;"></div></div>' +
                '<div style="padding:48px;display:flex;flex-direction:column;justify-content:center;background:#F8F9F8;">' +
                '<h2 style="font-size:2rem;font-weight:700;letter-spacing:0.05em;margin-bottom:8px;">'+name.textContent+'</h2>' +
                '<p style="font-size:0.65rem;letter-spacing:0.15em;color:#797877;margin-bottom:24px;">'+role.textContent+'</p>' +
                '<p style="font-size:0.75rem;letter-spacing:0.1em;color:#4A4A4A;margin-bottom:8px;">'+cats.textContent+'</p>' +
                '<p style="font-size:0.75rem;letter-spacing:0.1em;color:#797877;margin-bottom:32px;">'+loc.textContent+'</p>' +
                '<a href="#contacto" style="display:inline-flex;align-items:center;gap:8px;font-size:0.7rem;font-weight:600;letter-spacing:0.15em;padding:14px 28px;background:#000;color:#F8F9F8;text-align:center;justify-content:center;">TRABAJAR CON '+name.textContent+' &rarr;</a>' +
                '</div></div></div>';

            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';

            function closeModal() {
                modal.classList.remove('active');
                setTimeout(function(){ modal.remove(); document.body.style.overflow=''; }, 400);
            }
            modal.querySelector('.modal__close').addEventListener('click', closeModal);
            modal.querySelector('.modal__overlay').addEventListener('click', closeModal);
        });

        // ─── SERVICE HOVER ───
        document.addEventListener('mousemove', function(e) {
            var item = e.target.closest('.services__item');
            if (!item) return;
            var img = item.querySelector('.services__hover-img');
            if (img) {
                var rect = item.getBoundingClientRect();
                img.style.left = (e.clientX - rect.left - 100) + 'px';
            }
        });
    }

    // ─── TETRA RE-INIT ───
    window.TetraInit = function() {
        // Re-check reveals
        $$('.hero__title-line').forEach(function(line, i) {
            setTimeout(function() {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, i * 200);
        });

        $$('[data-reveal]:not(.revealed)').forEach(function(el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.88) {
                setTimeout(function() { el.classList.add('revealed'); }, parseInt(el.dataset.delay) || 0);
            }
        });
    };

    // ─── BOOT ───
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
