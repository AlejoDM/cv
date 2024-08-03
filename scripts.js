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
