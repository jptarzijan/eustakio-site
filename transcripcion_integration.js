// Módulo de integración para transcripción de audio en eustakio_interface
class TranscripcionIntegrator {
    constructor() {
        this.inicializarInterfaz();
    }

    inicializarInterfaz() {
        // Agregar botón de transcripción al panel superior
        this.agregarBotonTranscripcion();
        
        // Agregar área de carga de archivos
        this.agregarAreaCargaArchivos();
        
        // Agregar indicador de progreso
        this.agregarIndicadorProgreso();
    }

    agregarBotonTranscripcion() {
        const topBar = document.querySelector('.top-bar');
        if (!topBar) return;

        const botonTranscripcion = document.createElement('button');
        botonTranscripcion.innerHTML = '🎵 TRANSCRIBIR';
        botonTranscripcion.style.marginLeft = '8px';
        botonTranscripcion.onclick = () => this.mostrarDialogoCarga();
        
        topBar.appendChild(botonTranscripcion);
    }

    agregarAreaCargaArchivos() {
        // Crear modal para carga de archivos
        const modal = document.createElement('div');
        modal.id = 'transcripcionModal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            justify-content: center;
            align-items: center;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 8px;
                max-width: 500px;
                width: 90%;
                text-align: center;
            ">
                <h3 style="margin-top: 0; color: #021927;">Transcripción de Audio</h3>
                
                <div id="cargaArchivo" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">Seleccionar archivo de audio:</label>
                    <input type="file" id="archivoAudio" accept=".mp3,.wav,.m4a,.flac,.ogg,.aac" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        margin-bottom: 10px;
                    ">
                    <div id="infoArchivo" style="font-size: 12px; color: #666; margin-bottom: 10px;"></div>
                </div>

                <div id="progresoTranscripcion" style="display: none;">
                    <div style="margin-bottom: 10px;">Transcribiendo audio...</div>
                    <div style="
                        width: 100%;
                        height: 20px;
                        background: #f0f0f0;
                        border-radius: 10px;
                        overflow: hidden;
                    ">
                        <div id="barraProgreso" style="
                            width: 0%;
                            height: 100%;
                            background: #021927;
                            transition: width 0.3s;
                        "></div>
                    </div>
                </div>

                <div style="margin-top: 20px;">
                    <button id="btnTranscribir" onclick="transcripcionIntegrator.transcribirArchivo()" style="
                        background: #021927;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-right: 10px;
                    ">Transcribir</button>
                    <button onclick="transcripcionIntegrator.cerrarModal()" style="
                        background: #ccc;
                        color: #333;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Cancelar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Evento para mostrar información del archivo
        document.getElementById('archivoAudio').addEventListener('change', (e) => {
            const archivo = e.target.files[0];
            if (archivo) {
                const tamanoMB = (archivo.size / (1024 * 1024)).toFixed(2);
                document.getElementById('infoArchivo').innerHTML = `
                    Archivo: ${archivo.name}<br>
                    Tamaño: ${tamanoMB} MB<br>
                    Tipo: ${archivo.type}
                `;
            }
        });
    }

    agregarIndicadorProgreso() {
        const indicador = document.createElement('div');
        indicador.id = 'indicadorTranscripcion';
        indicador.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #021927;
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 10001;
            display: none;
            text-align: center;
        `;
        indicador.innerHTML = `
            <div style="margin-bottom: 10px;">🔄 Transcribiendo audio...</div>
            <div style="font-size: 12px;">Por favor espera, esto puede tomar unos minutos</div>
        `;
        document.body.appendChild(indicador);
    }

    mostrarDialogoCarga() {
        const modal = document.getElementById('transcripcionModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    cerrarModal() {
        const modal = document.getElementById('transcripcionModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    async transcribirArchivo() {
        const archivoInput = document.getElementById('archivoAudio');
        const archivo = archivoInput.files[0];

        if (!archivo) {
            alert('Por favor selecciona un archivo de audio');
            return;
        }

        // Verificar tamaño del archivo
        const tamanoMB = archivo.size / (1024 * 1024);
        if (tamanoMB > 25) {
            alert('El archivo es demasiado grande. El límite es 25MB');
            return;
        }

        // Mostrar progreso
        document.getElementById('progresoTranscripcion').style.display = 'block';
        document.getElementById('btnTranscribir').disabled = true;
        document.getElementById('indicadorTranscripcion').style.display = 'block';

        try {
            console.log('Iniciando transcripción...');
            console.log('Archivo:', archivo.name, 'Tamaño:', tamanoMB + 'MB');
            
            // Probar conectividad primero
            console.log('Probando conectividad con el servidor...');
            const healthResponse = await fetch('http://localhost:3001/api/health');
            if (!healthResponse.ok) {
                throw new Error('No se puede conectar con el servidor');
            }
            console.log('✅ Conectividad con servidor OK');
            
            // Crear FormData para enviar el archivo
            const formData = new FormData();
            formData.append('file', archivo);

            console.log('FormData creado, enviando petición...');

            // Simular progreso
            this.simularProgreso();

            // Enviar archivo para transcripción
            const response = await fetch('http://localhost:3001/api/transcribir', {
                method: 'POST',
                body: formData
            });

            console.log('Respuesta recibida:', response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const resultado = await response.json();
            console.log('Resultado:', resultado);

            if (resultado.error) {
                throw new Error(resultado.error);
            }

            // Mostrar transcripción en el panel izquierdo
            this.mostrarTranscripcionEnDropdown(resultado.transcripcion);
            
            // Cerrar modal
            this.cerrarModal();
            
            // Mostrar mensaje de éxito
            this.mostrarMensajeExito('Transcripción completada exitosamente');

        } catch (error) {
            console.error('Error durante la transcripción:', error);
            alert('Error durante la transcripción: ' + error.message);
        } finally {
            // Ocultar progreso
            document.getElementById('progresoTranscripcion').style.display = 'none';
            document.getElementById('btnTranscribir').disabled = false;
            document.getElementById('indicadorTranscripcion').style.display = 'none';
        }
    }

    simularProgreso() {
        const barra = document.getElementById('barraProgreso');
        let progreso = 0;
        const intervalo = setInterval(() => {
            progreso += Math.random() * 15;
            if (progreso > 90) progreso = 90;
            barra.style.width = progreso + '%';
        }, 500);

        // Limpiar intervalo después de 10 segundos
        setTimeout(() => {
            clearInterval(intervalo);
            barra.style.width = '100%';
        }, 10000);
    }

    mostrarMensajeExito(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 10002;
            animation: slideIn 0.3s ease-out;
        `;
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);

        // Remover después de 3 segundos
        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }

    async completarPlantilla() {
        // Obtener texto del dropdown (transcripción)
        const transcripcion = this.transcripcionActual || '';
        
        // Obtener texto del área editable (notas adicionales)
        const notasAdicionales = document.getElementById('editable1').innerText || '';
        
        // Combinar ambos textos
        let textoCompleto = '';
        if (transcripcion) {
            textoCompleto += `TRANSCRIPCIÓN:\n${transcripcion}\n\n`;
        }
        if (notasAdicionales && notasAdicionales.trim() !== '' && 
            !notasAdicionales.includes('El texto transcrito está disponible en el dropdown arriba')) {
            textoCompleto += `NOTAS ADICIONALES:\n${notasAdicionales}\n\n`;
        }
        
        if (!textoCompleto || textoCompleto.trim() === '') {
            alert('No hay texto disponible para completar la plantilla');
            return;
        }
        
        const plantilla = document.getElementById('editable2').innerText;
        
        if (!plantilla || plantilla.trim() === '') {
            alert('No hay plantilla seleccionada en el Panel 2');
            return;
        }

        const instruccion = 'Usa el texto del Panel 1 (transcripción y notas adicionales) para llenar la plantilla del Panel 2. Respeta el formato de la plantilla. No elimines encabezados ni estructura. Si no hay información para un campo, déjalo en blanco o pon [No especificado].';
        const prompt = `${instruccion}\n\nTexto del Panel 1:\n${textoCompleto}\nPlantilla del Panel 2:\n${plantilla}`;
        
        const panelDerecho = document.getElementById('editable2');
        const contenidoOriginal = panelDerecho.innerHTML;
        
        try {
            // Mostrar indicador de carga
            panelDerecho.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">🔄 Completando plantilla...</div>';
            
            console.log('Enviando petición para completar plantilla...');
            console.log('Texto combinado:', textoCompleto);
            
            const response = await fetch('http://localhost:3001/api/completar-plantilla', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            console.log('Respuesta recibida:', response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Resultado:', data);

            if (data.error) {
                throw new Error(data.error);
            }

            // Mostrar resultado en el panel derecho
            panelDerecho.innerHTML = data.result.replace(/\n/g, '<br>');
            
            // Mostrar mensaje de éxito
            this.mostrarMensajeExito('Plantilla completada exitosamente');

        } catch (error) {
            console.error('Error al completar plantilla:', error);
            // Restaurar contenido original en caso de error
            panelDerecho.innerHTML = contenidoOriginal;
            alert('Error al completar plantilla: ' + error.message);
        }
    }

    mostrarTranscripcionEnDropdown(transcripcion) {
        const panel1 = document.getElementById('panel1');
        
        // Limpiar dropdown anterior si existe
        this.limpiarDropdownAnterior();
        
        // Crear el dropdown de transcripción
        const dropdownContainer = document.createElement('div');
        dropdownContainer.id = 'transcripcionDropdown';
        dropdownContainer.style.cssText = `
            margin-bottom: 15px;
            border: 1px solid #021927;
            border-radius: 6px;
            overflow: hidden;
        `;
        
        // Crear el botón del dropdown
        const dropdownButton = document.createElement('button');
        dropdownButton.style.cssText = `
            width: 100%;
            padding: 12px 15px;
            background: #021927;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        dropdownButton.innerHTML = `
            📝 Transcripción (${transcripcion.length} caracteres)
            <span id="dropdownArrow" style="transition: transform 0.3s;">▼</span>
        `;
        
        // Crear el contenido del dropdown
        const dropdownContent = document.createElement('div');
        dropdownContent.id = 'dropdownContent';
        dropdownContent.style.cssText = `
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
            background: #f8f9fa;
        `;
        
        const transcripcionText = document.createElement('div');
        transcripcionText.style.cssText = `
            padding: 15px;
            line-height: 1.6;
            font-size: 13px;
            color: #333;
            white-space: pre-wrap;
            word-wrap: break-word;
        `;
        transcripcionText.textContent = transcripcion;
        
        dropdownContent.appendChild(transcripcionText);
        dropdownContainer.appendChild(dropdownButton);
        dropdownContainer.appendChild(dropdownContent);
        
        // Agregar funcionalidad de toggle
        dropdownButton.addEventListener('click', () => {
            const content = document.getElementById('dropdownContent');
            const arrow = document.getElementById('dropdownArrow');
            
            if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
                content.style.maxHeight = '300px';
                arrow.style.transform = 'rotate(180deg)';
            } else {
                content.style.maxHeight = '0px';
                arrow.style.transform = 'rotate(0deg)';
            }
        });
        
        // Insertar el dropdown al inicio del panel
        const editable1 = document.getElementById('editable1');
        panel1.insertBefore(dropdownContainer, editable1);
        
        // Limpiar contenido anterior del editable
        editable1.innerHTML = '<div style="color: #666; font-style: italic;">El texto transcrito está disponible en el dropdown arriba. Puedes editar aquí para agregar notas adicionales.</div>';
        
        // Guardar la transcripción para uso posterior
        this.transcripcionActual = transcripcion;
    }

    limpiarDropdownAnterior() {
        const dropdownAnterior = document.getElementById('transcripcionDropdown');
        if (dropdownAnterior) {
            dropdownAnterior.remove();
        }
    }
}

// Inicializar integración cuando se cargue la página
let transcripcionIntegrator;
document.addEventListener('DOMContentLoaded', () => {
    transcripcionIntegrator = new TranscripcionIntegrator();
});

// Agregar estilos CSS para animaciones
const estilos = document.createElement('style');
estilos.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(estilos); 