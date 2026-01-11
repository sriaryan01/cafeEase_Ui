import "../CSS/DashboardPage.css";
import "../CSS/UserCartPage.css";
import "../CSS/UserOrdersPage.css";

import React, { useEffect } from 'react';
import Navbar from '../Components/DashboardPageComponents/Navbar';
import Footer from '../Components/DashboardPageComponents/Footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Orders from "../Components/DashboardPageComponents/Orders";

const OrdersDashboard = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="App" >
      <ToastContainer/>
      <Navbar />
      <Orders/>
      <Footer />
    </div>
  );
};

export default OrdersDashboard;