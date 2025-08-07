import sqlite3


def init_db():
    """Inicializa la base de datos y crea las tablas si no existen."""
    conn = sqlite3.connect('infocar.db')
    cursor = conn.cursor()
    cursor.executescript('''
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
    conn.close()