import "../CSS/DashboardPage.css";
import "../CSS/UserCartPage.css";
import "../CSS/UserOrdersPage.css";

import React from 'react';
import Navbar from '../Components/DashboardPageComponents/Navbar';
import Footer from '../Components/DashboardPageComponents/Footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Orders from "../Components/DashboardPageComponents/Orders";

const OrdersDashboard = () => {
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