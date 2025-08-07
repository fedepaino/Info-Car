from flask import Flask, jsonify, request, g
from flask_cors import CORS
import uuid
import sqlite3
from database import init_db

app = Flask(__name__)
# CORS(app) permite que tu frontend (que corre en otro puerto)
# pueda hacer peticiones a este backend.
CORS(app)

DATABASE = 'infocar.db'

def get_db():
    """Abre una nueva conexión a la base de datos si no existe una en el contexto actual."""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        # Esto permite acceder a las columnas por nombre, muy útil.
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    """Cierra la conexión a la base de datos al final de la petición."""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# --- ruta principar del host ---
@app.route('/')
def index():
    """Ruta de bienvenida para verificar que el servidor está funcionando."""
    return "<h1>¡El backend de Info-Car está funcionando!</h1><p>Prueba a visitar <a href='/api/vehicles'>/api/vehicles</a></p>"



# --- API Endpoints ---

# GET todos los vehículos
@app.route('/api/vehicles', methods=['GET'])
def get_all_vehicles():
    db = get_db()
    vehicles_rows = db.execute('SELECT * FROM vehicles').fetchall()
    vehicles = [dict(row) for row in vehicles_rows]
    return jsonify(vehicles)

# GET un vehículo por ID
@app.route('/api/vehicles/<vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    db = get_db()
    vehicle_row = db.execute('SELECT * FROM vehicles WHERE id = ?', (vehicle_id,)).fetchone()
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
        'anio': data.get('anio'),
        'kilometraje': data.get('kilometraje'),
        'ultimaITV': data.get('ultimaITV')
    }

    db = get_db()
    db.execute(
        'INSERT INTO vehicles (id, marca, modelo, anio, kilometraje, ultimaITV) VALUES (?, ?, ?, ?, ?, ?)',
        (new_vehicle['id'], new_vehicle['marca'], new_vehicle['modelo'], new_vehicle['anio'], new_vehicle['kilometraje'], new_vehicle['ultimaITV'])
    )
    db.commit()

    return jsonify(new_vehicle), 201

# PUT para editar un vehículo
@app.route('/api/vehicles/<vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    data = request.get_json()
    db = get_db()
    
    db.execute(
        'UPDATE vehicles SET marca = ?, modelo = ?, anio = ?, kilometraje = ?, ultimaITV = ? WHERE id = ?',
        (data.get('marca'), data.get('modelo'), data.get('anio'), data.get('kilometraje'), data.get('ultimaITV'), vehicle_id)
    )
    db.commit()
    
    updated_vehicle_row = db.execute('SELECT * FROM vehicles WHERE id = ?', (vehicle_id,)).fetchone()

    if updated_vehicle_row is None:
        return jsonify({'message': 'Vehicle not found'}), 404

    return jsonify(dict(updated_vehicle_row))

# TODO: Agregar endpoints para services y alerts

if __name__ == '__main__':
    init_db()  # Asegura que la DB y las tablas estén creadas al iniciar
    app.run(debug=True, port=5000) # Flask corre en el puerto 5000 por defecto