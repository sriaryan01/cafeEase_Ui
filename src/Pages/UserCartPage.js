import "../CSS/DashboardPage.css";
import "../CSS/UserCartPage.css";
import React from 'react';
import Navbar from '../Components/DashboardPageComponents/Navbar';
import Cart from '../Components/DashboardPageComponents/Cart';
import Footer from '../Components/DashboardPageComponents/Footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartDashboard = () => {
  return (
    <div className="App" >
      <ToastContainer/>
      <Navbar />
      <Cart/>
      <Footer />
    </div>
  );
};

export default CartDashboard;