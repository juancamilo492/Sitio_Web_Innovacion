/* ==================================================
   ALICO - ACCESSIBILITY SIMPLE.JS
   Sistema de accesibilidad simplificado y funcional
   ================================================== */

// Estado global simple
let isPanelOpen = false;

// Configuraciones de accesibilidad
let accessibilitySettings = {
    fontSize: 100,
    highContrast: false,
    darkMode: false,
    reduceMotion: false,
    pauseAnimations: false,
    focusIndicator: false,
    skipLinks: false,
    textToSpeech: false
};

/* ==================================================
   FUNCIÓN PRINCIPAL DE TOGGLE
   ================================================== */
function toggleAccessibilityPanel() {
    const panel = document.getElementById('accessibilityPanel');
    const overlay = document.getElementById('accessibilityOverlay');
    const toggle = document.getElementById('accessibilityToggle');
    
    if (!panel || !overlay || !toggle) {
        console.error('Elementos no encontrados');
        return;
    }
    
    isPanelOpen = !isPanelOpen;
    
    if (isPanelOpen) {
        // Abrir
        panel.classList.add('show');
        overlay.classList.add('show');
        toggle.classList.add('panel-open');
        panel.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus en el primer botón
        setTimeout(() => {
            const firstButton = panel.querySelector('button');
            if (firstButton) firstButton.focus();
        }, 300);
        
    } else {
        // Cerrar
        panel.classList.remove('show');
        overlay.classList.remove('show');
        toggle.classList.remove('panel-open');
        panel.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Volver focus al toggle
        toggle.focus();
    }
}

/* ==================================================
   FUNCIONES DE TAMAÑO DE FUENTE
   ================================================== */
function adjustFontSize(action) {
    const body = document.body;
    
    switch(action) {
        case 'increase':
            if (accessibilitySettings.fontSize < 160) {
                accessibilitySettings.fontSize += 20;
            }
            break;
        case 'decrease':
            if (accessibilitySettings.fontSize > 80) {
                accessibilitySettings.fontSize -= 20;
            }
            break;
        case 'reset':
            accessibilitySettings.fontSize = 100;
            break;
    }
    
    // Aplicar tamaño
    if (accessibilitySettings.fontSize === 100) {
        body.style.fontSize = '';
        body.classList.remove('font-large', 'font-extra-large');
    } else {
        body.style.fontSize = accessibilitySettings.fontSize + '%';
        if (accessibilitySettings.fontSize <= 120) {
            body.classList.add('font-large');
            body.classList.remove('font-extra-large');
        } else {
            body.classList.add('font-extra-large');
            body.classList.remove('font-large');
        }
    }
    
    saveSettings();
}

function resetFontSize() {
    adjustFontSize('reset');
}

/* ==================================================
   FUNCIONES DE TOGGLE
   ================================================== */
function toggleHighContrast() {
    const checkbox = document.getElementById('highContrast');
    const body = document.body;
    
    accessibilitySettings.highContrast = checkbox.checked;
    
    if (accessibilitySettings.highContrast) {
        body.classList.add('high-contrast');
    } else {
        body.classList.remove('high-contrast');
    }
    
    saveSettings();
}

function toggleDarkMode() {
    const checkbox = document.getElementById('darkMode');
    const body = document.body;
    
    accessibilitySettings.darkMode = checkbox.checked;
    
    if (accessibilitySettings.darkMode) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
    
    saveSettings();
}

function toggleReduceMotion() {
    const checkbox = document.getElementById('reduceMotion');
    const body = document.body;
    
    accessibilitySettings.reduceMotion = checkbox.checked;
    
    if (accessibilitySettings.reduceMotion) {
        body.classList.add('reduce-motion');
        // Crear estilo para deshabilitar animaciones
        createMotionStyle();
    } else {
        body.classList.remove('reduce-motion');
        removeMotionStyle();
    }
    
    saveSettings();
}

function togglePauseAnimations() {
    const checkbox = document.getElementById('pauseAnimations');
    const body = document.body;
    
    accessibilitySettings.pauseAnimations = checkbox.checked;
    
    if (accessibilitySettings.pauseAnimations) {
        body.classList.add('pause-animations');
        createPauseStyle();
    } else {
        body.classList.remove('pause-animations');
        removePauseStyle();
    }
    
    saveSettings();
}

function toggleFocusIndicator() {
    const checkbox = document.getElementById('focusIndicator');
    const body = document.body;
    
    accessibilitySettings.focusIndicator = checkbox.checked;
    
    if (accessibilitySettings.focusIndicator) {
        body.classList.add('enhanced-focus');
    } else {
        body.classList.remove('enhanced-focus');
    }
    
    saveSettings();
}

function toggleSkipLinks() {
    const checkbox = document.getElementById('skipLinks');
    const skipLinks = document.getElementById('skipLinks');
    
    accessibilitySettings.skipLinks = checkbox.checked;
    
    if (accessibilitySettings.skipLinks) {
        skipLinks.classList.add('visible');
    } else {
        skipLinks.classList.remove('visible');
    }
    
    saveSettings();
}

function toggleTextToSpeech() {
    const button = document.getElementById('ttsButton');
    
    accessibilitySettings.textToSpeech = !accessibilitySettings.textToSpeech;
    
    if (accessibilitySettings.textToSpeech) {
        button.classList.add('active');
        button.innerHTML = '<span class="material-symbols-rounded">volume_off</span>Desactivar lectura';
        enableTextToSpeech();
    } else {
        button.classList.remove('active');
        button.innerHTML = '<span class="material-symbols-rounded">volume_up</span>Lectura de texto';
        disableTextToSpeech();
    }
    
    saveSettings();
}

/* ==================================================
   FUNCIONES DE UTILIDAD
   ================================================== */
function createMotionStyle() {
    if (document.getElementById('reduce-motion-style')) return;
    
    const style = document.createElement('style');
    style.id = 'reduce-motion-style';
    style.textContent = `
        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
}

function removeMotionStyle() {
    const style = document.getElementById('reduce-motion-style');
    if (style) style.remove();
}

function createPauseStyle() {
    if (document.getElementById('pause-animations-style')) return;
    
    const style = document.createElement('style');
    style.id = 'pause-animations-style';
    style.textContent = `
        .pause-animations *,
        .pause-animations *::before,
        .pause-animations *::after {
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
}

function removePauseStyle() {
    const style = document.getElementById('pause-animations-style');
    if (style) style.remove();
}

function enableTextToSpeech() {
    if (!('speechSynthesis' in window)) {
        alert('Text-to-Speech no soportado en este navegador');
        return;
    }
    
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
    elements.forEach(el => {
        el.addEventListener('click', speakText);
        el.style.cursor = 'pointer';
        el.setAttribute('title', 'Clic para leer en voz alta');
    });
}

function disableTextToSpeech() {
    speechSynthesis.cancel();
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
    elements.forEach(el => {
        el.removeEventListener('click', speakText);
        el.style.cursor = '';
        el.removeAttribute('title');
    });
}

function speakText(event) {
    if (!accessibilitySettings.textToSpeech) return;
    
    event.preventDefault();
    const text = event.target.textContent.trim();
    if (!text) return;
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
    
    // Resaltar texto
    event.target.style.backgroundColor = 'rgba(219, 149, 0, 0.3)';
    utterance.onend = () => {
        event.target.style.backgroundColor = '';
    };
}

function showKeyboardShortcuts() {
    alert(`ATAJOS DE TECLADO:

Alt + A: Abrir/cerrar panel
Alt + +: Aumentar fuente
Alt + -: Disminuir fuente
Alt + 0: Restaurar fuente
Esc: Cerrar panel`);
}

function resetAllSettings() {
    if (!confirm('¿Restaurar todas las configuraciones?')) return;
    
    // Reset estado
    accessibilitySettings = {
        fontSize: 100,
        highContrast: false,
        darkMode: false,
        reduceMotion: false,
        pauseAnimations: false,
        focusIndicator: false,
        skipLinks: false,
        textToSpeech: false
    };
    
    // Reset DOM
    document.body.className = '';
    document.body.style.fontSize = '';
    
    // Reset checkboxes
    document.querySelectorAll('.accessibility-panel input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Reset funcionalidades
    disableTextToSpeech();
    removeMotionStyle();
    removePauseStyle();
    
    const skipLinks = document.getElementById('skipLinks');
    if (skipLinks) skipLinks.classList.remove('visible');
    
    const ttsButton = document.getElementById('ttsButton');
    if (ttsButton) {
        ttsButton.classList.remove('active');
        ttsButton.innerHTML = '<span class="material-symbols-rounded">volume_up</span>Lectura de texto';
    }
    
    // Clear storage
    localStorage.removeItem('alico-accessibility');
    
    // Feedback
    const resetBtn = document.querySelector('.reset-button');
    if (resetBtn) {
        const original = resetBtn.innerHTML;
        resetBtn.innerHTML = '<span class="material-symbols-rounded">check</span>¡Restaurado!';
        resetBtn.style.background = 'linear-gradient(135deg, #71B338 0%, #7FBB4C 100%)';
        setTimeout(() => {
            resetBtn.innerHTML = original;
            resetBtn.style.background = '';
        }, 2000);
    }
}

/* ==================================================
   PERSISTENCIA
   ================================================== */
function saveSettings() {
    try {
        localStorage.setItem('alico-accessibility', JSON.stringify(accessibilitySettings));
    } catch (e) {
        console.warn('No se pudo guardar configuración');
    }
}

function loadSettings() {
    try {
        const saved = localStorage.getItem('alico-accessibility');
        if (saved) {
            accessibilitySettings = { ...accessibilitySettings, ...JSON.parse(saved) };
            applySettings();
        }
    } catch (e) {
        console.warn('No se pudo cargar configuración');
    }
}

function applySettings() {
    const body = document.body;
    
    // Font size
    if (accessibilitySettings.fontSize !== 100) {
        body.style.fontSize = accessibilitySettings.fontSize + '%';
        if (accessibilitySettings.fontSize <= 120) {
            body.classList.add('font-large');
        } else {
            body.classList.add('font-extra-large');
        }
    }
    
    // High contrast
    if (accessibilitySettings.highContrast) {
        body.classList.add('high-contrast');
        const cb = document.getElementById('highContrast');
        if (cb) cb.checked = true;
    }
    
    // Dark mode
    if (accessibilitySettings.darkMode) {
        body.classList.add('dark-mode');
        const cb = document.getElementById('darkMode');
        if (cb) cb.checked = true;
    }
    
    // Motion
    if (accessibilitySettings.reduceMotion) {
        body.classList.add('reduce-motion');
        createMotionStyle();
        const cb = document.getElementById('reduceMotion');
        if (cb) cb.checked = true;
    }
    
    if (accessibilitySettings.pauseAnimations) {
        body.classList.add('pause-animations');
        createPauseStyle();
        const cb = document.getElementById('pauseAnimations');
        if (cb) cb.checked = true;
    }
    
    // Focus
    if (accessibilitySettings.focusIndicator) {
        body.classList.add('enhanced-focus');
        const cb = document.getElementById('focusIndicator');
        if (cb) cb.checked = true;
    }
    
    // Skip links
    if (accessibilitySettings.skipLinks) {
        const skipLinks = document.getElementById('skipLinks');
        const cb = document.getElementById('skipLinks');
        if (skipLinks) skipLinks.classList.add('visible');
        if (cb) cb.checked = true;
    }
    
    // TTS
    if (accessibilitySettings.textToSpeech) {
        const btn = document.getElementById('ttsButton');
        if (btn) {
            btn.classList.add('active');
            btn.innerHTML = '<span class="material-symbols-rounded">volume_off</span>Desactivar lectura';
        }
        enableTextToSpeech();
    }
}

/* ==================================================
   ATAJOS DE TECLADO
   ================================================== */
document.addEventListener('keydown', function(e) {
    if (e.altKey) {
        switch(e.key.toLowerCase()) {
            case 'a':
                e.preventDefault();
                toggleAccessibilityPanel();
                break;
            case '+':
            case '=':
                e.preventDefault();
                adjustFontSize('increase');
                break;
            case '-':
                e.preventDefault();
                adjustFontSize('decrease');
                break;
            case '0':
                e.preventDefault();
                resetFontSize();
                break;
        }
    }
    
    if (e.key === 'Escape' && isPanelOpen) {
        toggleAccessibilityPanel();
    }
});

/* ==================================================
   INICIALIZACIÓN
   ================================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Asegurar que el panel esté cerrado
    const panel = document.getElementById('accessibilityPanel');
    const overlay = document.getElementById('accessibilityOverlay');
    const toggle = document.getElementById('accessibilityToggle');
    
    if (panel) {
        panel.classList.remove('show');
        panel.setAttribute('aria-hidden', 'true');
    }
    if (overlay) {
        overlay.classList.remove('show');
    }
    if (toggle) {
        toggle.classList.remove('panel-open');
    }
    
    isPanelOpen = false;
    
    // Cargar configuraciones
    loadSettings();
    
    console.log('Sistema de accesibilidad simplificado inicializado');
});
