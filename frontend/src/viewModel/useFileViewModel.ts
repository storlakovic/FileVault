import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { getFiles } from "../model/file";
import type { StoredFileResponse } from "../model/file";
import { ApiError } from "../model/errors/ApiError";

import {
    downloadFile as downloadFileRequest,
} from "../model/file";

export function useFileViewModel() {
    const [files, setFiles] = useState<StoredFileResponse[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [downloadingFileId, setDownloadingFileId] = useState<number | null>(null);

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
                setError("Could not download file");
            }
        } finally {
            setDownloadingFileId(null);
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
    };
}