/* ==================================================
   ALICO - SCRIPTS.JS MEJORADO
   Archivo JavaScript con mejoras según guía de marca
   ================================================== */

/* ==================================================
   FUNCIONES DE NAVEGACIÓN
   ================================================== */

/**
 * Alterna la visibilidad del menú móvil con animaciones mejoradas
 */
function toggleMenu() {
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (mobileNavMenu && menuToggle) {
        const isActive = mobileNavMenu.classList.contains('active');
        
        if (isActive) {
            // Cerrar menú
            mobileNavMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll del body
            
            // Animar elementos del menú
            const menuItems = document.querySelectorAll('.mobile-nav-item');
            menuItems.forEach((item, index) => {
                item.style.transitionDelay = `${index * 0.05}s`;
                item.style.transform = 'translateY(-20px)';
                item.style.opacity = '0';
            });
        } else {
            // Abrir menú
            mobileNavMenu.classList.add('active');
            menuToggle.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevenir scroll del body
            
            // Animar elementos del menú con delay
            setTimeout(() => {
                const menuItems = document.querySelectorAll('.mobile-nav-item');
                menuItems.forEach((item, index) => {
                    item.style.transitionDelay = `${index * 0.1}s`;
                    item.style.transform = 'translateY(0)';
                    item.style.opacity = '1';
                });
            }, 100);
        }
    }
}

/**
 * Funcionalidad mejorada para voltear las tarjetas del SGI
 * @param {HTMLElement} card - El elemento de la tarjeta a voltear
 */
function flipCard(card) {
    // Verificar si ya está volteada
    const isFlipped = card.classList.contains('flipped');
    
    // Agregar sonido de feedback (opcional)
    if (typeof Audio !== 'undefined') {
        // Aquí podrías agregar un sonido sutil
    }
    
    // Voltear la tarjeta
    card.classList.toggle('flipped');
    
    // Agregar efecto de vibración sutil en dispositivos móviles
    if (navigator.vibrate && !isFlipped) {
        navigator.vibrate(50);
    }
    
    // Animar tarjetas adyacentes sutilmente
    const allCards = document.querySelectorAll('.flip-card');
    const currentIndex = Array.from(allCards).indexOf(card);
    
    allCards.forEach((otherCard, index) => {
        if (index !== currentIndex && Math.abs(index - currentIndex) <= 1) {
            otherCard.style.transform = 'scale(0.98)';
            setTimeout(() => {
                otherCard.style.transform = '';
            }, 200);
        }
    });
}

/**
 * Desplaza la página hacia arriba con animación suave mejorada
 */
function scrollToTop() {
    const scrollDuration = 800;
    const scrollStep = -window.scrollY / (scrollDuration / 15);
    
    function scrollAnimation() {
        if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
            requestAnimationFrame(scrollAnimation);
        }
    }
    
    requestAnimationFrame(scrollAnimation);
}

/* ==================================================
   FUNCIONES DE UTILIDAD
   ================================================== */

/**
 * Inicializa las animaciones de scroll reveal
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos que deben animarse al hacer scroll
    const animatedElements = document.querySelectorAll('.flip-card, .resource-card, .methodology-card, .video-card');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

/**
 * Maneja los efectos de parallax suave
 */
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.banner-content');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

/**
 * Inicializa los tooltips para los iconos
 */
function initTooltips() {
    const iconElements = document.querySelectorAll('.material-symbols-rounded');
    
    iconElements.forEach(icon => {
        const parentLink = icon.closest('.nav-link, .mobile-nav-item');
        if (parentLink) {
            const text = parentLink.querySelector('span:not(.material-symbols-rounded)')?.textContent;
            if (text) {
                icon.setAttribute('title', text);
            }
        }
    });
}

/**
 * Maneja las animaciones de hover mejoradas
 */
function initHoverEffects() {
    // Efecto de ondas en los botones
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .header-banner-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Optimiza las imágenes lazy loading
 */
function initLazyLoading() {
    const images = document.querySelectorAll('.resource-card-image[style*="background-image"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

/* ==================================================
   EVENT LISTENERS MEJORADOS
   ================================================== */

/**
 * Mostrar/ocultar botón de volver arriba con animación suave
 */
window.addEventListener('scroll', function() {
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    // Llamar a parallax solo si no se prefiere movimiento reducido
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        requestAnimationFrame(handleParallax);
    }
});

/**
 * Cerrar menú móvil cuando se hace clic fuera de él
 */
document.addEventListener('click', function(event) {
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (mobileNavMenu && menuToggle) {
        if (!mobileNavMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            if (mobileNavMenu.classList.contains('active')) {
                toggleMenu();
            }
        }
    }
});

/**
 * Manejo de teclado para accesibilidad
 */
document.addEventListener('keydown', function(event) {
    // ESC para cerrar menú móvil
    if (event.key === 'Escape') {
        const mobileNavMenu = document.getElementById('mobileNavMenu');
        if (mobileNavMenu && mobileNavMenu.classList.contains('active')) {
            toggleMenu();
        }
    }
    
    // Enter y Espacio para flip cards
    if (event.key === 'Enter' || event.key === ' ') {
        if (event.target.classList.contains('flip-card')) {
            event.preventDefault();
            flipCard(event.target);
        }
    }
});

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
    // Prevenir comportamiento por defecto de enlaces con href="#"
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
    
    // Cerrar menú móvil al hacer clic en cualquier enlace del menú
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const mobileNavMenu = document.getElementById('mobileNavMenu');
            if (mobileNavMenu && mobileNavMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Inicializar funcionalidades
    initScrollReveal();
    initTooltips();
    initHoverEffects();
    initLazyLoading();
    
    // Agregar clase loaded al body para activar animaciones CSS
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Optimización de rendimiento: usar passive listeners
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
});

/**
 * Optimización del resize
 */
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Reajustar elementos si es necesario
        const mobileNavMenu = document.getElementById('mobileNavMenu');
        if (window.innerWidth > 1024 && mobileNavMenu.classList.contains('active')) {
            toggleMenu();
        }
    }, 250);
});

/**
 * Manejo del tema de color preferido del usuario
 */
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Aquí podrías agregar lógica para tema oscuro si lo implementas
    console.log('Usuario prefiere tema oscuro');
}

/**
 * Service Worker para PWA (opcional)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registrado'))
            .catch(error => console.log('SW no registrado'));
    });
}

/* ==================================================
   ANIMACIONES CSS ADICIONALES VIA JAVASCRIPT
   ================================================== */

// Agregar estilos de animación para el ripple effect
const rippleStyles = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .loaded .intro-card {
        animation: fadeInUp 0.8s ease-out;
    }
    
    .loaded .model-card {
        animation: fadeInUp 0.8s ease-out 0.2s both;
    }
    
    .loaded .methodology-card:nth-child(1) {
        animation: fadeInUp 0.8s ease-out 0.4s both;
    }
    
    .loaded .methodology-card:nth-child(2) {
        animation: fadeInUp 0.8s ease-out 0.6s both;
    }
`;

// Inyectar estilos si no existen
if (!document.getElementById('dynamic-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'dynamic-styles';
    styleSheet.textContent = rippleStyles;
    document.head.appendChild(styleSheet);
}

/* ==================================================
   FUNCIONES DE DEBUGGING (solo en desarrollo)
   ================================================== */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Funciones de debugging solo en desarrollo
    window.debugAlico = {
        toggleMenu,
        flipCard,
        scrollToTop,
        version: '2.0.0'
    };
    
    console.log('🚀 Alico Debug Mode Activated');
    console.log('📦 Available functions:', Object.keys(window.debugAlico));
}

// ==================================================
// FUNCIONES DE ACCESIBILIDAD
// ==================================================

// Variables globales para estados
let fontSizeLevel = 0; // -1: pequeño, 0: normal, 1: grande, 2: extra grande
let accessibilityStates = {
    highContrast: false,
    reducedAnimations: false,
    bigCursor: false,
    highlightLinks: false
};

/**
 * Alternar menú de accesibilidad
 */
function toggleAccessibilityMenu() {
    const menu = document.getElementById('accessibilityMenu');
    const isActive = menu.classList.contains('active');
    
    if (isActive) {
        closeAccessibilityMenu();
    } else {
        menu.classList.add('active');
        // Focus en el primer botón para accesibilidad
        setTimeout(() => {
            const firstButton = menu.querySelector('button');
            if (firstButton) firstButton.focus();
        }, 100);
    }
}

/**
 * Cerrar menú de accesibilidad
 */
function closeAccessibilityMenu() {
    const menu = document.getElementById('accessibilityMenu');
    menu.classList.remove('active');
}

/**
 * Cambiar tamaño de fuente
 */
function changeFontSize(action) {
    const body = document.body;
    
    // Remover clases existentes
    body.classList.remove('large-text', 'extra-large-text');
    
    switch(action) {
        case 'decrease':
            fontSizeLevel = Math.max(-1, fontSizeLevel - 1);
            break;
        case 'increase':
            fontSizeLevel = Math.min(2, fontSizeLevel + 1);
            break;
        case 'reset':
            fontSizeLevel = 0;
            break;
    }
    
    // Aplicar nueva clase
    if (fontSizeLevel === 1) {
        body.classList.add('large-text');
    } else if (fontSizeLevel >= 2) {
        body.classList.add('extra-large-text');
    }
    
    // Guardar preferencia
    localStorage.setItem('alico-font-size', fontSizeLevel);
    
    // Anunciar cambio para lectores de pantalla
    announceToScreenReader(`Tamaño de texto ${action === 'increase' ? 'aumentado' : action === 'decrease' ? 'reducido' : 'restablecido'}`);
}

/**
 * Alternar alto contraste
 */
function toggleHighContrast() {
    const body = document.body;
    const btn = document.getElementById('contrastBtn');
    
    accessibilityStates.highContrast = !accessibilityStates.highContrast;
    
    if (accessibilityStates.highContrast) {
        body.classList.add('high-contrast');
        btn.classList.add('active');
    } else {
        body.classList.remove('high-contrast');
        btn.classList.remove('active');
    }
    
    localStorage.setItem('alico-high-contrast', accessibilityStates.highContrast);
    announceToScreenReader(`Alto contraste ${accessibilityStates.highContrast ? 'activado' : 'desactivado'}`);
}

/**
 * Alternar animaciones
 */
function toggleAnimations() {
    const body = document.body;
    const btn = document.getElementById('animationsBtn');
    
    accessibilityStates.reducedAnimations = !accessibilityStates.reducedAnimations;
    
    if (accessibilityStates.reducedAnimations) {
        body.classList.add('no-animations');
        btn.classList.add('active');
    } else {
        body.classList.remove('no-animations');
        btn.classList.remove('active');
    }
    
    localStorage.setItem('alico-reduced-animations', accessibilityStates.reducedAnimations);
    announceToScreenReader(`Animaciones ${accessibilityStates.reducedAnimations ? 'reducidas' : 'habilitadas'}`);
}

/**
 * Alternar cursor grande
 */
function toggleBigCursor() {
    const body = document.body;
    const btn = document.getElementById('cursorBtn');
    
    accessibilityStates.bigCursor = !accessibilityStates.bigCursor;
    
    if (accessibilityStates.bigCursor) {
        body.classList.add('big-cursor');
        btn.classList.add('active');
    } else {
        body.classList.remove('big-cursor');
        btn.classList.remove('active');
    }
    
    localStorage.setItem('alico-big-cursor', accessibilityStates.bigCursor);
    announceToScreenReader(`Cursor grande ${accessibilityStates.bigCursor ? 'activado' : 'desactivado'}`);
}

/**
 * Alternar enlaces destacados
 */
function toggleHighlightLinks() {
    const body = document.body;
    const btn = document.getElementById('linksBtn');
    
    accessibilityStates.highlightLinks = !accessibilityStates.highlightLinks;
    
    if (accessibilityStates.highlightLinks) {
        body.classList.add('highlight-links');
        btn.classList.add('active');
    } else {
        body.classList.remove('highlight-links');
        btn.classList.remove('active');
    }
    
    localStorage.setItem('alico-highlight-links', accessibilityStates.highlightLinks);
    announceToScreenReader(`Enlaces ${accessibilityStates.highlightLinks ? 'destacados' : 'normales'}`);
}

/**
 * Restablecer todas las configuraciones
 */
function resetAccessibility() {
    const body = document.body;
    
    // Resetear clases
    body.classList.remove('high-contrast', 'large-text', 'extra-large-text', 'no-animations', 'big-cursor', 'highlight-links');
    
    // Resetear estados
    fontSizeLevel = 0;
    accessibilityStates = {
        highContrast: false,
        reducedAnimations: false,
        bigCursor: false,
        highlightLinks: false
    };
    
    // Resetear botones
    document.querySelectorAll('.accessibility-controls button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Limpiar localStorage
    localStorage.removeItem('alico-font-size');
    localStorage.removeItem('alico-high-contrast');
    localStorage.removeItem('alico-reduced-animations');
    localStorage.removeItem('alico-big-cursor');
    localStorage.removeItem('alico-highlight-links');
    
    announceToScreenReader('Configuración de accesibilidad restablecida');
}

/**
 * Anunciar a lectores de pantalla
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Cargar preferencias guardadas
 */
function loadAccessibilityPreferences() {
    // Cargar tamaño de fuente
    const savedFontSize = localStorage.getItem('alico-font-size');
    if (savedFontSize) {
        fontSizeLevel = parseInt(savedFontSize);
        if (fontSizeLevel === 1) {
            document.body.classList.add('large-text');
        } else if (fontSizeLevel >= 2) {
            document.body.classList.add('extra-large-text');
        }
    }
    
    // Cargar alto contraste
    if (localStorage.getItem('alico-high-contrast') === 'true') {
        accessibilityStates.highContrast = true;
        document.body.classList.add('high-contrast');
        document.getElementById('contrastBtn').classList.add('active');
    }
    
    // Cargar animaciones reducidas
    if (localStorage.getItem('alico-reduced-animations') === 'true') {
        accessibilityStates.reducedAnimations = true;
        document.body.classList.add('no-animations');
        document.getElementById('animationsBtn').classList.add('active');
    }
    
    // Cargar cursor grande
    if (localStorage.getItem('alico-big-cursor') === 'true') {
        accessibilityStates.bigCursor = true;
        document.body.classList.add('big-cursor');
        document.getElementById('cursorBtn').classList.add('active');
    }
    
    // Cargar enlaces destacados
    if (localStorage.getItem('alico-highlight-links') === 'true') {
        accessibilityStates.highlightLinks = true;
        document.body.classList.add('highlight-links');
        document.getElementById('linksBtn').classList.add('active');
    }
}

/**
 * Cerrar menú con tecla Escape
 */
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const menu = document.getElementById('accessibilityMenu');
        if (menu && menu.classList.contains('active')) {
            closeAccessibilityMenu();
        }
    }
});

/**
 * Cerrar menú al hacer clic fuera
 */
document.addEventListener('click', function(event) {
    const menu = document.getElementById('accessibilityMenu');
    const button = document.getElementById('accessibilityBtn');
    
    if (menu && button && 
        !menu.contains(event.target) && 
        !button.contains(event.target) &&
        menu.classList.contains('active')) {
        closeAccessibilityMenu();
    }
});

// Cargar preferencias al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Pequeño delay para asegurar que todos los elementos estén cargados
    setTimeout(loadAccessibilityPreferences, 100);
});
</script>
