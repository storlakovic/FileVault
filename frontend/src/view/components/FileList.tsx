import "./FileList.css";

import { useFileViewModel } from "../../viewModel/useFileViewModel";

function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileType(filename: string): string {
    return filename.split(".").pop()?.toUpperCase() ?? "FILE";
}

export default function FileList() {
    const {
        files,
        isLoading,
        error,
    } = useFileViewModel();

    if (isLoading) {
        return (
            <section className="vault-files vault-files--state">
                <div className="vault-files__spinner" />
                <span>Loading your files...</span>
            </section>
        );
    }

    if (error) {
        return (
            <section className="vault-files vault-files--state vault-files--error">
                <span>Could not load your files</span>
            </section>
        );
    }

    if (files.length === 0) {
        return (
            <section className="vault-files vault-files--state">
                <span>📂</span>
                <span>No files uploaded yet.</span>
            </section>
        );
    }

    return (
        <section className="vault-files">
            <header className="vault-files__header">
                <div>
                    <span className="vault-files__eyebrow">
                        Secure storage
                    </span>
                    <h2 className="vault-files__title">
                        Your files
                    </h2>
                </div>

                <span className="vault-files__count">
                    {files.length} {files.length === 1 ? "file" : "files"}
                </span>
            </header>

            <div className="vault-files__list">
                {files.map((file) => (
                    <article className="vault-file" key={file.id}>
                        <div className="vault-file__icon" aria-hidden="true">
                            📄
                        </div>

                        <div className="vault-file__details">
                            <span
                                className="vault-file__name"
                                title={file.original_name}
                            >
                                {file.original_name}
                            </span>

                            <div className="vault-file__meta">
                                <span>{formatFileSize(file.size)}</span>
                                <span>•</span>
                                <span>
                                    {new Date(file.created_at).toLocaleDateString(
                                        "de-AT",
                                    )}
                                </span>
                            </div>
                        </div>

                        <span className="vault-file__type">
                            {getFileType(file.original_name)}
                        </span>
                    </article>
                ))}
            </div>
        </section>
    );
}