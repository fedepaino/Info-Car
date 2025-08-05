export const vehicles = [
    {
        id: 'v1',
        marca: 'ford',
        modelo: 'kuga',
        kilometraje: 155000,
        ultimaITV: '2024-07-15',
    },
    {
        id: 'v2',
        marca: 'Toyota',
        modelo: 'Corolla',
        kilometraje: 85000,
        ultimaITV: '2024-06-20',
    },
    {
        id: 'v3',
        marca: 'Ford',
        modelo: 'F-150',
        kilometraje: 210000,
        ultimaITV: '2024-05-10',
    },
];

export const services = [
    {
        id: 's1',
        vehiculoId: 'v1',
        tipo: 'Cambio de aceite',
        fecha: '2025-07-15',
        kilometraje: 154500,
    },
    {
        id: 's2',
        vehiculoId: 'v2',
        tipo: 'Rotación de neumáticos',
        fecha: '2025-06-20',
        kilometraje: 84000,
    },
    {
        id: 's3',
        vehiculoId: 'v3',
        tipo: 'Inspección de frenos',
        fecha: '2025-05-10',
        kilometraje: 209000,
    },
];

export const alerts = [
    {
        id: 'a1',
        vehiculoId: 'v1',
        tipo: 'Próximo cambio de aceite',
        fechaEstimada: '2025-10-15',
    },
    {
        id: 'a2',
        vehiculoId: 'v2',
        tipo: 'Revisión general',
        fechaEstimada: '2025-12-20',
    },
];