document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // SISTEMA DE DIAGNÓSTICO Y PREVENCIÓN DE ERRORES (CÁMARA AR)
    // ---------------------------------------------------------

    // Función para mostrar banners en la parte superior
    const showSystemBanner = (message, type) => {
        const banner = document.createElement('div');
        banner.className = `system-banner ${type}`;
        
        const icon = type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info';
        banner.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        
        document.body.prepend(banner);
    };

    // 1. Chequeo de HTTPS
    const checkEnvironment = () => {
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const isHttps = window.location.protocol === 'https:';
        
        if (!isHttps && !isLocalhost) {
            showSystemBanner('Error: La cámara requiere conexión segura HTTPS.', 'error');
        }

        // 2. Detección básica de navegadores in-app (Instagram, WhatsApp, Facebook)
        // Estos navegadores bloquean intents externos y WebXR
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const isInAppBrowser = (ua.indexOf("FBAN") > -1) || 
                               (ua.indexOf("FBAV") > -1) || 
                               (ua.indexOf("Instagram") > -1) || 
                               (ua.indexOf("WhatsApp") > -1);
        
        if (isInAppBrowser) {
            showSystemBanner('Aviso: Estás usando un navegador integrado. Si la AR falla, abre este link en Chrome o Safari.', 'warning');
        }

        // 3. Chequeo nativo de soporte WebXR (Opcional, para navegadores que soporten la API)
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
                if (!supported) {
                    console.warn("WebXR 'immersive-ar' no está soportado nativamente en este navegador, se intentará usar Scene Viewer/Quick Look como fallback.");
                }
            });
        }
    };

    // Ejecutar validaciones de entorno al cargar
    checkEnvironment();

    // ---------------------------------------------------------
    // DATOS DEL MENÚ Y MODELOS 3D
    // ---------------------------------------------------------

    // Modelos de comida (Usando repositorios oficiales estables)
    const menuItems = [
        {
            id: 'burger',
            title: 'Hamburguesa Clásica',
            description: 'Doble carne con queso derretido, tomate fresco y lechuga crujiente.',
            price: '$18.00',
            glbModel: 'https://modelviewer.dev/shared-assets/models/Burger.glb',
            usdzModel: 'https://modelviewer.dev/shared-assets/models/Burger.usdz',
            poster: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop'
        },
        {
            id: 'avocado',
            title: 'Aguacate Orgánico',
            description: 'Aguacate fresco Hass, perfecto para dietas saludables o como acompañamiento.',
            price: '$5.50',
            // Usando Khronos Group glTF Sample Models via modelviewer cache
            glbModel: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/Avocado/glTF-Binary/Avocado.glb',
            usdzModel: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/Avocado/glTF-Binary/Avocado.usdz',
            poster: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop'
        },
        {
            id: 'shoe', // Placeholder oficial en vez de tarta
            title: 'Zapatilla Exclusiva',
            description: '(Modelo de Prueba) Utilizando el modelo oficial Shoe de Khronos para probar texturas complejas.',
            price: '$120.00',
            glbModel: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb',
            usdzModel: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.usdz',
            poster: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop'
        }
    ];

    // Modelo de diagnóstico estricto
    const diagnosticItem = {
        id: 'astronaut',
        title: 'Prueba de Compatibilidad AR',
        description: 'Modelo oficial de Google (El Astronauta). Si este modelo no carga o no abre en tu espacio, el problema radica en tu dispositivo o navegador.',
        price: 'Diagnóstico',
        glbModel: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
        usdzModel: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz',
        poster: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=600&auto=format&fit=crop',
        isDiagnostic: true
    };

    // ---------------------------------------------------------
    // RENDERIZADO DOM Y LISTENERS DE ERRORES AR
    // ---------------------------------------------------------

    const renderCard = (item, containerElement) => {
        const card = document.createElement('article');
        card.className = item.isDiagnostic ? 'card diagnostic-card' : 'card';

        card.innerHTML = `
            <div class="card-image-wrapper">
                <model-viewer 
                    id="mv-${item.id}"
                    src="${item.glbModel}" 
                    ios-src="${item.usdzModel}" 
                    poster="${item.poster}" 
                    alt="Modelo 3D de ${item.title}" 
                    ar 
                    ar-modes="webxr scene-viewer quick-look" 
                    camera-controls 
                    auto-rotate
                    shadow-intensity="1">
                    
                    <button slot="ar-button" class="ar-button-slot" id="btn-${item.id}">
                        <i class="fa-solid ${item.isDiagnostic ? 'fa-wrench' : 'fa-cube'}"></i> 
                        ${item.isDiagnostic ? 'Probar Compatibilidad' : 'Ver en tu mesa'}
                    </button>
                </model-viewer>
            </div>
            <div class="card-content">
                <div class="card-header">
                    <h2 class="dish-title">${item.title}</h2>
                    <span class="dish-price">${item.price}</span>
                </div>
                <p class="dish-description">${item.description}</p>
            </div>
        `;

        containerElement.appendChild(card);

        // AGREGAR EVENT LISTENERS AL MODEL-VIEWER PARA MANEJO DE ERRORES
        const modelViewerElement = document.getElementById(`mv-${item.id}`);
        const arButton = document.getElementById(`btn-${item.id}`);

        // Evento 'error': Se dispara si falla la descarga del .glb, errores de CORS o 404
        modelViewerElement.addEventListener('error', (event) => {
            console.error(`Error cargando el modelo 3D para ${item.title}:`, event);
            
            // Ocultar botón AR
            if (arButton) arButton.style.display = 'none';
            
            // Mostrar texto de "Modelo no disponible"
            const errorOverlay = document.createElement('div');
            errorOverlay.className = 'model-error-overlay';
            errorOverlay.innerHTML = '<i class="fa-solid fa-link-slash"></i> Modelo no disponible';
            
            // Adjuntarlo al contenedor del model-viewer (card-image-wrapper)
            modelViewerElement.parentElement.appendChild(errorOverlay);
        });

        // Evento 'ar-status': Monitorea el ciclo de vida al intentar abrir la cámara AR
        modelViewerElement.addEventListener('ar-status', (event) => {
            console.log(`Estado AR para ${item.title}: ${event.detail.status}`);
            
            if (event.detail.status === 'failed') {
                // El dispositivo intentó abrir la cámara pero falló a nivel nativo
                alert('Tu dispositivo no es compatible con Realidad Aumentada o requiere actualizar los Servicios de Google Play para RA.');
            }
        });
    };

    // Renderizar menú de comida
    const menuGrid = document.getElementById('menu-grid');
    menuItems.forEach(item => renderCard(item, menuGrid));

    // Renderizar tarjeta de diagnóstico
    const diagnosticGrid = document.getElementById('diagnostic-grid');
    renderCard(diagnosticItem, diagnosticGrid);
});
