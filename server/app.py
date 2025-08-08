from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
import os
import psycopg2
from psycopg2.extras import DictCursor
from database import init_db

app = Flask(__name__)
# CORS(app) permite que tu frontend (que corre en otro puerto)
# pueda hacer peticiones a este backend.
CORS(app)

# Llamamos a init_db() para asegurar que las tablas se creen al iniciar.
# En un entorno de producción, esto se podría manejar con un script de migración.
init_db()

def get_db_connection():
    """Crea una conexión a la base de datos PostgreSQL."""
    conn = psycopg2.connect(os.environ.get('DATABASE_URL'))
    return conn

# --- ruta principar del host ---
@app.route('/')
def index():
    """Ruta de bienvenida para verificar que el servidor está funcionando."""
    return "<h1>¡El backend de Info-Car está funcionando!</h1><p>Prueba a visitar <a href='/api/vehicles'>/api/vehicles</a></p>"

# --- API Endpoints ---

# GET todos los vehículos
@app.route('/api/vehicles', methods=['GET'])
def get_all_vehicles():
    conn = get_db_connection()
    # Usamos DictCursor para obtener resultados como diccionarios (similar a sqlite3.Row)
    cur = conn.cursor(cursor_factory=DictCursor)
    cur.execute('SELECT * FROM vehicles')
    vehicles_rows = cur.fetchall()
    cur.close()
    conn.close()
    vehicles = [dict(row) for row in vehicles_rows]
    return jsonify(vehicles)

# GET un vehículo por ID
@app.route('/api/vehicles/<vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)
    # PostgreSQL usa %s como placeholder
    cur.execute('SELECT * FROM vehicles WHERE id = %s', (vehicle_id,))
    vehicle_row = cur.fetchone()
    cur.close()
    conn.close()
    if vehicle_row is None:
        return jsonify({'message': 'Vehicle not found'}), 404
    return jsonify(dict(vehicle_row))

# POST para agregar un nuevo vehículo
@app.route('/api/vehicles', methods=['POST'])
def add_vehicle():
    data = request.get_json()
    new_vehicle = {
        'id': str(uuid.uuid4()),
        'marca': data.get('marca'),
        'modelo': data.get('modelo'),
        'matricula': data.get('matricula'), # Ya lo tenías aquí, ¡genial!
        'anio': data.get('anio'),
        'kilometraje': data.get('kilometraje'),
        'ultimaITV': data.get('ultimaITV'),
        'imageUrl': data.get('imageUrl')
    }

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO vehicles (id, marca, modelo, matricula, anio, kilometraje, ultimaITV, imageUrl) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)',
        (new_vehicle['id'], new_vehicle['marca'], new_vehicle['modelo'], new_vehicle['matricula'], new_vehicle['anio'], new_vehicle['kilometraje'], new_vehicle['ultimaITV'], new_vehicle['imageUrl'])
    )
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(new_vehicle), 201

# PUT para editar un vehículo
@app.route('/api/vehicles/<vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)
    
    cur.execute(
        'UPDATE vehicles SET marca = %s, modelo = %s, matricula = %s, anio = %s, kilometraje = %s, ultimaITV = %s, imageUrl = %s WHERE id = %s',
        (data.get('marca'), data.get('modelo'), data.get('matricula'), data.get('anio'), data.get('kilometraje'), data.get('ultimaITV'), data.get('imageUrl'), vehicle_id)
    )
    
    # Hacemos el SELECT después del UPDATE para obtener los datos actualizados
    cur.execute('SELECT * FROM vehicles WHERE id = %s', (vehicle_id,))
    updated_vehicle_row = cur.fetchone()
    
    conn.commit()
    cur.close()
    conn.close()

    if updated_vehicle_row is None:
        return jsonify({'message': 'Vehicle not found'}), 404

    return jsonify(dict(updated_vehicle_row))

# TODO: Agregar endpoints para services y alerts

if __name__ == '__main__':
    app.run(debug=True, port=5000) # Flask corre en el puerto 5000 por defecto