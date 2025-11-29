// Funciones de utilidad (Mantenidas)
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const profileSpan = document.querySelector('#profileToggle span');
        if (profileSpan) {
            profileSpan.textContent = currentUser;
        }
    }
});

function goToGrades(classId) {
    console.log(`Navegando a calificaciones para la clase: ${classId}`);
    window.location.href = `calif.html?classId=${classId}`;
}

function takeAttendance(classId) {
    console.log(`Navegando a toma de asistencia para la clase: ${classId}`);
    alert(`Abriendo herramienta de Lista para la clase ${classId}`);
}

// LÓGICA DE NEGOCIO: Promedio 70/30 (Mantenida)
function calculateFinalGrade(et, pp) {
    // Mantenemos 70% para ET (Evaluación Total) y 30% para PP (Proyecto Prototípico)
    const finalGrade = (et * 0.70) + (pp * 0.30);
    return finalGrade;
}

// SIMULACIÓN DE DATA POR GRUPO (Mantenida)
const studentData = {
    'GANA': [
        // GEOMETRÍA ANALÍTICA (4 alumnos)
        { matricula: 'M1001', nombre: 'Pérez López, Ana C.' , et: 8.5, pp: 9.0 },
        { matricula: 'M1002', nombre: 'García Ruiz, Carlos' , et: 6.0, pp: 5.0 },
        { matricula: 'M1003', nombre: 'Vásquez Soto, María' , et: 9.5, pp: 10.0 },
        { matricula: 'M1004', nombre: 'Rojas Aguilar, José' , et: 7.2, pp: 6.8 },
    ],
    'ALIN': [
        // ÁLGEBRA LINEAL (6 alumnos)
        { matricula: 'M2010', nombre: 'Castro Mena, David' , et: 7.8, pp: 7.5 },
        { matricula: 'M2011', nombre: 'Flores Luna, Valeria' , et: 5.5, pp: 6.5 },
        { matricula: 'M2012', nombre: 'Hernández Gil, Marco' , et: 8.9, pp: 9.2 },
        { matricula: 'M2013', nombre: 'Morales Cruz, Laura' , et: 10.0, pp: 9.5 },
        { matricula: 'M2014', nombre: 'Ochoa Vega, Raúl' , et: 6.5, pp: 7.0 },
        { matricula: 'M2015', nombre: 'Quiroz Paz, Emilia' , et: 4.0, pp: 3.5 },
    ],
    'CINT': [
        // CÁLCULO INTEGRAL (3 alumnos)
        { matricula: 'M3020', nombre: 'Álvarez Sofía' , et: 9.0, pp: 10.0 },
        { matricula: 'M3021', nombre: 'Benítez Juan' , et: 7.5, pp: 6.0 },
        { matricula: 'M3022', nombre: 'Díaz David' , et: 6.8, pp: 8.0 },
    ]
};

const classDataMap = {
    'GANA': { id: 'GANA', title: 'GEOMETRÍA ANALÍTICA', group: 'GPO-103', name: 'GEOMETRÍA ANALÍTICA (GPO-103)' },
    'ALIN': { id: 'ALIN', title: 'ÁLGEBRA LINEAL', group: 'GPO-201', name: 'ÁLGEBRA LINEAL (GPO-201)' },
    'CINT': { id: 'CINT', title: 'CÁLCULO INTEGRAL', group: 'GPO-301', name: 'CÁLCULO INTEGRAL (GPO-301)' }
};

// Funciones de manejo de tabla de calificaciones
function createStudentRow(student, index) {
    const finalGradeValue = calculateFinalGrade(student.et, student.pp);
    const finalGradeDisplay = finalGradeValue.toFixed(2);
    const gradeClass = finalGradeValue >= 7.0 ? 'grade-approved' : 'grade-failed';

    return `
        <tr>
            <td>${index + 1}</td>
            <td>${student.nombre}</td>
            <td><input type="number" class="grade-input" min="0" max="10" step="0.1" value="${student.et.toFixed(1)}" data-matricula="${student.matricula}" data-periodo="ET"></td>
            <td><input type="number" class="grade-input" min="0" max="10" step="0.1" value="${student.pp.toFixed(1)}" data-matricula="${student.matricula}" data-periodo="PP"></td>
            <td class="final-grade-cell" data-matricula="${student.matricula}">
                <span class="grade-chip ${gradeClass}">${finalGradeDisplay}</span>
            </td>
        </tr>
    `;
}

function loadGradesTable(classId) {
    const tableBody = document.getElementById('gradesTableBody');
    const students = studentData[classId] || [];

    tableBody.innerHTML = '';

    let tableHtml = '';
    students.forEach((student, index) => {
        tableHtml += createStudentRow(student, index);
    });

    tableBody.innerHTML = tableHtml;

    setupGradeInputListeners();
}

function loadClassInfo(classId) {
    const data = classDataMap[classId] || { title: 'Clase Desconocida', group: 'N/A' };
    const selector = document.getElementById('groupSelector');

    if (selector) selector.value = classId;

    if (document.getElementById('gradesTableBody')) {
        loadGradesTable(classId);
    }
}

function saveGrades() {
    const currentClassId = document.getElementById('groupSelector').value;
    const inputs = document.querySelectorAll('.grade-input');
    let hasInvalidGrade = false;

    inputs.forEach(input => {
        const grade = parseFloat(input.value);
        if (isNaN(grade) || grade < 0 || grade > 10) {
            input.style.borderColor = '#dc3545';
            hasInvalidGrade = true;
        } else {
            input.style.borderColor = '';
        }
    });

    if (hasInvalidGrade) {
        alert("¡Error! Una o más calificaciones son inválidas. Deben ser entre 0 y 10.");
    } else {
        alert(`¡Calificaciones de ${classDataMap[currentClassId].name} guardadas con éxito!`);
    }
}

function setupGradeInputListeners() {
    const gradeInputs = document.querySelectorAll('.grade-input');

    gradeInputs.forEach(input => {
        // Asegurar que solo haya un listener por input
        input.removeEventListener('input', handleGradeInput);
        input.addEventListener('input', handleGradeInput);
    });
}

function handleGradeInput(event) {
    const matricula = event.target.getAttribute('data-matricula');
    updateStudentAverage(matricula);
}

function updateStudentAverage(matricula) {
    const studentInputs = document.querySelectorAll(`.grade-input[data-matricula="${matricula}"]`);
    const finalCell = document.querySelector(`.final-grade-cell[data-matricula="${matricula}"] .grade-chip`);

    let et=0, pp=0;

    studentInputs.forEach(si => {
        const value = parseFloat(si.value) || 0;
        if (si.getAttribute('data-periodo') === 'ET') et = value;
        if (si.getAttribute('data-periodo') === 'PP') pp = value;
    });

    const finalGradeValue = calculateFinalGrade(et, pp);
    const finalGradeDisplay = finalGradeValue.toFixed(2);

    if (finalCell) {
        finalCell.textContent = finalGradeDisplay;
        finalCell.classList.remove('grade-approved', 'grade-failed');

        if (finalGradeValue >= 7.0) {
            finalCell.classList.add('grade-approved');
        } else {
            finalCell.classList.add('grade-failed');
        }
    }
}

// NUEVA FUNCIÓN: Lógica de chat simulada para mensajes.html
function loadChat(chatId) {
    const messagesArea = document.getElementById('messagesArea');
    const chatHeader = document.getElementById('chatHeader');
    const conversationCards = document.querySelectorAll('.conversation-card');

    // Desactivar todas las tarjetas y activar la actual
    conversationCards.forEach(card => card.classList.remove('active'));
    document.querySelector(`.conversation-card[onclick="loadChat('${chatId}')"]`).classList.add('active');

    // Simulación de carga de contenido dinámico
    let chatName = '';
    let chatStatus = '';
    let avatarInitials = '';
    let messages = '';

    switch(chatId) {
        case 'colega':
            chatName = 'Colega, Mtro. Carlos F.';
            chatStatus = 'Profesor, Dpto. Matemáticas';
            avatarInitials = 'CF';
            messages = `
                <div class="message received"><p>Profesor, le confirmo la reunión de coordinación para el Jueves a las 10:00 AM.</p><span class="message-time">Ayer 18:30 PM</span></div>
                <div class="message sent"><p>Confirmado, Carlos. Allí estaré. Gracias por avisar.</p><span class="message-time">Ayer 18:35 PM</span></div>
            `;
            break;
        case 'valeria':
            chatName = 'Valeria Ruiz';
            chatStatus = 'Estudiante, GPO-201';
            avatarInitials = 'VR';
            messages = `
                <div class="message received"><p>Profesor, estoy atascada en el ejercicio 5 del último práctico. ¿Podría darme una pista?</p><span class="message-time">Martes 14:00 PM</span></div>
                <div class="message received"><p>El de las matrices inversas.</p><span class="message-time">Martes 14:00 PM</span></div>
                <div class="message sent"><p>Hola Valeria. Revisa la propiedad de identidad y el método de Gauss-Jordan. No olvides usar la fila pivote. 😉</p><span class="message-time">Hoy 08:00 AM</span></div>
            `;
            break;
        case 'ana':
        default:
            chatName = 'Ana C. Pérez López';
            chatStatus = 'Estudiante, GPO-103';
            avatarInitials = 'AC';
            messages = `
                <div class="message received"><p>Buen día, profesor. Quería preguntarle sobre la nota final de ET. ¿Podría revisarla?</p><span class="message-time">10:28 AM</span></div>
                <div class="message sent"><p>Buen día, Ana. Claro, envíame tu matrícula para revisar. ¿Tienes alguna duda específica sobre el cálculo?</p><span class="message-time">10:30 AM</span></div>
                <div class="message received"><p>Mi matrícula es M1001. ¡Gracias!</p><span class="message-time">10:32 AM</span></div>
            `;
            break;
    }

    // Actualizar encabezado
    chatHeader.querySelector('.avatar-md').textContent = avatarInitials;
    chatHeader.querySelector('.chat-name').textContent = chatName;
    chatHeader.querySelector('.chat-status').textContent = chatStatus;

    // Actualizar área de mensajes
    messagesArea.innerHTML = messages;
    
    // Asegurar que se vea el último mensaje
    messagesArea.scrollTop = messagesArea.scrollHeight;
}


// =========================================================
// LÓGICA GENERAL, DARK MODE Y PERFIL (ROBUSTA)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const profileToggle = document.getElementById('profileToggle');
    const profileDropdown = document.getElementById('profileDropdown');
    const themeToggle = document.getElementById('themeToggle');
    const groupSelector = document.getElementById('groupSelector');

    // 1. LÓGICA DE MENÚ DESPLEGABLE
    if (profileToggle && profileDropdown) {
        profileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });

        window.addEventListener('click', (e) => {
            if (!profileToggle.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }

    // 2. LÓGICA PARA MARCAR EL BOTÓN ACTIVO
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.horizontal-nav .nav-item');

    navItems.forEach(item => {
        item.classList.remove('active');
        const itemHref = item.getAttribute('href').split('/').pop();

        if (itemHref === currentPage || (currentPage === "" && itemHref === "myclass.html")) {
            item.classList.add('active');
        }
    });

    // 3. LÓGICA DE DARK MODE
    if (themeToggle) {
        const iconElement = themeToggle.querySelector('i');

        const applyTheme = (isDark) => {
            const body = document.body;

            if (isDark) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                if (iconElement) {
                    iconElement.classList.remove('fa-sun');
                    iconElement.classList.add('fa-moon');
                }
                themeToggle.setAttribute('aria-label', 'Cambiar a Tema Claro');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
                if (iconElement) {
                    iconElement.classList.remove('fa-moon');
                    iconElement.classList.add('fa-sun');
                }
                themeToggle.setAttribute('aria-label', 'Cambiar a Tema Oscuro');
            }
        };

        // Carga Inicial del Tema
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme === 'dark');

        // Event Listener para el Toggle
        themeToggle.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme === 'dark');
        });
    }


    // 4. Inicializar la página de captura de calificaciones
    if (currentPage === "calif.html") {

        const urlParams = new URLSearchParams(window.location.search);
        let classIdToLoad = urlParams.get('classId') || 'GANA';

        if (groupSelector) {
            groupSelector.value = classIdToLoad;
            groupSelector.addEventListener('change', (event) => {
                const newClassId = event.target.value;
                loadClassInfo(newClassId);
                alert(`Cargando calificaciones para la clase: ${classDataMap[newClassId].name}`);
            });
        }

        loadClassInfo(classIdToLoad);
    }

    // 5. Configurar enlaces de Cerrar Sesión: limpiar session y redirigir a login
    function setupLogoutLinks() {
        const logoutLinks = document.querySelectorAll('a.logout, .logout');
        logoutLinks.forEach(link => {
            link.removeEventListener('click', handleLogoutClick);
            link.addEventListener('click', handleLogoutClick);
        });
    }

    function handleLogoutClick(e) {
        e.preventDefault();
        // Limpiar sessionStorage (mantener localStorage como preferencia de tema si el usuario lo desea)
        try { sessionStorage.clear(); } catch (err) { /* ignore */ }
        // Redirigir a la página de login
        const href = this && this.getAttribute ? this.getAttribute('href') : 'login.html';
        window.location.href = href || 'login.html';
    }

    setupLogoutLinks();
});