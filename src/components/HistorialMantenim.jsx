import React from "react";

const HistorialMantenim = () => {
    return (
        <div>
            <div className="card">
                <h3>Historial de Mantenimiento</h3>
                {vehicleServices.length > 0 ? (
                    <ul>
                        {vehicleServices.map(service => (
                            <li key={service.id}>
                                <h4>{service.tipo}</h4>
                                <p><strong>Fecha:</strong> {formatDate(service.fecha)}</p>
                                <p><strong>Kilometraje:</strong> {service.kilometraje} km</p>
                                <p><strong>Coste:</strong> ${service.coste}</p>
                                <p><strong>Notas:</strong> {service.notas}</p>
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay registros de mantenimiento para este vehículo.</p>)}
            </div>
        </div>
        );
};

export default HistorialMantenim;
