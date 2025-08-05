/* eslint-disable react/prop-types */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';

const VehicleDetail = ({ vehicles, services }) => {
    const { vehicleId } = useParams();
    const vehicle = vehicles.find(v => v.id === vehicleId);
    const vehicleServices = services.filter(s => s.vehiculoId === vehicleId);

    if (!vehicle) {
        return <h2>Vehículo no encontrado</h2>;
    }

    return (
        <div>
            <div className="card vehicle-detail-header">
                <h2>{vehicle.marca} {vehicle.modelo}</h2>
                <p><strong>Kilometraje:</strong> {vehicle.kilometraje} km</p>
                <p><strong>Última ITV:</strong> {formatDate(vehicle.ultimaITV)}</p>
                <div>
                    <Link to={`/vehicles/${vehicleId}/add-alert`} className="button">
                        ➕ Agregar Alerta de Mantenimiento
                    </Link>
                </div>
                <div>
                    <Link to={`/vehicles/${vehicleId}/edit`} className="button">
                        ✏️ Editar Vehículo
                    </Link>
                </div>
            </div>

            <div className="card">
                <h3>Historial de Mantenimiento</h3>
                {vehicleServices.length > 0 ? (
                    <ul>
                        {vehicleServices.map(service => (
                            <li key={service.id}>
                                <h4>{service.tipo}</h4>
                                <p><strong>Fecha:</strong> {formatDate(service.fecha)}</p>
                                <p><strong>Kilometraje:</strong> {service.kilometraje} km</p>
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay registros de mantenimiento para este vehículo.</p>)}
            </div>
        </div>
    );
};

export default VehicleDetail;