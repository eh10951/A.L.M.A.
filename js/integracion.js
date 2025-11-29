// SISTEMA A.L.M.A. - SCRIPT DE INTEGRACIÓN
// Conecta Login, Estudiante y Profesor en una sola página

// ============================================
// BASE DE DATOS SIMULADA
// ============================================

const users = {
    'alumno': { password: '1234', role: 'student', name: 'Ana C. Pérez López' },
    'profesor': { password: '1234', role: 'teacher', name: 'Dr. Juan García' },
    'admin': { password: '12345', role: 'admin', name: 'Administrador' }
};

let currentUser = null;

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema A.L.M.A. Iniciado');
    
    // Verificar si hay sesión guardada
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        navigateByRole(currentUser.role);
    }
    
    // Configurar formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Configurar botones de logout
    const logoutButtons = document.querySelectorAll('.logout');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });
    
    console.log('✅ Sistema listo');
});

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

function handleLogin(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();
    
    console.log('Intento de login:', usuario);
    
    if (!usuario || !password) {
        showLoginMessage('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (users[usuario] && users[usuario].password === password) {
        currentUser = {
            username: usuario,
            role: users[usuario].role,
            name: users[usuario].name
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showLoginMessage('¡Bienvenido ' + currentUser.name + '!', 'success');
        
        setTimeout(() => {
            navigateByRole(currentUser.role);
        }, 1500);
    } else {
        showLoginMessage('Usuario o contraseña incorrectos', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Mostrar login nuevamente
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('studentSection').style.display = 'none';
    document.getElementById('teacherSection').style.display = 'none';
    
    // Limpiar formulario
    document.getElementById('loginForm').reset();
    document.getElementById('usuario').focus();
}

function showLoginMessage(msg, type) {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;
    
    messageEl.textContent = msg;
    messageEl.className = 'show-message ' + type;
    
    setTimeout(() => {
        messageEl.className = 'hidden-message';
    }, 3000);
}

// ============================================
// NAVEGACIÓN ENTRE SECCIONES
// ============================================

function navigateByRole(role) {
    console.log('Navegando a:', role);
    
    const loginSection = document.getElementById('loginSection');
    const studentSection = document.getElementById('studentSection');
    const teacherSection = document.getElementById('teacherSection');
    
    if (role === 'student') {
        loginSection.style.display = 'none';
        studentSection.style.display = 'block';
        teacherSection.style.display = 'none';
        
        // Actualizar nombre del estudiante
        const nameElements = document.querySelectorAll('[id*="studentName"], [id*="studentFullName"]');
        nameElements.forEach(el => {
            el.textContent = currentUser.name;
        });
    } else if (role === 'teacher' || role === 'admin') {
        loginSection.style.display = 'none';
        studentSection.style.display = 'none';
        teacherSection.style.display = 'block';
        
        // Actualizar nombre del profesor
        const nameElements = document.querySelectorAll('[id*="teacherName"]');
        nameElements.forEach(el => {
            el.textContent = currentUser.name;
        });
    }
}

// ============================================
// FUNCIONES DE NAVEGACIÓN EN VISTAS
// ============================================

// Para estudiante - cambiar entre vistas
function switchStudentTab(tabName) {
    console.log('Cambiando a pestaña:', tabName);
    
    // Ocultar todas las vistas
    const views = document.querySelectorAll('[id*="-view"]');
    views.forEach(v => v.style.display = 'none');
    
    // Mostrar vista seleccionada
    const selectedView = document.getElementById(tabName + '-view');
    if (selectedView) {
        selectedView.style.display = 'block';
    }
    
    // Actualizar navegación activa
    const navItems = document.querySelectorAll('.horizontal-nav .nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(tabName)) {
            item.classList.add('active');
        }
    });
}

// Para profesor - cambiar entre vistas
function switchTeacherTab(tabName) {
    console.log('Cambiando a pestaña profesor:', tabName);
    
    const views = document.querySelectorAll('[id*="-view"]');
    views.forEach(v => v.style.display = 'none');
    
    const selectedView = document.getElementById(tabName + '-view');
    if (selectedView) {
        selectedView.style.display = 'block';
    }
}

// ============================================
// FUNCIONES DE PROFESOR
// ============================================

function goToGrades(classId) {
    console.log('Ir a calificaciones:', classId);
    alert('Abriendo calificaciones para: ' + classId);
}

function takeAttendance(classId) {
    console.log('Tomar asistencia:', classId);
    alert('Abriendo lista de asistencia para: ' + classId);
}

// ============================================
// FUNCIONES DE ESTUDIANTE
// ============================================

function showStudentProfile() {
    alert('Perfil de: ' + currentUser.name);
}

function showStudentSettings() {
    alert('Configuración');
}

// ============================================
// TEMA CLARO/OSCURO
// ============================================

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Cambiar iconos
    const toggleButtons = document.querySelectorAll('.theme-toggle-button');
    toggleButtons.forEach(btn => {
        btn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
}

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

console.log('✅ Script de integración cargado exitosamente');
