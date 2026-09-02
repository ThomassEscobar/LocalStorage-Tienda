// ============================================
// DATOS
// ============================================
let productos = [
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

let productoEditandoId = null;

// ============================================
// FUNCIONES CRUD
// ============================================

// 1. CREAR - Agregar producto
function agregarProducto(nuevoProducto) {
    // Generar ID automático
    const maxId = productos.reduce((max, p) => Math.max(max, p.id), 0);
    nuevoProducto.id = maxId + 1;
    
    productos.push(nuevoProducto);
    renderizarProductos();
    guardarEnLocalStorage();
}

// 2. LEER - Mostrar productos
function renderizarProductos() {
    const lista = document.getElementById("listaProductos");
    
    if (productos.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <h3>📦 No hay productos</h3>
                <p>Haz clic en "Agregar Producto" para comenzar</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = productos.map(producto => `
        <div class="product-card">
            <img src="${producto.imagen}" alt="${producto.nombre}" 
                 onerror="this.src='https://via.placeholder.com/300x200/2a2a3a/00d4ff?text=Sin+Imagen'">
            <h3>${producto.nombre}</h3>
            <div class="price">${producto.precio.toLocaleString()}</div>
            <p class="description">${producto.descripcion}</p>
            <div class="card-actions">
                <button class="btn btn-edit" onclick="editarProducto(${producto.id})">✏️ Editar</button>
                <button class="btn btn-delete" onclick="eliminarProducto(${producto.id})">🗑️ Eliminar</button>
                <button class="btn btn-primary" onclick="verDetalles(${producto.id})">👁️ Ver</button>
            </div>
        </div>
    `).join('');
}

// 3. ACTUALIZAR - Editar producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    productoEditandoId = id;
    
    // Llenar formulario
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

// 4. ELIMINAR - Borrar producto
function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    productos = productos.filter(p => p.id !== id);
    renderizarProductos();
    guardarEnLocalStorage();
}

// 5. VER DETALLES
function verDetalles(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    localStorage.setItem("producto", JSON.stringify(producto));
    window.location.href = "detalle.html";
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
        imagen: document.getElementById("imagen").value.trim() || "https://via.placeholder.com/300x200/2a2a3a/00d4ff?text=Sin+Imagen"
    };

    // Validar campos
    if (!datos.nombre || !datos.precio || !datos.descripcion) {
        alert("Por favor, completa todos los campos");
        return;
    }

    if (id) {
        // Editar
        actualizarProducto(id, datos);
    } else {
        // Agregar
        agregarProducto(datos);
    }

    cerrarModal();
});

// ============================================
// LOCAL STORAGE
// ============================================

function guardarEnLocalStorage() {
    try {
        localStorage.setItem("productos", JSON.stringify(productos));
    } catch (error) {
        console.error("Error guardando en localStorage:", error);
    }
}

function cargarDesdeLocalStorage() {
    try {
        const data = localStorage.getItem("productos");
        if (data) {
            productos = JSON.parse(data);
        }
    } catch (error) {
        console.error("Error cargando desde localStorage:", error);
    }
}

// ============================================
// INICIALIZAR
// ============================================

// Cargar datos guardados
cargarDesdeLocalStorage();

// Renderizar productos
renderizarProductos();

// Cerrar modal con ESC
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") cerrarModal();
});

// Cerrar modal haciendo clic fuera
document.getElementById("modalProducto").addEventListener("click", function(e) {
    if (e.target === this) cerrarModal();
});