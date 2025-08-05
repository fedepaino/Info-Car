/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AddAlertForm = ({ onSubmit }) => {
    const [tipo, setTipo] = useState('');
    const [fechaEstimada, setFechaEstimada] = useState('');
    const { vehicleId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!tipo || !fechaEstimada) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        onSubmit({
            tipo,
            fechaEstimada,
            vehiculoId: vehicleId,
        });
        navigate(`/vehicles/${vehicleId}`); // Vuelve a la página de detalles del vehículo
    };

    return (
        <div className="card">
            <h3>Agregar Nueva Alerta de Mantenimiento</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="tipo">Tipo de Alerta</label>
                    <input type="text" id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Ej: Cambio de correa de distribución" />
                </div>
                <div className="form-group">
                    <label htmlFor="fechaEstimada">Fecha Estimada</label>
                    <input type="date" id="fechaEstimada" value={fechaEstimada} onChange={(e) => setFechaEstimada(e.target.value)} />
                </div>
                <button type="submit" className="button">Agregar Alerta</button>
            </form>
        </div>
    );
};

export default AddAlertForm;