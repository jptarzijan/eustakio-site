# Integración de Transcripción de Audio en eustakio_interface

Esta integración permite transcribir archivos de audio clínico directamente desde la interfaz de eustakio_interface usando la API de Whisper de OpenAI.

## Características

- 🎵 **Transcripción de audio**: Soporte para MP3, WAV, M4A, FLAC, OGG, AAC
- 🔐 **Configuración segura**: API key guardada localmente
- 📝 **Integración perfecta**: La transcripción aparece en el Panel 1
- 🎨 **Interfaz nativa**: Se integra perfectamente con el diseño existente
- ⚡ **Procesamiento rápido**: Transcripción en tiempo real

## Instalación

### 1. Instalar dependencias del servidor

```bash
cd /Users/jptarzijan/Desktop/eustakio_interface
pip3 install -r requirements_server.txt
```

### 2. Configurar API Key

La primera vez que uses la transcripción, se te pedirá configurar tu API key de OpenAI.

## Uso

### 1. Iniciar el servidor

```bash
cd /Users/jptarzijan/Desktop/eustakio_interface
python3 server.py
```

El servidor se iniciará en `http://localhost:3001`

### 2. Usar la transcripción

1. **Abrir la aplicación**: Ve a `http://localhost:3001` en tu navegador
2. **Hacer clic en el logo**: Para acceder a la interfaz principal
3. **Usar el botón "🎵 TRANSCRIBIR"**: En la barra superior
4. **Configurar API Key**: Si es la primera vez
5. **Seleccionar archivo**: Elegir tu archivo de audio clínico
6. **Transcribir**: La transcripción aparecerá en el Panel 1
7. **Usar plantillas**: Copiar al Panel 2 y usar las plantillas médicas

## Flujo de Trabajo

```
Archivo de Audio → Transcripción → Panel 1 → Plantilla → Panel 2 → Documento Final
```

### Ejemplo de uso:

1. **Cargar audio**: `consulta_medica.mp3`
2. **Transcribir**: Se obtiene el texto de la consulta
3. **Seleccionar plantilla**: "GENERAL" o "EPICRISIS"
4. **Completar**: Usar el botón de completar plantilla
5. **Guardar**: Exportar como PDF o imprimir

## Archivos de la Integración

- `transcripcion_integration.js` - Módulo JavaScript para la interfaz
- `server.py` - Servidor Flask para manejar transcripciones
- `requirements_server.txt` - Dependencias del servidor
- `config.json` - Configuración (se crea automáticamente)
- `uploads/` - Carpeta temporal para archivos (se crea automáticamente)

## API Endpoints

- `GET /api/config` - Obtener configuración
- `POST /api/config` - Guardar configuración
- `POST /api/transcribir` - Transcribir archivo de audio
- `GET /api/health` - Verificar estado del servidor

## Límites

- **Tamaño máximo**: 25MB por archivo
- **Formatos soportados**: MP3, WAV, M4A, FLAC, OGG, AAC
- **Idioma**: Optimizado para español (configurable)

## Solución de Problemas

### Error: "API key no configurada"
- Configura tu API key en el modal de transcripción
- Verifica que tengas créditos en tu cuenta de OpenAI

### Error: "Archivo demasiado grande"
- Comprime el audio a menor calidad
- Divide archivos largos en segmentos más pequeños

### Error: "Servidor no responde"
- Verifica que el servidor esté ejecutándose en el puerto 3001
- Revisa la consola del navegador para errores

### Error: "CORS"
- El servidor ya incluye CORS configurado
- Si persiste, verifica que estés accediendo desde `localhost:3001`

## Seguridad

- Tu API key se guarda localmente en `config.json`
- Los archivos de audio se eliminan automáticamente después de la transcripción
- No se almacenan transcripciones en el servidor

## Desarrollo

Para modificar la integración:

1. **Frontend**: Editar `transcripcion_integration.js`
2. **Backend**: Editar `server.py`
3. **Estilos**: Modificar los estilos inline en el JavaScript

## Compatibilidad

- **Navegadores**: Chrome, Edge, Firefox, Safari
- **Sistemas**: macOS, Windows, Linux
- **Python**: 3.7 o superior 