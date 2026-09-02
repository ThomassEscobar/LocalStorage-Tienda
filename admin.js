// ============================================
// VERIFICAR AUTENTICACIÓN Y ROL
// ============================================

if (!protectAdminRoute()) {
    // Si no es admin, redirigir
}

// Mostrar información del admin
const user = getCurrentUser();
document.getElementById("adminInfo").textContent = `🔑 ${user.fullname || user.username} (Admin)`;

// ============================================
// DATOS
// ============================================

let productos = [];
let productoEditandoId = null;

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

function guardarEnLocalStorage() {
    try {
        localStorage.setItem("productos", JSON.stringify(productos));
    } catch (error) {
        console.error("Error guardando en localStorage:", error);
    }
}

// ============================================
// CRUD - ADMIN
// ============================================

function agregarProducto(nuevoProducto) {
    const maxId = productos.reduce((max, p) => Math.max(max, p.id), 0);
    nuevoProducto.id = maxId + 1;
    
    productos.push(nuevoProducto);
    renderizarProductos();
    guardarEnLocalStorage();
}

function renderizarProductos() {
    const lista = document.getElementById("listaProductos");
    
    if (productos.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📦</span>
                <h3>No hay productos</h3>
                <p>Haz clic en "Agregar Producto" para comenzar</p>
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
                <button class="btn btn-edit btn-sm" onclick="editarProducto(${producto.id})">✏️ Editar</button>
                <button class="btn btn-delete btn-sm" onclick="eliminarProducto(${producto.id})">🗑️ Eliminar</button>
                <button class="btn btn-primary btn-sm" onclick="verDetalles(${producto.id})">👁️ Ver</button>
            </div>
        </div>
    `).join('');
}

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    productoEditandoId = id;
    
    document.getElementById("productoId").value = id;
    document.getElementById("modalTitulo").textContent = "Editar Producto";
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("descripcion").value = producto.descripcion;
    document.getElementById("imagen").value = producto.imagen;
    document.getElementById("btnGuardar").textContent = "Actualizar";
    
    abrirModal();
}

function actualizarProducto(id, datosActualizados) {
    const index = productos.findIndex(p => p.id === id);
    if (index !== -1) {
        productos[index] = { ...productos[index], ...datosActualizados };
        renderizarProductos();
        guardarEnLocalStorage();
    }
}

function eliminarProducto(id) {
    if (!confirm('⚠️ ¿Estás seguro de eliminar este producto?')) return;
    
    productos = productos.filter(p => p.id !== id);
    renderizarProductos();
    guardarEnLocalStorage();
}

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
// MODAL
// ============================================

function abrirModal() {
    document.getElementById("modalProducto").classList.add("active");
    document.body.style.overflow = "hidden";
}

function cerrarModal() {
    document.getElementById("modalProducto").classList.remove("active");
    document.body.style.overflow = "auto";
    resetFormulario();
}

function abrirModalAgregar() {
    resetFormulario();
    document.getElementById("modalTitulo").textContent = "Nuevo Producto";
    document.getElementById("btnGuardar").textContent = "Guardar";
    productoEditandoId = null;
    abrirModal();
}

function resetFormulario() {
    document.getElementById("formProducto").reset();
    document.getElementById("productoId").value = "";
}

// ============================================
// MANEJAR FORMULARIO
// ============================================

document.getElementById("formProducto").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById("productoId").value);
    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        precio: parseInt(document.getElementById("precio").value),
        descripcion: document.getElementById("descripcion").value.trim(),
        imagen: document.getElementById("imagen").value.trim() || "https://via.placeholder.com/300x200/e2e8f0/2563eb?text=Sin+Imagen"
    };

    if (!datos.nombre || !datos.precio || !datos.descripcion) {
        alert("Por favor, completa todos los campos");
        return;
    }

    if (id) {
        actualizarProducto(id, datos);
    } else {
        agregarProducto(datos);
    }

    cerrarModal();
});

// ============================================
// INICIALIZAR
// ============================================

cargarDesdeLocalStorage();
renderizarProductos();

// Cerrar modal con ESC
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") cerrarModal();
});

// Cerrar modal haciendo clic fuera
document.getElementById("modalProducto").addEventListener("click", function(e) {
    if (e.target === this) cerrarModal();
});