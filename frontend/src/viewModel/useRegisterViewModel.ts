import {useState} from "react";
import {registerUser} from "../model/auth.ts";
import {ApiError} from "../model/errors/ApiError.ts";


export function useRegisterViewModel() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [reenteredPassword, setReenteredPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    async function register(): Promise<boolean> {
        if (
            !username.trim() ||
            !email.trim() ||
            !password ||
            !reenteredPassword
        ) {
            setError("Please fill all fields!");
            return false;
        }

        if (username.trim().length < 3) {
            setError(
                "Username must have at least 3 characters.",
            );
            return false;
        }

        if (password.length < 8) {
            setError(
                "Password must have at least 8 characters.",
            );
            return false;
        }

        if (password !== reenteredPassword) {
            setError("Passwords do not match.");
            return false;
        }

        setLoading(true);
        setError("");
        try{
            await registerUser({username: username.trim(), email: email.trim(), password});
            return true;
        }catch (caughtError: unknown) {
            if (
                caughtError instanceof ApiError &&
                caughtError.status === 409
            ) {
                setError(
                    "Username or email is already registered.",
                );
            } else {
                setError("Register failed");
            }

            return false
        }finally {
            setLoading(false);
        }
    }
    return {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        reenteredPassword,
        setReenteredPassword,
        error,
        isLoading,
        setLoading,
        register,
    };
}