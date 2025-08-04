import React, { useState } from 'react';

const AddVehicleForm = ({ onSubmit, onCancel }) => {
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [anio, setAnio] = useState('');
    const [kilometraje, setKilometraje] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newVehicle = { marca, modelo, anio: parseInt(anio), kilometraje: parseInt(kilometraje) };
        onSubmit(newVehicle);
    };

    return (
        <div className="form-card">
            <h2>Agregar Nuevo Vehículo</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Marca:</label>
                    <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Modelo:</label>
                    <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Año:</label>
                    <input type="number" value={anio} onChange={(e) => setAnio(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Kilometraje inicial:</label>
                    <input type="number" value={kilometraje} onChange={(e) => setKilometraje(e.target.value)} required />
                </div>
                <div className="form-actions">
                    <button type="submit">Guardar Vehículo</button>
                    <button type="button" onClick={onCancel} className="cancel-btn">Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default AddVehicleForm;