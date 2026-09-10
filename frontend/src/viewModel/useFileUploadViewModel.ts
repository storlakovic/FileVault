import { useState } from "react";

import {
    uploadFile as uploadFileRequest,
} from "../model/file";
import type {
    StoredFileResponse,
} from "../model/file";
import { ApiError } from "../model/errors/ApiError";

export function useFileUploadViewModel() {
    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);

    const [uploadedFile, setUploadedFile] =
        useState<StoredFileResponse | null>(null);

    const [isUploading, setUploading] =
        useState(false);

    const [error, setError] =
        useState("");

    function selectFile(file: File): void {
        setSelectedFile(file);
        setUploadedFile(null);
        setError("");
    }

    function clearFile(): void {
        setSelectedFile(null);
        setUploadedFile(null);
        setError("");
    }

    async function upload(): Promise<boolean> {
        if (selectedFile === null) {
            setError("Please select a file.");
            return false;
        }

        setUploading(true);
        setError("");

        try {
            const storedFile =
                await uploadFileRequest(selectedFile);

            setUploadedFile(storedFile);
            setSelectedFile(null);

            return true;
        } catch (caughtError: unknown) {
            if (caughtError instanceof ApiError) {
                setError(caughtError.message);
            } else {
                setError("Could not upload file.");
            }

            return false;
        } finally {
            setUploading(false);
        }
    }

    return {
        selectedFile,
        uploadedFile,
        isUploading,
        error,
        selectFile,
        clearFile,
        upload,
    };
}