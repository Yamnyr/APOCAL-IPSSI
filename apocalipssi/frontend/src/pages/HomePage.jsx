import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Bienvenue sur ApocaLoipssi</h1>
                <p className="hero-description">
                    Plateforme de téléchargement de documents PDF pour notre application
                </p>
                <div className="hero-actions">
                    <Link to="/upload" className="hero-button">
                        Accéder au formulaire
                    </Link>
                </div>
            </div>

            <div className="features-section">
                <h2>Fonctionnalités</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>Téléchargement simple</h3>
                        <p>Téléchargez facilement vos documents PDF en quelques clics</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Sécurisé</h3>
                        <p>Vos documents sont traités de manière sécurisée</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Rapide</h3>
                        <p>Traitement et validation instantanés</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
