// Enviar formulario GOOFICINA
document.getElementById('consultaForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = document.getElementById('btnConsultar');
    const resultadoDiv = document.getElementById('resultado');
    const resultadoTitulo = document.getElementById('resultadoTitulo');
    const resultadoContenido = document.getElementById('resultadoContenido');

    // Mostrar estado de carga
    btn.disabled = true;
    btn.textContent = 'Consultando...';
    resultadoDiv.style.display = 'none';

    try {
        const response = await fetch('/sunarp/goficina/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });

        const resultado = await response.json();

        resultadoDiv.style.display = 'block';

        if (resultado.success) {
            resultadoDiv.className = 'resultado success';
            resultadoTitulo.textContent = 'Consulta Exitosa';

            if (resultado.data) {
                const oficinas = resultado.data.oficina || resultado.data;

                if (Array.isArray(oficinas)) {
                    let html = '<table class="tabla-resultados"><thead><tr>';
                    html += '<th>Código Zona</th>';
                    html += '<th>Código Oficina</th>';
                    html += '<th>Descripción</th>';
                    html += '</tr></thead><tbody>';

                    oficinas.forEach(function(oficina) {
                        html += '<tr>';
                        html += '<td>' + (oficina.codZona || '') + '</td>';
                        html += '<td>' + (oficina.codOficina || '') + '</td>';
                        html += '<td>' + (oficina.descripcion || '') + '</td>';
                        html += '</tr>';
                    });

                    html += '</tbody></table>';
                    resultadoContenido.innerHTML = html;
                } else {
                    // Si la respuesta viene en otro formato, mostrar el JSON
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
        btn.textContent = 'Consultar Oficinas';
    }
});
