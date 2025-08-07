import React from 'react';
import { FaCar } from 'react-icons/fa6'; // Icono de placeholder
import './VehicleCard.css';

const VehicleCard = ({ vehicle, onClick }) => {
    // Asumimos que 'vehicle' tiene: marca, modelo, matricula, kilometraje y opcionalmente imageUrl
    return (
        <div className="vehicle-card" onClick={onClick} role="button" tabIndex={0}>
            <div className="vehicle-card-image-container">
                {vehicle.imageUrl ? (
                    <img src={vehicle.imageUrl} alt={`${vehicle.marca} ${vehicle.modelo}`} />
                ) : (
                    <FaCar className="vehicle-placeholder-icon" />
                )}
            </div>
            <div className="vehicle-card-info">
                <h3>{vehicle.marca} {vehicle.modelo}</h3>
                <p>{vehicle.matricula}</p>
            </div>
        </div>
    );
};

export default VehicleCard;
