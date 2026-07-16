import React, { useState, useRef } from 'react';
import "./UploadFile.css";
import Navbar from "./Navbar.tsx";

const UploadFile: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
            setSuccess('');
            setProgress(0);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError('');
            setSuccess('');
            setProgress(0);
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        setProgress(0);
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Bitte wähle zuerst eine Datei aus.');
            return;
        }

        setError('');
        setIsUploading(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setSuccess('Datei erfolgreich hochgeladen!');
                    setFile(null);
                    return 100;
                }
                return prev + 10;
            });
        }, 150);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="upload-container">
            <Navbar/>
            <div className="upload-card">
                <h2>Datei hochladen</h2>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <form onSubmit={handleUploadSubmit}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept=".pdf,.png,.jpg,.jpeg,.zip,.json"
                    />

                    <div
                        className={`dropzone ${dragActive ? 'drag-active' : ''}`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={handleDivClick}
                    >
                        <div className="dropzone-icon">
                            📁
                        </div>
                        <p>Datei hierher ziehen oder anklicken</p>
                        <span>Unterstützt PDF, PNG, JPG, ZIP (max. 50MB)</span>
                    </div>

                    {file && (
                        <div className="file-preview">
                            <div className="file-info">
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">{formatFileSize(file.size)}</span>
                            </div>
                            <button
                                type="button"
                                className="btn-remove"
                                onClick={removeFile}
                                title="Datei entfernen"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {isUploading && (
                        <div className="progress-container">
                            <span className="file-size">Wird hochgeladen: {progress}%</span>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="upload-btn"
                        disabled={!file || isUploading}
                    >
                        {isUploading ? 'Lädt hoch...' : 'Hochladen'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadFile;