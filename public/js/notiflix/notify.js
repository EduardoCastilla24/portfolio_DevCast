export function Notify(type, text, position = 'center-top', animate = 'from-top'){
    // Definir los tipos de notificación que Notiflix puede manejar
    const notificationTypes = {
        failure: Notiflix.Notify.failure,
        success: Notiflix.Notify.success,
        info: Notiflix.Notify.info,
        warning: Notiflix.Notify.warning,
    };

    // Verificar si el tipo de notificación es válido
    if (notificationTypes[type]) {
        // Llamar al método correspondiente de Notiflix con el mensaje y la configuración
        notificationTypes[type](text, {
            position: position,
            distance: '30px',
            fontSize: '12px',
            cssAnimationStyle: animate,
            clickToClose: true,
            pauseOnHover: true,
        });
    } else {
        console.warn(`Tipo de notificación "${type}" no válido. Usa uno de: failure, success, info, warning.`);
    }
}
