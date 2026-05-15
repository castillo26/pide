let detenerConsulta = false;
let resultados = [];
let totalDnis = 0;

document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    detenerConsulta = false;
    resultados = [];

    const fileInput = document.getElementById('excelFile');
    const btn = document.getElementById('btnCargar');
    const btnDetener = document.getElementById('btnDetener');
    const progressDiv = document.getElementById('progreso');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const resultadoDiv = document.getElementById('resultado');
    const resultadoTitulo = document.getElementById('resultadoTitulo');
    const resultadoContenido = document.getElementById('resultadoContenido');
    const totalCount = document.getElementById('totalCount');
    const successCount = document.getElementById('successCount');
    const errorCount = document.getElementById('errorCount');
    const pendientesCount = document.getElementById('pendientesCount');

    const file = fileInput.files[0];
    if (!file) {
        resultadoDiv.style.display = 'block';
        resultadoDiv.className = 'resultado error';
        resultadoTitulo.textContent = 'Error';
        resultadoContenido.innerHTML = '<p>Seleccione un archivo Excel.</p>';
        return;
    }

    resultadoDiv.style.display = 'none';
    progressDiv.style.display = 'block';

    try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const dnis = jsonData
            .map(row => String(row['dni'] || row['DNI'] || '').trim())
            .filter(d => /^\d{8}$/.test(d));

        if (dnis.length === 0) {
            progressDiv.style.display = 'none';
            resultadoDiv.style.display = 'block';
            resultadoDiv.className = 'resultado error';
            resultadoTitulo.textContent = 'Error';
            resultadoContenido.innerHTML = '<p>No se encontraron DNIs válidos (8 dígitos) en la columna "dni" o "DNI".</p>';
            return;
        }

        totalDnis = dnis.length;
        totalCount.textContent = totalDnis;
        successCount.textContent = '0';
        errorCount.textContent = '0';
        pendientesCount.textContent = totalDnis;
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';

        btn.style.display = 'none';
        btnDetener.style.display = 'block';

        resultados = [];
        let exitosos = 0;
        let errores = 0;

        for (let i = 0; i < dnis.length; i++) {
            if (detenerConsulta) {
                progressText.textContent = 'Consulta detenida por el usuario.';
                break;
            }

            progressText.textContent = `Consultando DNI ${dnis[i]} (${i + 1} de ${totalDnis})...`;

            try {
                const response = await fetch('/sunarp/reniec/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dni: dnis[i] })
                });

                const result = await response.json();

                if (result.success && result.data) {
                    const consultarResponse = result.data.consultarResponse;
                    const ret = consultarResponse && consultarResponse.return;
                    const datosPersona = ret && ret.datosPersona;
                    resultados.push({
                        dni: dnis[i],
                        success: true,
                        datosPersona: datosPersona || null,
                        mensaje: ret ? ret.deResultado : '',
                        raw: result.data
                    });
                    exitosos++;
                } else {
                    const errorMsg = result.error || 'Error en consulta';
                    resultados.push({ dni: dnis[i], success: false, error: errorMsg });
                    errores++;
                }
            } catch (error) {
                resultados.push({ dni: dnis[i], success: false, error: 'Error de conexión: ' + error.message });
                errores++;
            }

            successCount.textContent = exitosos;
            errorCount.textContent = errores;
            pendientesCount.textContent = totalDnis - (i + 1);

            const pct = Math.round(((i + 1) / totalDnis) * 100);
            progressBar.style.width = pct + '%';
            progressBar.textContent = pct + '%';

            if (i < dnis.length - 1 && !detenerConsulta) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        btnDetener.style.display = 'none';
        btn.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Cargar y Consultar';

        progressText.textContent = detenerConsulta
            ? `Consulta detenida. Procesados ${resultados.length} de ${totalDnis} DNIs.`
            : 'Consulta finalizada.';

        mostrarResultados(resultados, resultadoDiv, resultadoTitulo, resultadoContenido);

    } catch (error) {
        progressDiv.style.display = 'none';
        resultadoDiv.style.display = 'block';
        resultadoDiv.className = 'resultado error';
        resultadoTitulo.textContent = 'Error';
        resultadoContenido.innerHTML = '<p>Error al leer el archivo: ' + error.message + '</p>';
        btn.style.display = 'block';
        btnDetener.style.display = 'none';
    }
});

document.getElementById('btnDetener').addEventListener('click', function() {
    detenerConsulta = true;
});

function mostrarResultados(resultados, resultadoDiv, resultadoTitulo, resultadoContenido) {
    resultadoDiv.style.display = 'block';

    const exitosos = resultados.filter(r => r.success).length;
    const errores = resultados.filter(r => !r.success).length;

    if (exitosos > 0) {
        resultadoTitulo.textContent = `Resultados (${exitosos} exitosos, ${errores} errores)`;
    } else {
        resultadoTitulo.textContent = 'Sin resultados exitosos';
    }

    let html = '';
    html += '<details open><summary>Ver resultados detallados</summary>';
    html += '<table class="tabla-resultados"><thead><tr>';
    html += '<th>#</th>';
    html += '<th>DNI</th>';
    html += '<th>Estado</th>';
    html += '<th>Apellido Paterno</th>';
    html += '<th>Apellido Materno</th>';
    html += '<th>Nombres</th>';
    html += '<th>Detalle</th>';
    html += '</tr></thead><tbody>';

    resultados.forEach((r, index) => {
        html += '<tr>';
        html += `<td>${index + 1}</td>`;
        html += `<td>${r.dni}</td>`;
        if (r.success && r.datosPersona) {
            const d = r.datosPersona;
            html += '<td class="success">Éxito</td>';
            html += `<td>${d.apPrimer || ''}</td>`;
            html += `<td>${d.apSegundo || ''}</td>`;
            html += `<td>${d.prenombres || ''}</td>`;
            let detalle = '';
            detalle += `<p><strong>Dirección:</strong> ${d.direccion || 'N/A'}</p>`;
            detalle += `<p><strong>Estado Civil:</strong> ${d.estadoCivil || 'N/A'}</p>`;
            detalle += `<p><strong>Ubigeo:</strong> ${d.ubigeo || 'N/A'}</p>`;
            detalle += `<p><strong>Restricción:</strong> ${d.restriccion || 'N/A'}</p>`;
            if (r.mensaje) detalle += `<p><strong>Mensaje:</strong> ${r.mensaje}</p>`;
            if (d.foto) detalle += `<img src="data:image/jpeg;base64,${d.foto}" alt="Foto" style="width:100px;height:auto;border-radius:4px;">`;
            html += `<td><details><summary>Ver detalle</summary>${detalle}</details></td>`;
        } else if (r.success && !r.datosPersona) {
            html += '<td class="warning">Sin datos</td><td></td><td></td><td></td>';
            html += `<td><pre>${JSON.stringify(r.raw, null, 2)}</pre></td>`;
        } else {
            html += '<td class="error">Error</td>';
            html += '<td></td><td></td><td></td>';
            html += `<td>${r.error || 'Error desconocido'}</td>`;
        }
        html += '</tr>';
    });

    html += '</tbody></table>';
    html += '</details>';

    if (exitosos > 0) {
        html += '<button id="btnDescargarCSV" class="btn-download" style="background:#28a745;max-width:300px;margin:20px auto 0;display:block;">Descargar CSV</button>';
    }

    resultadoContenido.innerHTML = html;

    const btnCSV = document.getElementById('btnDescargarCSV');
    if (btnCSV) {
        btnCSV.addEventListener('click', function() {
            descargarCSV(resultados);
        });
    }
}

function descargarCSV(resultados) {
    let csv = 'DNI,Apellido Paterno,Apellido Materno,Nombres,Direccion,Estado Civil,Ubigeo,Estado\n';

    resultados.forEach(r => {
        if (r.success && r.datosPersona) {
            const d = r.datosPersona;
            const ap = (d.apPrimer || '').replace(/,/g, ' ');
            const am = (d.apSegundo || '').replace(/,/g, ' ');
            const nom = (d.prenombres || '').replace(/,/g, ' ');
            const dir = (d.direccion || '').replace(/,/g, ' ');
            const ec = (d.estadoCivil || '').replace(/,/g, ' ');
            const ub = (d.ubigeo || '').replace(/,/g, ' ');
            csv += `${r.dni},${ap},${am},${nom},${dir},${ec},${ub},Éxito\n`;
        } else {
            csv += `${r.dni},,,,,,,Error: ${(r.error || '').replace(/,/g, ' ')}\n`;
        }
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resultados_reniec.csv';
    link.click();
    URL.revokeObjectURL(link.href);
}
