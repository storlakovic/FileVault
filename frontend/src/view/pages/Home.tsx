import React from 'react';
import './Home.css';
import Navbar from "./Navbar.tsx";

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <Navbar/>
            <main className="hero-section">
                <h1>Welcome back, <span>User</span>!</h1>
            </main>
        </div>
    );
};

export default Home;