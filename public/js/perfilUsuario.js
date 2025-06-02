document.addEventListener('DOMContentLoaded', async () => {
    let usuarioId;

    try {
        /*
        const response = await fetch('http://localhost:3000/usuarios/api/auth/check', {
            method: 'GET',
            credentials: 'include'
        });
        */
      
    const response = await fetch('https://tikapawdbp.onrender.com/usuarios/api/auth/check', {
    method: 'GET',
    credentials: 'include'
});
        const data = await response.json();
        console.log('Respuesta de autenticación completa:', data); 

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (data.isValid && data.tipo === 'usuario') {
            usuarioId = data.userId;
            const userData = data.data || data.user || data; 
            document.getElementById('nombre').textContent = userData.username || userData.nombre || 'Usuario';
            document.getElementById('edad').textContent = userData.edad || 'No especificada';
            document.getElementById('correo').textContent = userData.correo || 'No especificado';
            document.getElementById('telefono').textContent = userData.telefono || 'No especificado';

            console.log('Datos del usuario asignados:', {
                nombre: document.getElementById('nombre').textContent,
                edad: document.getElementById('edad').textContent,
                correo: document.getElementById('correo').textContent,
                telefono: document.getElementById('telefono').textContent
            });

            await cargarSolicitudes();
        } else {
            const mensajeError = document.getElementById('mensaje-error');
            mensajeError.textContent = 'Sesión no válida o tipo de usuario incorrecto';
            mensajeError.classList.remove('oculto');
            window.location.href = '/usuarios/login';
        }
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        const mensajeError = document.getElementById('mensaje-error');
        mensajeError.textContent = `Error al verificar autenticación: ${error.message}`;
        mensajeError.classList.remove('oculto');
        window.location.href = '/usuarios/login';
    }

    async function cargarSolicitudes() {
        try {
            const response = await fetch(`http://localhost:3000/solicitudes/solicitudes?tipo=usuario&id=${usuarioId}`, {
                credentials: 'include'
            });
            const data = await response.json();
            const resultadosSolicitudes = document.getElementById('resultados-solicitudes');
            const mensajeError = document.getElementById('mensaje-error');
            resultadosSolicitudes.innerHTML = '';

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (data.success && data.solicitudes && data.solicitudes.length > 0) {
                data.solicitudes.forEach(solicitud => {
                    const tarjeta = document.createElement('div');
                    tarjeta.className = 'tarjeta-solicitud';
                    tarjeta.innerHTML = `
                        <img src="${solicitud.mascota_foto || '/img/cat.jpeg'}" alt="${solicitud.mascota_nombre || 'Mascota'}">
                        <h3>Solicitud #${solicitud.idsolicitud}</h3>
                        <p><strong>Mascota:</strong> ${solicitud.mascota_nombre || 'Desconocida'}</p>
                        <p><strong>Fecha:</strong> ${new Date(solicitud.fecha).toLocaleDateString('es-ES')}</p>
                        <p><strong>Estado:</strong> <span class="estado-${solicitud.estado}">${solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}</span></p>
                        <a href="/mascota.html?mascotaId=${solicitud.idmascota}" class="boton-heroico">Ver Mascota</a>
                    `;
                    resultadosSolicitudes.appendChild(tarjeta);
                });
            } else {
                resultadosSolicitudes.innerHTML = '<p>No hay solicitudes de adopción aún.</p>';
            }
        } catch (error) {
            console.error('Error al cargar solicitudes:', error);
            const mensajeError = document.getElementById('mensaje-error');
            mensajeError.textContent = `Error al cargar las solicitudes: ${error.message}`;
            mensajeError.classList.remove('oculto');
        }
    }

    document.getElementById('logout').addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:3000/usuarios/logout', {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = '/usuarios/login';
            } else {
                const mensajeError = document.getElementById('mensaje-error');
                mensajeError.textContent = 'Error al cerrar sesión';
                mensajeError.classList.remove('oculto');
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            const mensajeError = document.getElementById('mensaje-error');
            mensajeError.textContent = 'Error al cerrar sesión';
            mensajeError.classList.remove('oculto');
        }
    });
});
