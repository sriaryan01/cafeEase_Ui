import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../Services/user_service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const links = [
  { to: "/admin/products", label: "Products" },
  { to: "/admin/category", label: "Categories" },
  { to: "/admin/user", label: "Users" },
  { to: "/admin/order", label: "Orders" },
];

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");

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
      <div className="admin-nav-container">
        <div className="admin-nav-brand">CafeEase Admin</div>
        <div className="admin-nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "admin-nav-link active" : "admin-nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="admin-nav-actions">
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;