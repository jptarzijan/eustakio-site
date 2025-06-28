#!/usr/bin/env python3
"""
Servidor Flask para integrar transcripción de audio con eustakio_interface
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import requests
from werkzeug.utils import secure_filename
import tempfile

app = Flask(__name__)
CORS(app)  # Permitir peticiones desde el frontend

# Configuración
CONFIG_FILE = 'config.json'
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'm4a', 'flac', 'ogg', 'aac'}

# Crear carpeta de uploads si no existe
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Verificar si el archivo tiene una extensión permitida"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def cargar_configuracion():
    """Cargar configuración desde archivo"""
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, 'r') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error al cargar configuración: {e}")
    return {}

def guardar_configuracion(config):
    """Guardar configuración en archivo"""
    try:
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f)
        return True
    except Exception as e:
        print(f"Error al guardar configuración: {e}")
        return False

@app.route('/')
def index():
    """Servir la página principal"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_file(filename):
    """Servir archivos estáticos"""
    return send_from_directory('.', filename)

@app.route('/api/config', methods=['GET'])
def get_config():
    """Obtener configuración"""
    config = cargar_configuracion()
    return jsonify(config)

@app.route('/api/config', methods=['POST'])
def save_config():
    """Guardar configuración"""
    try:
        data = request.get_json()
        if 'api_key' in data:
            config = cargar_configuracion()
            config['api_key'] = data['api_key']
            if guardar_configuracion(config):
                return jsonify({'success': True, 'message': 'Configuración guardada'})
            else:
                return jsonify({'error': 'Error al guardar configuración'}), 500
        else:
            return jsonify({'error': 'API key requerida'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transcribir', methods=['POST'])
def transcribir_audio():
    """Transcribir archivo de audio usando Whisper API"""
    print("🔍 Petición de transcripción recibida")
    
    try:
        # Verificar si hay archivo
        if 'file' not in request.files:
            print("❌ No se encontró archivo en la petición")
            return jsonify({'error': 'No se proporcionó archivo'}), 400
        
        archivo = request.files['file']
        print(f"📁 Archivo recibido: {archivo.filename}")
        
        if archivo.filename == '':
            print("❌ Nombre de archivo vacío")
            return jsonify({'error': 'No se seleccionó archivo'}), 400
        
        if not allowed_file(archivo.filename):
            print(f"❌ Tipo de archivo no permitido: {archivo.filename}")
            return jsonify({'error': 'Tipo de archivo no permitido'}), 400
        
        # Obtener API key
        api_key = request.form.get('api_key')
        if not api_key:
            config = cargar_configuracion()
            api_key = config.get('api_key')
        
        if not api_key:
            print("❌ API key no encontrada")
            return jsonify({'error': 'API key no configurada'}), 400
        
        print("✅ API key encontrada")
        
        # Guardar archivo temporalmente
        filename = secure_filename(archivo.filename)
        temp_path = os.path.join(UPLOAD_FOLDER, filename)
        archivo.save(temp_path)
        print(f"💾 Archivo guardado temporalmente: {temp_path}")
        
        # Verificar tamaño del archivo
        tamano_archivo = os.path.getsize(temp_path) / (1024 * 1024)  # MB
        print(f"📏 Tamaño del archivo: {tamano_archivo:.2f}MB")
        
        if tamano_archivo > 25:
            os.remove(temp_path)  # Limpiar archivo
            print("❌ Archivo demasiado grande")
            return jsonify({'error': 'El archivo es demasiado grande. El límite es 25MB'}), 400
        
        print("🚀 Enviando archivo a Whisper API...")
        
        # Preparar archivo para envío a Whisper API
        with open(temp_path, 'rb') as audio_file:
            files = {'file': audio_file}
            data = {
                'model': 'whisper-1',
                'language': 'es',  # Español para audio clínico
                'response_format': 'json'
            }
            headers = {
                'Authorization': f'Bearer {api_key}'
            }
            
            # Realizar petición a la API de Whisper
            response = requests.post(
                'https://api.openai.com/v1/audio/transcriptions',
                headers=headers,
                data=data,
                files=files
            )
        
        print(f"📡 Respuesta de Whisper API: {response.status_code}")
        
        # Limpiar archivo temporal
        os.remove(temp_path)
        print("🧹 Archivo temporal eliminado")
        
        if response.status_code == 200:
            resultado = response.json()
            transcripcion = resultado.get('text', '')
            print(f"✅ Transcripción exitosa: {len(transcripcion)} caracteres")
            return jsonify({
                'success': True,
                'transcripcion': transcripcion,
                'archivo': filename
            })
        else:
            error_msg = f"Error en la API: {response.status_code} - {response.text}"
            print(f"❌ Error de Whisper API: {error_msg}")
            return jsonify({'error': error_msg}), 500
            
    except Exception as e:
        print(f"❌ Error general: {str(e)}")
        # Limpiar archivo temporal en caso de error
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
            print("🧹 Archivo temporal eliminado por error")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Verificar estado del servidor"""
    return jsonify({'status': 'ok', 'message': 'Servidor funcionando correctamente'})

@app.route('/api/completar-plantilla', methods=['POST'])
def completar_plantilla():
    """Completar plantilla usando OpenAI"""
    print("🔍 Petición de completación de plantilla recibida")
    
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        
        if not prompt:
            print("❌ No se proporcionó prompt")
            return jsonify({'error': 'Prompt requerido'}), 400
        
        print(f"📝 Prompt recibido: {len(prompt)} caracteres")
        
        # Obtener API key
        config = cargar_configuracion()
        api_key = config.get('api_key')
        
        if not api_key:
            print("❌ API key no encontrada")
            return jsonify({'error': 'API key no configurada'}), 400
        
        print("🚀 Enviando prompt a OpenAI...")
        
        # Realizar petición a OpenAI
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': 'gpt-3.5-turbo',
            'messages': [
                {
                    'role': 'system',
                    'content': 'Eres un asistente médico especializado en completar plantillas médicas. Debes respetar el formato de la plantilla y llenar solo los campos que puedas con la información proporcionada. Si no hay información para un campo, déjalo en blanco o con [No especificado].'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'max_tokens': 2000,
            'temperature': 0.3
        }
        
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=payload
        )
        
        print(f"📡 Respuesta de OpenAI: {response.status_code}")
        
        if response.status_code == 200:
            resultado = response.json()
            contenido = resultado['choices'][0]['message']['content']
            print(f"✅ Plantilla completada: {len(contenido)} caracteres")
            return jsonify({
                'success': True,
                'result': contenido
            })
        else:
            error_msg = f"Error en OpenAI: {response.status_code} - {response.text}"
            print(f"❌ Error de OpenAI: {error_msg}")
            return jsonify({'error': error_msg}), 500
            
    except Exception as e:
        print(f"❌ Error general: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Iniciando servidor de transcripción para eustakio_interface...")
    print("📁 Serviendo archivos desde:", os.getcwd())
    print("🌐 Servidor disponible en: http://localhost:3001")
    print("📝 API endpoints:")
    print("   - GET  /api/config     - Obtener configuración")
    print("   - POST /api/config     - Guardar configuración")
    print("   - POST /api/transcribir - Transcribir audio")
    print("   - GET  /api/health     - Verificar estado")
    print("   - POST /api/completar-plantilla - Completar plantilla")
    
    app.run(host='0.0.0.0', port=3001, debug=True) 