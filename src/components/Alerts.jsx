import React from 'react';
import { formatDate } from '../utils/dateUtils';

const Alerts = ({ alerts }) => {
    return (
        <div className="card">
            <h3>Alertas de Mantenimiento Próximas</h3>
            <ul>
                {alerts.map(a => (
                    <li key={a.id}>
                        {/* Mostrar el tipo de alerta y el coche al que pertenece */}
                        <h4>{a.tipo}</h4>
                        <p><strong>Coche:</strong> {a.vehicleMarca} {a.vehicleModelo}</p>
                        <p><strong>Fecha Estimada:</strong> {formatDate(a.fechaEstimada)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Alerts;