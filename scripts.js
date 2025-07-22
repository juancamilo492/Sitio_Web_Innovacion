/* ==================================================
   ALICO - SCRIPTS.JS
   Archivo JavaScript compartido para todas las páginas
   ================================================== */

/* ==================================================
   FUNCIONES DE NAVEGACIÓN
   ================================================== */

/**
 * Alterna la visibilidad del menú móvil
 */
function toggleMenu() {
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    if (mobileNavMenu) {
        const isActive = mobileNavMenu.classList.contains('active');
        
        if (isActive) {
            // Cerrar menú
            mobileNavMenu.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll del body
        } else {
            // Abrir menú
            mobileNavMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevenir scroll del body mientras el menú está abierto
        }
    }
}

/**
 * Funcionalidad para voltear las tarjetas del SGI
 * @param {HTMLElement} card - El elemento de la tarjeta a voltear
 */
function flipCard(card) {
    card.classList.toggle('flipped');
}

/**
 * Desplaza la página hacia arriba suavemente
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/* ==================================================
   EVENT LISTENERS
   ================================================== */

/**
 * Mostrar/ocultar botón de volver arriba basado en el scroll
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
});

/**
 * Cerrar menú móvil cuando se hace clic fuera de él
 */
document.addEventListener('click', function(event) {
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (mobileNavMenu && menuToggle) {
        if (!mobileNavMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            mobileNavMenu.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll del body
        }
    }
});

/**
 * Cerrar menú móvil al hacer clic en una opción de navegación
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
            if (mobileNavMenu) {
                mobileNavMenu.classList.remove('active');
                document.body.style.overflow = ''; // Restaurar scroll del body
            }
        });
    });
});
