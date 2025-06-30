import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    ApocaLoipssi
                </Link>

                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/" className="navbar-link">
                            Accueil
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/upload" className="navbar-link">
                            Formulaire
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
