import React from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleCard from './VehicleCard';
import './VehicleList.css';

const VehicleList = ({ vehicles }) => {
    const navigate = useNavigate();

    const handleCardClick = (vehicleId) => {
        navigate(`/vehicles/${vehicleId}`);
    };

    return (
        <div className="card">
            <h3 style={{margin:5}}>Vehículos Registrados</h3>
            <div className="vehicle-list">
                {vehicles.length > 0 ? (
                    vehicles.map(vehicle => (
                        <VehicleCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            onClick={() => handleCardClick(vehicle.id)}
                        />
                    ))
                ) : (
                    <p>No hay vehículos registrados.</p>
                )}
            </div>
        </div>
    );
};

export default VehicleList;