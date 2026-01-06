
import "../CSS/DashboardPage.css";
import React from 'react';
import Navbar from '../Components/DashboardPageComponents/Navbar';
import Home from '../Components/DashboardPageComponents/Home';
import Products from '../Components/DashboardPageComponents/Products';
import Footer from '../Components/DashboardPageComponents/Footer';

const ProductDashboard = () => {
  return (
    <div className="App" >
      <Navbar />
      <Home />
      <Products />
      <Footer />
    </div>
  );
};

export default ProductDashboard;
