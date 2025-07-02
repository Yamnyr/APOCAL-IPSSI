import React from 'react';
import { Upload, Shield, Zap, ArrowRight, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
const HomePage = () => {
    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #ffffff 50%, #f3e8ff 100%)',
        position: 'relative',
        overflow: 'hidden'
    };

    const backgroundElement1Style = {
        position: 'absolute',
        top: '-10rem',
        right: '-15rem',
        width: '25rem',
        height: '25rem',
        background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
        borderRadius: '50%',
        mixBlendMode: 'multiply',
        filter: 'blur(3rem)',
        opacity: 0.15,
        animation: 'pulse 3s ease-in-out infinite'
    };

    const backgroundElement2Style = {
        position: 'absolute',
        bottom: '-15rem',
        left: '-10rem',
        width: '30rem',
        height: '30rem',
        background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
        borderRadius: '50%',
        mixBlendMode: 'multiply',
        filter: 'blur(3rem)',
        opacity: 0.15,
        animation: 'pulse 3s ease-in-out infinite',
        animationDelay: '1.5s'
    };

    const heroSectionStyle = {
        textAlign: 'center',
        marginTop: '25rem',
        padding: '4rem 2rem',
        position: 'relative',
        zIndex: 10
    };

    const logoContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '3rem'
    };

    const logoStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '5rem',
        height: '5rem',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderRadius: '1.25rem',
        boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.3)',
        animation: 'float 3s ease-in-out infinite'
    };

    const logoInnerStyle = {
        width: '2.5rem',
        height: '2.5rem',
        backgroundColor: 'white',
        borderRadius: '0.625rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const logoDotStyle = {
        width: '1.25rem',
        height: '1.25rem',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderRadius: '0.3125rem'
    };

    const appNameStyle = {
        fontSize: '2.25rem',
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginLeft: '1rem',
        letterSpacing: '0.05em'
    };

    const heroTitleStyle = {
        fontSize: '3.5rem',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '1.5rem',
        lineHeight: '1.1'
    };

    const heroDescriptionStyle = {
        fontSize: '1.25rem',
        color: '#6b7280',
        marginBottom: '3rem',
        maxWidth: '42rem',
        margin: '0 auto 3rem auto',
        lineHeight: '1.6'
    };

    const heroButtonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        color: 'white',
        fontWeight: '600',
        padding: '1rem 2rem',
        borderRadius: '1rem',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        fontSize: '1.125rem',
        boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)',
        marginRight: '1rem'
    };

    const secondaryButtonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        color: '#4f46e5',
        fontWeight: '600',
        padding: '1rem 2rem',
        borderRadius: '1rem',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        fontSize: '1.125rem',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        backdropFilter: 'blur(10px)'
    };

    const featuresSectionStyle = {
        padding: '4rem 2rem',
        maxWidth: '80rem',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
    };

    const featuresTitleStyle = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1f2937',
        marginBottom: '3rem'
    };

    const featureGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
    };

    const featureCardStyle = {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        textAlign: 'center'
    };

    const featureIconStyle = {
        width: '4rem',
        height: '4rem',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem auto',
        color: 'white'
    };

    const featureTitleStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '1rem'
    };

    const featureDescriptionStyle = {
        color: '#6b7280',
        lineHeight: '1.6'
    };

    const statsStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
        gap: '2rem',
        maxWidth: '60rem',
        margin: '0 auto'
    };

    const statCardStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1rem',
        padding: '1.5rem',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.3)'
    };

    const statNumberStyle = {
        fontSize: '2rem',
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    };

    const statLabelStyle = {
        color: '#6b7280',
        fontSize: '0.875rem',
        marginTop: '0.5rem'
    };

    return (
        <div style={containerStyle}>
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { opacity: 0.15; }
                        50% { opacity: 0.25; }
                    }
                    
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                `}
            </style>
            
            <div style={backgroundElement1Style}></div>
            <div style={backgroundElement2Style}></div>

            <div style={heroSectionStyle}>
                <div style={logoContainerStyle}>
                    <div style={logoStyle}>
                        <div style={logoInnerStyle}>
                            <div style={logoDotStyle}></div>
                        </div>
                    </div>
                    <h2 style={appNameStyle}>APOCALIPSSI</h2>
                </div>

                <h1 style={heroTitleStyle}>
                    Plateforme de gestion
                    <br />
                    <span style={{ 
                        background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        documentaire
                    </span>
                </h1>

                <p style={heroDescriptionStyle}>
                    Téléchargez, gérez et organisez vos documents PDF en toute simplicité. 
                    Une solution moderne et sécurisée pour tous vos besoins documentaires.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <Link 
                        to="/upload" 
                        style={heroButtonStyle}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'linear-gradient(90deg, #4f46e5, #7c3aed)';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 15px 35px -5px rgba(99, 102, 241, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'linear-gradient(90deg, #6366f1, #8b5cf6)';
                            e.target.style.transform = 'translateY(0px)';
                            e.target.style.boxShadow = '0 10px 25px -5px rgba(99, 102, 241, 0.3)';
                        }}
                    >
                        <Upload style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                        Télécharger un document
                        <ArrowRight style={{ width: '1.25rem', height: '1.25rem', marginLeft: '0.5rem' }} />
                    </Link>

                    <Link 
                        to="/documents" 
                        style={secondaryButtonStyle}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 1)';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 15px 35px -5px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                            e.target.style.transform = 'translateY(0px)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        <FileText style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                        Voir mes documents
                    </Link>
                </div>
            </div>

            <div style={featuresSectionStyle}>
                <h2 style={featuresTitleStyle}>Pourquoi choisir APOCALIPSSI ?</h2>
                
                <div style={featureGridStyle}>
                    <div 
                        style={featureCardStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 25px 50px -10px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <div style={featureIconStyle}>
                            <Upload size={24} />
                        </div>
                        <h3 style={featureTitleStyle}>Téléchargement simple</h3>
                        <p style={featureDescriptionStyle}>
                            Interface intuitive pour télécharger vos documents PDF en quelques clics. 
                            Glissez-déposez ou sélectionnez vos fichiers facilement.
                        </p>
                    </div>

                    <div 
                        style={featureCardStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 25px 50px -10px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <div style={featureIconStyle}>
                            <Shield size={24} />
                        </div>
                        <h3 style={featureTitleStyle}>Sécurité avancée</h3>
                        <p style={featureDescriptionStyle}>
                            Vos documents sont protégés par un chiffrement de niveau entreprise. 
                            Confidentialité et sécurité garanties à chaque étape.
                        </p>
                    </div>

                    <div 
                        style={featureCardStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 25px 50px -10px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <div style={featureIconStyle}>
                            <Zap size={24} />
                        </div>
                        <h3 style={featureTitleStyle}>Performance optimale</h3>
                        <p style={featureDescriptionStyle}>
                            Traitement ultra-rapide et validation instantanée. 
                            Infrastructure cloud haute performance pour une expérience fluide.
                        </p>
                    </div>
                </div>

                <div style={statsStyle}>
                    <div style={statCardStyle}>
                        <div style={statNumberStyle}>10K+</div>
                        <div style={statLabelStyle}>Documents traités</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statNumberStyle}>99.9%</div>
                        <div style={statLabelStyle}>Temps de disponibilité</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statNumberStyle}>24/7</div>
                        <div style={statLabelStyle}>Support technique</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statNumberStyle}>2s</div>
                        <div style={statLabelStyle}>Temps de traitement</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;