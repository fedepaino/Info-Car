export const initialState = {
    vehicles: [],
    services: [],
    alerts: [],
};
 
export const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_INITIAL_DATA':
            return { ...state, ...action.payload };
        case 'ADD_VEHICLE':
            // El payload ya es el vehículo completo con ID del backend
            return { ...state, vehicles: [...state.vehicles, action.payload] };
        case 'EDIT_VEHICLE':
            return {
                ...state,
                // El payload contiene el ID y los datos actualizados del backend
                vehicles: state.vehicles.map(v => v.id === action.payload.vehicleId ? { ...v, ...action.payload.updatedData } : v)
            };
        case 'ADD_MAINTENANCE':
            return { ...state, services: [...state.services, action.payload] };
        case 'ADD_ALERT':
            return { ...state, alerts: [...state.alerts, action.payload] };
        default:
            return state;
    }
};
