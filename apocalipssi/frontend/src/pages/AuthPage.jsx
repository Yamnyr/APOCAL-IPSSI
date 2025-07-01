import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Ici vous pourrez ajouter votre logique d'authentification
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0e7ff 0%, #ffffff 50%, #f3e8ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundElement1Style = {
    position: 'absolute',
    top: '-10rem',
    right: '-10rem',
    width: '20rem',
    height: '20rem',
    background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
    borderRadius: '50%',
    mixBlendMode: 'multiply',
    filter: 'blur(3rem)',
    opacity: 0.2,
    animation: 'pulse 2s ease-in-out infinite'
  };

  const backgroundElement2Style = {
    position: 'absolute',
    bottom: '-10rem',
    left: '-10rem',
    width: '20rem',
    height: '20rem',
    background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
    borderRadius: '50%',
    mixBlendMode: 'multiply',
    filter: 'blur(3rem)',
    opacity: 0.2,
    animation: 'pulse 2s ease-in-out infinite',
    animationDelay: '1s'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '2rem',
    width: '100%',
    maxWidth: '28rem',
    transition: 'all 0.5s ease',
    position: 'relative',
    zIndex: 10
  };

  const logoStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '4rem',
    height: '4rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: '1rem',
    marginBottom: '1rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
  };

  const logoInnerStyle = {
    width: '2rem',
    height: '2rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const logoDotStyle = {
    width: '1rem',
    height: '1rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: '0.25rem'
  };

  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem',
    textAlign: 'center'
  };

  const subtitleStyle = {
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const inputGroupStyle = {
    position: 'relative',
    marginBottom: '1.5rem'
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '3rem',
    paddingRight: '1rem',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none'
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#6366f1',
    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  };

  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1.25rem',
    height: '1.25rem',
    color: '#9ca3af',
    pointerEvents: 'none',
    zIndex: 10
  };

  const eyeButtonStyle = {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const eyeIconStyle = {
    width: '1.25rem',
    height: '1.25rem',
    color: '#9ca3af',
    transition: 'color 0.3s ease'
  };

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  };

  const checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#6b7280',
    cursor: 'pointer'
  };

  const checkboxStyle = {
    width: '1rem',
    height: '1rem',
    marginRight: '0.5rem',
    accentColor: '#6366f1'
  };

  const forgotLinkStyle = {
    fontSize: '0.875rem',
    color: '#6366f1',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  };

  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    color: 'white',
    fontWeight: '600',
    padding: '1rem 1.5rem',
    borderRadius: '1rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    marginBottom: '2rem'
  };

  const googleButtonStyle = {
    width: '100%',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    color: '#374151',
    fontWeight: '500',
    padding: '0.75rem 1rem',
    borderRadius: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    marginBottom: '2rem'
  };

  const dividerStyle = {
    position: 'relative',
    marginBottom: '2rem'
  };

  const dividerLineStyle = {
    width: '100%',
    height: '1px',
    backgroundColor: '#e5e7eb'
  };

  const dividerTextStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '0 1rem',
    fontSize: '0.875rem',
    color: '#6b7280'
  };

  const toggleTextStyle = {
    textAlign: 'center',
    color: '#6b7280'
  };

  const toggleButtonStyle = {
    color: '#6366f1',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '0.25rem',
    transition: 'color 0.3s ease'
  };

  const [focusedInput, setFocusedInput] = useState('');

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.3; }
          }
        `}
      </style>
      
      <div style={backgroundElement1Style}></div>
      <div style={backgroundElement2Style}></div>

      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={logoStyle}>
              <div style={logoInnerStyle}>
                <div style={logoDotStyle}></div>
              </div>
            </div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginLeft: '0.75rem',
              letterSpacing: '0.05em'
            }}>
              APOCALIPSSI
            </h2>
          </div>
          <h1 style={titleStyle}>
            {isLogin ? 'Connexion' : 'Inscription'}
          </h1>
          <p style={subtitleStyle}>
            {isLogin ? 'Ravi de vous revoir !' : 'Créons votre compte'}
          </p>
        </div>

        <div>
          {!isLogin && (
            <div style={inputGroupStyle}>
              <User style={iconStyle} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput('')}
                style={focusedInput === 'name' ? inputFocusStyle : inputStyle}
                placeholder="Nom complet"
                required={!isLogin}
              />
            </div>
          )}

          <div style={inputGroupStyle}>
            <Mail style={iconStyle} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput('')}
              style={focusedInput === 'email' ? inputFocusStyle : inputStyle}
              placeholder="Adresse email"
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <Lock style={iconStyle} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput('')}
              style={focusedInput === 'password' ? {...inputFocusStyle, paddingRight: '3rem'} : {...inputStyle, paddingRight: '3rem'}}
              placeholder="Mot de passe"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={eyeButtonStyle}
            >
              {showPassword ? (
                <EyeOff style={eyeIconStyle} />
              ) : (
                <Eye style={eyeIconStyle} />
              )}
            </button>
          </div>

          {!isLogin && (
            <div style={inputGroupStyle}>
              <Lock style={iconStyle} />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput('')}
                style={focusedInput === 'confirmPassword' ? inputFocusStyle : inputStyle}
                placeholder="Confirmer le mot de passe"
                required={!isLogin}
              />
            </div>
          )}

          {isLogin && (
            <div style={checkboxContainerStyle}>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  style={checkboxStyle}
                />
                Se souvenir de moi
              </label>
              <a href="#" style={forgotLinkStyle}>
                Mot de passe oublié ?
              </a>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(90deg, #4f46e5, #7c3aed)';
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(90deg, #6366f1, #8b5cf6)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <span style={{ marginRight: '0.5rem' }}>
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </span>
            <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        <div style={dividerStyle}>
          <div style={dividerLineStyle}></div>
          <span style={dividerTextStyle}>ou</span>
        </div>

        <button 
          style={googleButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f9fafb';
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.boxShadow = 'none';
          }}
        >
          <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.75rem' }} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        <div style={toggleTextStyle}>
          <span>
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
          </span>
          <button
            onClick={toggleMode}
            style={toggleButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.color = '#4f46e5';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#6366f1';
            }}
          >
            {isLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}