#!/usr/bin/env python3
"""
Handler principal para Vercel
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import requests
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuración
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'm4a', 'flac', 'ogg', 'aac'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    """Servir la página principal"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_file(filename):
    """Servir archivos estáticos"""
    return send_from_directory('.', filename)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Verificar estado del servidor"""
    return jsonify({'status': 'ok', 'message': 'Servidor funcionando correctamente'})

@app.route('/api/transcribir', methods=['POST'])
def transcribir_audio():
    """Transcribir archivo de audio usando Whisper API"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No se proporcionó archivo'}), 400
        
        archivo = request.files['file']
        if archivo.filename == '':
            return jsonify({'error': 'No se seleccionó archivo'}), 400
        
        if not allowed_file(archivo.filename):
            return jsonify({'error': 'Tipo de archivo no permitido'}), 400
        
        # Obtener API key
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            return jsonify({'error': 'API key no configurada'}), 400
        
        # Guardar archivo temporalmente
        filename = secure_filename(archivo.filename)
        temp_path = f'/tmp/{filename}'
        archivo.save(temp_path)
        
        # Verificar tamaño del archivo
        tamano_archivo = os.path.getsize(temp_path) / (1024 * 1024)
        if tamano_archivo > 25:
            os.remove(temp_path)
            return jsonify({'error': 'El archivo es demasiado grande. El límite es 25MB'}), 400
        
        # Enviar a Whisper API
        with open(temp_path, 'rb') as audio_file:
            files = {'file': audio_file}
            data = {
                'model': 'whisper-1',
                'language': 'es',
                'response_format': 'json'
            }
            headers = {
                'Authorization': f'Bearer {api_key}'
            }
            
            response = requests.post(
                'https://api.openai.com/v1/audio/transcriptions',
                headers=headers,
                data=data,
                files=files
            )
        
        # Limpiar archivo temporal
        os.remove(temp_path)
        
        if response.status_code == 200:
            resultado = response.json()
            transcripcion = resultado.get('text', '')
            return jsonify({
                'success': True,
                'transcripcion': transcripcion,
                'archivo': filename
            })
        else:
            return jsonify({'error': f'Error en la API: {response.status_code}'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/completar-plantilla', methods=['POST'])
def completar_plantilla():
    """Completar plantilla usando OpenAI"""
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({'error': 'Prompt requerido'}), 400
        
        # Obtener API key
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            return jsonify({'error': 'API key no configurada'}), 400
        
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
                    'content': 'Eres un asistente médico especializado en completar plantillas médicas.'
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
        
        if response.status_code == 200:
            resultado = response.json()
            contenido = resultado['choices'][0]['message']['content']
            return jsonify({
                'success': True,
                'result': contenido
            })
        else:
            return jsonify({'error': f'Error en OpenAI: {response.status_code}'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Para desarrollo local
if __name__ == '__main__':
    app.run(debug=True) 