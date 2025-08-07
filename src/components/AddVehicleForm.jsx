import React, { useState } from 'react';
import axios from 'axios';

const AddVehicleForm = ({ onSubmit, onCancel }) => {
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [matricula, setMatricula] = useState('');
    const [anio, setAnio] = useState('');
    const [kilometraje, setKilometraje] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (isUploading) return;
        setIsUploading(true);

        let imageUrl = ''; // URL por defecto si no hay imagen

        if (imageFile) {
            try {
                // 1. Obtener la firma del backend (asegúrate de que esté corriendo)
                const response = await axios.get('http://localhost:3001/api/sign-upload');
                const { signature, timestamp } = response.data;

                // 2. Preparar el FormData para Cloudinary
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('timestamp', timestamp);
                formData.append('signature', signature);
                // ¡IMPORTANTE! Reemplaza con tus valores reales de Cloudinary
                formData.append('api_key', '453669563368148'); 
                formData.append('folder', 'info-car-vehicles');

                // 3. Subir la imagen a Cloudinary
                const uploadResponse = await axios.post(
                    `https://api.cloudinary.com/v1_1/da77hokqy/image/upload`,
                    formData
                );

                imageUrl = uploadResponse.data.secure_url;

            } catch (error) {
                console.error('Error al subir la imagen:', error);
                alert('Hubo un error al subir la imagen. Por favor, inténtalo de nuevo.');
                setIsUploading(false);
                return; // Detener el proceso si la subida falla
            }
        }

        // 4. Crear el objeto final del vehículo con la URL de la imagen
        const newVehicle = {
            marca, modelo, matricula,
            anio: parseInt(anio),
            kilometraje: parseInt(kilometraje),
            imageUrl // Añadir la URL de la imagen
        };
        onSubmit(newVehicle);
    };

    return (
        <div className="form-card">
            <h2>Agregar Nuevo Vehículo</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Marca:</label>
                    <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Modelo:</label>
                    <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Año:</label>
                    <input type="number" value={anio} onChange={(e) => setAnio(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Matricula:</label>
                    <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Kilometraje inicial:</label>
                    <input type="number" value={kilometraje} onChange={(e) => setKilometraje(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Imagen del Vehículo</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={isUploading}>{isUploading ? 'Guardando...' : 'Guardar Vehículo'}</button>
                    <button type="button" onClick={onCancel} className="cancel-btn">Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default AddVehicleForm;