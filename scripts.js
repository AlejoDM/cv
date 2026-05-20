/* ============================================================
   SCRIPTS.JS — Portafolio de Alejo De Miguel
   Manejo centralizado de navegación, menú hamburguesa,
   scroll suave, animaciones de entrada y pantalla de carga.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* ----------------------------------------------------------
       0. SELECCIÓN DE TEMA (CLARO / OSCURO)
       Manejo de la alternancia de tema, iconos y persistencia.
    ---------------------------------------------------------- */
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeMeta = document.getElementById("theme-meta");

    function updateThemeUI(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector("i");
        if (icon) {
            if (theme === "light") {
                icon.className = "fa-solid fa-sun";
            } else {
                icon.className = "fa-solid fa-moon";
            }
        }
    }

    // Inicializar el estado del botón según el tema actual (ya aplicado en head)
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    updateThemeUI(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function () {
            const theme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
            
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
            
            updateThemeUI(theme);
            
            if (themeMeta) {
                themeMeta.setAttribute("content", theme === "dark" ? "#0a0a0f" : "#f5f7fb");
            }

            // Notificar al Canvas que el tema cambió
            const event = new CustomEvent("themeChanged", { detail: { theme: theme } });
            document.dispatchEvent(event);
        });
    }

    /* ----------------------------------------------------------
       1. PANTALLA DE CARGA
       Oculta la pantalla de carga una vez que todo el contenido
       (incluyendo imágenes) haya terminado de cargar.
    ---------------------------------------------------------- */
    const loadingScreen = document.getElementById("loading-screen");

    window.addEventListener("load", function () {
        setTimeout(function () {
            loadingScreen.classList.add("loaded");
        }, 300);
    });

    /* ----------------------------------------------------------
       2. MENÚ HAMBURGUESA (MÓVIL)
       Toggle del menú en pantallas pequeñas con animación.
       Cierra el menú al hacer click en un enlace.
    ---------------------------------------------------------- */
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    hamburgerBtn.addEventListener("click", function () {
        const isOpen = navMenu.classList.toggle("open");
        hamburgerBtn.classList.toggle("active");
        hamburgerBtn.setAttribute("aria-expanded", isOpen);
    });

    // Cerrar menú al hacer click en un enlace de navegación
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            navMenu.classList.remove("open");
            hamburgerBtn.classList.remove("active");
            hamburgerBtn.setAttribute("aria-expanded", "false");
        });
    });

    /* ----------------------------------------------------------
       3. SCROLL SUAVE
       Al hacer click en los enlaces del nav, realiza un scroll
       suave hasta la sección correspondiente, compensando
       la altura del header sticky.
    ---------------------------------------------------------- */
    navLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const headerHeight = document.getElementById("site-header").offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    /* ----------------------------------------------------------
       4. NAVEGACIÓN ACTIVA CON INTERSECTION OBSERVER
       Resalta automáticamente el enlace del nav correspondiente
       a la sección visible en pantalla durante el scroll.
    ---------------------------------------------------------- */
    const sections = document.querySelectorAll(".section");

    const navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Quitar clase activa de todos los links
                navLinks.forEach(function (link) {
                    link.classList.remove("active");
                });

                // Agregar clase activa al link correspondiente
                const activeLink = document.querySelector(
                    '.nav-link[data-section="' + entry.target.id + '"]'
                );
                if (activeLink) {
                    activeLink.classList.add("active");
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: "-70px 0px -30% 0px"
    });

    sections.forEach(function (section) {
        navObserver.observe(section);
    });

    /* ----------------------------------------------------------
       5. ANIMACIONES DE ENTRADA AL SCROLL
       Utiliza IntersectionObserver para activar animaciones
       de fade-in y slide-up cuando los elementos entran
       al viewport del usuario.
    ---------------------------------------------------------- */
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    const scrollAnimationObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                // Dejar de observar una vez animado para mejorar performance
                scrollAnimationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach(function (el) {
        scrollAnimationObserver.observe(el);
    });

    /* ----------------------------------------------------------
       6. HEADER COMPACTO AL HACER SCROLL
       Reduce el padding del header cuando el usuario
       hace scroll hacia abajo para dar más espacio al contenido.
    ---------------------------------------------------------- */
    const header = document.getElementById("site-header");
    let lastScroll = 0;

    window.addEventListener("scroll", function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        lastScroll = currentScroll;
    });
});

/* ============================================================
   7. FONDO TECNOLÓGICO ANIMADO (Canvas)
   Dibuja una grilla sutil con nodos en las intersecciones
   y partículas que viajan por las líneas, estilo circuito.
   ============================================================ */
(function () {
    var canvas = document.getElementById("tech-bg");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    var gridSize = 60;
    var nodes = [];
    var particles = [];
    var maxParticles = 28;

    // Colores del tema (se inicializan leyendo de las variables CSS)
    var accentColor = "108, 99, 255";
    var secondaryColor = "0, 212, 170";
    var gridLineOpacity = 0.12;

    function updateColors() {
        var style = getComputedStyle(document.documentElement);
        var accent = style.getPropertyValue('--color-accent-rgb');
        var secondary = style.getPropertyValue('--color-secondary-rgb');
        var opacity = style.getPropertyValue('--grid-line-opacity');
        
        if (accent) accentColor = accent.trim();
        if (secondary) secondaryColor = secondary.trim();
        if (opacity) gridLineOpacity = parseFloat(opacity.trim());
    }

    // Escuchar el evento de cambio de tema
    document.addEventListener("themeChanged", function () {
        updateColors();
        
        // Actualizar partículas existentes con los nuevos colores de tema
        particles.forEach(function (p) {
            var useAccent = Math.random() > 0.5;
            p.color = useAccent ? accentColor : secondaryColor;
        });
    });

    // Inicializar colores al cargar
    updateColors();

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initNodes();
    }

    // Crear nodos en las intersecciones de la grilla
    function initNodes() {
        nodes = [];
        var cols = Math.ceil(canvas.width / gridSize) + 1;
        var rows = Math.ceil(canvas.height / gridSize) + 1;

        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                nodes.push({
                    x: c * gridSize,
                    y: r * gridSize,
                    pulse: Math.random() * Math.PI * 2,
                    speed: 0.005 + Math.random() * 0.01
                });
            }
        }
    }

    // Crear una partícula que viaja por las líneas de la grilla
    function spawnParticle() {
        if (particles.length >= maxParticles) return;

        var startNode = nodes[Math.floor(Math.random() * nodes.length)];
        // Elegir dirección: 0=derecha, 1=abajo, 2=izquierda, 3=arriba
        var dir = Math.floor(Math.random() * 4);
        var dx = [1, 0, -1, 0][dir];
        var dy = [0, 1, 0, -1][dir];
        var useAccent = Math.random() > 0.5;

        particles.push({
            x: startNode.x,
            y: startNode.y,
            dx: dx,
            dy: dy,
            progress: 0,
            color: useAccent ? accentColor : secondaryColor,
            life: 1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar líneas de la grilla
        ctx.strokeStyle = "rgba(" + accentColor + ", " + gridLineOpacity + ")";
        ctx.lineWidth = 0.5;

        // Líneas verticales
        for (var x = 0; x <= canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        // Líneas horizontales
        for (var y = 0; y <= canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Dibujar nodos pulsantes en las intersecciones
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            node.pulse += node.speed;
            var glow = (gridLineOpacity * 0.66) + Math.sin(node.pulse) * (gridLineOpacity * 0.58);

            ctx.beginPath();
            ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(" + accentColor + ", " + glow + ")";
            ctx.fill();
        }

        // Dibujar y actualizar partículas viajeras
        for (var j = particles.length - 1; j >= 0; j--) {
            var p = particles[j];
            p.progress += 0.8;

            var px = p.x + p.dx * p.progress;
            var py = p.y + p.dy * p.progress;

            // Trail de la partícula
            var trailLen = 20;
            var gradient = ctx.createLinearGradient(
                px - p.dx * trailLen, py - p.dy * trailLen,
                px, py
            );
            gradient.addColorStop(0, "rgba(" + p.color + ", 0)");
            gradient.addColorStop(1, "rgba(" + p.color + ", 0.35)");

            ctx.beginPath();
            ctx.moveTo(px - p.dx * trailLen, py - p.dy * trailLen);
            ctx.lineTo(px, py);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Punto brillante en la cabeza
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(" + p.color + ", 0.6)";
            ctx.fill();

            // Eliminar cuando sale de la celda
            if (p.progress >= gridSize) {
                p.life -= 0.3;
                if (p.life <= 0 || px < -20 || px > canvas.width + 20 || py < -20 || py > canvas.height + 20) {
                    particles.splice(j, 1);
                }
            }
        }

        // Generar nuevas partículas ocasionalmente
        if (Math.random() < 0.05) {
            spawnParticle();
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();
})();
