/* eslint-disable react/prop-types */
import React from 'react';
import { formatDate } from '../utils/dateUtils';

const AllAlertsPage = ({ alerts }) => {
    if (!alerts || alerts.length === 0) {
        return (
            <div className="container">
                <h1>Todas las Alertas de Mantenimiento</h1>
                <p>No tienes ninguna alerta de mantenimiento programada.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Todas las Alertas de Mantenimiento</h1>
            <div className="alerts-list-full-page">
                {alerts.map((alert) => (
                    <div className="card alert-item-full" key={alert.id}>
                        <h4>{alert.tipo}</h4>
                        <p><strong>Coche:</strong> {alert.vehicleMarca} {alert.vehicleModelo}</p>
                        <p><strong>Fecha Estimada:</strong> {formatDate(alert.fechaEstimada)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllAlertsPage;