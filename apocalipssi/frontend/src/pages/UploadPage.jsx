import React from 'react';
import UploadForm from '../components/UploadForm';

const UploadPage = () => {
    return (
        <div className="app-container">
            <header className="header">
                <h1>Application de téléchargement</h1>
            </header>
            <main>
                <UploadForm />
            </main>
        </div>
    );
};

export default UploadPage;
