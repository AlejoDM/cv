document.addEventListener("DOMContentLoaded", function() {
    showSection('inicio'); // Mostrar la sección de inicio por defecto
});

function showSection(sectionId) {
    const sections = document.querySelectorAll("main section");
    sections.forEach(section => {
        if (section.id !== 'inicio') { // Mantener siempre visible la sección de inicio
            if (section.id === sectionId) {
                section.classList.add("active");
                section.classList.remove("hidden");
            } else {
                section.classList.add("hidden");
                section.classList.remove("active");
            }
        }
    });
}

// Función para ocultar la pantalla de carga cuando la imagen de fondo se ha cargado
window.addEventListener('load', function() {
    var loadingScreen = document.getElementById('loading-screen');

    setTimeout(function() {
        loadingScreen.style.animation = 'fadeOut 1s ease-out forwards'; // Aplica la animación de ocultamiento
    })
});
