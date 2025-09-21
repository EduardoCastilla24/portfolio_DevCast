import { Close_Modal } from "/js/Modal/Modal.js";

document.getElementById("modal_contact_form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = document.getElementById("modal_contact_form");
    const RAW_FORM_DATA = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        message: form.message.value.trim()
    };

    // Cierra el modal antes de enviar
    Close_Modal('modal_contact', 'modal_contact_form');

    // Mostrar indicador de carga
    Notiflix.Loading.standard("Enviando mensaje...");

    try {
        const res = await fetch("https://magicloops.dev/api/loop/run/b09bf734-661a-411b-aea5-f9034e15190cc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            RAW_FORM_DATA: JSON.stringify(RAW_FORM_DATA)
        });

        Notiflix.Loading.remove();

        if (!res.ok) throw new Error("Error en el envío");

        Notiflix.Notify.success("Mensaje enviado correctamente ✅");
        form.reset();
    } catch (err) {
        Notiflix.Loading.remove();
        Notiflix.Notify.failure("Hubo un error al enviar el mensaje ❌");
        console.error(err);
    }
});
