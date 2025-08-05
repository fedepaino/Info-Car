import { vehicles as initialVehicles, services as initialServices, alerts as initialAlerts } from './mockData';

// 1. Definir el reducer para manejar las acciones del estado
export const appReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_VEHICLE':
            return { ...state, vehicles: [...state.vehicles, { ...action.payload, id: Date.now().toString() }] };
        case 'EDIT_VEHICLE':
            return {
                ...state,
                vehicles: state.vehicles.map(v => v.id === action.payload.vehicleId ? { ...v, ...action.payload.updatedData } : v)
            };
        case 'ADD_MAINTENANCE':
            return { ...state, services: [...state.services, { ...action.payload, id: Date.now().toString() }] };
        case 'ADD_ALERT':
            return { ...state, alerts: [...state.alerts, { ...action.payload, id: Date.now().toString() }] };
        default:
            return state;
    }
};

// 2. Función para cargar el estado inicial desde localStorage o usar datos de ejemplo
export const loadInitialState = () => {
    try {
        const serializedState = localStorage.getItem('infoCarState');
        if (serializedState === null) {
            return { vehicles: initialVehicles, services: initialServices, alerts: initialAlerts };
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.error("No se pudo cargar el estado desde localStorage", error);
        return { vehicles: initialVehicles, services: initialServices, alerts: initialAlerts };
    }
};