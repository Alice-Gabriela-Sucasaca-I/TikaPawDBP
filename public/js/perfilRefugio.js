document.addEventListener('DOMContentLoaded', () => {
    const mensajeError = document.getElementById('mensaje-error');
    const resultadosSolicitudes = document.getElementById('resultados-solicitudes');
    let idcentro;

    //fetch('http://localhost:3000/usuarios/api/auth/check', { credentials: 'include' })
    fetch('https://tikapawdbp.onrender.com/usuarios/api/auth/check', { credentials: 'include' })  
    .then(res => res.json())
        .then(data => {
            if (!data.isValid || data.tipo !== 'refugio') {
                window.location.href = '/usuarios/login';
            } else {
                idcentro = data.userId;
                cargarPerfil();
                cargarMascotas(idcentro);
                cargarSolicitudes();
            }
        })
        .catch(error => {
            console.error('Error al verificar autenticación:', error);
            mensajeError.textContent = 'Error al verificar autenticación.';
            mensajeError.classList.remove('oculto');
        });

    function cargarPerfil() {
        fetch('http://localhost:3000/refugios/api/perfil', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('nombrecentro').textContent = data.refugio.nombrecentro;
                    document.getElementById('nombreencargado').textContent = data.refugio.nombreencargado;
                    document.getElementById('correo').textContent = data.refugio.correo;
                    document.getElementById('telefono').textContent = data.refugio.telefono;
                    document.getElementById('redesociales').textContent = data.refugio.redesociales || 'No especificado';
                } else {
                    mensajeError.textContent = data.message || 'Error al cargar el perfil.';
                    mensajeError.classList.remove('oculto');
                }
            })
            .catch(error => {
                console.error('Error al cargar perfil:', error);
                mensajeError.textContent = 'Error al cargar el perfil.';
                mensajeError.classList.remove('oculto');
            });
    }

    function cargarMascotas(idcentro) {
        fetch(`http://localhost:3000/refugios/mascotas/${idcentro}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                const contenedorGatos = document.getElementById('mascotasRegistradas');
                contenedorGatos.innerHTML = '';

                if (data.success && data.mascotas.length > 0) {
                    data.mascotas.forEach(mascota => {
                        const tarjeta = document.createElement('div');
                        tarjeta.className = 'tarjeta-gato';
                        tarjeta.innerHTML = `
                            <img src="${mascota.foto || '/img/cat.jpeg'}" alt="${mascota.nombre}">
                            <h3>${mascota.nombre}</h3>
                            <p>${mascota.edad} años • ${mascota.descripcion}</p>
                            <button class="boton-solicitudes" data-mascota-id="${mascota.idmascota}">Solicitudes de Adopción</button>
                        `;
                        contenedorGatos.appendChild(tarjeta);
                    });

                    document.querySelectorAll('.boton-solicitudes').forEach(button => {
                        button.addEventListener('click', () => {
                            const mascotaId = button.getAttribute('data-mascota-id');
                            window.location.href = `/refugiosSolicitudes.html?mascotaId=${mascotaId}&idcentro=${idcentro}`;
                        });
                    });
                } else {
                    contenedorGatos.innerHTML = '<p>No hay mascotas registradas en este refugio.</p>';
                }
            })
            .catch(error => {
                console.error('Error al cargar mascotas:', error);
                contenedorGatos.innerHTML = '<p>Error al cargar mascotas.</p>';
            });
    }

    function cargarSolicitudes() {
        fetch(`http://localhost:3000/solicitudes/solicitudes?tipo=refugio&idcentro=${idcentro}`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                console.log('Solicitudes obtenidas:', data); 
                resultadosSolicitudes.innerHTML = '';

                if (data.success && data.solicitudes.length > 0) {
                    data.solicitudes.forEach(solicitud => {
                        const tarjeta = document.createElement('div');
                        tarjeta.className = 'tarjeta-gato';
                        tarjeta.innerHTML = `
                            <h3>Solicitud #${solicitud.idsolicitud}</h3>
                            <p><strong>Usuario:</strong> ${solicitud.usuario_nombre || 'Desconocido'}</p>
                            <p><strong>Mascota:</strong> ${solicitud.mascota_nombre || 'Desconocida'}</p>
                            <p><strong>Fecha:</strong> ${new Date(solicitud.fecha).toLocaleDateString()}</p>
                            <p><strong>Estado:</strong> ${solicitud.estado}</p>
                            <p><strong>Motivo:</strong> ${solicitud.motivo || 'No especificado'}</p>
                            <p><strong>Experiencia:</strong> ${solicitud.experiencia || 'No especificada'}</p>
                            <select class="estado-solicitud" data-solicitud-id="${solicitud.idsolicitud}">
                                <option value="pendiente" ${solicitud.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                                <option value="aprobada" ${solicitud.estado === 'aprobada' ? 'selected' : ''}>Aprobada</option>
                                <option value="rechazada" ${solicitud.estado === 'rechazada' ? 'selected' : ''}>Rechazada</option>
                            </select>
                            <button class="actualizar-estado" data-solicitud-id="${solicitud.idsolicitud}">Actualizar Estado</button>
                        `;
                        resultadosSolicitudes.appendChild(tarjeta);
                    });

                    document.querySelectorAll('.actualizar-estado').forEach(button => {
                        button.addEventListener('click', () => {
                            const solicitudId = button.getAttribute('data-solicitud-id');
                            const select = button.previousElementSibling;
                            const nuevoEstado = select.value;

                            fetch(`http://localhost:3000/solicitudes/solicitudes/${solicitudId}/estado`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ estado: nuevoEstado }),
                                credentials: 'include'
                            })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.success) {
                                        alert('Estado actualizado correctamente');
                                        cargarSolicitudes();
                                    } else {
                                        mensajeError.textContent = data.message || 'Error al actualizar el estado';
                                        mensajeError.classList.remove('oculto');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error al actualizar estado:', error);
                                    mensajeError.textContent = 'Error al actualizar el estado';
                                    mensajeError.classList.remove('oculto');
                                });
                        });
                    });
                } else {
                    resultadosSolicitudes.innerHTML = '<p>No hay solicitudes de adopción aún.</p>';
                }
            })
            .catch(error => {
                console.error('Error al cargar solicitudes:', error);
                resultadosSolicitudes.innerHTML = '<p>Error al cargar solicitudes.</p>';
            });
    }

    document.getElementById('cerrar-sesion').addEventListener('click', () => {
        fetch('http://localhost:3000/refugios/logout', {
            method: 'POST',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/usuarios/login';
                } else {
                    mensajeError.textContent = data.message || 'Error al cerrar sesión';
                    mensajeError.classList.remove('oculto');
                }
            })
            .catch(error => {
                console.error('Error al cerrar sesión:', error);
                mensajeError.textContent = 'Error al cerrar sesión';
                mensajeError.classList.remove('oculto');
            });
    });
});
