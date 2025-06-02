// login.js
/*
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('form');
    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();

            const correo = document.getElementById('correo').value;
            const password = document.getElementById('password').value;

            const datos = { correo: correo, password: password };

            fetch('/usuarios/login', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })
            .then(respuesta => respuesta.json())
            .then(datos => {
                if (datos.success) {
                    alert('inicio exitoso :d');
                    window.location.href = '/';
                } 
                else {
                    alert('error: ' + datos.message);
                }
            })
            .catch(error => {
                console.error('error:', error);
                alert('hubo un problema con el inicio de sesion');
            });
        });
    }
});
*/
/*
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar sesión con el backend primero
    try {
        const response = await fetch('/usuarios/api/auth/check', { credentials: 'include' });
        const { isValid, tipo } = await response.json();

        if (isValid) {
            sessionStorage.setItem('tipoUsuario', tipo);
            const currentPath = window.location.pathname;

            // Redirigir según el tipo de usuario
            if (tipo === 'usuario' && !currentPath.includes('/usuarios/perfil')) {
                window.location.replace('/usuarios/perfil/usuario');
            } else if (tipo === 'refugio' && !currentPath.includes('/refugios/perfil')) {
                window.location.replace('/refugios/perfil/refugio');
            }
        } else {
            sessionStorage.removeItem('tipoUsuario');
            if (!window.location.pathname.includes('/usuarios/login')) {
                window.location.replace('/usuarios/login');
            }
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
    }

    // Manejo del formulario de login
    const formulario = document.querySelector('form');
    if (formulario) {
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();
            const correo = document.getElementById('correo').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/usuarios/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo, password }),
                    credentials: 'include'
                });
                const datos = await response.json();

                if (datos.success) {
                    sessionStorage.setItem('tipoUsuario', datos.tipo);
                    window.location.replace(
                        datos.tipo === 'usuario' 
                            ? '/usuarios/perfil/usuario' 
                            : '/refugios/perfil/refugio'
                    );
                } else {
                    alert('Error: ' + datos.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un problema con el inicio de sesión');
            }
        });
    }
});
*/

document.addEventListener('DOMContentLoaded', async () => {
    // 🔍 Verifica inicioo de sesion
    async function verificarSesion() {
        try {
            // 1roo intenta verificar sesion de usuario
            let response = await fetch('/usuarios/api/auth/check', { credentials: 'include' });
            let { isValid, tipo } = await response.json();

            if (isValid) return { isValid, tipo };

            // Si no es usuario, intenta con refugio
            response = await fetch('/refugios/api/auth/check', { credentials: 'include' });
            return await response.json();
        } 
        catch (error) {
            console.error('Error al verificar sesión:', error);
            return { isValid: false };
        }
    }

    const { isValid, tipo } = await verificarSesion();
    const currentPath = window.location.pathname;

    if (isValid) {
        sessionStorage.setItem('tipoUsuario', tipo);

        if (tipo === 'usuario' && !currentPath.startsWith('/usuarios/perfil')) {
            window.location.replace('/usuarios/perfil/usuario');
        } 
        else if (tipo === 'refugio' && !currentPath.startsWith('/refugios/perfil')) {
            window.location.replace('/refugios/perfil/refugio');
        }
    } 
    else {
        sessionStorage.removeItem('tipoUsuario');
        if (!currentPath.includes('/usuarios/login')) {
            window.location.replace('/usuarios/login');
        }
    }

    //  formulario de login
    const formulario = document.querySelector('form');
    if (formulario) {
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();

            const correo = document.getElementById('correo').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/usuarios/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo, password }),
                    credentials: 'include'
                });

                const datos = await response.json();

                if (datos.success) {
                    sessionStorage.setItem('tipoUsuario', datos.tipo);

                    // Redirigir según el tipo de usuario
                    window.location.replace(
                        datos.tipo === 'usuario'
                            ? '/usuarios/perfil/usuario'
                            : '/refugios/perfil/refugio'
                    );
                }
                 else {
                    alert('Error: ' + datos.message);
                }
            } 
            catch (error) {
                console.error('Error:', error);
                alert('Hubo un problema con el inicio de sesión');
            }
        });
    }
});
