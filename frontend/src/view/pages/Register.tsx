import { useState } from 'react';
import "./Register.css"

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [reenteredPassword, setReenteredPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e:any) => {
        e.preventDefault();
        if (!email || !password || !reenteredPassword || !username) {
            setError('Please fill out all fields.');
            return;
        }
        setUsername('');
        setError('');
        setReenteredPassword('');
        setEmail('');
        setPassword('');
        navigation.navigate('/');
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
                            type="username"
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
                        <label htmlFor="password">Re-enter Password</label>
                        <input
                            type="password"
                            id="reenteredPassword"
                            value={reenteredPassword}
                            onChange={(e) => setReenteredPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="register-btn">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;