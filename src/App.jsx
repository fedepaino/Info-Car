import React, { useReducer, useMemo, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Importar Routes y Route

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddVehicleForm from './components/AddVehicleForm';
import AddAlertForm from './components/AddAlertForm';
import AddMaintenanceForm from './components/AddMaintenanceForm';
import EditVehicleForm from './components/EditVehicleForm'; // Importar el nuevo formulario de edición
import VehicleDetail from './components/VehicleDetail'; // Importar nuevo componente
import AllAlertsPage from './components/AllAlertsPage';
import './index.css';

import { appReducer, loadInitialState } from './store';

function App() {
  // 3. Usar useReducer para manejar el estado global
  const [state, dispatch] = useReducer(appReducer, undefined, loadInitialState);
  const { vehicles, services, alerts } = state;

  // 4. Usar useEffect para guardar el estado en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('infoCarState', JSON.stringify(state));
  }, [state]);

  // 5. Adaptar las funciones de manejo para que usen `dispatch`
  const handleAddVehicle = (newVehicle) => dispatch({ type: 'ADD_VEHICLE', payload: newVehicle });
  const handleEditVehicle = (vehicleId, updatedData) => dispatch({ type: 'EDIT_VEHICLE', payload: { vehicleId, updatedData } });
  const handleAddMaintenance = (newMaintenance) => dispatch({ type: 'ADD_MAINTENANCE', payload: newMaintenance });
  const handleAddAlert = (newAlert) => dispatch({ type: 'ADD_ALERT', payload: newAlert });

  // El resto de la lógica (useMemo) permanece igual, ya que depende de `vehicles` y `alerts`
  const enrichedAlerts = useMemo(() => {
    const mappedAlerts = alerts.map(alert => {
      const vehicle = vehicles.find(v => v.id === alert.vehiculoId);
      return {
        ...alert,
        vehicleMarca: vehicle ? vehicle.marca : 'Desconocido',
        vehicleModelo: vehicle ? vehicle.modelo : 'Desconocido',
      };
    });

    // Ordenar por fecha estimada, de la más cercana a la más lejana
    return mappedAlerts.sort((a, b) => new Date(a.fechaEstimada) - new Date(b.fechaEstimada));
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
            <Route path="/vehicles/:vehicleId/edit" element={<EditVehicleForm vehicles={vehicles} onSubmit={handleEditVehicle} />} />
            <Route path="/vehicles/:vehicleId/add-alert" element={<AddAlertForm onSubmit={handleAddAlert} />} />
            <Route path="/alertas" element={<AllAlertsPage alerts={enrichedAlerts} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;