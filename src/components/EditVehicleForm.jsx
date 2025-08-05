/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditVehicleForm = ({ vehicles, onSubmit }) => {
    const { vehicleId } = useParams();
    const navigate = useNavigate();
    const vehicleToEdit = vehicles.find(v => v.id === vehicleId);

    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [kilometraje, setKilometraje] = useState('');
    const [ultimaITV, setUltimaITV] = useState('');

    useEffect(() => {
        if (vehicleToEdit) {
            setMarca(vehicleToEdit.marca);
            setModelo(vehicleToEdit.modelo);
            setKilometraje(vehicleToEdit.kilometraje);
            // Formatear la fecha para el input type="date" (YYYY-MM-DD)
            const itvDate = new Date(vehicleToEdit.ultimaITV).toISOString().split('T')[0];
            setUltimaITV(itvDate);
        }
    }, [vehicleToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!marca || !modelo || !kilometraje || !ultimaITV) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        onSubmit(vehicleId, {
            marca,
            modelo,
            kilometraje: parseInt(kilometraje, 10),
            ultimaITV,
        });
        navigate(`/vehicles/${vehicleId}`); // Vuelve a la página de detalles
    };

    if (!vehicleToEdit) {
        return <h2>Vehículo no encontrado</h2>;
    }

    return (
        <div className="card">
            <h3>Editar Vehículo</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="marca">Marca</label>
                    <input type="text" id="marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="modelo">Modelo</label>
                    <input type="text" id="modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="kilometraje">Kilometraje</label>
                    <input type="number" id="kilometraje" value={kilometraje} onChange={(e) => setKilometraje(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="ultimaITV">Última ITV</label>
                    <input type="date" id="ultimaITV" value={ultimaITV} onChange={(e) => setUltimaITV(e.target.value)} />
                </div>
                <button type="submit" className="button">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default EditVehicleForm;