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
    const images = document.querySelectorAll('.resource-card-image[style*="background-image"], .footer-logo-image, .logo-image');
    
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

/**
 * Maneja el fallback de imágenes cuando no se pueden cargar
 */
function initImageFallbacks() {
    // Manejar logo del header
    const logoImage = document.querySelector('.logo-image');
    const logoFallback = document.querySelector('.logo-text-fallback');
    
    if (logoImage && logoFallback) {
        logoImage.addEventListener('error', function() {
            console.warn('Error al cargar imagen del logo header:', this.src);
            this.style.display = 'none';
            logoFallback.style.display = 'flex';
        });
        
        logoImage.addEventListener('load', function() {
            console.log('Imagen del logo header cargada exitosamente');
            logoFallback.style.display = 'none';
        });
    }
    
    // Manejar logo del footer
    const footerLogoImage = document.querySelector('.footer-logo-image');
    const footerLogoFallback = document.querySelector('.footer-logo-fallback');
    
    if (footerLogoImage && footerLogoFallback) {
        footerLogoImage.addEventListener('error', function() {
            console.warn('Error al cargar imagen del logo footer:', this.src);
            this.style.display = 'none';
            footerLogoFallback.style.display = 'block';
        });
        
        footerLogoImage.addEventListener('load', function() {
            console.log('Imagen del logo footer cargada exitosamente');
            this.style.opacity = '1';
            footerLogoFallback.style.display = 'none';
        });
        
        // Inicializar con opacidad 0 para efecto fade-in
        footerLogoImage.style.opacity = '0';
        footerLogoImage.style.transition = 'opacity 0.3s ease';
    }
}

/**
 * Precarga las imágenes importantes
 */
function preloadImages() {
    const imagesToPreload = [
        'images/Ali_head.png',
        'images/logo-blanco.png',
        'images/cocrea.png',
        'images/versatil.png'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => console.log(`Imagen precargada: ${src}`);
        img.onerror = () => console.warn(`Error al precargar imagen: ${src}`);
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
    initImageFallbacks();
    preloadImages();
    
    // Agregar clase loaded al body para activar animaciones CSS
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Optimización de rendimiento: usar passive listeners
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
    
    console.log('🎨 Alico - Sistema de imágenes inicializado');
    console.log('📱 Detección de dispositivo:', window.innerWidth < 768 ? 'Móvil' : window.innerWidth < 1024 ? 'Tablet' : 'Desktop');
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
        
        // Reajustar imágenes si es necesario
        const logoImage = document.querySelector('.logo-image');
        const footerLogoImage = document.querySelector('.footer-logo-image');
        
        if (logoImage && logoImage.complete) {
            console.log('Reajustando imagen del logo tras resize');
        }
        
        if (footerLogoImage && footerLogoImage.complete) {
            console.log('Reajustando imagen del footer tras resize');
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
            .then(registration => console.log('🔧 SW registrado'))
            .catch(error => console.log('❌ SW no registrado'));
    });
}

/**
 * Detección de soporte de WebP para optimización de imágenes
 */
function supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * Optimización de carga de imágenes según la conexión
 */
function getConnectionQuality() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            return 'low';
        } else if (connection.effectiveType === '3g') {
            return 'medium';
        } else {
            return 'high';
        }
    }
    return 'high'; // Default para conexiones desconocidas
}

/**
 * Función para mostrar notificaciones del sistema
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' : 'linear-gradient(135deg, var(--verde-natura) 0%, var(--verde-natura-80) 100%)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        font-family: 'Work Sans', sans-serif;
        font-weight: 600;
        font-size: 14px;
        transform: translateX(400px);
        transition: all 0.3s ease;
        max-width: 300px;
        backdrop-filter: blur(10px);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-rounded" style="font-size: 20px;">${type === 'error' ? 'error' : 'check_circle'}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animar salida y remover
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
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
    
    /* Animaciones específicas para imágenes */
    .logo-image,
    .footer-logo-image {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .logo-image:hover,
    .footer-logo-image:hover {
        transform: scale(1.05);
    }
    
    /* Efecto de carga para imágenes */
    .image-loading {
        opacity: 0;
        transform: scale(0.9);
    }
    
    .image-loaded {
        opacity: 1;
        transform: scale(1);
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
        showNotification,
        supportsWebP: supportsWebP(),
        connectionQuality: getConnectionQuality(),
        version: '2.1.0'
    };
    
    console.log('🚀 Alico Debug Mode Activated');
    console.log('📦 Available functions:', Object.keys(window.debugAlico));
    console.log('🖼️ WebP Support:', supportsWebP());
    console.log('🌐 Connection Quality:', getConnectionQuality());
}

/* ==================================================
   MANEJO DE ERRORES GLOBALES
   ================================================== */
window.addEventListener('error', function(event) {
    if (event.target.tagName === 'IMG') {
        console.warn('Error cargando imagen:', event.target.src);
        // Aquí podrías implementar lógica adicional para manejar errores de imágenes
    }
});

// Manejo de errores de promesas no capturadas
window.addEventListener('unhandledrejection', function(event) {
    console.error('Promise rechazada:', event.reason);
    // Prevenir que aparezca en la consola del navegador
    event.preventDefault();
});
