/* ==================================================
   ALICO - ACCESSIBILITY.JS
   Sistema completo de accesibilidad web
   ================================================== */

/* ==================================================
   VARIABLES GLOBALES Y CONFIGURACIÓN
   ================================================== */
let accessibilityState = {
    panelOpen: false, // EXPLÍCITAMENTE CERRADO
    fontSize: 100,
    highContrast: false,
    darkMode: false,
    reduceMotion: false,
    pauseAnimations: false,
    focusIndicator: false,
    skipLinks: false,
    textToSpeech: false,
    readingGuide: false
};

// Cargar configuración guardada al iniciar
document.addEventListener('DOMContentLoaded', function() {
    // Asegurar que el panel esté cerrado al iniciar
    const panel = document.getElementById('accessibilityPanel');
    const overlay = document.getElementById('accessibilityOverlay');
    const toggle = document.getElementById('accessibilityToggle');
    
    if (panel) {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
    if (toggle) {
        toggle.classList.remove('active');
    }
    
    // Cargar configuraciones guardadas DESPUÉS de asegurar que el panel esté cerrado
    loadAccessibilitySettings();
    initializeAccessibility();
    setupKeyboardShortcuts();
});

/* ==================================================
   FUNCIONES PRINCIPALES DEL PANEL
   ================================================== */

/**
 * Alternar la visibilidad del panel de accesibilidad
 */
function toggleAccessibilityPanel() {
    const panel = document.getElementById('accessibilityPanel');
    const overlay = document.getElementById('accessibilityOverlay');
    const toggle = document.getElementById('accessibilityToggle');
    
    if (!panel || !overlay || !toggle) return;
    
    accessibilityState.panelOpen = !accessibilityState.panelOpen;
    
    if (accessibilityState.panelOpen) {
        // Abrir panel
        panel.classList.add('active');
        overlay.classList.add('active');
        toggle.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
        
        // Enfocar el primer elemento del panel
        setTimeout(() => {
            const firstFocusable = panel.querySelector('button, input, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) firstFocusable.focus();
        }, 300);
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        // Anunciar apertura para lectores de pantalla
        announceToScreenReader('Panel de accesibilidad abierto');
        
    } else {
        // Cerrar panel
        panel.classList.remove('active');
        overlay.classList.remove('active');
        toggle.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        // Devolver foco al botón de toggle
        toggle.focus();
        
        // Anunciar cierre para lectores de pantalla
        announceToScreenReader('Panel de accesibilidad cerrado');
    }
}

/* ==================================================
   FUNCIONES DE AJUSTE DE FUENTE
   ================================================== */

/**
 * Ajustar el tamaño de fuente
 * @param {string} action - 'increase', 'decrease', o 'reset'
 */
function adjustFontSize(action) {
    const body = document.body;
    
    switch(action) {
        case 'increase':
            if (accessibilityState.fontSize < 160) {
                accessibilityState.fontSize += 20;
            }
            break;
        case 'decrease':
            if (accessibilityState.fontSize > 80) {
                accessibilityState.fontSize -= 20;
            }
            break;
        case 'reset':
            accessibilityState.fontSize = 100;
            break;
    }
    
    // Aplicar el nuevo tamaño
    if (accessibilityState.fontSize === 100) {
        body.classList.remove('font-size-large', 'font-size-extra-large');
        body.style.fontSize = '';
    } else if (accessibilityState.fontSize <= 120) {
        body.classList.remove('font-size-extra-large');
        body.classList.add('font-size-large');
        body.style.fontSize = accessibilityState.fontSize + '%';
    } else {
        body.classList.remove('font-size-large');
        body.classList.add('font-size-extra-large');
        body.style.fontSize = accessibilityState.fontSize + '%';
    }
    
    // Guardar configuración
    saveAccessibilitySettings();
    
    // Anunciar cambio
    announceToScreenReader(`Tamaño de fuente ajustado a ${accessibilityState.fontSize}%`);
}

/**
 * Resetear tamaño de fuente
 */
function resetFontSize() {
    adjustFontSize('reset');
}

/* ==================================================
   FUNCIONES DE CONTRASTE Y TEMA
   ================================================== */

/**
 * Alternar alto contraste
 */
function toggleHighContrast() {
    const checkbox = document.getElementById('highContrast');
    const body = document.body;
    
    accessibilityState.highContrast = checkbox.checked;
    
    if (accessibilityState.highContrast) {
        body.classList.add('high-contrast');
        announceToScreenReader('Alto contraste activado');
    } else {
        body.classList.remove('high-contrast');
        announceToScreenReader('Alto contraste desactivado');
    }
    
    saveAccessibilitySettings();
}

/**
 * Alternar modo oscuro
 */
function toggleDarkMode() {
    const checkbox = document.getElementById('darkMode');
    const body = document.body;
    
    accessibilityState.darkMode = checkbox.checked;
    
    if (accessibilityState.darkMode) {
        body.classList.add('dark-mode');
        announceToScreenReader('Modo oscuro activado');
    } else {
        body.classList.remove('dark-mode');
        announceToScreenReader('Modo oscuro desactivado');
    }
    
    saveAccessibilitySettings();
}

/* ==================================================
   FUNCIONES DE ANIMACIONES
   ================================================== */

/**
 * Alternar reducción de movimiento
 */
function toggleReduceMotion() {
    const checkbox = document.getElementById('reduceMotion');
    const body = document.body;
    
    accessibilityState.reduceMotion = checkbox.checked;
    
    if (accessibilityState.reduceMotion) {
        body.classList.add('reduce-motion');
        // También pausar animaciones CSS específicas
        disableSpecificAnimations();
        announceToScreenReader('Animaciones reducidas');
    } else {
        body.classList.remove('reduce-motion');
        enableSpecificAnimations();
        announceToScreenReader('Animaciones restauradas');
    }
    
    saveAccessibilitySettings();
    logAccessibilityUsage('reduce_motion', checkbox.checked ? 'enabled' : 'disabled');
}

/**
 * Alternar pausa de animaciones
 */
function togglePauseAnimations() {
    const checkbox = document.getElementById('pauseAnimations');
    const body = document.body;
    
    accessibilityState.pauseAnimations = checkbox.checked;
    
    if (accessibilityState.pauseAnimations) {
        body.classList.add('pause-animations');
        // Forzar eliminación de todas las animaciones
        forceDisableAllAnimations();
        announceToScreenReader('Todas las animaciones pausadas');
    } else {
        body.classList.remove('pause-animations');
        enableSpecificAnimations();
        announceToScreenReader('Animaciones reanudadas');
    }
    
    saveAccessibilitySettings();
    logAccessibilityUsage('pause_animations', checkbox.checked ? 'enabled' : 'disabled');
}

/**
 * Deshabilitar animaciones específicas
 */
function disableSpecificAnimations() {
    // Crear un estilo dinámico para deshabilitar animaciones
    let disableAnimationsStyle = document.getElementById('disable-animations-style');
    
    if (!disableAnimationsStyle) {
        disableAnimationsStyle = document.createElement('style');
        disableAnimationsStyle.id = 'disable-animations-style';
        document.head.appendChild(disableAnimationsStyle);
    }
    
    disableAnimationsStyle.textContent = `
        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            transform: none !important;
        }
        
        .reduce-motion .ali-character {
            animation: none !important;
        }
        
        .reduce-motion .flip-card:hover .flip-card-inner {
            transform: rotateY(0deg) !important;
        }
        
        .reduce-motion .nav-link:hover,
        .reduce-motion .btn-primary:hover,
        .reduce-motion .btn-secondary:hover,
        .reduce-motion .resource-card:hover,
        .reduce-motion .methodology-card:hover {
            transform: none !important;
        }
        
        .reduce-motion .intro-card::before {
            animation: none !important;
        }
    `;
}

/**
 * Forzar eliminación de todas las animaciones
 */
function forceDisableAllAnimations() {
    let pauseAnimationsStyle = document.getElementById('pause-animations-style');
    
    if (!pauseAnimationsStyle) {
        pauseAnimationsStyle = document.createElement('style');
        pauseAnimationsStyle.id = 'pause-animations-style';
        document.head.appendChild(pauseAnimationsStyle);
    }
    
    pauseAnimationsStyle.textContent = `
        .pause-animations *,
        .pause-animations *::before,
        .pause-animations *::after {
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        
        .pause-animations .flip-card-inner {
            transition: none !important;
        }
        
        .pause-animations .ali-character {
            animation: none !important;
        }
        
        .pause-animations .intro-card::before,
        .pause-animations [class*="shimmer"],
        .pause-animations [class*="float"] {
            animation: none !important;
        }
        
        .pause-animations .flip-card:hover .flip-card-inner {
            transform: rotateY(0deg) !important;
        }
    `;
}

/**
 * Habilitar animaciones específicas
 */
function enableSpecificAnimations() {
    // Remover estilos dinámicos de deshabilitación
    const disableStyle = document.getElementById('disable-animations-style');
    const pauseStyle = document.getElementById('pause-animations-style');
    
    if (disableStyle) {
        disableStyle.remove();
    }
    
    if (pauseStyle) {
        pauseStyle.remove();
    }
}

/* ==================================================
   FUNCIONES DE NAVEGACIÓN
   ================================================== */

/**
 * Alternar indicador de foco mejorado
 */
function toggleFocusIndicator() {
    const checkbox = document.getElementById('focusIndicator');
    const body = document.body;
    
    accessibilityState.focusIndicator = checkbox.checked;
    
    if (accessibilityState.focusIndicator) {
        body.classList.add('enhanced-focus');
        announceToScreenReader('Indicador de foco mejorado activado');
    } else {
        body.classList.remove('enhanced-focus');
        announceToScreenReader('Indicador de foco normal');
    }
    
    saveAccessibilitySettings();
}

/**
 * Alternar enlaces de salto
 */
function toggleSkipLinks() {
    const checkbox = document.getElementById('skipLinks');
    const skipLinksEl = document.getElementById('skipLinks');
    
    accessibilityState.skipLinks = checkbox.checked;
    
    if (accessibilityState.skipLinks) {
        skipLinksEl.classList.add('visible');
        announceToScreenReader('Enlaces de salto activados');
    } else {
        skipLinksEl.classList.remove('visible');
        announceToScreenReader('Enlaces de salto desactivados');
    }
    
    saveAccessibilitySettings();
}

/* ==================================================
   FUNCIONES DE LECTURA
   ================================================== */

/**
 * Alternar lectura de texto (Text-to-Speech)
 */
function toggleTextToSpeech() {
    const button = document.getElementById('ttsButton');
    
    accessibilityState.textToSpeech = !accessibilityState.textToSpeech;
    
    if (accessibilityState.textToSpeech) {
        button.classList.add('active');
        button.innerHTML = '<span class="material-symbols-rounded">volume_off</span>Desactivar lectura';
        initializeTextToSpeech();
        announceToScreenReader('Lectura de texto activada. Haz clic en cualquier texto para escucharlo');
    } else {
        button.classList.remove('active');
        button.innerHTML = '<span class="material-symbols-rounded">volume_up</span>Lectura de texto';
        disableTextToSpeech();
        announceToScreenReader('Lectura de texto desactivada');
    }
    
    saveAccessibilitySettings();
}

/**
 * Inicializar funcionalidad de Text-to-Speech
 */
function initializeTextToSpeech() {
    // Verificar soporte del navegador
    if (!('speechSynthesis' in window)) {
        console.warn('Text-to-Speech no soportado en este navegador');
        return;
    }
    
    // Agregar listeners a elementos de texto
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, label');
    
    textElements.forEach(element => {
        element.addEventListener('click', handleTextToSpeech);
        element.style.cursor = 'pointer';
        element.setAttribute('title', 'Clic para leer en voz alta');
    });
}

/**
 * Manejar la lectura de texto
 */
function handleTextToSpeech(event) {
    if (!accessibilityState.textToSpeech) return;
    
    event.preventDefault();
    
    const text = event.target.textContent.trim();
    if (!text) return;
    
    // Detener cualquier lectura anterior
    speechSynthesis.cancel();
    
    // Crear nueva utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    // Hablar el texto
    speechSynthesis.speak(utterance);
    
    // Resaltar el elemento que se está leyendo
    event.target.style.backgroundColor = 'rgba(219, 149, 0, 0.3)';
    
    utterance.onend = () => {
        event.target.style.backgroundColor = '';
    };
}

/**
 * Desactivar Text-to-Speech
 */
function disableTextToSpeech() {
    speechSynthesis.cancel();
    
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, label');
    
    textElements.forEach(element => {
        element.removeEventListener('click', handleTextToSpeech);
        element.style.cursor = '';
        element.removeAttribute('title');
    });
}

/**
 * Mostrar guía de lectura
 */
function showReadingGuide() {
    accessibilityState.readingGuide = !accessibilityState.readingGuide;
    
    if (accessibilityState.readingGuide) {
        createReadingGuide();
        announceToScreenReader('Guía de lectura activada');
    } else {
        removeReadingGuide();
        announceToScreenReader('Guía de lectura desactivada');
    }
}

/**
 * Crear guía de lectura visual
 */
function createReadingGuide() {
    const guide = document.createElement('div');
    guide.id = 'readingGuide';
    guide.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, var(--amarillo-oro) 0%, var(--amarillo-oro-80) 100%);
        z-index: 10000;
        pointer-events: none;
        transition: all 0.3s ease;
        box-shadow: 0 0 10px rgba(219, 149, 0, 0.5);
    `;
    
    document.body.appendChild(guide);
    
    // Seguir el mouse/cursor
    document.addEventListener('mousemove', updateReadingGuide);
    document.addEventListener('focusin', updateReadingGuideOnFocus);
}

/**
 * Actualizar posición de la guía de lectura
 */
function updateReadingGuide(event) {
    const guide = document.getElementById('readingGuide');
    if (guide) {
        guide.style.top = (event.clientY - 1) + 'px';
    }
}

/**
 * Actualizar guía de lectura en focus
 */
function updateReadingGuideOnFocus(event) {
    const guide = document.getElementById('readingGuide');
    if (guide && event.target) {
        const rect = event.target.getBoundingClientRect();
        guide.style.top = (rect.top - 1) + 'px';
    }
}

/**
 * Remover guía de lectura
 */
function removeReadingGuide() {
    const guide = document.getElementById('readingGuide');
    if (guide) {
        guide.remove();
    }
    
    document.removeEventListener('mousemove', updateReadingGuide);
    document.removeEventListener('focusin', updateReadingGuideOnFocus);
}

/* ==================================================
   FUNCIONES DE UTILIDADES
   ================================================== */

/**
 * Mostrar atajos de teclado
 */
function showKeyboardShortcuts() {
    const shortcuts = `
ATAJOS DE TECLADO DISPONIBLES:

Alt + A: Abrir/cerrar panel de accesibilidad
Alt + +: Aumentar tamaño de fuente
Alt + -: Disminuir tamaño de fuente
Alt + 0: Restaurar tamaño de fuente
Alt + C: Alternar alto contraste
Alt + D: Alternar modo oscuro
Alt + M: Reducir animaciones
Alt + F: Indicador de foco mejorado
Alt + S: Enlaces de salto
Alt + T: Lectura de texto
Esc: Cerrar panel de accesibilidad
Tab: Navegar entre elementos
Enter/Espacio: Activar elemento enfocado
    `;
    
    alert(shortcuts);
    announceToScreenReader('Atajos de teclado mostrados');
}

/**
 * Resetear todas las configuraciones
 */
function resetAllSettings() {
    // Crear un modal de confirmación personalizado más accesible
    const confirmReset = confirm('¿Estás seguro de que quieres restaurar todas las configuraciones de accesibilidad a sus valores predeterminados?');
    
    if (confirmReset) {
        // Resetear estado
        accessibilityState = {
            panelOpen: accessibilityState.panelOpen, // Mantener el panel abierto
            fontSize: 100,
            highContrast: false,
            darkMode: false,
            reduceMotion: false,
            pauseAnimations: false,
            focusIndicator: false,
            skipLinks: false,
            textToSpeech: false,
            readingGuide: false
        };
        
        // Limpiar clases del body
        const body = document.body;
        body.classList.remove(
            'font-size-large', 'font-size-extra-large',
            'high-contrast', 'dark-mode', 'reduce-motion',
            'pause-animations', 'enhanced-focus'
        );
        body.style.fontSize = '';
        
        // Resetear checkboxes
        document.querySelectorAll('.accessibility-panel input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        // Desactivar funcionalidades especiales
        disableTextToSpeech();
        removeReadingGuide();
        enableSpecificAnimations(); // Restaurar animaciones
        
        // Ocultar skip links
        const skipLinksEl = document.getElementById('skipLinks');
        if (skipLinksEl) skipLinksEl.classList.remove('visible');
        
        // Resetear botones
        const ttsButton = document.getElementById('ttsButton');
        if (ttsButton) {
            ttsButton.classList.remove('active');
            ttsButton.innerHTML = '<span class="material-symbols-rounded">volume_up</span>Lectura de texto';
        }
        
        // Limpiar localStorage
        localStorage.removeItem('alico-accessibility-settings');
        
        // Feedback visual temporal en el botón
        const resetButton = document.querySelector('.reset-button');
        if (resetButton) {
            const originalText = resetButton.innerHTML;
            resetButton.innerHTML = '<span class="material-symbols-rounded">check</span>¡Restaurado!';
            resetButton.style.background = 'linear-gradient(135deg, var(--verde-natura) 0%, var(--verde-natura-80) 100%)';
            
            setTimeout(() => {
                resetButton.innerHTML = originalText;
                resetButton.style.background = '';
            }, 2000);
        }
        
        announceToScreenReader('Todas las configuraciones de accesibilidad han sido restauradas a sus valores predeterminados');
        logAccessibilityUsage('reset_all', 'executed');
    }
}

/* ==================================================
   FUNCIONES DE PERSISTENCIA
   ================================================== */

/**
 * Guardar configuraciones en localStorage
 */
function saveAccessibilitySettings() {
    try {
        localStorage.setItem('alico-accessibility-settings', JSON.stringify(accessibilityState));
    } catch (error) {
        console.warn('No se pudieron guardar las configuraciones de accesibilidad:', error);
    }
}

/**
 * Cargar configuraciones desde localStorage
 */
function loadAccessibilitySettings() {
    try {
        const saved = localStorage.getItem('alico-accessibility-settings');
        if (saved) {
            const parsedSettings = JSON.parse(saved);
            // NO cargar el estado del panel (panelOpen), siempre empezar cerrado
            accessibilityState = { 
                ...accessibilityState, 
                ...parsedSettings, 
                panelOpen: false // Forzar panel cerrado
            };
            
            // Aplicar configuraciones cargadas
            applyLoadedSettings();
        }
    } catch (error) {
        console.warn('No se pudieron cargar las configuraciones de accesibilidad:', error);
    }
}

/**
 * Aplicar configuraciones cargadas
 */
function applyLoadedSettings() {
    const body = document.body;
    
    // Aplicar tamaño de fuente
    if (accessibilityState.fontSize !== 100) {
        if (accessibilityState.fontSize <= 120) {
            body.classList.add('font-size-large');
        } else {
            body.classList.add('font-size-extra-large');
        }
        body.style.fontSize = accessibilityState.fontSize + '%';
    }
    
    // Aplicar alto contraste
    if (accessibilityState.highContrast) {
        body.classList.add('high-contrast');
        const checkbox = document.getElementById('highContrast');
        if (checkbox) checkbox.checked = true;
    }
    
    // Aplicar modo oscuro
    if (accessibilityState.darkMode) {
        body.classList.add('dark-mode');
        const checkbox = document.getElementById('darkMode');
        if (checkbox) checkbox.checked = true;
    }
    
    // Aplicar reducción de movimiento
    if (accessibilityState.reduceMotion) {
        body.classList.add('reduce-motion');
        disableSpecificAnimations();
        const checkbox = document.getElementById('reduceMotion');
        if (checkbox) checkbox.checked = true;
    }
    
    // Aplicar pausa de animaciones
    if (accessibilityState.pauseAnimations) {
        body.classList.add('pause-animations');
        forceDisableAllAnimations();
        const checkbox = document.getElementById('pauseAnimations');
        if (checkbox) checkbox.checked = true;
    }
    
    // Aplicar indicador de foco
    if (accessibilityState.focusIndicator) {
        body.classList.add('enhanced-focus');
        const checkbox = document.getElementById('focusIndicator');
        if (checkbox) checkbox.checked = true;
    }
    
    // Aplicar skip links
    if (accessibilityState.skipLinks) {
        const skipLinksEl = document.getElementById('skipLinks');
        const checkbox = document.getElementById('skipLinks');
        if (skipLinksEl) skipLinksEl.classList.add('visible');
        if (checkbox) checkbox.checked = true;
    }
    
    // Aplicar text-to-speech
    if (accessibilityState.textToSpeech) {
        const button = document.getElementById('ttsButton');
        if (button) {
            button.classList.add('active');
            button.innerHTML = '<span class="material-symbols-rounded">volume_off</span>Desactivar lectura';
        }
        initializeTextToSpeech();
    }
    
    // Aplicar guía de lectura
    if (accessibilityState.readingGuide) {
        createReadingGuide();
    }
}

/* ==================================================
   FUNCIONES DE INICIALIZACIÓN
   ================================================== */

/**
 * Inicializar sistema de accesibilidad
 */
function initializeAccessibility() {
    // Configurar ARIA labels y roles
    setupAriaLabels();
    
    // Detectar preferencias del sistema
    detectSystemPreferences();
    
    // Configurar trap de foco para el panel
    setupFocusTrap();
    
    // Configurar anuncios para lectores de pantalla
    setupScreenReaderAnnouncements();
    
    console.log('🔧 Sistema de accesibilidad de Alico inicializado');
}

/**
 * Configurar ARIA labels
 */
function setupAriaLabels() {
    const panel = document.getElementById('accessibilityPanel');
    if (panel) {
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-labelledby', 'accessibility-title');
    }
}

/**
 * Detectar preferencias del sistema
 */
function detectSystemPreferences() {
    // Detectar preferencia de movimiento reducido
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        accessibilityState.reduceMotion = true;
        const checkbox = document.getElementById('reduceMotion');
        if (checkbox) checkbox.checked = true;
        document.body.classList.add('reduce-motion');
    }
    
    // Detectar preferencia de alto contraste
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
        accessibilityState.highContrast = true;
        const checkbox = document.getElementById('highContrast');
        if (checkbox) checkbox.checked = true;
        document.body.classList.add('high-contrast');
    }
    
    // Detectar preferencia de tema oscuro
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Solo aplicar si el usuario no ha configurado manualmente
        if (!localStorage.getItem('alico-accessibility-settings')) {
            accessibilityState.darkMode = true;
            const checkbox = document.getElementById('darkMode');
            if (checkbox) checkbox.checked = true;
            document.body.classList.add('dark-mode');
        }
    }
}

/**
 * Configurar trap de foco para el panel
 */
function setupFocusTrap() {
    const panel = document.getElementById('accessibilityPanel');
    if (!panel) return;
    
    panel.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            const focusableElements = panel.querySelectorAll(
                'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    });
}

/**
 * Configurar anuncios para lectores de pantalla
 */
function setupScreenReaderAnnouncements() {
    // Crear elemento para anuncios
    const announcer = document.createElement('div');
    announcer.id = 'accessibility-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(announcer);
}

/**
 * Anunciar mensaje a lectores de pantalla
 */
function announceToScreenReader(message) {
    const announcer = document.getElementById('accessibility-announcer');
    if (announcer) {
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }
}

/* ==================================================
   ATAJOS DE TECLADO
   ================================================== */

/**
 * Configurar atajos de teclado
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Solo ejecutar si Alt está presionado
        if (!event.altKey) return;
        
        switch(event.key) {
            case 'a':
            case 'A':
                event.preventDefault();
                toggleAccessibilityPanel();
                break;
            case '+':
            case '=':
                event.preventDefault();
                adjustFontSize('increase');
                break;
            case '-':
                event.preventDefault();
                adjustFontSize('decrease');
                break;
            case '0':
                event.preventDefault();
                resetFontSize();
                break;
            case 'c':
            case 'C':
                event.preventDefault();
                const contrastCheckbox = document.getElementById('highContrast');
                if (contrastCheckbox) {
                    contrastCheckbox.checked = !contrastCheckbox.checked;
                    toggleHighContrast();
                }
                break;
            case 'd':
            case 'D':
                event.preventDefault();
                const darkModeCheckbox = document.getElementById('darkMode');
                if (darkModeCheckbox) {
                    darkModeCheckbox.checked = !darkModeCheckbox.checked;
                    toggleDarkMode();
                }
                break;
            case 'm':
            case 'M':
                event.preventDefault();
                const motionCheckbox = document.getElementById('reduceMotion');
                if (motionCheckbox) {
                    motionCheckbox.checked = !motionCheckbox.checked;
                    toggleReduceMotion();
                }
                break;
            case 'f':
            case 'F':
                event.preventDefault();
                const focusCheckbox = document.getElementById('focusIndicator');
                if (focusCheckbox) {
                    focusCheckbox.checked = !focusCheckbox.checked;
                    toggleFocusIndicator();
                }
                break;
            case 's':
            case 'S':
                event.preventDefault();
                const skipCheckbox = document.getElementById('skipLinks');
                if (skipCheckbox) {
                    skipCheckbox.checked = !skipCheckbox.checked;
                    toggleSkipLinks();
                }
                break;
            case 't':
            case 'T':
                event.preventDefault();
                toggleTextToSpeech();
                break;
        }
    });
    
    // Cerrar panel con ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && accessibilityState.panelOpen) {
            toggleAccessibilityPanel();
        }
    });
}

/* ==================================================
   FUNCIONES DE RESPONSIVE Y ADAPTACIÓN
   ================================================== */

/**
 * Ajustar panel según el tamaño de pantalla
 */
function adjustPanelForScreenSize() {
    const panel = document.getElementById('accessibilityPanel');
    const toggle = document.getElementById('accessibilityToggle');
    
    if (!panel || !toggle) return;
    
    // Forzar que el panel esté cerrado en cualquier cambio de tamaño
    if (!accessibilityState.panelOpen) {
        panel.classList.remove('active');
        const overlay = document.getElementById('accessibilityOverlay');
        if (overlay) overlay.classList.remove('active');
        toggle.classList.remove('active');
    }
    
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 480) {
        // Móvil pequeño - panel más adaptado
        panel.style.width = 'calc(100vw - 16px)';
        panel.style.maxWidth = 'none';
        panel.style.left = 'auto';
        panel.style.right = accessibilityState.panelOpen ? 'var(--spacing-sm)' : '-100%';
    } else if (screenWidth <= 768) {
        // Móvil - panel adaptado
        panel.style.width = 'calc(100vw - 32px)';
        panel.style.maxWidth = '400px';
        panel.style.left = 'auto';
        panel.style.right = accessibilityState.panelOpen ? 'var(--spacing-md)' : '-100%';
    } else if (screenWidth <= 1023) {
        // Tablet - panel normal
        panel.style.width = '380px';
        panel.style.maxWidth = '380px';
        panel.style.left = 'auto';
        panel.style.right = accessibilityState.panelOpen ? 'var(--spacing-lg)' : '-400px';
    } else {
        // Desktop - panel original
        panel.style.width = '420px';
        panel.style.maxWidth = '420px';
        panel.style.left = 'auto';
        panel.style.right = accessibilityState.panelOpen ? 'var(--spacing-xl)' : '-450px';
    }
}

// Ajustar en resize
window.addEventListener('resize', adjustPanelForScreenSize);

/* ==================================================
   FUNCIONES DE MONITOREO Y ANALYTICS
   ================================================== */

/**
 * Registrar uso de funcionalidades de accesibilidad
 */
function logAccessibilityUsage(feature, action) {
    // Aquí podrías enviar datos a tu sistema de analytics
    console.log(`Accesibilidad: ${feature} - ${action}`);
    
    // Ejemplo de envío a Google Analytics (si está configurado)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'accessibility_feature_used', {
            feature: feature,
            action: action,
            timestamp: new Date().toISOString()
        });
    }
}

/* ==================================================
   FUNCIONES DE COMPATIBILIDAD
   ================================================== */

/**
 * Verificar compatibilidad del navegador
 */
function checkBrowserCompatibility() {
    const features = {
        localStorage: typeof Storage !== 'undefined',
        speechSynthesis: 'speechSynthesis' in window,
        matchMedia: typeof window.matchMedia !== 'undefined',
        requestAnimationFrame: typeof window.requestAnimationFrame !== 'undefined'
    };
    
    const unsupported = Object.keys(features).filter(key => !features[key]);
    
    if (unsupported.length > 0) {
        console.warn('Algunas funcionalidades de accesibilidad no están disponibles:', unsupported);
    }
    
    return features;
}

/* ==================================================
   INICIALIZACIÓN FINAL
   ================================================== */

// Verificar compatibilidad al cargar
document.addEventListener('DOMContentLoaded', function() {
    checkBrowserCompatibility();
    adjustPanelForScreenSize();
    
    // Mostrar mensaje de bienvenida si es la primera vez
    if (!localStorage.getItem('alico-accessibility-welcomed')) {
        setTimeout(() => {
            announceToScreenReader('Funcionalidades de accesibilidad disponibles. Presiona Alt + A para abrir el panel de opciones.');
            localStorage.setItem('alico-accessibility-welcomed', 'true');
        }, 2000);
    }
    
    console.log('✅ Sistema de accesibilidad Alico completamente inicializado');
});

/* ==================================================
   EXPORTAR FUNCIONES PARA DEBUGGING
   ================================================== */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.alicoAccessibility = {
        state: accessibilityState,
        togglePanel: toggleAccessibilityPanel,
        adjustFontSize: adjustFontSize,
        toggleHighContrast: toggleHighContrast,
        toggleDarkMode: toggleDarkMode,
        resetAll: resetAllSettings,
        announce: announceToScreenReader,
        version: '1.0.0'
    };
}
