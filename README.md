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

## 🛠️ Instalación Local

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

## 🌐 Despliegue en la Nube

### Opción 1: Vercel (Recomendado - Gratis)

#### 1. Conectar con GitHub
1. Ve a [Vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en "New Project"
4. Selecciona tu repositorio `eustakio-site`

#### 2. Configurar variables de entorno
En la configuración del proyecto en Vercel:
1. Ve a "Settings" → "Environment Variables"
2. Agrega:
   - `OPENAI_API_KEY` = `tu-api-key-aqui`
   - `FLASK_ENV` = `production`

#### 3. Desplegar
Vercel desplegará automáticamente cuando hagas push a GitHub:
```bash
git add .
git commit -m "Configuración para Vercel"
git push origin main
```

#### 4. Tu aplicación estará disponible en:
`https://tu-proyecto.vercel.app`

### Opción 2: Heroku (Gratis)

#### 1. Instalar Heroku CLI
```bash
# macOS
brew install heroku/brew/heroku

# Windows
# Descargar desde: https://devcenter.heroku.com/articles/heroku-cli
```

#### 2. Login y crear aplicación
```bash
heroku login
heroku create eustakio-app
```

#### 3. Configurar variables de entorno
```bash
heroku config:set OPENAI_API_KEY="tu-api-key-aqui"
```

#### 4. Desplegar
```bash
git push heroku main
```

#### 5. Abrir la aplicación
```bash
heroku open
```

### Opción 3: Railway (Gratis)

1. Ve a [Railway.app](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Configura la variable de entorno `OPENAI_API_KEY`
4. Railway desplegará automáticamente

### Opción 4: Render (Gratis)

1. Ve a [Render.com](https://render.com)
2. Conecta tu repositorio de GitHub
3. Configura como "Web Service"
4. Agrega la variable de entorno `OPENAI_API_KEY`
5. Render desplegará automáticamente

### Opción 5: VPS (DigitalOcean, AWS, etc.)

```bash
# En tu servidor
git clone https://github.com/jptarzijan/eustakio-site.git
cd eustakio-site
pip install -r requirements_server.txt

# Configurar API key
export OPENAI_API_KEY="tu-api-key-aqui"

# Ejecutar en producción
python3 server.py
```

## 🔧 Configuración

### Variables de Entorno (Producción)
Para despliegue en la nube, usa variables de entorno:

```bash
export OPENAI_API_KEY="tu-api-key-aqui"
export FLASK_ENV="production"
export PORT="3001"
```

### Archivos de Configuración
- `config.json`: Configuración local (no se sube a Git)
- `config.example.json`: Ejemplo de configuración
- Variables de entorno: Para producción

## 📁 Estructura del Proyecto

```
eustakio_interface/
├── index.html                 # Interfaz principal
├── server.py                  # Servidor Flask
├── transcripcion_integration.js # Módulo de transcripción
├── config.json               # Configuración (no en Git)
├── config.example.json       # Ejemplo de configuración
├── requirements_server.txt    # Dependencias Python
├── Procfile                  # Configuración Heroku
├── runtime.txt               # Versión Python Heroku
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
- En producción, usa variables de entorno
- El archivo `config.json` está excluido del control de versiones
- Nunca subas API keys reales a GitHub

## 🐛 Solución de Problemas

### Error de API Key
- Verifica que tu API key esté correctamente configurada
- En producción, verifica las variables de entorno
- Asegúrate de que la API key tenga permisos para Whisper y GPT

### Error de Puerto
- El puerto se configura automáticamente en producción
- Para desarrollo local, modifica la línea en `server.py`

### Error de Archivo Grande
- El límite de archivo es 25MB
- Comprime el audio si es necesario

### Error en Heroku
```bash
# Ver logs
heroku logs --tail

# Reiniciar aplicación
heroku restart
```

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
