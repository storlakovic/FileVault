import { useEffect, useState } from "react";

import { getCurrentUser } from "../model/auth";
import type { UserResponse } from "../model/auth";
import { ApiError } from "../model/errors/ApiError";

export function useCurrentUserViewModel() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadCurrentUser(): Promise<void> {
        setLoading(true);
        setError("");

        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (caughtError: unknown) {
            setUser(null);

            if (caughtError instanceof ApiError) {
                if (caughtError.status === 401) {
                    localStorage.removeItem("access_token");
                }

                setError(caughtError.message);
            } else {
                setError("Could not load user.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadCurrentUser();
    }, []);

    return {
        user,
        isLoading,
        error,
    };
}