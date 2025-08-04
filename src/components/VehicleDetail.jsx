import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import './VehicleDetail.css'; // Crear un archivo CSS para esta vista

const VehicleDetail = ({ vehicles, services }) => {
    const { vehicleId } = useParams();
    const navigate = useNavigate();

    // Buscar el vehículo y sus servicios
    const vehicle = vehicles.find(v => v.id === vehicleId);
    const vehicleServices = services.filter(s => s.vehiculoId === vehicleId);

    if (!vehicle) {
        return <div>Vehículo no encontrado.</div>;
    }

    return (
        <div className="vehicle-detail-container">
            <div className="vehicle-info-card">
                <h2>{vehicle.marca} {vehicle.modelo} ({vehicle.anio})</h2>
                <p><strong>Kilometraje actual:</strong> {vehicle.kilometraje} km</p>
                <button onClick={() => navigate(-1)} className="back-btn">Volver al Dashboard</button>
            </div>

            <div className="services-card">
                <h3>Historial de Mantenimientos</h3>
                {vehicleServices.length > 0 ? (
                    <ul>
                        {vehicleServices.map(s => (
                            <li key={s.id}>
                                <div>
                                    <h4>{s.tipo}</h4>
                                    <p>Fecha: {formatDate(s.fecha)}</p>
                                    <p>Kilometraje: {s.kilometraje} km</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay mantenimientos registrados para este vehículo.</p>
                )}
            </div>
        </div>
    );
};

export default VehicleDetail;