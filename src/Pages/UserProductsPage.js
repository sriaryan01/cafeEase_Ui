
import "../CSS/DashboardPage.css";
import React, { useEffect } from 'react';
import Navbar from '../Components/DashboardPageComponents/Navbar';
import Home from '../Components/DashboardPageComponents/Home';
import Products from '../Components/DashboardPageComponents/Products';
import Footer from '../Components/DashboardPageComponents/Footer';

const ProductDashboard = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

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
