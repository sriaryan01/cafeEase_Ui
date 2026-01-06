// NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotFoundIcon from "../Assets/notFound.png"
import "../CSS/NotFound.css"; // Custom styling for the error page

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Oops! Page Not Found</h2>
        <p className="notfound-message">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className='button-container'>
        <button className="gohome-button" onClick={() => navigate("/")}>
          Back to Home
        </button>
        <button className="goback-button" onClick={() => navigate(-1)}>
          Go Back
        </button>
        </div>
      </div>
      <div className="notfound-image">
        <img src={NotFoundIcon} alt="Page not found" /> {/* Add a relevant 404 image here */}
      </div>
    </div>
  );
};

export default NotFound;
