import React, { useState } from 'react';

const AddMaintenanceForm = ({ vehicles, onSubmit, onCancel }) => {
    const [vehiculoId, setVehiculoId] = useState('');
    const [tipo, setTipo] = useState('');
    const [fecha, setFecha] = useState('');
    const [kilometraje, setKilometraje] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMaintenance = { vehiculoId, tipo, fecha, kilometraje: parseInt(kilometraje) };
        onSubmit(newMaintenance);
    };

    return (
        <div className="form-card">
            <h2>Agregar Nuevo Mantenimiento</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Vehículo:</label>
                    <select value={vehiculoId} onChange={(e) => setVehiculoId(e.target.value)} required>
                        <option value="">Selecciona un vehículo</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.marca} {v.modelo}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Tipo de servicio:</label>
                    <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Fecha:</label>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Kilometraje:</label>
                    <input type="number" value={kilometraje} onChange={(e) => setKilometraje(e.target.value)} required />
                </div>
                <div className="form-actions">
                    <button type="submit">Guardar Mantenimiento</button>
                    <button type="button" onClick={onCancel} className="cancel-btn">Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default AddMaintenanceForm;