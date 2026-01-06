// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ element, allowedRoles }) => {
    
    var userRole;
    const token= Cookies.get('token');
    var decodedToken="";
    if (token) {
      try {
        decodedToken = jwtDecode(token);
        userRole =decodedToken.role;
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    }
    console.log("userRole------->",userRole);

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default ProtectedRoute;
