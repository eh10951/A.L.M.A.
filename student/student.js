// =========================================================
// student.js - Lógica Principal para Kardex de Alumnos (Actualizado con Selector y Gráficos)
// =========================================================

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const profileSpan = document.querySelector('#profileToggle span');
        if (profileSpan) {
            profileSpan.textContent = currentUser;
        }
    }
});

// DATOS DE EJEMPLO: Usamos esta estructura de datos para alimentar el selector y los gráficos.
// En un sistema real, esto se cargaría desde un API o base de datos.
const semesterData = [
    {
        id: 's1',
        name: '1° Semestre',
        status: 'Aprobado',
        average: 8.58,
        subjects: [
            { name: 'Geometría Analítica', grade: 9.2, status: 'Aprobado' },
            { name: 'Matemáticas Discretas', grade: 7.5, status: 'Aprobado' },
            { name: 'Lógica de Programación', grade: 8.8, status: 'Aprobado' },
            { name: 'Ciencias de Datos (Intro)', grade: 9.5, status: 'Aprobado' },
            { name: 'Comunicación Oral y Escrita', grade: 8.0, status: 'Aprobado' },
            { name: 'Introducción a la Economía', grade: 8.5, status: 'Aprobado' },
        ]
    },
    {
        id: 's2',
        name: '2° Semestre',
        status: 'Aprobado',
        average: 8.85,
        subjects: [
            { name: 'Álgebra Lineal', grade: 9.0, status: 'Aprobado' },
            { name: 'Programación (Avanzada)', grade: 8.5, status: 'Aprobado' },
            { name: 'Desarrollo Personal', grade: 9.8, status: 'Aprobado' },
            { name: 'Cálculo Diferencial', grade: 9.2, status: 'Aprobado' },
            { name: 'Estadística Descriptiva', grade: 7.7, status: 'Aprobado' },
            { name: 'Principios Contables', grade: 8.8, status: 'Aprobado' },
        ]
    },
    {
        id: 's3',
        name: '3° Semestre (En Curso)',
        status: 'En Curso',
        average: null,
        subjects: [
            { name: 'Cálculo Integral', status: 'En Curso' },
            { name: 'Fundamentos de BD', status: 'En Curso' },
            { name: 'Estructura de BD', status: 'En Curso' },
            { name: 'Probabilidad', status: 'En Curso' },
            { name: 'Finanzas Corporativas', status: 'En Curso' },
            { name: 'Metodología de la Investigación', status: 'En Curso' },
        ]
    },
];

let subjectBarChart = null;
let statusDoughnutChart = null;

document.addEventListener('DOMContentLoaded', () => {
    const profileToggle = document.getElementById('profileToggle');
    const profileDropdown = document.getElementById('profileDropdown');
    const themeToggle = document.getElementById('themeToggle');
    const selector = document.getElementById('semester-selector');
    const detailsContainer = document.getElementById('semester-details-container');

    // =========================================================
    // 1. LÓGICA DE MENÚ DESPLEGABLE (Perfil)
    // =========================================================
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

    // =========================================================
    // 2. LÓGICA PARA MARCAR EL BOTÓN ACTIVO
    // =========================================================
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.horizontal-nav .nav-item');

    navItems.forEach(item => {
        item.classList.remove('active');
        const itemHref = item.getAttribute('href').split('/').pop();

        if (itemHref === currentPage || (currentPage === "" && itemHref === "kardex.html")) {
            item.classList.add('active');
        }
    });

    // =========================================================
    // 3. LÓGICA DE DARK MODE
    // =========================================================
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
            applyTheme(currentTheme !== 'dark');
        });
    }

    // El resto de la lógica de Kardex/gráficos se mantiene si no estás en docs.html

    // =========================================================
    // 5. LÓGICA PARA MODAL DE DOCUMENTOS (Comprobante de Estudios)
    // =========================================================
    const openModalButton = document.getElementById('openComprobanteModal');
    const pdfModal = document.getElementById('pdfModal');
    const closeModalButton = document.getElementById('closePdfModal');

    if (openModalButton && pdfModal && closeModalButton) {
        // Abrir el modal al hacer click en la tarjeta
        openModalButton.addEventListener('click', () => {
            pdfModal.style.display = 'block';
        });

        // Cerrar el modal con el botón de cerrar (x)
        closeModalButton.addEventListener('click', () => {
            pdfModal.style.display = 'none';
        });

        // Cerrar el modal al hacer click fuera de él
        window.addEventListener('click', (event) => {
            if (event.target === pdfModal) {
                pdfModal.style.display = 'none';
            }
        });

        // Cerrar el modal con la tecla ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                pdfModal.style.display = 'none';
            }
        });
    }


    // =========================================================
    // FUNCIONALIDAD PARA DESCARGA DE DOCUMENTOS Y TRÁMITES (Sección existente)
    // =========================================================

    // Funcionalidad para botones de trámites (código que ya existía)
    const tramiteButtons = document.querySelectorAll('.btn-tramite');
    
    tramiteButtons.forEach(button => {
        if (!button.classList.contains('disabled')) {
            button.addEventListener('click', () => {
                const tramiteName = button.closest('.tramite-card').querySelector('h4').textContent;
                alert(`Has iniciado el trámite: ${tramiteName}. Revisa tu historial de trámites.`);
            });
        }
    });

    // Lógica adicional para el colapso de detalles de semestre (si aplica en otras páginas)
    const semesterHeaders = document.querySelectorAll('.semester-card h4');
    semesterHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const details = header.nextElementSibling.nextElementSibling; // Asume que el siguiente elemento es el contenedor de detalles
            if (details && details.classList.contains('semester-details-content')) {
                details.classList.toggle('show');
            }
        });
    });

});