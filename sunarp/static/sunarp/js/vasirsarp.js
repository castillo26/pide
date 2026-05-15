document.getElementById('consultaForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = document.getElementById('btnConsultar');
    const resultadoDiv = document.getElementById('resultado');
    const resultadoTitulo = document.getElementById('resultadoTitulo');
    const resultadoContenido = document.getElementById('resultadoContenido');

    const totalPag = parseInt(document.getElementById('nroTotalPag').value, 10);
    if (!totalPag || totalPag < 1) {
        resultadoDiv.style.display = 'block';
        resultadoDiv.className = 'resultado error';
        resultadoTitulo.textContent = 'Error';
        resultadoContenido.innerHTML = '<p>Número total de páginas inválido.</p>';
        return;
    }

    const baseData = {
        transaccion: document.getElementById('transaccion').value,
        idImg: document.getElementById('idImg').value,
        tipo: document.getElementById('tipo').value,
        nroPagRef: document.getElementById('nroPagRef').value,
    };

    if (!baseData.transaccion || !baseData.idImg || !baseData.tipo || !baseData.nroPagRef) {
        resultadoDiv.style.display = 'block';
        resultadoDiv.className = 'resultado error';
        resultadoTitulo.textContent = 'Error';
        resultadoContenido.innerHTML = '<p>Por favor complete todos los campos requeridos.</p>';
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Consultando...';
    resultadoDiv.style.display = 'block';
    resultadoDiv.className = 'resultado success';
    resultadoTitulo.textContent = 'Cargando páginas...';
    resultadoContenido.innerHTML = '';

    const imagenes = [];

    for (let pagina = 1; pagina <= totalPag; pagina++) {
        resultadoTitulo.textContent = `Cargando página ${pagina} de ${totalPag}...`;

        try {
            const response = await fetch('/sunarp/vasirsarp/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...baseData, nroTotalPag: String(totalPag), pagina: String(pagina) })
            });

            const resultado = await response.json();

            if (resultado.success && resultado.data) {
                let imgBase64 = null;
                if (resultado.data.verAsientoSIRSARPResponse) {
                    imgBase64 = resultado.data.verAsientoSIRSARPResponse.img;
                } else if (resultado.data.img) {
                    imgBase64 = resultado.data.img;
                }

                if (imgBase64) {
                    imagenes.push({ pagina, img: imgBase64 });
                } else {
                    imagenes.push({ pagina, error: 'No se encontró imagen en la respuesta', raw: resultado.data });
                }
            } else {
                imagenes.push({ pagina, error: resultado.error || 'Error en la consulta' });
            }
        } catch (error) {
            imagenes.push({ pagina, error: 'Error de conexión: ' + error.message });
        }

        if (pagina < totalPag) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    resultadoTitulo.textContent = 'Consulta Exitosa';

    if (imagenes.length === 0) {
        resultadoDiv.className = 'resultado error';
        resultadoTitulo.textContent = 'Sin resultados';
        resultadoContenido.innerHTML = '<p>No se obtuvieron imágenes.</p>';
    } else {
        let html = '';
        imagenes.forEach((item) => {
            html += `<div class="data-item"><h4>Página ${item.pagina}</h4>`;
            if (item.img) {
                html += `<img src="data:image/jpeg;base64,${item.img}" alt="Página ${item.pagina}" style="max-width:100%;height:auto;">`;
            } else {
                html += `<p class="error">${item.error || 'Error desconocido'}</p>`;
                if (item.raw) {
                    html += `<pre>${JSON.stringify(item.raw, null, 2)}</pre>`;
                }
            }
            html += '</div>';
        });
        html += '<div style="text-align:center;margin-top:20px;">';
        html += '<button id="btnDescargarPDF" style="background:#28a745;max-width:300px;margin:0 auto;">Descargar PDF</button>';
        html += '</div>';
        resultadoContenido.innerHTML = html;

        document.getElementById('btnDescargarPDF').addEventListener('click', function() {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('landscape');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            imagenes.forEach((item, index) => {
                if (index > 0) pdf.addPage();
                if (item.img) {
                    const imgData = 'data:image/jpeg;base64,' + item.img;
                    const imgProps = pdf.getImageProperties(imgData);
                    const imgWidth = pageWidth - 20;
                    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                    const yOffset = (pageHeight - imgHeight) / 2;
                    pdf.addImage(imgData, 'JPEG', 10, yOffset, imgWidth, imgHeight);
                }
            });

            pdf.save(`vasirsarp_${baseData.transaccion}.pdf`);
        });
    }

    btn.disabled = false;
    btn.textContent = 'Ver todas las imágenes';
});
