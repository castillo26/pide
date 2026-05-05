// Enviar formulario BPJRSocial
document.getElementById('consultaForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = document.getElementById('btnConsultar');
    const resultadoDiv = document.getElementById('resultado');
    const resultadoTitulo = document.getElementById('resultadoTitulo');
    const resultadoContenido = document.getElementById('resultadoContenido');

    // Datos del formulario
    const data = {
        razon_social: document.getElementById('razon_social').value
    };

    // UI loading
    btn.disabled = true;
    btn.textContent = 'Consultando...';
    resultadoDiv.style.display = 'none';

    try {
        const response = await fetch('/sunarp/bpjrsocial/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const resultado = await response.json();

        // Debug en consola
        console.log('=== Respuesta BPJRSocial ===');
        console.log('Status:', response.status);
        console.log('Resultado completo:', resultado);

        resultadoDiv.style.display = 'block';

        // =========================
        // ERROR HTTP
        // =========================
        if (!response.ok) {
            resultadoDiv.className = 'resultado error';
            resultadoTitulo.textContent = 'Error HTTP';
            let html = `<p><strong>Status:</strong> ${response.status}</p>`;
            if (resultado.error) {
                html += `<p><strong>Error:</strong> ${resultado.error}</p>`;
            }
            if (resultado.response) {
                html += '<details open><summary>Respuesta del servidor</summary><pre>' + resultado.response + '</pre></details>';
            }
            resultadoContenido.innerHTML = html;
            btn.disabled = false;
            btn.textContent = 'Consultar';
            return;
        }

        // =========================
        // SIN DATOS
        // =========================
        if (!resultado.data) {
            resultadoDiv.className = 'resultado warning';
            resultadoTitulo.textContent = 'Sin datos';
            resultadoContenido.innerHTML = '<p>No se recibieron datos</p>' +
                '<details open><summary>Ver respuesta completa</summary><pre>' + JSON.stringify(resultado, null, 2) + '</pre></details>';
            btn.disabled = false;
            btn.textContent = 'Consultar';
            return;
        }

        // =========================
        // BUSCAR ESTRUCTURA DE DATOS
        // =========================
        let personaJuridicaData = null;
        let estructuraEncontrada = '';

        // La estructura real es: personaJuridica -> resultado
        if (resultado.data.personaJuridica && resultado.data.personaJuridica.resultado) {
            personaJuridicaData = resultado.data.personaJuridica.resultado;
            estructuraEncontrada = 'personaJuridica.resultado';
        } else if (resultado.data.personaJuridica) {
            personaJuridicaData = resultado.data.personaJuridica;
            estructuraEncontrada = 'personaJuridica';
        } else if (resultado.data.resultado) {
            personaJuridicaData = resultado.data.resultado;
            estructuraEncontrada = 'resultado';
        } else if (resultado.data.PIDE) {
            personaJuridicaData = resultado.data.PIDE;
            estructuraEncontrada = 'PIDE';
        } else if (resultado.data.verDetalleRPVExtraResponse) {
            personaJuridicaData = resultado.data.verDetalleRPVExtraResponse;
            estructuraEncontrada = 'verDetalleRPVExtraResponse';
        } else {
            personaJuridicaData = resultado.data;
            estructuraEncontrada = 'data directo';
        }

        console.log('Estructura encontrada:', estructuraEncontrada);
        console.log('Datos extraídos:', personaJuridicaData);

        // =========================
        // MOSTRAR RESULTADO
        // =========================
        let html = '';
        let tieneDatos = false;

        if (personaJuridicaData && typeof personaJuridicaData === 'object') {
            html += '<div class="data-item">';
            html += '<h4>Datos de la Persona Jurídica</h4>';
            html += `<p style="font-size:12px;color:#666;">(Estructura: ${estructuraEncontrada})</p>`;

            if (personaJuridicaData.zona) {
                html += `<p><strong>Zona Registral:</strong> ${personaJuridicaData.zona}</p>`;
                tieneDatos = true;
            }
            if (personaJuridicaData.oficina) {
                html += `<p><strong>Oficina Registral:</strong> ${personaJuridicaData.oficina}</p>`;
                tieneDatos = true;
            }
            if (personaJuridicaData.partida) {
                html += `<p><strong>Partida:</strong> ${personaJuridicaData.partida}</p>`;
                tieneDatos = true;
            }
            if (personaJuridicaData.ficha) {
                html += `<p><strong>Ficha:</strong> ${personaJuridicaData.ficha}</p>`;
                tieneDatos = true;
            }
            if (personaJuridicaData.tomo) {
                html += `<p><strong>Tomo:</strong> ${personaJuridicaData.tomo}</p>`;
                tieneDatos = true;
            }
            if (personaJuridicaData.folio) {
                html += `<p><strong>Folio:</strong> ${personaJuridicaData.folio}</p>`;
                tieneDatos = true;
            }
            if (personaJuridicaData.tipo) {
                html += `<p><strong>Tipo:</strong> ${personaJuridicaData.tipo}</p>`;
                tieneDatos = true;
            }
            if (personaJuridicaData.denominacion || personaJuridicaData.denominacion === '') {
                html += `<p><strong>Denominación:</strong> ${personaJuridicaData.denominacion || 'N/A'}</p>`;
                tieneDatos = true;
            }

            // Mostrar todos los campos dinámicamente si hay más
            html += '<details><summary>Ver todos los campos</summary><div style="margin-top:10px;">';
            for (const key in personaJuridicaData) {
                if (!['zona','oficina','partida','ficha','tomo','folio','tipo','denominacion'].includes(key)) {
                    html += `<p><strong>${key}:</strong> ${personaJuridicaData[key]}</p>`;
                }
            }
            html += '</div></details>';
            html += '</div>';
        }

        // =========================
        // SIN DATOS ENCONTRADOS
        // =========================
        if (!tieneDatos) {
            resultadoDiv.className = 'resultado warning';
            resultadoTitulo.textContent = 'Sin datos';
            html = '<p class="warning">No se encontraron datos de la persona jurídica</p>';
        } else {
            resultadoDiv.className = 'resultado success';
            resultadoTitulo.textContent = 'Consulta Exitosa';
        }

        // Siempre mostrar respuesta raw para debug
        html += '<details><summary>Ver respuesta JSON completa (debug)</summary><pre>' + JSON.stringify(resultado.data, null, 2) + '</pre></details>';

        resultadoContenido.innerHTML = html;

    } catch (error) {
        resultadoDiv.style.display = 'block';
        resultadoDiv.className = 'resultado error';
        resultadoTitulo.textContent = 'Error de conexión';
        resultadoContenido.innerHTML = '<p><strong>Error:</strong> ' + error.message + '</p>';
        console.error('Error en fetch:', error);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Consultar';
    }
});
