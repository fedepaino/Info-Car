import os
import psycopg2


def init_db():
    """Inicializa la base de datos PostgreSQL y crea las tablas si no existen."""
    # Obtiene la URL de la base de datos desde las variables de entorno
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        # Para desarrollo local, podrías tener una URL por defecto,
        # pero para Render, esta variable siempre existirá.
        raise Exception("No se ha configurado la variable de entorno DATABASE_URL")

    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    # El SQL es compatible con PostgreSQL, no necesita cambios.
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vehicles (
            id TEXT PRIMARY KEY,
            marca TEXT NOT NULL,
            modelo TEXT NOT NULL,
            matricula TEXT,
            anio INTEGER,
            kilometraje INTEGER,
            ultimaITV TEXT,
            imageUrl TEXT
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
    cursor.close()
    conn.close()
    print("Base de datos inicializada.")
