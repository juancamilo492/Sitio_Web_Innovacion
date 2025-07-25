/* ==================================================
   ALICO - SERVICE WORKER OPTIMIZADO
   Cache inteligente para imágenes e iconos
   ================================================== */

const CACHE_NAME = 'alico-v1.2';
const STATIC_CACHE = 'alico-static-v1.2';
const IMAGE_CACHE = 'alico-images-v1.2';
const FONT_CACHE = 'alico-fonts-v1.2';

// Recursos críticos para precache
const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/styles.css',
    '/scripts.js',
    '/images/Ali_head.png',
    '/images/logo-blanco.png',
    '/images/cocrea.png',
    '/images/versatil.png'
];

// Recursos de fuentes
const FONT_RESOURCES = [
    'https://fonts.googleapis.com/css2?family=Zilla+Slab:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap'
];

/* ==================================================
   INSTALACIÓN DEL SERVICE WORKER
   ================================================== */
self.addEventListener('install', event => {
    console.log('🔧 SW: Instalando...');
    
    event.waitUntil(
        Promise.all([
            // Cache de recursos críticos
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 SW: Cacheando recursos críticos');
                return cache.addAll(CRITICAL_RESOURCES);
            }),
            
            // Cache de fuentes
            caches.open(FONT_CACHE).then(cache => {
                console.log('🔤 SW: Cacheando fuentes');
                return cache.addAll(FONT_RESOURCES);
            })
        ]).then(() => {
            console.log('✅ SW: Instalación completada');
            return self.skipWaiting();
        }).catch(error => {
            console.error('❌ SW: Error en instalación:', error);
        })
    );
});

/* ==================================================
   ACTIVACIÓN DEL SERVICE WORKER
   ================================================== */
self.addEventListener('activate', event => {
    console.log('🚀 SW: Activando...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Limpiar caches antiguos
                    if (cacheName !== STATIC_CACHE && 
                        cacheName !== IMAGE_CACHE && 
                        cacheName !== FONT_CACHE) {
                        console.log('🗑️ SW: Limpiando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ SW: Activación completada');
            return self.clients.claim();
        })
    );
});

/* ==================================================
   INTERCEPTACIÓN DE REQUESTS
   ================================================== */
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Solo manejar requests GET
    if (request.method !== 'GET') {
        return;
    }
    
    // Estrategia basada en el tipo de recurso
    if (isImageRequest(request)) {
        event.respondWith(handleImageRequest(request));
    } else if (isFontRequest(request)) {
        event.respondWith(handleFontRequest(request));
    } else if (isStaticResource(request)) {
        event.respondWith(handleStaticRequest(request));
    } else if (isHTMLRequest(request)) {
        event.respondWith(handleHTMLRequest(request));
    }
});

/* ==================================================
   FUNCIONES DE IDENTIFICACIÓN DE REQUESTS
   ================================================== */
function isImageRequest(request) {
    return request.destination === 'image' || 
           request.url.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/i);
}

function isFontRequest(request) {
    return request.destination === 'font' || 
           request.url.includes('fonts.googleapis.com') ||
           request.url.includes('fonts.gstatic.com') ||
           request.url.match(/\.(woff|woff2|ttf|eot)$/i);
}

function isStaticResource(request) {
    return request.url.match(/\.(css|js)$/i);
}

function isHTMLRequest(request) {
    return request.destination === 'document' ||
           request.headers.get('accept')?.includes('text/html');
}

/* ==================================================
   ESTRATEGIAS DE CACHE
   ================================================== */

// Cache First para imágenes (mejor rendimiento)
async function handleImageRequest(request) {
    try {
        const cache = await caches.open(IMAGE_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('🖼️ SW: Imagen desde cache:', request.url);
            return cachedResponse;
        }
        
        console.log('🔍 SW: Descargando imagen:', request.url);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Solo cachear imágenes exitosas
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ SW: Error cargando imagen:', error);
        // Retornar imagen placeholder si existe
        return caches.match('/images/placeholder.svg') || 
               new Response('', { status: 404 });
    }
}

// Cache First para fuentes (críticas para diseño)
async function handleFontRequest(request) {
    try {
        const cache = await caches.open(FONT_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('🔤 SW: Fuente desde cache:', request.url);
            return cachedResponse;
        }
        
        console.log('🔍 SW: Descargando fuente:', request.url);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ SW: Error cargando fuente:', error);
        return fetch(request);
    }
}

// Stale While Revalidate para CSS/JS
async function handleStaticRequest(request) {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        // Retornar cache inmediatamente si existe
        if (cachedResponse) {
            console.log('📄 SW: Recurso desde cache:', request.url);
            
            // Actualizar en background
            fetch(request).then(networkResponse => {
                if (networkResponse.ok) {
                    cache.put(request, networkResponse.clone());
                }
            }).catch(() => {
                // Silenciar errores de background update
            });
            
            return cachedResponse;
        }
        
        // Si no hay cache, ir a red
        console.log('🔍 SW: Descargando recurso:', request.url);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ SW: Error cargando recurso estático:', error);
        return fetch(request);
    }
}

// Network First para HTML (contenido dinámico)
async function handleHTMLRequest(request) {
    try {
        console.log('🔍 SW: Cargando HTML desde red:', request.url);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ SW: Error de red, usando cache:', error);
        
        // Fallback a cache si la red falla
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('📋 SW: HTML desde cache:', request.url);
            return cachedResponse;
        }
        
        // Página offline si no hay nada
        return caches.match('/index.html') || 
               new Response('Página no disponible offline', { 
                   status: 404,
                   headers: { 'Content-Type': 'text/html' }
               });
    }
}

/* ==================================================
   EVENTOS DE MENSAJE
   ================================================== */
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_CACHE_INFO') {
        getCacheInfo().then(info => {
            event.ports[0].postMessage(info);
        });
    }
});

/* ==================================================
   FUNCIONES UTILITARIAS
   ================================================== */
async function getCacheInfo() {
    const cacheNames = await caches.keys();
    const info = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        info[cacheName] = keys.length;
    }
    
    return info;
}

// Limpieza periódica de cache de imágenes
async function cleanImageCache() {
    const cache = await caches.open(IMAGE_CACHE);
    const requests = await cache.keys();
    
    // Mantener solo las últimas 50 imágenes
    if (requests.length > 50) {
        const toDelete = requests.slice(0, requests.length - 50);
        await Promise.all(toDelete.map(request => cache.delete(request)));
        console.log(`🧹 SW: Limpiadas ${toDelete.length} imágenes del cache`);
    }
}

// Ejecutar limpieza cada hora
setInterval(cleanImageCache, 60 * 60 * 1000);

console.log('🎯 SW: Service Worker de Alico inicializado');
