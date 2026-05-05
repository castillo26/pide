// Enviar formulario VASIRSARP
document.getElementById('consultaForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = document.getElementById('btnConsultar');
    const resultadoDiv = document.getElementById('resultado');
    const resultadoTitulo = document.getElementById('resultadoTitulo');
    const resultadoContenido = document.getElementById('resultadoContenido');

    // Obtener valores del formulario
    const data = {
        transaccion: document.getElementById('transaccion').value,
        idImg: document.getElementById('idImg').value,
        tipo: document.getElementById('tipo').value,
        nroTotalPag: document.getElementById('nroTotalPag').value,
        nroPagRef: document.getElementById('nroPagRef').value,
        pagina: document.getElementById('pagina').value
    };

    // Validar que todos los campos tengan valor
    if (!data.transaccion || !data.idImg || !data.tipo || !data.nroTotalPag || !data.nroPagRef || !data.pagina) {
        resultadoDiv.style.display = 'block';
        resultadoDiv.className = 'resultado error';
        resultadoTitulo.textContent = 'Error';
        resultadoContenido.innerHTML = '<p>Por favor complete todos los campos requeridos.</p>';
        return;
    }

    // Mostrar estado de carga
    btn.disabled = true;
    btn.textContent = 'Consultando...';
    resultadoDiv.style.display = 'none';

    try {
        const response = await fetch('/sunarp/vasirsarp/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const resultado = await response.json();

        resultadoDiv.style.display = 'block';

        if (resultado.success) {
            resultadoDiv.className = 'resultado success';
            resultadoTitulo.textContent = 'Consulta Exitosa';

            if (resultado.data) {
                // La respuesta viene en verAsientoSIRSARPResponse
                let imgBase64 = null;

                if (resultado.data.verAsientoSIRSARPResponse) {
                    imgBase64 = resultado.data.verAsientoSIRSARPResponse.img;
                } else if (resultado.data.img) {
                    imgBase64 = resultado.data.img;
                }

                if (imgBase64) {
                    resultadoContenido.innerHTML = `
                        <div class="imagen-container">
                            <img src="data:image/jpeg;base64,${imgBase64}" alt="Asiento Registral" style="max-width: 100%; height: auto;">
                        </div>
                    `;
                } else {
                    resultadoContenido.innerHTML = '<pre>' + JSON.stringify(resultado.data, null, 2) + '</pre>';
                }
            } else {
                resultadoContenido.innerHTML = '<pre>' + JSON.stringify(resultado, null, 2) + '</pre>';
            }
        } else {
            resultadoDiv.className = 'resultado error';
            resultadoTitulo.textContent = 'Error en la consulta';
            resultadoContenido.innerHTML = '<p>' + (resultado.error || 'Error desconocido') + '</p>';
            if (resultado.response) {
                resultadoContenido.innerHTML += '<details><summary>Respuesta del servidor</summary><pre>' + resultado.response + '</pre></details>';
            }
        }
    } catch (error) {
        resultadoDiv.style.display = 'block';
        resultadoDiv.className = 'resultado error';
        resultadoTitulo.textContent = 'Error';
        resultadoContenido.innerHTML = '<p>Error de conexión: ' + error.message + '</p>';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Ver Imagen';
    }
});
