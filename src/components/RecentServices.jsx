import React from 'react';
import { formatDate } from '../utils/dateUtils';

const RecentServices = ({ services }) => {
    return (
        <div className="card">
            <h3>Historial de Servicios Recientes</h3>
            <ul>
                {services.map(s => (
                    <li key={s.id}>
                        <h4>{s.tipo}</h4>
                        <p>Fecha: {formatDate(s.fecha)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentServices;