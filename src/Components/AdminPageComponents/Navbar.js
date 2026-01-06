import React from 'react';
import { NavLink } from 'react-router-dom';
import { logout } from '../../Services/user_service';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');

    setTimeout(() => {
      toast.success("Logged out successfully", {
        position: "top-left",
        autoClose: 800,
        closeOnClick: true,
        theme: "dark",
      });
    }, 100);
  };

  return (
    <nav className="admin-page-nav">
      <ToastContainer />
      <ul>
        <li><NavLink to="/admin/products">Product</NavLink></li>
        <li><NavLink to="/admin/category">Category</NavLink></li>
        <li><NavLink to="/admin/user">User</NavLink></li>
        <li><NavLink to="/admin/order">Order</NavLink></li>
        <li><NavLink to="/admin/bill">Bill</NavLink></li>
        <li><NavLink to="/admin">Go Home</NavLink></li>
        <li><button className='nav-button' onClick={handleLogout} >Logout</button></li>
      </ul>
    </nav>
  )
}

export default Navbar