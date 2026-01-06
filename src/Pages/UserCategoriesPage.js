import "../CSS/DashboardPage.css";
import "../CSS/UserCartPage.css";
import React from 'react';
import Navbar from '../Components/DashboardPageComponents/Navbar';
import Footer from '../Components/DashboardPageComponents/Footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "../Components/DashboardPageComponents/Home";
import Category from "../Components/DashboardPageComponents/Category";

const CategoriesDashboard = () => {
  return (
    <div className="App" >
      <ToastContainer/>
      <Navbar />
      <Home/>
      <Category/>
      <Footer />
    </div>
  );
};

export default CategoriesDashboard;