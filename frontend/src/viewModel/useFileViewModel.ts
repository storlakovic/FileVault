import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type { StoredFileResponse } from "../model/file";
import { ApiError } from "../model/errors/ApiError";

import {
    deleteFile as deleteFileRequest,
    downloadFile as downloadFileRequest,
    getFiles,
} from "../model/file";

export function useFileViewModel() {
    const [files, setFiles] = useState<StoredFileResponse[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [downloadingFileId, setDownloadingFileId] = useState<number | null>(null);
    const [deletingFileId, setDeletingFileId] = useState<number | null>(null);
    const [error, setError] = useState("");

    const loadFiles = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError("");

        try {
            const loadedFiles = await getFiles();
            setFiles(loadedFiles);
        } catch (caughtError: unknown) {
            if (caughtError instanceof ApiError) {
                setError(caughtError.message);
            } else {
                setError("Could not load files");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    async function download(
        file: StoredFileResponse,
    ): Promise<void> {
        setDownloadingFileId(file.id);
        setError("");

        try {
            const blob = await downloadFileRequest(file.id);
            const objectUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = file.original_name;

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(objectUrl);
        } catch (caughtError: unknown) {
            if (caughtError instanceof ApiError) {
                setError(caughtError.message);
            } else {
                setError("Could not download file.");
            }
        } finally {
            setDownloadingFileId(null);
        }
    }

    async function removeFile(
        fileId: number,
    ): Promise<void> {
        setDeletingFileId(fileId);
        setError("");

        try {
            await deleteFileRequest(fileId);

            setFiles((currentFiles) =>
                currentFiles.filter(
                    (file) => file.id !== fileId,
                ),
            );
        } catch (caughtError: unknown) {
            if (caughtError instanceof ApiError) {
                setError(caughtError.message);
            } else {
                setError("Could not delete file.");
            }
        } finally {
            setDeletingFileId(null);
        }
    }

    useEffect(() => {
        void loadFiles();
    }, [loadFiles]);

    return {
        files,
        isLoading,
        error,
        loadFiles,
        download,
        downloadingFileId,
        removeFile,
        deletingFileId,
    };
}