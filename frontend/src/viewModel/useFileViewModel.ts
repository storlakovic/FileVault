import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { getFiles } from "../model/file";
import type { StoredFileResponse } from "../model/file";
import { ApiError } from "../model/errors/ApiError";

export function useFileViewModel() {
    const [files, setFiles] = useState<StoredFileResponse[]>([]);
    const [isLoading, setLoading] = useState(true);
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

    useEffect(() => {
        void loadFiles();
    }, [loadFiles]);

    return {
        files,
        isLoading,
        error,
        loadFiles,
    };
}