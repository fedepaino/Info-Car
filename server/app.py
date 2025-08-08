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

def _vehicle_row_to_dict(row):
    """Convierte una fila de la base de datos a un diccionario con claves en camelCase."""
    if not row:
        return None
    return {
        'id': row['id'],
        'marca': row['marca'],
        'modelo': row['modelo'],
        'matricula': row['matricula'],
        'anio': row['anio'],
        'kilometraje': row['kilometraje'],
        'ultimaITV': row['ultimaitv'],  # Clave de la DB en minúsculas
        'imageUrl': row['imageurl']    # Clave de la DB en minúsculas
    }

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
    vehicles = [_vehicle_row_to_dict(row) for row in vehicles_rows]
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
    return jsonify(_vehicle_row_to_dict(vehicle_row))

# POST para agregar un nuevo vehículo
@app.route('/api/vehicles', methods=['POST'])
def add_vehicle():
    data = request.get_json()
    # Generamos el ID aquí para poder buscar el registro recién creado
    vehicle_id = str(uuid.uuid4())

    conn = get_db_connection()
    # Usamos DictCursor para poder leer el resultado
    cur = conn.cursor(cursor_factory=DictCursor)
    cur.execute(
        # Usamos nombres de columna en minúsculas para ser explícitos
        'INSERT INTO vehicles (id, marca, modelo, matricula, anio, kilometraje, ultimaitv, imageurl) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)',
        (vehicle_id, data.get('marca'), data.get('modelo'), data.get('matricula'), data.get('anio'), data.get('kilometraje'), data.get('ultimaITV'), data.get('imageUrl'))
    )

    # Obtenemos el vehículo recién creado de la base de datos para asegurar que la respuesta es correcta
    cur.execute('SELECT * FROM vehicles WHERE id = %s', (vehicle_id,))
    new_vehicle_row = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    return jsonify(_vehicle_row_to_dict(new_vehicle_row)), 201

# PUT para editar un vehículo
@app.route('/api/vehicles/<vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    cur.execute(
        'UPDATE vehicles SET marca = %s, modelo = %s, matricula = %s, anio = %s, kilometraje = %s, ultimaitv = %s, imageurl = %s WHERE id = %s',
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

    return jsonify(_vehicle_row_to_dict(updated_vehicle_row))

# TODO: Agregar endpoints para services y alerts

if __name__ == '__main__':
    app.run(debug=True, port=5000) # Flask corre en el puerto 5000 por defecto