import React from 'react';
import VehicleList from './VehicleList';
import RecentServices from './RecentServices';
import Alerts from './Alerts';

import { vehicles, services, alerts } from '../mockData';

const Dashboard = ({vehicles, services, alerts}) => {
    return (
        <main className="dashboard-content">
            <div className="dashboard-header">
                <h1>Home</h1>
            </div>

            <div className="dashboard-grid">
                <div className="main-panel">
                    <VehicleList vehicles={vehicles} />
                    <RecentServices services={services} />
                </div>
                <div className="side-panel">
                    <Alerts alerts={alerts} />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;