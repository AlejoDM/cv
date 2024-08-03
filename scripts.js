document.addEventListener("DOMContentLoaded", function() {
    showSection('inicio'); // Mostrar la sección de inicio por defecto
});

function showSection(sectionId) {
    const sections = document.querySelectorAll("main section");
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add("active");
        } else {
            section.classList.remove("active");
        }
    });
}
