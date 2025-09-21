import { Close_Modal } from "/js/Modal/Modal.js";

const form = document.getElementById("modal_contact_form");
const submitBtn = form.querySelector("button[type='submit']");

// Muestra mensaje debajo del input
function markInvalid(input, message) {
    const errorTag = input.parentElement.querySelector("p");
    input.classList.add("border-red-500");
    if (errorTag) {
        errorTag.textContent = message;
        errorTag.classList.remove("hidden");
    }
}

// Limpia mensajes previos
function clearErrors() {
    form.querySelectorAll("input, textarea").forEach(el => {
        el.classList.remove("border-red-500");
    });
    form.querySelectorAll("p").forEach(el => {
        el.textContent = "";
        el.classList.add("hidden");
    });
}

// Validación sin if anidados
function validateForm(data) {
    clearErrors();
    let isValid = true;

    if (data.name.length < 3) {
        markInvalid(form.name, "Ingresa tu nombre completo.");
        isValid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        markInvalid(form.email, "Correo electrónico inválido.");
        isValid = false;
    }
    if (!/^\+?\d{7,15}$/.test(data.phone)) {
        markInvalid(form.phone, "Número de teléfono inválido.");
        isValid = false;
    }
    if (data.message.length < 5) {
        markInvalid(form.message, "Escribe un mensaje más detallado.");
        isValid = false;
    }

    return isValid;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const RAW_FORM_DATA = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        message: form.message.value.trim()
    };

    if (!validateForm(RAW_FORM_DATA)) return;

    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-50", "cursor-not-allowed");

    Close_Modal('modal_contact', 'modal_contact_form');
    Notiflix.Loading.standard("Enviando mensaje...");

    try {
        const res = await fetch("https://magicloops.dev/api/loop/run/b09bf734-661a-411b-aea5-f9034e15190cc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(RAW_FORM_DATA)
        });

        if (!res.ok) throw new Error("Error en el envío");

        Notiflix.Notify.success("Mensaje enviado correctamente ✅");
        form.reset();
    } catch (err) {
        Notiflix.Notify.failure("Hubo un error al enviar el mensaje ❌");
        console.error(err);
    } finally {
        Notiflix.Loading.remove();
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
});
