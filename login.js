// ============================================
// SISTEMA DE AUTENTICACIÓN COMPLETO
// ============================================

// ============================================
// GESTIÓN DE USUARIOS EN LOCALSTORAGE
// ============================================

function getUsers() {
    try {
        const users = localStorage.getItem("users");
        if (users) {
            return JSON.parse(users);
        }
    } catch (error) {
        console.error("Error cargando usuarios:", error);
    }
    
    // Usuarios por defecto
    const defaultUsers = [
        {
            id: 1,
            username: "admin",
            password: "admin123",
            fullname: "Administrador",
            email: "admin@tienda.com",
            role: "admin",
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            username: "usuario",
            password: "user123",
            fullname: "Usuario Normal",
            email: "usuario@correo.com",
            role: "user",
            createdAt: new Date().toISOString()
        }
    ];
    
    localStorage.setItem("users", JSON.stringify(defaultUsers));
    return defaultUsers;
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function findUserByUsername(username) {
    const users = getUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

function findUserByEmail(email) {
    const users = getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// ============================================
// FUNCIONES DE REGISTRO
// ============================================

function registerUser(userData) {
    const users = getUsers();
    
    // Verificar si el usuario ya existe
    if (findUserByUsername(userData.username)) {
        return { success: false, message: "❌ El nombre de usuario ya está en uso" };
    }
    
    // Verificar si el email ya existe
    if (findUserByEmail(userData.email)) {
        return { success: false, message: "❌ El correo electrónico ya está registrado" };
    }
    
    // Validar contraseña
    if (userData.password.length < 6) {
        return { success: false, message: "❌ La contraseña debe tener al menos 6 caracteres" };
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username: userData.username,
        password: userData.password,
        fullname: userData.fullname,
        email: userData.email,
        role: "user", // Siempre usuario normal al registrarse
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return { 
        success: true, 
        message: "✅ ¡Registro exitoso! Ahora puedes iniciar sesión",
        user: newUser
    };
}

// ============================================
// FUNCIONES DE LOGIN
// ============================================

function login(username, password) {
    const user = findUserByUsername(username);
    
    if (user && user.password === password) {
        // Guardar sesión
        const session = {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem("session", JSON.stringify(session));
        return { success: true, user: session };
    }
    
    return { success: false, message: "❌ Usuario o contraseña incorrectos" };
}

// ============================================
// FUNCIONES DE SESIÓN
// ============================================

function logout() {
    localStorage.removeItem("session");
    window.location.href = "index.html";
}

function getCurrentUser() {
    try {
        const session = localStorage.getItem("session");
        return session ? JSON.parse(session) : null;
    } catch (error) {
        return null;
    }
}

function isAuthenticated() {
    return getCurrentUser() !== null;
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === "admin";
}

function isUser() {
    const user = getCurrentUser();
    return user && user.role === "user";
}

// ============================================
// PROTECCIÓN DE RUTAS
// ============================================

function protectRoute() {
    if (!isAuthenticated()) {
        window.location.href = "index.html";
        return false;
    }
    return true;
}

function protectAdminRoute() {
    if (!isAuthenticated()) {
        window.location.href = "index.html";
        return false;
    }
    
    if (!isAdmin()) {
        alert("⛔ Acceso denegado. Solo administradores.");
        window.location.href = "productos.html";
        return false;
    }
    
    return true;
}

// ============================================
// MANEJAR LOGIN
// ============================================

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            const errorMessage = document.getElementById("errorMessage");
            const successMessage = document.getElementById("successMessage");
            
            // Ocultar mensajes
            errorMessage.classList.remove("show");
            if (successMessage) successMessage.classList.remove("show");
            
            // Validar campos
            if (!username || !password) {
                errorMessage.textContent = "⚠️ Por favor, completa todos los campos";
                errorMessage.classList.add("show");
                return;
            }
            
            // Intentar login
            const result = login(username, password);
            
            if (result.success) {
                // Redirigir según el rol
                if (result.user.role === "admin") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "productos.html";
                }
            } else {
                errorMessage.textContent = result.message || "❌ Usuario o contraseña incorrectos";
                errorMessage.classList.add("show");
                document.getElementById("password").value = "";
                document.getElementById("password").focus();
            }
        });
    }
    
    // Redirigir si ya está logueado
    if (isAuthenticated() && window.location.pathname.includes("index.html")) {
        const user = getCurrentUser();
        if (user.role === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "productos.html";
        }
    }
});

// ============================================
// MANEJAR REGISTRO
// ============================================

document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById("registerForm");
    
    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById("fullname").value.trim();
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const errorMessage = document.getElementById("errorMessage");
            
            // Ocultar mensaje de error
            errorMessage.classList.remove("show");
            
            // Validar campos
            if (!fullname || !username || !email || !password || !confirmPassword) {
                errorMessage.textContent = "⚠️ Por favor, completa todos los campos";
                errorMessage.classList.add("show");
                return;
            }
            
            // Validar nombre de usuario (solo letras y números, mínimo 4 caracteres)
            const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
            if (!usernameRegex.test(username)) {
                errorMessage.textContent = "⚠️ El usuario debe tener al menos 4 caracteres (solo letras y números)";
                errorMessage.classList.add("show");
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorMessage.textContent = "⚠️ Por favor, ingresa un correo electrónico válido";
                errorMessage.classList.add("show");
                return;
            }
            
            // Validar contraseña
            if (password.length < 6) {
                errorMessage.textContent = "⚠️ La contraseña debe tener al menos 6 caracteres";
                errorMessage.classList.add("show");
                return;
            }
            
            // Validar que coincidan las contraseñas
            if (password !== confirmPassword) {
                errorMessage.textContent = "⚠️ Las contraseñas no coinciden";
                errorMessage.classList.add("show");
                return;
            }
            
            // Registrar usuario
            const result = registerUser({
                fullname,
                username,
                email,
                password
            });
            
            if (result.success) {
                // Mostrar mensaje de éxito
                const successMessage = document.createElement("div");
                successMessage.className = "success-message show";
                successMessage.textContent = "✅ ¡Registro exitoso! Redirigiendo al login...";
                successMessage.style.cssText = `
                    background: #dcfce7;
                    color: #166534;
                    padding: 0.75rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    font-size: 0.875rem;
                `;
                
                const form = document.getElementById("registerForm");
                form.parentNode.insertBefore(successMessage, form);
                
                // Redirigir al login después de 2 segundos
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            } else {
                errorMessage.textContent = result.message;
                errorMessage.classList.add("show");
            }
        });
    }
});

// ============================================
// FUNCIÓN PARA CREAR ADMIN (SOLO USO INTERNO)
// ============================================

function createAdminUser(username, password, fullname, email) {
    const users = getUsers();
    
    // Verificar si el usuario ya existe
    if (findUserByUsername(username)) {
        return { success: false, message: "El usuario ya existe" };
    }
    
    const newAdmin = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username,
        password,
        fullname,
        email,
        role: "admin",
        createdAt: new Date().toISOString()
    };
    
    users.push(newAdmin);
    saveUsers(users);
    
    return { success: true, message: "Admin creado exitosamente", user: newAdmin };
}