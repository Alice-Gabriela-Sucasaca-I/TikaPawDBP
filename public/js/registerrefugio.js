document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-refugio-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

function handleSubmit(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Capturar los datos del formulario
    const formData = new FormData(event.target);
    const data = {
        rubro: formData.get('rubro'),
        nombreencargado: formData.get('nombreencargado'),
        nombrecentro: formData.get('nombrecentro'),
        telefono: formData.get('telefono'),
        correo: formData.get('correo'),
        redesociales: formData.get('redes'),
        contrasena: formData.get('contrasena'), // Nuevo campo
        descripcion: formData.get('descripcion'),
        infoadicional: formData.get('infoadicional')
    };

    // Enviar los datos al servidor
    fetch('/refugios/registerrefugio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            // Mostrar mensaje de éxito
            const exito = document.getElementById('exito');
            exito.style.display = 'block';
            // Opcional: Limpiar el formulario
            event.target.reset();
            // Ocultar el mensaje después de 5 segundos
            setTimeout(() => {
                exito.style.display = 'none';
            }, 5000);
        } else {
            console.error('Error al registrar refugio:', result.message);
            alert('Error al registrar refugio: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Hubo un error al enviar el formulario. Por favor, intenta de nuevo.');
    });
}