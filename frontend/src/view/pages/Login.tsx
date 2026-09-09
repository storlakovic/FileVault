import type {SubmitEvent} from 'react';
import "./Login.css"
import { useNavigate } from "react-router-dom";
import {useLoginViewModel} from "../../viewModel/useLoginViewModel.ts";

const Login = () => {
    const navigate = useNavigate();
    const {
        username,
        setUsername,
        password,
        setPassword,
        error,
        isLoading,
        login,
    } = useLoginViewModel();
    const handleSubmit = async (
        event: SubmitEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        const success = await login();

        if (success) {
            navigate("/");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>

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
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="footer-text">
                    No account? <a href="register">Registrieren</a>
                </p>
            </div>
        </div>
    );
};

export default Login;