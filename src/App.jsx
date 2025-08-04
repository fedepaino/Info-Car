import React, { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom'; // Importar Routes y Route

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddVehicleForm from './components/AddVehicleForm';
import AddMaintenanceForm from './components/AddMaintenanceForm';
import VehicleDetail from './components/VehicleDetail'; // Importar nuevo componente
import './index.css';

import { vehicles as initialVehicles, services as initialServices, alerts as initialAlerts } from './mockData';

function App() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [services, setServices] = useState(initialServices);
  const [alerts, setAlerts] = useState(initialAlerts);

  // Función para agregar un nuevo vehículo
  const handleAddVehicle = (newVehicle) => {
    setVehicles([...vehicles, { ...newVehicle, id: Date.now().toString() }]);
  };

  // Función para agregar un nuevo mantenimiento
  const handleAddMaintenance = (newMaintenance) => {
    setServices([...services, { ...newMaintenance, id: Date.now().toString() }]);
  };

  // Enriquecer las alertas con los datos del vehículo
  const enrichedAlerts = useMemo(() => {
    return alerts.map(alert => {
      const vehicle = vehicles.find(v => v.id === alert.vehiculoId);
      return {
        ...alert,
        vehicleMarca: vehicle ? vehicle.marca : 'Desconocido',
        vehicleModelo: vehicle ? vehicle.modelo : 'Desconocido',
      };
    });
  }, [alerts, vehicles]);

  return (
    <div className="app-container">
      {/* El Sidebar ya no necesita el estado 'view' */}
      <Sidebar />
      <div className="main-content-area">
        <div className="content-panel">
          {/* Aquí definimos las rutas */}
          <Routes>
            <Route path="/" element={<Dashboard vehicles={vehicles} services={services} alerts={enrichedAlerts} />} />
            <Route path="/add-vehicle" element={<AddVehicleForm onSubmit={handleAddVehicle} />} />
            <Route path="/add-maintenance" element={<AddMaintenanceForm vehicles={vehicles} onSubmit={handleAddMaintenance} />} />
            {/* La nueva ruta con un parámetro dinámico :vehicleId */}
            <Route path="/vehicles/:vehicleId" element={<VehicleDetail vehicles={vehicles} services={services} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;