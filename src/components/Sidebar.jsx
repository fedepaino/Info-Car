import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <aside
            className={`sidebar ${isHovered ? 'expanded' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="logo-container">
                <span role="img" aria-label="gear">⚙️</span>
                <span className="logo-text">InfoCar</span>
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">
                            <span className="icon">🏠</span>
                            <span className="link-text">Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/add-vehicle">
                            <span className="icon">🚗</span>
                            <span className="link-text">Agregar Vehículo</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/add-maintenance">
                            <span className="icon">🔧</span>
                            <span className="link-text">Agregar Mantenimiento</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/alertas">
                            <span className="icon">🔔</span>
                            <span className="link-text">Alertas</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;