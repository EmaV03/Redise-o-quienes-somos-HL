/**
 * INTERACCIONES «QUIÉNES SOMOS» — CASA HOMO LUDENS
 * Incluye:
 * 1. Animaciones de Scroll Bidireccionales (se activan al bajar y al volver a subir).
 * 2. Títulos Cinéticos (división en palabras interactivas).
 * 3. Parallax de Fondo (#hl-interactive-bg) con respuesta a mouse y scroll.
 * 4. Lanzador de Dado Lúdico con datos reales de Sandra y Natàlia.
 * 5. Selector de Juegos Favoridos + Inclinación 3D en tarjetas.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const root = document.getElementById('hl-about-root');
        if (!root) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // =====================================================================
        // 1. TÍTULOS CINÉTICOS (Efecto interactivo palabra por palabra)
        // =====================================================================
        const kineticTitles = root.querySelectorAll('.hl-ab-kinetic-title');
        kineticTitles.forEach(function (titleEl) {
            const rawText = titleEl.textContent.trim();
            const words = rawText.split(/\s+/);
            titleEl.innerHTML = words.map(function (word) {
                return '<span class="hl-ab-word">' + word + '</span>';
            }).join(' ');
        });

        // =====================================================================
        // 2. ANIMACIONES DE SCROLL REVERSIBLES (CADA VEZ QUE SUBÍS O BAJÁS)
        // =====================================================================
        const scrollAnimElements = root.querySelectorAll('.hl-ab-scroll-anim');

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            scrollAnimElements.forEach(function (el) {
                el.classList.add('is-inview');
            });
        } else {
            const reversibleObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        // Entra en el viewport (bajando o subiendo) -> anima
                        entry.target.classList.add('is-inview');
                    } else {
                        // Sale del viewport (hacia arriba o hacia abajo) -> se reinicia
                        // para volver a animarse cada vez que el usuario vuelva a subir o bajar
                        entry.target.classList.remove('is-inview');
                    }
                });
            }, {
                root: null,
                threshold: 0.12,
                rootMargin: '-20px 0px -20px 0px'
            });

            scrollAnimElements.forEach(function (el) {
                reversibleObserver.observe(el);
            });
        }

        // =====================================================================
        // 3. PARALLAX INTERACTIVO EN EL BACKGROUND (#hl-interactive-bg)
        // =====================================================================
        const parallaxItems = root.querySelectorAll('#hl-interactive-bg .hl-parallax-item');
        let mouseX = 0;
        let mouseY = 0;
        let scrollY = window.scrollY || window.pageYOffset;
        let ticking = false;

        function updateBackgroundParallax() {
            if (prefersReducedMotion) return;
            parallaxItems.forEach(function (item) {
                const mouseSpeed = parseFloat(item.getAttribute('data-speed') || '0.04');
                const scrollSpeed = parseFloat(item.getAttribute('data-scroll-speed') || '0.1');
                const moveX = mouseX * mouseSpeed;
                const moveY = (mouseY * mouseSpeed) + (scrollY * scrollSpeed);
                item.style.transform = 'translate3d(' + moveX.toFixed(1) + 'px, ' + moveY.toFixed(1) + 'px, 0)';
            });
            ticking = false;
        }

        function requestParallaxUpdate() {
            if (!ticking && !prefersReducedMotion) {
                window.requestAnimationFrame(updateBackgroundParallax);
                ticking = true;
            }
        }

        window.addEventListener('mousemove', function (e) {
            mouseX = (e.clientX - window.innerWidth / 2);
            mouseY = (e.clientY - window.innerHeight / 2);
            requestParallaxUpdate();
        }, { passive: true });

        window.addEventListener('scroll', function () {
            scrollY = window.scrollY || window.pageYOffset;
            requestParallaxUpdate();
        }, { passive: true });

        // =====================================================================
        // 4. DADO INTERACTIVO DE HISTORIA REAL (Basado en el PDF)
        // =====================================================================
        const diceBtn = root.querySelector('#hl-ab-roll-btn');
        const diceCube = root.querySelector('#hl-ab-dice-icon');
        const diceOutput = root.querySelector('#hl-ab-dice-output');

        const realFacts = [
            '🎲 <strong>Tirada 1 (Infancia):</strong> Sandra conserva hasta hoy los juegos de mesa que su familia le regalaba desde niña.',
            '🗝️ <strong>Tirada 2 (Barcelona 2015):</strong> En 2015 en Barcelona, Sandra jugó por primera vez a un escape en vivo y descubrió la propuesta ideal para adultos.',
            '🌍 <strong>Tirada 3 (De Barcelona a Bahía):</strong> Natàlia es originaria de Barcelona y reside en Bahía Blanca desde el año 2010.',
            '🏆 <strong>Tirada 4 (Los 3 Favoritos):</strong> Los juegos de mesa preferidos de Natàlia son Carcassonne, Istambul y Azul.',
            '🎓 <strong>Tirada 5 (Formación Lúdica):</strong> Sandra es Técnica Nacional en Recreación y Máster en Gamificación y Narrativa Transmedia.',
            '🧩 <strong>Tirada 6 (Mirada Pedagógica):</strong> Natàlia es Maestra de Educación Infantil con posgrado en Educación Socioconstructivista.'
        ];
        let lastFactIndex = -1;

        if (diceBtn && diceCube && diceOutput) {
            diceBtn.addEventListener('click', function () {
                diceCube.classList.add('is-rolling');

                let nextIndex;
                do {
                    nextIndex = Math.floor(Math.random() * realFacts.length);
                } while (nextIndex === lastFactIndex && realFacts.length > 1);
                lastFactIndex = nextIndex;

                setTimeout(function () {
                    diceOutput.innerHTML = realFacts[nextIndex];
                    diceCube.classList.remove('is-rolling');
                }, 260);
            });
        }

        // =====================================================================
        // 5. SELECTOR DE JUEGOS PREFERIDOS DE NATÀLIA
        // =====================================================================
        const gameDescriptions = {
            carcassonne: '<strong>Carcassonne:</strong> Uno de los tres juegos de mesa preferidos de Natàlia, ideal para compartir en familia y explicar a nuevos jugadores.',
            istambul: '<strong>Istambul:</strong> Elegido por Natàlia entre sus tres favoritos; una experiencia estratégica que le encanta aprender, jugar y enseñar.',
            azul: '<strong>Azul:</strong> Parte del trío de favoritos de Natàlia (junto a Carcassonne e Istambul), perfecto para disfrutar un gran rato con los que más quieres.'
        };

        const gameTabs = root.querySelectorAll('.hl-ab-game-tab');
        const detailPanel = root.querySelector('#hl-ab-game-detail');

        if (gameTabs.length > 0 && detailPanel) {
            gameTabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    const gameKey = tab.getAttribute('data-game');

                    gameTabs.forEach(function (t) {
                        t.classList.remove('is-active');
                        t.setAttribute('aria-selected', 'false');
                    });

                    tab.classList.add('is-active');
                    tab.setAttribute('aria-selected', 'true');

                    if (gameDescriptions[gameKey]) {
                        detailPanel.style.transform = 'scale(0.98)';
                        setTimeout(function () {
                            detailPanel.innerHTML = gameDescriptions[gameKey];
                            detailPanel.style.transform = 'scale(1)';
                        }, 120);
                    }
                });
            });
        }

        // =====================================================================
        // 6. INSIGNIAS DE FORMACIÓN CON REBOTE INTERACTIVO
        // =====================================================================
        const credChips = root.querySelectorAll('.hl-ab-cred-chip');
        credChips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                chip.classList.toggle('is-popped');
            });
            chip.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    chip.classList.toggle('is-popped');
                }
            });
        });

        // =====================================================================
        // 7. EFECTO TILT 3D SUAVE EN TARJETAS (.hl-ab-tilt-card)
        // =====================================================================
        if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
            const tiltCards = root.querySelectorAll('.hl-ab-tilt-card');
            tiltCards.forEach(function (card) {
                card.addEventListener('mousemove', function (e) {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -3.5;
                    const rotateY = ((x - centerX) / centerX) * 3.5;

                    card.style.transform = 'perspective(900px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-3px)';
                });

                card.addEventListener('mouseleave', function () {
                    card.style.transform = '';
                });
            });
        }

        // =====================================================================
        // 8. NAVEGACIÓN SUAVE INTERNA
        // =====================================================================
        const internalLinks = root.querySelectorAll('a[href^="#perfil-"]');
        internalLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                const targetId = link.getAttribute('href');
                const targetEl = root.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({
                        behavior: prefersReducedMotion ? 'auto' : 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    });
})();
