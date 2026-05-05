// Enviar formulario VDRPVExtra
document.getElementById('consultaForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = document.getElementById('btnConsultar');
    const resultadoDiv = document.getElementById('resultado');
    const resultadoTitulo = document.getElementById('resultadoTitulo');
    const resultadoContenido = document.getElementById('resultadoContenido');

    // Obtener valores del formulario
    const data = {
        zona: document.getElementById('zona').value,
        oficina: document.getElementById('oficina').value,
        placa: document.getElementById('placa').value
    };

    // Validar que todos los campos tengan valor
    if (!data.zona || !data.oficina || !data.placa) {
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
        const response = await fetch('/sunarp/vdrpvextra/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const resultado = await response.json();

        // Debug: ver qué llega exactamente
        console.log('Respuesta completa:', resultado);

        resultadoDiv.style.display = 'block';

        if (resultado.success) {
            resultadoDiv.className = 'resultado success';
            resultadoTitulo.textContent = 'Consulta Exitosa';

            if (resultado.data) {
                let html = '';
                let vehiculoData = null;

                // Debug: mostrar estructura de datos
                console.log('resultado.data:', resultado.data);

                // Intentar encontrar los datos del vehículo en diferentes estructuras
                if (resultado.data.verDetalleRPVExtraResponse) {
                    vehiculoData = resultado.data.verDetalleRPVExtraResponse.vehiculo;
                    console.log('Encontrado en verDetalleRPVExtraResponse.vehiculo:', vehiculoData);
                } else if (resultado.data.vehiculo) {
                    vehiculoData = resultado.data.vehiculo;
                    console.log('Encontrado en resultado.data.vehiculo:', vehiculoData);
                } else if (resultado.data.PIDE) {
                    vehiculoData = resultado.data.PIDE;
                    console.log('Encontrado en resultado.data.PIDE:', vehiculoData);
                } else {
                    vehiculoData = resultado.data;
                    console.log('Usando resultado.data directo:', vehiculoData);
                }

                if (vehiculoData && Object.keys(vehiculoData).length > 0) {
                    html += '<div class="data-item">';
                    html += '<h4>Datos del Vehículo</h4>';

                    if (vehiculoData.placa) {
                        html += `<p><strong>Placa:</strong> ${vehiculoData.placa}</p>`;
                    }
                    if (vehiculoData.serie) {
                        html += `<p><strong>Serie:</strong> ${vehiculoData.serie}</p>`;
                    }
                    if (vehiculoData.vin) {
                        html += `<p><strong>VIN:</strong> ${vehiculoData.vin}</p>`;
                    }
                    if (vehiculoData.nro_motor) {
                        html += `<p><strong>Nro Motor:</strong> ${vehiculoData.nro_motor}</p>`;
                    }
                    if (vehiculoData.color) {
                        html += `<p><strong>Color:</strong> ${vehiculoData.color}</p>`;
                    }
                    if (vehiculoData.marca) {
                        html += `<p><strong>Marca:</strong> ${vehiculoData.marca}</p>`;
                    }
                    if (vehiculoData.modelo) {
                        html += `<p><strong>Modelo:</strong> ${vehiculoData.modelo}</p>`;
                    }
                    if (vehiculoData.estado) {
                        html += `<p><strong>Estado:</strong> ${vehiculoData.estado}</p>`;
                    }
                    if (vehiculoData.sede) {
                        html += `<p><strong>Sede:</strong> ${vehiculoData.sede}</p>`;
                    }
                    if (vehiculoData.anoFabricacion) {
                        html += `<p><strong>Año Fabricación:</strong> ${vehiculoData.anoFabricacion}</p>`;
                    }
                    if (vehiculoData.codCategoria) {
                        html += `<p><strong>Categoría:</strong> ${vehiculoData.codCategoria}</p>`;
                    }
                    if (vehiculoData.codTipoCarr) {
                        html += `<p><strong>Tipo Carrocería:</strong> ${vehiculoData.codTipoCarr}</p>`;
                    }
                    if (vehiculoData.carroceria) {
                        html += `<p><strong>Carrocería:</strong> ${vehiculoData.carroceria}</p>`;
                    }

                    // Propietarios (puede ser un array o un objeto único)
                    if (vehiculoData.propietarios) {
                        const propietarios = Array.isArray(vehiculoData.propietarios) ? vehiculoData.propietarios : [vehiculoData.propietarios];
                        if (propietarios.length > 0) {
                            html += '<div class="data-item" style="margin-top: 15px;">';
                            html += '<h4>Propietarios</h4>';
                            propietarios.forEach((prop, index) => {
                                // El nombre puede venir como texto directo o como propiedad 'nombre'
                                const nombreProp = typeof prop === 'string' ? prop : (prop.nombre || prop.text || 'N/A');
                                if (nombreProp) {
                                    html += `<p>${index + 1}. ${nombreProp}</p>`;
                                }
                            });
                            html += '</div>';
                        }
                    }

                    html += '</div>';
                }

                // Si no hay datos parseados, mostrar raw data para debug
                if (!html || html === '') {
                    html = '<p class="warning">No se encontraron datos del vehículo en la respuesta</p>';
                    html += '<details><summary>Ver datos raw (debug)</summary><pre>' + JSON.stringify(resultado.data, null, 2) + '</pre></details>';
                }

                resultadoContenido.innerHTML = html;
            } else {
                resultadoContenido.innerHTML = '<pre>' + JSON.stringify(resultado, null, 2) + '</pre>';
            }
        } else {
            resultadoDiv.className = 'resultado error';
            resultadoTitulo.textContent = 'Error en la consulta';

            let errorMsg = resultado.error || 'Error desconocido';

            // Si hay status_code, mostrarlo
            if (resultado.status_code) {
                errorMsg = `HTTP ${resultado.status_code}: ${errorMsg}`;
            }

            resultadoContenido.innerHTML = '<p><strong>Error:</strong> ' + errorMsg + '</p>';

            // Mostrar response completo si existe
            if (resultado.response) {
                resultadoContenido.innerHTML += '<details open><summary>Respuesta completa del servidor</summary><pre>' + resultado.response + '</pre></details>';
            }

            // Mostrar data si existe
            if (resultado.data) {
                resultadoContenido.innerHTML += '<details><summary>Datos (JSON)</summary><pre>' + JSON.stringify(resultado.data, null, 2) + '</pre></details>';
            }
        }
    } catch (error) {
        resultadoDiv.style.display = 'block';
        resultadoDiv.className = 'resultado error';
        resultadoTitulo.textContent = 'Error';
        resultadoContenido.innerHTML = '<p>Error de conexión: ' + error.message + '</p>';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Consultar Vehículo';
    }
});
