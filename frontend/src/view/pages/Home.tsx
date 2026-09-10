import React from 'react';
import './Home.css';
import Navbar from "./Navbar.tsx";

import { useCurrentUserViewModel } from "../../viewModel/useCurrentUserViewModel";
import {Navigate} from "react-router-dom";
import FileList from "../components/FileList.tsx";

const Home: React.FC = () => {
    const {
        user,
        isLoading,
        error,
    } = useCurrentUserViewModel();


    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        if(error == "Invalid or expired token"){
            return <Navigate to="/login" replace />;
        }
        return <p>{error}</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="home-container">
            <Navbar/>
            <main className="hero-section">
                <h1>Welcome back, {user?.username}</h1>
                <FileList />
            </main>
        </div>
    );
};

export default Home;