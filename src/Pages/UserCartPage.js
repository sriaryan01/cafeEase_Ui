import "../CSS/DashboardPage.css";
import "../CSS/UserCartPage.css";
import React, { useEffect } from 'react';
import Navbar from '../Components/DashboardPageComponents/Navbar';
import Cart from '../Components/DashboardPageComponents/Cart';
import Footer from '../Components/DashboardPageComponents/Footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartDashboard = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

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