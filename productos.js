// ============================================
// VERIFICAR AUTENTICACIÓN
// ============================================

if (!isAuthenticated()) {
    window.location.href = "index.html";
}

// Mostrar información del usuario
const user = getCurrentUser();
document.getElementById("userInfo").textContent = `👤 ${user.fullname || user.username} (Usuario)`;

// ============================================
// DATOS
// ============================================

let productos = [];

function cargarDesdeLocalStorage() {
    try {
        const data = localStorage.getItem("productos");
        if (data) {
            productos = JSON.parse(data);
        } else {
            productos = [
                {
                    id: 1,
                    nombre: "Notebook",
                    precio: 500000,
                    descripcion: "Notebook para estudio y trabajo",
                    imagen: "img/notebook.jpg"
                },
                {
                    id: 2,
                    nombre: "Mouse",
                    precio: 15000,
                    descripcion: "Mouse Inalambrico",
                    imagen: "img/mouse.jpg"
                },
                {
                    id: 3,
                    nombre: "Teclado",
                    precio: 25000,
                    descripcion: "Teclado USB",
                    imagen: "img/teclado.jpg"
                }
            ];
            localStorage.setItem("productos", JSON.stringify(productos));
        }
    } catch (error) {
        console.error("Error cargando desde localStorage:", error);
    }
}

// ============================================
// RENDERIZAR PRODUCTOS (SOLO LECTURA)
// ============================================

function renderizarProductos() {
    const lista = document.getElementById("listaProductos");
    
    if (productos.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📦</span>
                <h3>No hay productos disponibles</h3>
                <p>Vuelve más tarde</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = productos.map(producto => `
        <div class="product-card">
            <img src="${producto.imagen}" alt="${producto.nombre}" 
                 onerror="this.src='https://via.placeholder.com/300x200/e2e8f0/2563eb?text=Sin+Imagen'">
            <h3>${producto.nombre}</h3>
            <div class="price">$${producto.precio.toLocaleString()}</div>
            <p class="description">${producto.descripcion}</p>
            <div class="card-actions">
                <button class="btn btn-primary btn-sm" onclick="verDetalles(${producto.id})" style="flex: 1;">
                    👁️ Ver Detalles
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// VER DETALLES
// ============================================

function verDetalles(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    localStorage.setItem("producto", JSON.stringify(producto));
    window.location.href = "detalle.html";
}

// ============================================
// CERRAR SESIÓN
// ============================================

function cerrarSesion() {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
        logout();
    }
}

// ============================================
// INICIALIZAR
// ============================================

cargarDesdeLocalStorage();
renderizarProductos();