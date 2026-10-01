document.addEventListener('DOMContentLoaded', () => {
    // Definimos el catálogo de platos (datos simulados)
    const menuItems = [
        {
            id: 1,
            title: 'Hamburguesa Trufada',
            description: 'Carne Angus seleccionada con queso cheddar fundido, cebolla caramelizada y un toque de nuestra exclusiva salsa de trufa negra.',
            price: '$18.00',
            // URLs de ejemplo de modelos 3D provistos por modelviewer.dev
            glbModel: 'https://modelviewer.dev/shared-assets/models/Burger.glb',
            usdzModel: 'https://modelviewer.dev/shared-assets/models/Burger.usdz',
            // Imagen 2D apetitosa (poster) para mostrar antes de la carga 3D
            poster: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop'
        },
        {
            id: 2,
            title: 'Sushi Premium Roll',
            description: 'Uramaki relleno de langostino tempura y aguacate, envuelto en finas láminas de salmón fresco y atún rojo con salsa teriyaki.',
            price: '$22.50',
            // Utilizando un modelo de aguacate como placeholder de prueba para WebAR
            glbModel: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/Avocado/glTF-Binary/Avocado.glb',
            usdzModel: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/Avocado/glTF-Binary/Avocado.usdz',
            poster: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop'
        },
        {
            id: 3,
            title: 'Tarta Artesanal',
            description: 'Exquisita tarta con base de galleta crujiente, crema de vainilla suave y una fina selección de frutos rojos de temporada.',
            price: '$9.00',
            // Utilizando otro modelo gratuito de prueba (casco como placeholder)
            glbModel: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', 
            usdzModel: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.usdz',
            poster: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=600&auto=format&fit=crop'
        }
    ];

    const menuGrid = document.getElementById('menu-grid');

    // Función que inyecta las tarjetas en el DOM
    const renderMenu = () => {
        menuItems.forEach(item => {
            const card = document.createElement('article');
            card.className = 'card';

            // Estructura de cada plato
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <model-viewer 
                        id="model-${item.id}"
                        src="${item.glbModel}" 
                        ios-src="${item.usdzModel}" 
                        poster="${item.poster}" 
                        alt="Modelo 3D de ${item.title}" 
                        ar 
                        ar-modes="webxr scene-viewer quick-look" 
                        camera-controls 
                        auto-rotate
                        shadow-intensity="1">
                    </model-viewer>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h2 class="dish-title">${item.title}</h2>
                        <span class="dish-price">${item.price}</span>
                    </div>
                    <p class="dish-description">${item.description}</p>
                    
                    <button class="ar-btn" onclick="activateAR(${item.id})">
                        <i class="fa-solid fa-cube"></i> Ver en tu mesa (AR)
                    </button>
                </div>
            `;

            menuGrid.appendChild(card);
        });
    };

    renderMenu();
});

// Función global llamada por el botón "Ver en tu mesa (AR)"
window.activateAR = (id) => {
    const modelViewerElement = document.getElementById(`model-${id}`);
    if (modelViewerElement) {
        // Ejecutamos el método nativo del componente model-viewer para lanzar la cámara AR
        try {
            modelViewerElement.activateAR();
        } catch (error) {
            console.error("Error al iniciar AR:", error);
            alert("No se pudo iniciar la experiencia de Realidad Aumentada.");
        }
    }
};
