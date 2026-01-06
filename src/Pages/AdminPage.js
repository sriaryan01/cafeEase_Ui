import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Product from '../Components/AdminPageComponents/Product';
import Category from '../Components/AdminPageComponents/Category';
import User from '../Components/AdminPageComponents/User';
import Order from '../Components/AdminPageComponents/Order';
import Bill from '../Components/AdminPageComponents/Bill';
import Home from '../Components/AdminPageComponents/Home';
import NotFound from './NotFound';
import Navbar from '../Components/AdminPageComponents/Navbar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../CSS/AdminPage.css";



const AdminPage = () => {

  return (
    <div className='admin-dashboard'>
      <div className="vertical-navbar">
        <Navbar />
      </div>
      <ToastContainer/>
      <div className="admin-content">
        <Routes>
          <Route path="/products" element={<Product />} />
          <Route path="/category" element={<Category />} />
          <Route path="/user" element={<User />} />
          <Route path="/order" element={<Order />} />
          <Route path="/bill" element={<Bill />} />
          <Route path="/" element={<Home/>} />
          <Route path="/*" element={<NotFound />} />

        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;
