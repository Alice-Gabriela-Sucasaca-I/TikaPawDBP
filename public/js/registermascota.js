document.addEventListener('DOMContentLoaded', () => {
    // Cargar refugios en el select
    const selectRefugio = document.getElementById('idcentro');
    fetch('/refugios/refugios')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.refugios.length > 0) {
                data.refugios.forEach(refugio => {
                    const option = document.createElement('option');
                    option.value = refugio.idcentro;
                    option.textContent = refugio.nombrecentro;
                    selectRefugio.appendChild(option);
                });
            } else {
                selectRefugio.innerHTML = '<option value="">No hay refugios disponibles</option>';
            }
        })
        .catch(error => {
            console.error('Error al cargar refugios:', error);
            selectRefugio.innerHTML = '<option value="">Error al cargar refugios</option>';
        });

    // Manejar el envío del formulario
    const form = document.getElementById('register-mascota-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

function handleSubmit(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Capturar los datos del formulario
    const formData = new FormData(event.target);
    const data = {
        idcentro: parseInt(formData.get('idcentro')),
        nombre: formData.get('nombre'),
        tamanio: formData.get('tamanio'),
        especie: formData.get('especie'),
        edad: parseInt(formData.get('edad')),
        genero: formData.get('genero'),
        descripcion: formData.get('descripcion')
    };

    // Enviar los datos al servidor
    fetch('/mascotas/registermascota', {
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
            // Limpiar el formulario
            event.target.reset();
            // Ocultar el mensaje después de 5 segundos
            setTimeout(() => {
                exito.style.display = 'none';
            }, 5000);
        } else {
            console.error('Error al registrar mascota:', result.message);
            alert('Error al registrar mascota: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Hubo un error al enviar el formulario. Por favor, intenta de nuevo.');
    });
}