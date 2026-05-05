// Enviar formulario CVerificador SUNARP
document.getElementById('consultaForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = document.getElementById('btnConsultar');
    const resultadoDiv = document.getElementById('resultado');
    const resultadoTitulo = document.getElementById('resultadoTitulo');
    const resultadoContenido = document.getElementById('resultadoContenido');

    // Datos del formulario
    const data = {
        apellido_paterno: document.getElementById('apellido_paterno').value,
        apellido_materno: document.getElementById('apellido_materno').value,
        nombres: document.getElementById('nombres').value
    };

    // UI loading
    btn.disabled = true;
    btn.textContent = 'Consultando...';
    resultadoDiv.style.display = 'none';

    try {
        const response = await fetch('/sunarp/cverificador/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // ⚠️ SOAP / XML response
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");

        resultadoDiv.style.display = 'block';

        // =========================
        // CASO ERROR HTTP
        // =========================
        if (!response.ok) {
            resultadoDiv.className = 'resultado error';
            resultadoTitulo.textContent = 'Error en la consulta';
            resultadoContenido.innerHTML = `<p>Error HTTP: ${response.status}</p>`;
            return;
        }

        // =========================
        // EXTRAER XML
        // =========================
        const detalle = xml.getElementsByTagName("detalleVerificador")[0];

        if (!detalle) {
            resultadoDiv.className = 'resultado error';
            resultadoTitulo.textContent = 'Sin datos';
            resultadoContenido.innerHTML = '<p>No se encontró información en la respuesta</p>';
            return;
        }

        const dataResponse = {
            apellidosNombres: detalle.getElementsByTagName("apellidosNombres")[0]?.textContent?.trim(),
            estado: detalle.getElementsByTagName("estado")[0]?.textContent?.trim(),
            profesion: detalle.getElementsByTagName("profesion")[0]?.textContent?.trim(),
            telefono: detalle.getElementsByTagName("telefono")[0]?.textContent?.trim(),
            tipoVerificador: detalle.getElementsByTagName("tipoVerificador")[0]?.textContent?.trim(),
            zonaRegistral: detalle.getElementsByTagName("zonaRegistral")[0]?.textContent?.trim()
        };

        // =========================
        // MOSTRAR ÉXITO
        // =========================
        resultadoDiv.className = 'resultado success';
        resultadoTitulo.textContent = 'Consulta Exitosa';

        let html = '<div class="data-item">';

        html += `<p><strong>Nombre:</strong> ${dataResponse.apellidosNombres || 'N/A'}</p>`;
        html += `<p><strong>Estado:</strong> ${dataResponse.estado || 'N/A'}</p>`;
        html += `<p><strong>Profesión:</strong> ${dataResponse.profesion || 'N/A'}</p>`;
        html += `<p><strong>Teléfono:</strong> ${dataResponse.telefono || 'N/A'}</p>`;
        html += `<p><strong>Tipo Verificador:</strong> ${dataResponse.tipoVerificador || 'N/A'}</p>`;
        html += `<p><strong>Zona Registral:</strong> ${dataResponse.zonaRegistral || 'N/A'}</p>`;

        html += '</div>';

        resultadoContenido.innerHTML = html;

    } catch (error) {
        // =========================
        // ERROR DE CONEXIÓN
        // =========================
        resultadoDiv.style.display = 'block';
        resultadoDiv.className = 'resultado error';
        resultadoTitulo.textContent = 'Error de conexión';
        resultadoContenido.innerHTML = `<p>${error.message}</p>`;
    }

    // Restaurar botón
    btn.disabled = false;
    btn.textContent = 'Consultar';
});