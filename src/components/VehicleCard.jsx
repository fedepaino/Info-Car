import React from 'react';
import { FaCar } from 'react-icons/fa6'; // Icono de placeholder
import './VehicleCard.css';

const VehicleCard = ({ vehicle, onClick }) => {
    // Pro-Tip: Función para transformar la URL de Cloudinary y pedir una miniatura.
    // Esto hace que la lista cargue mucho más rápido.
    const getThumbnailUrl = (url) => {
        if (!url) return '';
        // Inserta transformaciones (ancho 100, alto 100, recortar, enfocar en auto)
        // justo después de /upload/
        return url.replace('/upload/', '/upload/w_100,h_100,c_fill,g_auto/');
    };

    // Asumimos que 'vehicle' tiene: marca, modelo, matricula, y opcionalmente imageUrl
    return (
        <div className="vehicle-card" onClick={onClick} role="button" tabIndex={0}>
            <div className="vehicle-card-image-container">
                {vehicle.imageUrl ? (
                    <img src={getThumbnailUrl(vehicle.imageUrl)} alt={`${vehicle.marca} ${vehicle.modelo}`} />
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
