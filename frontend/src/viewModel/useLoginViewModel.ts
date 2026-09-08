import { useState } from "react";

import {loginUser} from "../model/auth.ts";


export function useLoginViewModel() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    async function login(): Promise<boolean> {
        if(!username.trim() || !password) {
            setError("Please fill all fields!");
            return false;
        }

        setLoading(true);
        setError("");

        try{
            const tokenResponse = await loginUser({username: username.trim(), password});
            localStorage.setItem(
                "access_token",
                tokenResponse.access_token,
            );
            return true;
        }catch(caughtError: unknown){
            setError("Login failed");
            return false;
        }finally {
            setLoading(false);
        }
    }

    return {
        username,
        setUsername,
        password,
        setPassword,
        error,
        isLoading,
        login,
    };
}