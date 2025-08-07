# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Crear back-end

## Paso 1: Creación del Backend con Python y Flask

## 1.1 Primero, crearemos una carpeta server en la raíz de tu proyecto. 
Estructura de carpetas: Tu proyecto se verá así:

plaintext
Info-Car/
├── server/
│   ├── app.py          # El corazón de tu API
│   ├── database.py     # Lógica para la base de datos
│   └── requirements.txt  # Dependencias de Python
└── src/
    └── ...

## 1.2 Configurar el entorno de Python: Es una buena práctica usar un entorno virtual para aislar las dependencias de tu proyecto.

Abre una terminal en la nueva carpeta Info-Car/server.
Crea el entorno virtual: python -m venv venv
Actívalo:
  - En **Windows (cmd.exe)**: `venv\Scripts\activate`
  - En **Windows (Git Bash/MINGW64)**: `source venv/Scripts/activate`
  - En **macOS/Linux**: `source venv/bin/activate`

## 1.3 Definir las dependencias (requirements.txt): Este archivo le dice a Python qué paquetes necesita tu backend.

escribe estas dos dependencias en la carpeta: requirements.txt

Flask
Flask-Cors

## 1.4 Instalar las dependencias: Con tu entorno virtual activado, 

ejecuta: pip install -r requirements.txt

## 1.5 Configurar la Base de Datos (database.py): Este script se encargará de crear tu base de datos SQLite y las tablas si no existen.

New file: database.py
+42

import sqlite3

def get_db_connection():
    """Crea una conexión a la base de datos."""
    conn = sqlite3.connect('infocar.db')
    # Esto permite acceder a las columnas por nombre, muy útil.
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Inicializa la base de datos y crea las tablas si no existen."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS vehicles (
            id TEXT PRIMARY KEY,
            marca TEXT NOT NULL,
            modelo TEXT NOT NULL,
            anio INTEGER,
            kilometraje INTEGER,
            ultimaITV TEXT
        );

        CREATE TABLE IF NOT EXISTS services (
            id TEXT PRIMARY KEY,
            vehiculoId TEXT NOT NULL,
            tipo TEXT NOT NULL,
            fecha TEXT,
            kilometraje INTEGER,
            FOREIGN KEY(vehiculoId) REFERENCES vehicles(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS alerts (
            id TEXT PRIMARY KEY,
            vehiculoId TEXT NOT NULL,
            tipo TEXT NOT NULL,
            fechaEstimada TEXT,
            FOREIGN KEY(vehiculoId) REFERENCES vehicles(id) ON DELETE CASCADE
        );
    ''')
    conn.commit()
    conn.close()

## 1.6 Crear el Servidor Flask y los Endpoints (app.py): Este es el archivo principal de tu API. Aquí definimos las rutas que tu aplicación de React consumirá.

New file: app.py
+79
from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
from database import init_db, get_db_connection

app = Flask(__name__)
# CORS(app) permite que tu frontend (que corre en otro puerto)
# pueda hacer peticiones a este backend.
CORS(app)

# --- API Endpoints ---

# GET todos los vehículos
@app.route('/api/vehicles', methods=['GET'])
def get_all_vehicles():
    conn = get_db_connection()
    vehicles_rows = conn.execute('SELECT * FROM vehicles').fetchall()
    conn.close()
    vehicles = [dict(row) for row in vehicles_rows]
    return jsonify(vehicles)

# GET un vehículo por ID
@app.route('/api/vehicles/<vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    conn = get_db_connection()
    vehicle_row = conn.execute('SELECT * FROM vehicles WHERE id = ?', (vehicle_id,)).fetchone()
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
        'anio': data.get('anio'),
        'kilometraje': data.get('kilometraje'),
        'ultimaITV': data.get('ultimaITV')
    }

    conn = get_db_connection()
    conn.execute(
        'INSERT INTO vehicles (id, marca, modelo, anio, kilometraje, ultimaITV) VALUES (?, ?, ?, ?, ?, ?)',
        (new_vehicle['id'], new_vehicle['marca'], new_vehicle['modelo'], new_vehicle['anio'], new_vehicle['kilometraje'], new_vehicle['ultimaITV'])
    )
    conn.commit()
    conn.close()

    return jsonify(new_vehicle), 201

# PUT para editar un vehículo
@app.route('/api/vehicles/<vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    data = request.get_json()
    conn = get_db_connection()
    
    conn.execute(
        'UPDATE vehicles SET marca = ?, modelo = ?, anio = ?, kilometraje = ?, ultimaITV = ? WHERE id = ?',
        (data.get('marca'), data.get('modelo'), data.get('anio'), data.get('kilometraje'), data.get('ultimaITV'), vehicle_id)
    )
    conn.commit()
    
    updated_vehicle_row = conn.execute('SELECT * FROM vehicles WHERE id = ?', (vehicle_id,)).fetchone()
    conn.close()

    if updated_vehicle_row is None:
        return jsonify({'message': 'Vehicle not found'}), 404

    return jsonify(dict(updated_vehicle_row))

# TODO: Agregar endpoints para services y alerts

if __name__ == '__main__':
    init_db()  # Asegura que la DB y las tablas estén creadas al iniciar
    app.run(debug=True, port=5000) # Flask corre en el puerto 5000 p

## 1.7 Arrancar el Backend (Python)

*   Abre una terminal en la carpeta `Info-Car/server`.
*   Asegúrate de que tu entorno virtual esté activado (`source venv/Scripts/activate` o el comando correspondiente para tu terminal).
*   Ejecuta `python app.py`.
*   Verás un mensaje indicando que el servidor Flask está corriendo en `http://localhost:5000`.
*   Para detener el servidor, presiona `Ctrl+C` en la terminal.

## Paso 2: Conectar el Frontend de React al Backend
Ahora, modificaremos tu aplicación de React para que use el nuevo backend de Python. Los cambios son casi idénticos a la propuesta anterior, pero apuntaremos al puerto 5000.

Actualizar la lógica del estado (store.js): Vamos a cambiar el reducer para que maneje los datos que vienen del servidor y eliminaremos la dependencia de localStorage.