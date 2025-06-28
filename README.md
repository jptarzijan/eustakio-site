# Eustakio Interface - Sistema de Transcripción Clínica

Sistema web para transcripción de audio clínico usando Whisper API y completación de plantillas médicas con OpenAI.

## 🚀 Características

- **Transcripción de Audio**: Integración con Whisper API para transcripción de archivos de audio
- **Plantillas Médicas**: Sistema de plantillas predefinidas y personalizables
- **Interfaz Dual**: Dos paneles editables para trabajo simultáneo
- **Autenticación**: Sistema de login y registro de usuarios
- **Exportación PDF**: Generación de documentos PDF
- **Grabación de Audio**: Grabación directa desde el navegador

## 📋 Requisitos

- Python 3.7+
- Navegador web moderno
- API Key de OpenAI (para Whisper y GPT)

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/jptarzijan/eustakio-site.git
cd eustakio-site
```

### 2. Instalar dependencias
```bash
pip install -r requirements_server.txt
```

### 3. Configurar API Key
1. Copia el archivo de configuración de ejemplo:
```bash
cp config.example.json config.json
```

2. Edita `config.json` y agrega tu API key de OpenAI:
```json
{
  "openai_api_key": "tu-api-key-real-aqui",
  "whisper_model": "whisper-1"
}
```

### 4. Ejecutar el servidor
```bash
python3 server.py
```

El servidor estará disponible en: http://localhost:3001

## 🔧 Configuración

### Variables de Entorno (Opcional)
Puedes usar variables de entorno en lugar del archivo config.json:

```bash
export OPENAI_API_KEY="tu-api-key-aqui"
```

### Archivos de Configuración
- `config.json`: Configuración principal (no se sube a Git)
- `config.example.json`: Ejemplo de configuración

## 📁 Estructura del Proyecto

```
eustakio_interface/
├── index.html                 # Interfaz principal
├── server.py                  # Servidor Flask
├── transcripcion_integration.js # Módulo de transcripción
├── config.json               # Configuración (no en Git)
├── config.example.json       # Ejemplo de configuración
├── requirements_server.txt    # Dependencias Python
├── .gitignore               # Archivos ignorados por Git
├── images/                  # Imágenes del proyecto
│   └── LOGO1.png
└── uploads/                 # Archivos temporales (no en Git)
```

## 🎯 Uso

### Transcripción de Audio
1. Haz clic en "TRANSCRIPCIÓN" en la barra superior
2. Selecciona un archivo de audio (MP3, WAV, M4A, etc.)
3. Espera a que se complete la transcripción
4. La transcripción aparecerá en el panel izquierdo

### Plantillas Médicas
1. Usa el dropdown de plantillas para seleccionar una plantilla
2. Haz clic en el botón de flecha para completar la plantilla
3. El resultado aparecerá en el panel derecho

### Crear Nueva Plantilla
1. Selecciona "CREAR NUEVA PLANTILLA" del dropdown
2. Completa el nombre y contenido de la plantilla
3. Guarda la plantilla para uso futuro

## 🔒 Seguridad

- Las API keys se almacenan localmente en `config.json`
- El archivo `config.json` está excluido del control de versiones
- Nunca subas API keys reales a GitHub

## 🐛 Solución de Problemas

### Error de API Key
- Verifica que tu API key esté correctamente configurada en `config.json`
- Asegúrate de que la API key tenga permisos para Whisper y GPT

### Error de Puerto
- Si el puerto 3001 está ocupado, modifica la línea en `server.py`:
```python
app.run(host='0.0.0.0', port=3001, debug=True)
```

### Error de Archivo Grande
- El límite de archivo es 25MB
- Comprime el audio si es necesario

## 📝 Licencia

Este proyecto es de uso privado para Eustakio.

## 🤝 Contribución

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico, contacta al equipo de desarrollo de Eustakio.
