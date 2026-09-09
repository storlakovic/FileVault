import "./Register.css"

import {useRegisterViewModel} from "../../viewModel/useRegisterViewModel.ts";
import {useNavigate} from "react-router-dom";

import type {
    SubmitEvent as ReactSubmitEvent,
} from "react";

const Register = () => {
    const navigate = useNavigate();

    const {
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
        register,
    } = useRegisterViewModel();

    const handleSubmit = async (
        event: ReactSubmitEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        const success = await register();

        if (success) {
            navigate("/login");
        }
    };
    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Register</h2>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">E-Mail</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.at"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="reenteredPassword">
                            Re-enter Password
                        </label>
                        <input
                            type="password"
                            id="reenteredPassword"
                            value={reenteredPassword}
                            onChange={(e) => setReenteredPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;