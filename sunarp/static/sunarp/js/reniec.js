document.getElementById('consultaForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = document.getElementById('btnConsultar');
    const resultadoDiv = document.getElementById('resultado');
    const resultadoTitulo = document.getElementById('resultadoTitulo');
    const resultadoContenido = document.getElementById('resultadoContenido');

    const dni = document.getElementById('dni').value.trim();

    if (!dni || dni.length !== 8 || !/^\d{8}$/.test(dni)) {
        resultadoDiv.style.display = 'block';
        resultadoDiv.className = 'resultado error';
        resultadoTitulo.textContent = 'Error';
        resultadoContenido.innerHTML = '<p>Ingrese un DNI válido de 8 dígitos.</p>';
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Consultando...';
    resultadoDiv.style.display = 'none';

    try {
        const response = await fetch('/sunarp/reniec/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dni })
        });

        const resultado = await response.json();

        resultadoDiv.style.display = 'block';

        if (resultado.success && resultado.data) {
            resultadoDiv.className = 'resultado success';
            resultadoTitulo.textContent = 'Consulta Exitosa';

            const consultarResponse = resultado.data.consultarResponse;
            const ret = consultarResponse && consultarResponse.return;
            const datosPersona = ret && ret.datosPersona;

            if (!datosPersona) {
                resultadoContenido.innerHTML = '<pre>' + JSON.stringify(resultado.data, null, 2) + '</pre>';
                return;
            }

            let html = '<div style="display:flex;gap:20px;flex-wrap:wrap;">';

            if (datosPersona.foto) {
                html += '<div style="flex-shrink:0;">';
                html += `<img src="data:image/jpeg;base64,${datosPersona.foto}" alt="Foto DNI" style="width:180px;height:auto;border-radius:8px;border:1px solid #ddd;">`;
                html += '</div>';
            }

            html += '<div style="flex:1;min-width:250px;">';
            html += '<h4>Datos de la Persona</h4>';
            html += `<p><strong>DNI:</strong> ${document.getElementById('dni').value}</p>`;
            html += `<p><strong>Apellido Paterno:</strong> ${datosPersona.apPrimer || 'N/A'}</p>`;
            html += `<p><strong>Apellido Materno:</strong> ${datosPersona.apSegundo || 'N/A'}</p>`;
            html += `<p><strong>Nombres:</strong> ${datosPersona.prenombres || 'N/A'}</p>`;
            html += `<p><strong>Dirección:</strong> ${datosPersona.direccion || 'N/A'}</p>`;
            html += `<p><strong>Estado Civil:</strong> ${datosPersona.estadoCivil || 'N/A'}</p>`;
            html += `<p><strong>Restricción:</strong> ${datosPersona.restriccion || 'N/A'}</p>`;
            html += `<p><strong>Ubigeo:</strong> ${datosPersona.ubigeo || 'N/A'}</p>`;
            html += '</div></div>';

            if (ret.deResultado) {
                html += `<p style="margin-top:15px;font-size:13px;color:#666;"><strong>Mensaje:</strong> ${ret.deResultado}</p>`;
            }

            resultadoContenido.innerHTML = html;
        } else {
            resultadoDiv.className = 'resultado error';
            resultadoTitulo.textContent = 'Error en la consulta';
            let errorMsg = resultado.error || 'Error desconocido';
            if (resultado.status_code) {
                errorMsg = `HTTP ${resultado.status_code}: ${errorMsg}`;
            }
            let html = `<p><strong>Error:</strong> ${errorMsg}</p>`;
            if (resultado.response) {
                html += '<details open><summary>Respuesta del servidor</summary><pre>' + resultado.response + '</pre></details>';
            }
            resultadoContenido.innerHTML = html;
        }
    } catch (error) {
        resultadoDiv.style.display = 'block';
        resultadoDiv.className = 'resultado error';
        resultadoTitulo.textContent = 'Error';
        resultadoContenido.innerHTML = '<p>Error de conexión: ' + error.message + '</p>';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Consultar DNI';
    }
});
