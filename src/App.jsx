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

import { appReducer, initialState } from './store';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { vehicles, services, alerts } = state;

  // Cargar datos iniciales desde el backend al montar el componente
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Por ahora, solo cargamos vehículos. Puedes añadir services y alerts.
        const response = await fetch(`${API_URL}/vehicles`);
        const vehiclesData = await response.json();
        dispatch({ type: 'SET_INITIAL_DATA', payload: { vehicles: vehiclesData, services: [], alerts: [] } });
      } catch (error) {
        console.error("Error al cargar los datos iniciales:", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleAddVehicle = async (vehicleData) => {
    try {
      const response = await fetch(`${API_URL}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData),
      });
      const newVehicle = await response.json();
      dispatch({ type: 'ADD_VEHICLE', payload: newVehicle });
    } catch (error) {
      console.error("Error al agregar vehículo:", error);
    }
  };

  const handleEditVehicle = async (vehicleId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const savedVehicle = await response.json();
      dispatch({ type: 'EDIT_VEHICLE', payload: { vehicleId, updatedData: savedVehicle } });
    } catch (error) {
      console.error("Error al editar vehículo:", error);
    }
  };

  // TODO: Adaptar estas funciones para que usen fetch, igual que las de vehículos
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