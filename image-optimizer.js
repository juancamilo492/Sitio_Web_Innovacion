/* ==================================================
   ALICO - OPTIMIZADOR DE IMÁGENES
   Sistema avanzado de carga y optimización de imágenes
   ================================================== */

class AlicoImageOptimizer {
    constructor() {
        this.supportWebP = false;
        this.supportAvif = false;
        this.connectionSpeed = 'fast';
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.imageCache = new Map();
        this.lazyImages = new Set();
        
        this.init();
    }
    
    async init() {
        // Detectar soporte de formatos modernos
        await this.detectFormatSupport();
        
        // Detectar velocidad de conexión
        this.detectConnectionSpeed();
        
        // Configurar intersection observer
        this.setupLazyLoading();
        
        // Precargar imágenes críticas
        this.preloadCriticalImages();
        
        // Optimizar imágenes existentes
        this.optimizeExistingImages();
        
        console.log('🖼️ AlicoImageOptimizer inicializado', {
            webp: this.supportWebP,
            avif: this.supportAvif,
            connection: this.connectionSpeed,
            dpr: this.devicePixelRatio
        });
    }
    
    /* ==================================================
       DETECCIÓN DE CAPACIDADES
       ================================================== */
    
    async detectFormatSupport() {
        // Detectar WebP
        this.supportWebP = await this.canUseWebP();
        
        // Detectar AVIF
        this.supportAvif = await this.canUseAvif();
    }
    
    canUseWebP() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
    
    canUseAvif() {
        return new Promise(resolve => {
            const avif = new Image();
            avif.onload = avif.onerror = () => {
                resolve(avif.height === 2);
            };
            avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        });
    }
    
    detectConnectionSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const effectiveType = connection.effectiveType;
            
            switch (effectiveType) {
                case 'slow-2g':
                case '2g':
                    this.connectionSpeed = 'slow';
                    break;
                case '3g':
                    this.connectionSpeed = 'medium';
                    break;
                case '4g':
                default:
                    this.connectionSpeed = 'fast';
                    break;
            }
        }
        
        console.log(`🌐 Velocidad de conexión detectada: ${this.connectionSpeed}`);
    }
    
    /* ==================================================
       OPTIMIZACIÓN DE URLS DE IMÁGENES
       ================================================== */
    
    optimizeImageUrl(originalUrl, options = {}) {
        const {
            width = null,
            height = null,
            quality = null,
            format = 'auto'
        } = options;
        
        // Si la imagen ya está optimizada, usar cache
        const cacheKey = `${originalUrl}-${width}-${height}-${quality}-${format}`;
        if (this.imageCache.has(cacheKey)) {
            return this.imageCache.get(cacheKey);
        }
        
        let optimizedUrl = originalUrl;
        
        // Determinar el mejor formato
        const bestFormat = this.getBestFormat(format);
        
        // Generar URL optimizada (esto dependería de tu CDN o servicio de imágenes)
        if (this.shouldOptimize(originalUrl)) {
            optimizedUrl = this.generateOptimizedUrl(originalUrl, {
                width: this.getOptimalWidth(width),
                height: this.getOptimalHeight(height),
                quality: this.getOptimalQuality(quality),
                format: bestFormat
            });
        }
        
        // Guardar en cache
        this.imageCache.set(cacheKey, optimizedUrl);
        
        return optimizedUrl;
    }
    
    getBestFormat(preferredFormat) {
        if (preferredFormat === 'auto') {
            if (this.supportAvif) return 'avif';
            if (this.supportWebP) return 'webp';
            return 'jpg';
        }
        return preferredFormat;
    }
    
    shouldOptimize(url) {
        // Solo optimizar imágenes locales o de CDNs conocidos
        return url.startsWith('/') || 
               url.startsWith('./') || 
               url.includes('alico.com') ||
               !url.startsWith('http');
    }
    
    generateOptimizedUrl(originalUrl, options) {
        // Ejemplo de generación de URL optimizada
        // Esto se adaptaría a tu CDN específico (Cloudinary, ImageKit, etc.)
        
        const params = new URLSearchParams();
        
        if (options.width) params.set('w', options.width);
        if (options.height) params.set('h', options.height);
        if (options.quality) params.set('q', options.quality);
        if (options.format) params.set('f', options.format);
        
        // Para desarrollo, mantener URL original
        if (window.location.hostname === 'localhost') {
            return originalUrl;
        }
        
        // En producción, usar tu servicio de optimización
        return `${originalUrl}?${params.toString()}`;
    }
    
    getOptimalWidth(requestedWidth) {
        if (!requestedWidth) return null;
        
        // Ajustar según DPR y conexión
        let width = requestedWidth * this.devicePixelRatio;
        
        if (this.connectionSpeed === 'slow') {
            width = Math.min(width, requestedWidth * 1.5);
        }
        
        return Math.round(width);
    }
    
    getOptimalHeight(requestedHeight) {
        if (!requestedHeight) return null;
        return Math.round(requestedHeight * this.devicePixelRatio);
    }
    
    getOptimalQuality(requestedQuality) {
        if (requestedQuality) return requestedQuality;
        
        switch (this.connectionSpeed) {
            case 'slow': return 60;
            case 'medium': return 75;
            case 'fast': return 85;
            default: return 80;
        }
    }
    
    /* ==================================================
       LAZY LOADING AVANZADO
       ================================================== */
    
    setupLazyLoading() {
        const options = {
            root: null,
            rootMargin: this.connectionSpeed === 'slow' ? '10px' : '50px',
            threshold: 0.1
        };
        
        this.lazyObserver = new IntersectionObserver(
            this.handleLazyIntersection.bind(this),
            options
        );
        
        // Observar todas las imágenes lazy existentes
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
        lazyImages.forEach(img => {
            this.lazyImages.add(img);
            this.lazyObserver.observe(img);
        });
    }
    
    handleLazyIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                this.loadImage(img);
                this.lazyObserver.unobserve(img);
                this.lazyImages.delete(img);
            }
        });
    }
    
    async loadImage(img, options = {}) {
        const originalSrc = img.dataset.src || img.src;
        if (!originalSrc) return;
        
        // Encontrar skeleton loader
        const skeleton = this.findSkeleton(img);
        
        // Mostrar skeleton si existe
        if (skeleton) {
            skeleton.style.display = 'block';
        }
        
        try {
            // Optimizar URL
            const optimizedSrc = this.optimizeImageUrl(originalSrc, {
                width: img.width || options.width,
                height: img.height || options.height,
                quality: options.quality
            });
            
            // Precargar imagen
            await this.preloadSingleImage(optimizedSrc);
            
            // Aplicar imagen cargada
            img.src = optimizedSrc;
            img.classList.add('loaded');
            
            // Ocultar skeleton
            if (skeleton) {
                skeleton.style.opacity = '0';
                setTimeout(() => {
                    skeleton.style.display = 'none';
                }, 300);
            }
            
            console.log(`✅ Imagen cargada: ${originalSrc}`);
            
        } catch (error) {
            console.warn(`❌ Error cargando imagen: ${originalSrc}`, error);
            this.handleImageError(img, skeleton);
        }
    }
    
    preloadSingleImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    }
    
    findSkeleton(img) {
        // Buscar skeleton en hermanos anteriores
        let sibling = img.previousElementSibling;
        while (sibling) {
            if (sibling.classList.contains('image-skeleton')) {
                return sibling;
            }
            sibling = sibling.previousElementSibling;
        }
        return null;
    }
    
    handleImageError(img, skeleton) {
        if (skeleton) {
            skeleton.style.display = 'none';
        }
        
        // Mostrar fallback si existe
        const fallback = img.nextElementSibling;
        if (fallback && (
            fallback.classList.contains('logo-text-fallback') ||
            fallback.classList.contains('footer-logo-fallback') ||
            fallback.tagName === 'H3'
        )) {
            fallback.style.display = fallback.tagName === 'H3' ? 'block' : 'flex';
        }
        
        img.style.display = 'none';
    }
    
    /* ==================================================
       PRECARGA DE IMÁGENES CRÍTICAS
       ================================================== */
    
    preloadCriticalImages() {
        const criticalImages = [
            { src: 'images/Ali_head.png', priority: 'high' },
            { src: 'images/logo-blanco.png', priority: 'high' },
            { src: 'images/cocrea.png', priority: 'medium' },
            { src: 'images/versatil.png', priority: 'medium' }
        ];
        
        criticalImages.forEach(({ src, priority }) => {
            if (priority === 'high' || this.connectionSpeed !== 'slow') {
                this.preloadImage(src);
            }
        });
    }
    
    async preloadImage(src) {
        try {
            const optimizedSrc = this.optimizeImageUrl(src);
            await this.preloadSingleImage(optimizedSrc);
            console.log(`🚀 Imagen crítica precargada: ${src}`);
        } catch (error) {
            console.warn(`⚠️ Error precargando imagen crítica: ${src}`, error);
        }
    }
    
    /* ==================================================
       OPTIMIZACIÓN DE IMÁGENES EXISTENTES
       ================================================== */
    
    optimizeExistingImages() {
        const existingImages = document.querySelectorAll('img:not([data-optimized])');
        
        existingImages.forEach(img => {
            if (img.src && !img.classList.contains('loaded')) {
                // Marcar como procesada
                img.setAttribute('data-optimized', 'true');
                
                // Si no es lazy, optimizar inmediatamente
                if (img.loading !== 'lazy' && !img.dataset.src) {
                    const originalSrc = img.src;
                    const optimizedSrc = this.optimizeImageUrl(originalSrc);
                    
                    if (optimizedSrc !== originalSrc) {
                        img.src = optimizedSrc;
                    }
                }
            }
        });
    }
    
    /* ==================================================
       API PÚBLICA
       ================================================== */
    
    // Cargar imagen específica
    async loadSpecificImage(selector, options = {}) {
        const img = document.querySelector(selector);
        if (img) {
            await this.loadImage(img, options);
        }
    }
    
    // Precargar imagen específica
    async preloadSpecificImage(src, options = {}) {
        const optimizedSrc = this.optimizeImageUrl(src, options);
        await this.preloadSingleImage(optimizedSrc);
    }
    
    // Obtener estadísticas
    getStats() {
        return {
            supportWebP: this.supportWebP,
            supportAvif: this.supportAvif,
            connectionSpeed: this.connectionSpeed,
            devicePixelRatio: this.devicePixelRatio,
            cacheSize: this.imageCache.size,
            lazyImagesRemaining: this.lazyImages.size
        };
    }
    
    // Limpiar cache
    clearCache() {
        this.imageCache.clear();
        console.log('🧹 Cache de imágenes limpiado');
    }
    
    // Actualizar configuración dinámicamente
    updateConnectionSpeed(newSpeed) {
        this.connectionSpeed = newSpeed;
        console.log(`🔄 Velocidad de conexión actualizada: ${newSpeed}`);
    }
}

/* ==================================================
   INICIALIZACIÓN GLOBAL
   ================================================== */

// Instancia global
let alicoImageOptimizer;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        alicoImageOptimizer = new AlicoImageOptimizer();
    });
} else {
    alicoImageOptimizer = new AlicoImageOptimizer();
}

// Exportar para uso global
window.AlicoImageOptimizer = alicoImageOptimizer;

/* ==================================================
   UTILIDADES ADICIONALES
   ================================================== */

// Función helper para optimizar imágenes dinámicamente
window.optimizeImage = function(src, options = {}) {
    if (alicoImageOptimizer) {
        return alicoImageOptimizer.optimizeImageUrl(src, options);
    }
    return src;
};

// Función helper para precargar imágenes
window.preloadImage = function(src, options = {}) {
    if (alicoImageOptimizer) {
        return alicoImageOptimizer.preloadSpecificImage(src, options);
    }
    return Promise.resolve();
};

// Monitoreo de red para ajustar calidad dinámicamente
if ('connection' in navigator) {
    navigator.connection.addEventListener('change', () => {
        if (alicoImageOptimizer) {
            alicoImageOptimizer.detectConnectionSpeed();
            console.log('🔄 Conexión de red cambió, reajustando optimizaciones');
        }
    });
}

console.log('🎯 Sistema de optimización de imágenes Alico listo');
