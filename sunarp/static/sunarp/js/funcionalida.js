        // Mostrar/ocultar campos según tipo de persona
        document.getElementById('tipo_participante').addEventListener('change', function() {
            const tipo = this.value;
            const naturalFields = document.getElementById('personaNaturalFields');
            const juridicaFields = document.getElementById('personaJuridicaFields');

            if (tipo === 'N') {
                naturalFields.style.display = 'block';
                juridicaFields.style.display = 'none';
            } else {
                naturalFields.style.display = 'none';
                juridicaFields.style.display = 'block';
            }
        });

        // Enviar formulario
        document.getElementById('consultaForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const btn = document.getElementById('btnConsultar');
            const resultadoDiv = document.getElementById('resultado');
            const resultadoTitulo = document.getElementById('resultadoTitulo');
            const resultadoContenido = document.getElementById('resultadoContenido');

            // Función para reemplazar Ñ por N
            const normalizarTexto = (texto) => {
                if (!texto) return texto;
                return texto.replace(/ñ/gi, 'n');
            };

            // Obtener valores del formulario
            const tipo = document.getElementById('tipo_participante').value;
            const data = {
                tipo_participante: tipo,
                apellido_paterno: normalizarTexto(document.getElementById('apellido_paterno').value),
                apellido_materno: normalizarTexto(document.getElementById('apellido_materno').value),
                nombres: normalizarTexto(document.getElementById('nombres').value),
                razon_social: normalizarTexto(document.getElementById('razon_social').value)
            };

            // Mostrar estado de carga
            btn.disabled = true;
            btn.textContent = 'Consultando...';
            resultadoDiv.style.display = 'none';

            try {
                const response = await fetch('/sunarp/tsirsarp/', {
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

                    // Estructura: data.buscarTitularidadSIRSARPResponse.respuestaTitularidad.respuestaTitularidad
                    if (resultado.data && resultado.data.buscarTitularidadSIRSARPResponse) {
                        const respuesta = resultado.data.buscarTitularidadSIRSARPResponse.respuestaTitularidad;
                        const items = respuesta.respuestaTitularidad;
                        const lista = Array.isArray(items) ? items : [items];

                        let html = '';
                        lista.forEach((item, index) => {
                            html += '<div class="data-item">';
                            html += `<p><strong>Registro:</strong> ${item.registro || 'N/A'}</p>`;
                            html += `<p><strong>Libro:</strong> ${item.libro || 'N/A'}</p>`;
                            html += `<p><strong>Nombre:</strong> ${item.apPaterno || ''} ${item.apMaterno || ''} ${item.nombre || ''}</p>`;
                            html += `<p><strong>Documento:</strong> ${item.tipoDocumento || 'N/A'} - ${item.numeroDocumento || 'N/A'}</p>`;
                            html += `<p><strong>Partida:</strong> ${item.numeroPartida || 'N/A'}</p>`;
                            if (item.numeroPlaca) {
                                html += `<p><strong>Placa:</strong> ${item.numeroPlaca}</p>`;
                            }
                            if (item.direccion) {
                                html += `<p><strong>Dirección:</strong> ${item.direccion}</p>`;
                            }
                            html += `<p><strong>Estado:</strong> ${item.estado || 'N/A'}</p>`;
                            html += `<p><strong>Zona:</strong> ${item.zona || 'N/A'}</p>`;
                            html += `<p><strong>Oficina:</strong> ${item.oficina || 'N/A'}</p>`;
                            html += '</div>';
                        });
                        resultadoContenido.innerHTML = html;
                    } else {
                        resultadoContenido.innerHTML = '<pre>' + JSON.stringify(resultado, null, 2) + '</pre>';
                    }
                } else {
                    resultadoDiv.className = 'resultado error';
                    resultadoTitulo.textContent = 'Error en la consulta';
                    let errorMsg = '<p><strong>' + (resultado.error || 'Error desconocido') + '</strong></p>';
                    if (resultado.status_code) {
                        errorMsg += '<p>Código de estado: ' + resultado.status_code + '</p>';
                    }
                    resultadoContenido.innerHTML = errorMsg;
                }
            } catch (error) {
                resultadoDiv.style.display = 'block';
                resultadoDiv.className = 'resultado error';
                resultadoTitulo.textContent = 'Error';
                resultadoContenido.innerHTML = '<p>Error de conexión: ' + error.message + '</p>';
            } finally {
                btn.disabled = false;
                btn.textContent = 'Consultar';
            }
        });