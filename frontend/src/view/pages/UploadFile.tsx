import React, { useState, useRef } from 'react';
import "./UploadFile.css";
import Navbar from "./Navbar.tsx";
import {Navigate} from "react-router-dom";
import {useCurrentUserViewModel} from "../../viewModel/useCurrentUserViewModel.ts";
import {useFileUploadViewModel} from "../../viewModel/useFileUploadViewModel.ts";

const UploadFile: React.FC = () => {
    const [dragActive, setDragActive] = useState<boolean>(false)
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    const {
        user,
        isLoading,
        error,
    } = useCurrentUserViewModel();

    const {
        selectedFile,
        uploadedFile,
        isUploading,
        error: uploadError,
        selectFile,
        clearFile,
        upload,
    } = useFileUploadViewModel();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        if(error == "Invalid or expired token"){
            return <Navigate to="/login" replace />;
        }
        return <p>{error}</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const file = event.target.files?.[0];

        if (file) {
            selectFile(file);
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

    const handleDrop = (
        event: React.DragEvent<HTMLDivElement>,
    ): void => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);

        const file = event.dataTransfer.files?.[0];

        if (file) {
            selectFile(file);
        }
    };

    const removeFile = (
        event: React.MouseEvent<HTMLButtonElement>,
    ): void => {
        event.stopPropagation();
        clearFile();

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUploadSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        const success = await upload();

        if (success && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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

                {uploadError && <p className="error-message">{uploadError}</p>}

                {uploadedFile && (
                    <p className="success-message">
                        {uploadedFile.original_name} wurde erfolgreich hochgeladen.
                    </p>
                )}
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

                    {selectedFile && (
                        <div className="file-preview">
                            <div className="file-info">
                                <span className="file-name">{selectedFile.name}</span>
                                <span className="file-size">{formatFileSize(selectedFile.size)}</span>
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

                    <button
                        type="submit"
                        className="upload-btn"
                        disabled={!selectedFile || isUploading}
                    >
                        {isUploading ? 'Lädt hoch...' : 'Hochladen'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadFile;