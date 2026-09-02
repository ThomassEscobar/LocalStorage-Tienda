# 📦 Tienda Tech - Gestión de Productos

> Ejemplo demostrativo básico de CRUD con JavaScript puro y LocalStorage.

---

## 📋 Descripción

Proyecto educativo que implementa un **CRUD completo** (Crear, Leer, Actualizar, Eliminar) de productos usando **HTML, CSS y JavaScript vanilla**. Los datos se guardan en **LocalStorage** del navegador, funcionando completamente en el cliente sin necesidad de servidor backend.

---

## 🛠️ Tecnologías

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

- **HTML5** - Estructura semántica
- **CSS3** - Estilos minimalistas y responsive
- **JavaScript ES6+** - Lógica CRUD y manipulación del DOM
- **LocalStorage** - Persistencia de datos en el navegador

---

## 📁 Estructura

```
tienda-tech/
├── productos.html      # Página principal
├── detalle.html       # Página de detalle
├── style.css          # Estilos
├── productos.js       # Lógica CRUD
├── detalle.js         # Lógica de detalle
└── img/               # Imágenes de ejemplo
```

---

## 🎯 Funcionalidades

| Operación | Descripción |
|-----------|-------------|
| **➕ Crear** | Agregar productos con formulario modal |
| **👁️ Leer** | Visualizar productos en grid |
| **✏️ Actualizar** | Editar productos existentes |
| **🗑️ Eliminar** | Eliminar con confirmación |
| **📄 Detalle** | Ver información completa |

---

## 💾 Persistencia

```javascript
// Guardar datos
localStorage.setItem("productos", JSON.stringify(productos));

// Recuperar datos
const data = localStorage.getItem("productos");
```

---

## 🚀 Ejecución Local

### Opción 1: VS Code (Recomendado)
```bash
1. Clona el repositorio
2. Abre con VS Code
3. Instala "Live Server"
4. Click derecho en productos.html → "Open with Live Server"
```

### Opción 2: Python
```bash
python -m http.server 8000
# Abre http://localhost:8000
```

### Opción 3: Node.js
```bash
npx serve
# Abre http://localhost:3000
```

---

## 🎨 Diseño

- **Paleta**: Blanco, grises y azul `#2563eb`
- **Tipografía**: Sans-serif
- **Layout**: CSS Grid y Flexbox
- **Responsive**: Adaptable a móviles
- **Footer**: Información de contacto

---

## 📝 Ejemplo de Productos

| ID | Producto | Precio |
|----|----------|--------|
| 1 | Notebook | $500.000 |
| 2 | Mouse | $15.000 |
| 3 | Teclado | $25.000 |

---

## 🔧 Personalización Rápida

### Cambiar colores
```css
/* style.css */
:root {
    --primary: #tu-color;
    --background: #tu-color;
}
```

### Agregar productos por defecto
```javascript
// productos.js
let productos = [
    // ... tus productos
];
```

---

## 📱 Responsive

- **Desktop**: Grid 3-4 columnas
- **Tablet**: Grid 2 columnas  
- **Móvil**: Grid 1 columna

---

## 🔒 Privacidad

- ✅ Datos solo en el navegador
- ✅ Sin envío a servidores
- ✅ Sin cookies

⚠️ Los datos se pierden al limpiar LocalStorage

---

## 📚 Conceptos Aprendidos

- Manipulación del DOM
- Eventos JavaScript
- LocalStorage
- Métodos de array (map, filter, find)
- JSON (parse/stringify)
- CSS Grid y Flexbox
- Diseño responsive

---

**⭐ ¡Dale una estrella si te fue útil!**

---
