import { useState } from 'react';
import '../App.css';

const UploadForm = () => {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Données soumises:', {
            name,
            file
        });
        setName('');
        setFile(null);
        setFileName('');

        document.getElementById('pdf-upload').value = '';

        alert('Formulaire soumis avec succès!');
    };

    return (
        <div className="upload-form-container">
            <h2>Formulaire de téléchargement</h2>
            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label htmlFor="name">Nom:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Entrez votre nom"
                        required
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="pdf-upload">Fichier PDF:</label>
                    <div className="file-input-container">
                        <input
                            type="file"
                            id="pdf-upload"
                            accept=".pdf"
                            onChange={handleFileChange}
                            required
                            className="file-input"
                        />
                        {fileName && (
                            <p className="file-name">Fichier sélectionné: {fileName}</p>
                        )}
                    </div>
                </div>

                <button type="submit" className="submit-button">
                    Envoyer
                </button>
            </form>
        </div>
    );
};

export default UploadForm;
