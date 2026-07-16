import React from 'react';
import './NotFound.css';

const NotFound: React.FC = () => {
    return (
        // Same outer container for background gradients
        <div className="not-found-container">
            {/* Same card structure with animation */}
            <div className="not-found-card">
                {/* Visual indicator (optional icon) */}
                <div className="error-icon" aria-hidden="true">
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#60a5fa" // Matching light blue
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginBottom: '20px' }}
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>

                {/* Main 404 Heading */}
                <h1>404</h1>

                {/* Subtitle */}
                <h2>Page Not Found</h2>

                {/* Helpful Description */}
                <p>
                    Oops! The page you are looking for might have been removed,
                    had its name changed, or is temporarily unavailable.
                </p>

                {/* Call-to-action button, styling matches login-btn */}
                <a href="/" className="home-btn">
                    Back to Homepage
                </a>
            </div>
        </div>
    );
};

export default NotFound;