
export function Open_Modal(id) {
    const modal = document.getElementById(id); // Selecciona el modal por ID
    modal.showModal();
}

export function Close_Modal(modalId) {
    const modal = document.getElementById(modalId);

    if (modal) {
        modal.close();
    }
}