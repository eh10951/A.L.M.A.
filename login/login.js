// Obtiene la referencia al formulario y al elemento donde se mostrará el mensaje
const loginForm = document.getElementById('loginForm');
const messageElement = document.getElementById('message');

// Función que se ejecuta cuando se intenta enviar el formulario
loginForm.addEventListener('submit', function(event) {
    // 1. Previene el envío por defecto (para que la página no se recargue)
    event.preventDefault(); 

    // 2. Obtiene los valores de los campos
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    // 3. Lógica de validación y redirección
    if (usuario === 'alumno' && password === '1234') {
        localStorage.setItem('currentUser', 'Ana C. Pérez López');
        showMessage('¡Bienvenido Alumno!', 'success');
        setTimeout(() => {
            window.location.href = '../student/plantilla.html';
        }, 1500);
    } else if (usuario === 'profesor' && password === '1234') {
        localStorage.setItem('currentUser', 'Profesor A.');
        showMessage('¡Bienvenido Profesor!', 'success');
        setTimeout(() => {
            window.location.href = '../teacher/myclass.html';
        }, 1500);
    } else if (usuario === 'admin' && password === '12345') {
        localStorage.setItem('currentUser', 'Administrador');
        showMessage('¡Bienvenido Administrador!', 'success');
        setTimeout(() => {
            window.location.href = '../teacher/myclass.html';
        }, 1500);
    } else {
        // Error
        showMessage('Error: Usuario o contraseña incorrectos.', 'error');
    }
});

/**
 * Muestra un mensaje en la tarjeta de login.
 * @param {string} msg - El texto a mostrar.
 * @param {string} type - 'success' o 'error' para definir el color.
 */
function showMessage(msg, type) {
    messageElement.textContent = msg;
    
    // Remueve las clases anteriores y añade la clase de visibilidad
    messageElement.classList.remove('success', 'error', 'hidden-message');
    messageElement.classList.add('show-message');
    
    // Añade la clase de estilo (color)
    if (type === 'success') {
        messageElement.classList.add('success');
    } else {
        // Por defecto o si es error
        messageElement.classList.add('error'); 
    }
    
    // Oculta el mensaje después de 4 segundos
    setTimeout(() => {
        messageElement.classList.remove('show-message');
    }, 4000);
}