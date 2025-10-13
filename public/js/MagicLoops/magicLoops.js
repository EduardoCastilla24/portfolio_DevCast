import { Close_Modal } from "/js/Modal/Modal.js";

// ✅ Asegúrate de que el ID del formulario coincida con el que pusiste en tu componente Astro
const form = document.getElementById("modal_contact_form");
if (!form) {
    console.error("❌ No se encontró el formulario con ID 'modal_contact_form'");
}

// Botón de envío
const submitBtn = form?.querySelector("button[type='submit']");

// 🔧 Utilidad: Mostrar mensaje de error debajo del campo
function markInvalid(input, message) {
    const errorTag = input.parentElement.querySelector("p");
    input.classList.add("border-red-500", "focus:border-red-500");
    if (errorTag) {
        errorTag.textContent = message;
        errorTag.classList.remove("hidden");
    }
}

// 🔧 Utilidad: Limpiar errores anteriores
function clearErrors() {
    form.querySelectorAll("input, textarea").forEach(el => {
        el.classList.remove("border-red-500", "focus:border-red-500");
    });
    form.querySelectorAll("p").forEach(el => {
        el.textContent = "";
        el.classList.add("hidden");
    });
}

// ✅ Validar datos del formulario
function validateForm(data) {
    clearErrors();
    let valid = true;

    if (!data.name || data.name.length < 3) {
        markInvalid(form.name, "Por favor, ingresa tu nombre completo.");
        valid = false;
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        markInvalid(form.email, "El correo electrónico no es válido.");
        valid = false;
    }

    if (data.phone && !/^\+?\d{7,15}$/.test(data.phone)) {
        markInvalid(form.phone, "Número de teléfono inválido (mínimo 7 dígitos).");
        valid = false;
    }

    if (!data.message || data.message.length < 10) {
        markInvalid(form.message, "Por favor, escribe un mensaje más detallado.");
        valid = false;
    }

    return valid;
}

// 🚀 Enviar datos a Magic Loops
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        message: form.message.value.trim()
    };

    if (!validateForm(formData)) return;

    // Desactivar botón y mostrar carga
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-50", "cursor-not-allowed");

    // Cerrar modal visualmente
    Close_Modal("modal_contact", "modal_contact_form");
    Notiflix.Loading.standard("Enviando mensaje...");

    try {
        const response = await fetch("https://magicloops.dev/api/loop/d022ad5a-814a-4022-8983-8f6d740c8e4d/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        console.log("🔍 Respuesta Magic Loops:", result);

        // Extraer el cuerpo interno correctamente
        const data = result.body || result;

        // Analizar respuesta del loop
        if (!data.success) {
            throw new Error(data.error || "Error al enviar el mensaje.");
        }

        Notiflix.Notify.success(data.message || "Mensaje enviado correctamente");
        form.reset();
    } catch (error) {
        console.error("❌ Error:", error);
        Notiflix.Notify.failure("Hubo un problema al enviar el mensaje. Intenta nuevamente.");
    } finally {
        // Restaurar el estado del botón
        Notiflix.Loading.remove();
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
});
