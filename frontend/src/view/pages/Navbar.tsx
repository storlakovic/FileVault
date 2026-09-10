import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = (): void => {
        localStorage.removeItem("access_token");

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <nav className="navbar">
            <NavLink to="/" className="nav-logo">
                FileVault
            </NavLink>
            <ul className="nav-links">
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/upload" className={({ isActive }) => isActive ? 'active' : ''}>
                        File Upload
                    </NavLink>
                </li>
            </ul>
            <button className="btn-logout" onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
};

export default Navbar;