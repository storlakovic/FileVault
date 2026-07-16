import React from 'react';
import './Home.css';
import Navbar from "./Navbar.tsx";

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <Navbar/>
            <main className="hero-section">
                <h1>Willkommen zurück, <span>User</span>!</h1>
                <p>
                    Hier hast du alle wichtigen Statistiken und Funktionen auf einen Blick.
                    Schnell, sicher und vollkommen responsiv.
                </p>
            </main>
        </div>
    );
};

export default Home;