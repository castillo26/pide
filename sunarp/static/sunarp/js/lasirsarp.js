// Enviar formulario LASIRSARP
document.getElementById('consultaForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = document.getElementById('btnConsultar');
    const resultadoDiv = document.getElementById('resultado');
    const resultadoTitulo = document.getElementById('resultadoTitulo');
    const resultadoContenido = document.getElementById('resultadoContenido');

    // Obtener valores del formulario
    const data = {
        registro: document.getElementById('registro').value,
        zona: document.getElementById('zona').value,
        oficina: document.getElementById('oficina').value,
        partida: document.getElementById('partida').value
    };

    // Validar que todos los campos tengan valor
    if (!data.registro || !data.zona || !data.oficina || !data.partida) {
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
        const response = await fetch('/sunarp/lasirsarp/', {
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

            if (resultado.data && resultado.data.asientos) {
                const asientos = resultado.data.asientos;
                let html = '<div class="asientos-container">';

                // Información general
                if (asientos.transaccion) {
                    html += `<div class="info-general">`;
                    html += `<p><strong>Transacción:</strong> ${asientos.transaccion}</p>`;
                    if (asientos.nroTotalPag) {
                        html += `<p><strong>Total de Páginas:</strong> ${asientos.nroTotalPag}</p>`;
                    }
                    html += '</div>';
                }

                // Lista de asientos
                if (asientos.listAsientos && asientos.listAsientos.length > 0) {
                    html += '<h4>Lista de Asientos:</h4>';
                    asientos.listAsientos.forEach((asiento, index) => {
                        html += '<div class="data-item">';
                        html += `<p><strong>Asiento #${index + 1}</strong></p>`;
                        html += `<p><strong>ID Imagen:</strong> ${asiento.idImgAsiento || 'N/A'}</p>`;
                        html += `<p><strong>Número de Páginas:</strong> ${asiento.numPag || 'N/A'}</p>`;
                        html += `<p><strong>Tipo:</strong> ${asiento.tipo || 'N/A'}</p>`;

                        // Lista de páginas del asiento
                        if (asiento.listPag && asiento.listPag.length > 0) {
                            html += '<div class="paginas-list">';
                            html += '<p><strong>Páginas:</strong></p><ul>';
                            asiento.listPag.forEach((pag) => {
                                html += `<li>Página ${pag.pagina || 'N/A'} (Ref: ${pag.nroPagRef || 'N/A'})</li>`;
                            });
                            html += '</ul></div>';
                        }
                        html += '</div>';
                    });
                } else {
                    html += '<p>No se encontraron asientos para esta partida.</p>';
                }

                html += '</div>';
                resultadoContenido.innerHTML = html;
            } else {
                // Mostrar respuesta completa si no tiene la estructura esperada
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
        btn.textContent = 'Consultar Asientos';
    }
});