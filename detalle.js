// Recuperamos el producto guardado del LocalStorage
let producto = JSON.parse(
    localStorage.getItem("producto")
);

// Verificar que el producto existe
if (producto) {
    // Mostrar Datos en el HTML
    document.getElementById("imagen").src = 
        producto.imagen || "https://via.placeholder.com/600x400/e2e8f0/2563eb?text=Sin+Imagen";
    
    document.getElementById("nombre").textContent = 
        producto.nombre;
    
    document.getElementById("precio").textContent = 
        "Precio: $" + producto.precio.toLocaleString();
    
    document.getElementById("descripcion").textContent = 
        producto.descripcion;
} else {
    // Si no hay producto, mostrar mensaje
    document.querySelector(".container > div").innerHTML = `
        <h2 style="text-align: center; color: var(--text-muted);">Producto no encontrado</h2>
        <p style="text-align: center;"><a href="productos.html" class="btn btn-primary">Volver a Productos</a></p>
    `;
}