import React from 'react';

import { Link } from 'react-router-dom';

const VehicleList = ({ vehicles }) => {
    return (
        <div className="card">
            <h3>Vehículos Registrados</h3>
            <ul>
                {vehicles.map(v => (
                    <li key={v.id}>
                        {/* Usamos Link para navegar a la nueva página */}
                        <Link to={`/vehicles/${v.id}`}>
                            <h4>{v.marca} {v.modelo}</h4>
                            <p>Kilometraje: {v.kilometraje} km</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VehicleList;