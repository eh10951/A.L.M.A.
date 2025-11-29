// ============================================
// DATOS SIMULADOS Y CONFIGURACIÓN
// ============================================

// Base de datos simulada de usuarios
const users = {
    'alumno': { password: '1234', role: 'student', name: 'Ana C. Pérez López' },
    'profesor': { password: '1234', role: 'teacher', name: 'Dr. Juan García' },
    'admin': { password: '12345', role: 'admin', name: 'Administrador' }
};

// Datos de estudiantes por clase
const studentData = {
    'GANA': [
        { matricula: 'M1001', nombre: 'Pérez López, Ana C.', et: 8.5, pp: 9.0 },
        { matricula: 'M1002', nombre: 'García Ruiz, Carlos', et: 6.0, pp: 5.0 },
        { matricula: 'M1003', nombre: 'Vásquez Soto, María', et: 9.5, pp: 10.0 },
        { matricula: 'M1004', nombre: 'Rojas Aguilar, José', et: 7.2, pp: 6.8 },
    ],
    'ALIN': [
        { matricula: 'M2010', nombre: 'Castro Mena, David', et: 7.8, pp: 7.5 },
        { matricula: 'M2011', nombre: 'Flores Luna, Valeria', et: 5.5, pp: 6.5 },
        { matricula: 'M2012', nombre: 'Hernández Gil, Marco', et: 8.9, pp: 9.2 },
        { matricula: 'M2013', nombre: 'Morales Cruz, Laura', et: 10.0, pp: 9.5 },
    ],
    'CINT': [
        { matricula: 'M3020', nombre: 'Álvarez Sofía', et: 9.0, pp: 10.0 },
        { matricula: 'M3021', nombre: 'Benítez Juan', et: 7.5, pp: 6.0 },
        { matricula: 'M3022', nombre: 'Díaz David', et: 6.8, pp: 8.0 },
    ]
};

// Información de clases
const classInfo = {
    'GANA': { id: 'GANA', title: 'GEOMETRÍA ANALÍTICA', group: 'GPO-103' },
    'ALIN': { id: 'ALIN', title: 'ÁLGEBRA LINEAL', group: 'GPO-201' },
    'CINT': { id: 'CINT', title: 'CÁLCULO INTEGRAL', group: 'GPO-301' }
};

// Variable global para usuario actual
let currentUser = null;

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

function initializeApp() {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('No se encontró el formulario de login');
        return;
    }
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const usuario = document.getElementById('usuario').value.trim();
        const password = document.getElementById('password').value.trim();
        
        console.log('Usuario ingresado:', usuario);
        console.log('Usuarios disponibles:', Object.keys(users));
        console.log('Usuario existe:', usuario in users);
        
        if (!usuario || !password) {
            showMessage('Por favor completa todos los campos.', 'error');
            return;
        }
        
        authenticateUser(usuario, password);
    });

    // Inicializar dropdowns de perfil
    setupProfileDropdowns();
    
    // Inicializar theme toggle
    setupThemeToggle();
}

function authenticateUser(usuario, password) {
    const messageElement = document.getElementById('message');
    
    console.log('Intentando autenticar:', usuario);
    console.log('Usuario en lista:', usuario in users);
    
    if (usuario in users) {
        const user = users[usuario];
        console.log('Contraseña esperada:', user.password);
        console.log('Contraseña ingresada:', password);
        console.log('¿Coinciden?:', user.password === password);
        
        if (user.password === password) {
            currentUser = {
                username: usuario,
                role: user.role,
                name: user.name
            };
            
            // Guardar sesión en localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            console.log('✅ Autenticación exitosa');
            showMessage('¡Inicio de sesión exitoso!', 'success');
            
            // Redirigir según rol después de 1 segundo
            setTimeout(() => {
                navigateByRole(currentUser.role);
            }, 1000);
            
        } else {
            console.log('❌ Contraseña incorrecta');
            showMessage('Error: Usuario o contraseña incorrectos.', 'error');
        }
    } else {
        console.log('❌ Usuario no existe');
        showMessage('Error: Usuario o contraseña incorrectos.', 'error');
    }
}

function showMessage(msg, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = msg;
    
    messageElement.classList.remove('success', 'error', 'hidden-message');
    messageElement.classList.add('show-message');
    
    if (type === 'success') {
        messageElement.classList.add('success');
    } else {
        messageElement.classList.add('error');
    }
    
    setTimeout(() => {
        messageElement.classList.remove('show-message');
    }, 4000);
}

// ============================================
// NAVEGACIÓN ENTRE SECCIONES
// ============================================

function navigateByRole(role) {
    // Ocultar todas las secciones
    document.getElementById('loginSection').classList.remove('active');
    document.getElementById('studentSection').classList.remove('active');
    document.getElementById('teacherSection').classList.remove('active');
    
    // Mostrar sección correspondiente
    if (role === 'student') {
        document.getElementById('studentSection').classList.add('active');
        document.getElementById('studentName').textContent = currentUser.name;
        document.getElementById('studentFullName').textContent = currentUser.name;
        initializeStudentView();
    } else if (role === 'teacher') {
        document.getElementById('teacherSection').classList.add('active');
        document.getElementById('teacherName').textContent = currentUser.name;
        initializeTeacherView();
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Mostrar login
    document.getElementById('loginSection').classList.add('active');
    document.getElementById('studentSection').classList.remove('active');
    document.getElementById('teacherSection').classList.remove('active');
    
    // Limpiar formulario
    document.getElementById('loginForm').reset();
    document.getElementById('usuario').focus();
}

// ============================================
// VISTAS DE ESTUDIANTE
// ============================================

function initializeStudentView() {
    // Mostrar vista de kardex por defecto
    switchStudentView('kardex');
}

function switchStudentView(view) {
    // Ocultar todas las vistas de estudiante
    const studentViews = document.querySelectorAll('.student-view');
    studentViews.forEach(v => v.classList.remove('active'));
    
    // Mostrar vista seleccionada
    const viewElement = document.getElementById(view + '-view');
    if (viewElement) {
        viewElement.classList.add('active');
    }
    
    // Actualizar navegación activa
    document.querySelectorAll('.horizontal-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.nav-item[data-view="${view}"]`)?.classList.add('active');
}

function showStudentProfile() {
    alert('Perfil del estudiante: ' + currentUser.name);
}

function showStudentSettings() {
    alert('Configuración del estudiante');
}

// ============================================
// VISTAS DE PROFESOR
// ============================================

function initializeTeacherView() {
    // Mostrar vista de clases por defecto
    switchTeacherView('clases');
}

function switchTeacherView(view) {
    // Ocultar todas las vistas de profesor
    const teacherViews = document.querySelectorAll('.teacher-view');
    teacherViews.forEach(v => v.classList.remove('active'));
    
    // Mostrar vista seleccionada
    const viewElement = document.getElementById(view + '-view');
    if (viewElement) {
        viewElement.classList.add('active');
    }
    
    // Actualizar navegación activa
    document.querySelectorAll('.main-header-content .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.nav-item[data-page="${view}"]`)?.classList.add('active');
}

function openGradeEntry(classId) {
    console.log('Abriendo captura de calificaciones para:', classId);
    switchTeacherView('calificaciones');
    setTimeout(() => {
        document.getElementById('classSelector').value = classId;
        loadClassGrades(classId);
    }, 100);
}

function openAttendance(classId) {
    alert(`Abriendo lista de asistencia para ${classInfo[classId].title}`);
}

function loadClassGrades(classId) {
    const container = document.getElementById('gradesTableContainer');
    
    if (!classId) {
        container.innerHTML = '<p>Selecciona una clase para ver los estudiantes.</p>';
        return;
    }
    
    const students = studentData[classId] || [];
    const classDetails = classInfo[classId];
    
    if (students.length === 0) {
        container.innerHTML = '<p>No hay estudiantes en esta clase.</p>';
        return;
    }
    
    let html = `
        <h3>${classDetails.title} - ${classDetails.group}</h3>
        <table class="grades-table">
            <thead>
                <tr>
                    <th>Matrícula</th>
                    <th>Nombre</th>
                    <th>ET (70%)</th>
                    <th>PP (30%)</th>
                    <th>Calificación Final</th>
                    <th>Estatus</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    students.forEach(student => {
        const finalGrade = (student.et * 0.70) + (student.pp * 0.30);
        const status = finalGrade >= 6 ? 'Aprobado' : 'Reprobado';
        const statusClass = finalGrade >= 6 ? 'approved' : 'failed';
        
        html += `
            <tr>
                <td>${student.matricula}</td>
                <td>${student.nombre}</td>
                <td><input type="number" value="${student.et}" min="0" max="10" step="0.1" class="grade-input"></td>
                <td><input type="number" value="${student.pp}" min="0" max="10" step="0.1" class="grade-input"></td>
                <td><strong>${finalGrade.toFixed(2)}</strong></td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
            </tr>
        `;
    });
    
    html += `
        </tbody>
        </table>
        <button class="btn btn-primary" onclick="saveGrades('${classId}')">
            <i class="fas fa-save"></i> Guardar Calificaciones
        </button>
    `;
    
    container.innerHTML = html;
}

function saveGrades(classId) {
    alert(`Calificaciones guardadas para ${classInfo[classId].title}`);
}

function showTeacherSettings() {
    alert('Configuración del profesor');
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

function setupProfileDropdowns() {
    // Dropdown de estudiante
    const profileToggleStudent = document.getElementById('profileToggleStudent');
    const profileDropdownStudent = document.getElementById('profileDropdownStudent');
    
    if (profileToggleStudent) {
        profileToggleStudent.addEventListener('click', () => {
            profileDropdownStudent.style.display = 
                profileDropdownStudent.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Dropdown de profesor
    const profileToggleTeacher = document.getElementById('profileToggleTeacher');
    const profileDropdownTeacher = document.getElementById('profileDropdownTeacher');
    
    if (profileToggleTeacher) {
        profileToggleTeacher.addEventListener('click', () => {
            profileDropdownTeacher.style.display = 
                profileDropdownTeacher.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.profile-dropdown')) {
            if (profileDropdownStudent) profileDropdownStudent.style.display = 'none';
            if (profileDropdownTeacher) profileDropdownTeacher.style.display = 'none';
        }
    });
}

function setupThemeToggle() {
    const themeToggleStudent = document.getElementById('themeToggleStudent');
    const themeToggleTeacher = document.getElementById('themeToggleTeacher');
    
    const toggleTheme = (toggle) => {
        if (toggle) {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            toggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        }
    };
    
    if (themeToggleStudent) {
        themeToggleStudent.addEventListener('click', () => toggleTheme(themeToggleStudent));
    }
    
    if (themeToggleTeacher) {
        themeToggleTeacher.addEventListener('click', () => toggleTheme(themeToggleTeacher));
    }
    
    // Aplicar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function checkExistingSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        navigateByRole(currentUser.role);
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    checkExistingSession();
});
