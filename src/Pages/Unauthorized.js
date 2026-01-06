// Unauthorized.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BannerBackground from "../Assets/home-banner-background.png";
import StopIcon from "../Assets/stop-icon.png"
import "../CSS/Unauthorized.css";

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div id='unauthorized'>

            <div className="home-bannerImage-container">
                <img src={BannerBackground} alt="" />
            </div>
            
            <div className='stop-icon'>
                    <img src={StopIcon} alt="" />
                </div>
            <div className="unauthorized-container">
                <h1 className="unauthorized-title">403 - Unauthorized</h1>
                <p className="unauthorized-message">
                    Sorry, you don't have permission to access this page.
                </p>
                <button className="unauthorized-button" onClick={() => navigate("/")}>
                    Go to Home
                </button>
                <button className="unauthorized-button" onClick={goBack}>
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
