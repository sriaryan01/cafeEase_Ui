import React, { useState } from "react";
import icon from "../../Assets/Icon.png"
import { BsCart2 } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { logout } from "../../Services/user_service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuOptions = [
    {
      text: "Categories",
      href: "/categories",
      icon: <HomeIcon />,
    },
    {
      text: "Products",
      href: "/products",
      icon: <InfoIcon />,
    },
    {
      text: "Orders",
      href: "/orders",
      icon: <PhoneRoundedIcon />,
    },
    {
      text: "Cart",
      href: "/cart",
      icon: <ShoppingCartRoundedIcon />,
    },
    {
      text: "Logout",
      href: "/",
      icon: <ShoppingCartRoundedIcon />,
    },
  ];

  const navigate = useNavigate();

  const handleLogout = (e) => {
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
    console.log("Logout Successfull");
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const handleGoToProducts = () => {
    navigate("/products")
  };

  const handleGoToCategories = () => {
    navigate("/categories")
  };

  const handleGoToOrders = () => {
    navigate("/orders")
  };
  return (
    <nav id="dashboard-page-nav">

      <div className="nav-logo-container">
        <img src={icon} alt="CafeEase" width={200} />
      </div>
      <div className="navbar-links-container">
        <button onClick={handleGoToCategories}>Categories</button>
        <button onClick={handleGoToProducts}>Products</button>
        <button onClick={handleGoToOrders}>My Orders</button>
        <button onClick={handleGoToCart}>
          <BsCart2 className="navbar-cart-icon" />
        </button>
        <button id="primary-button" onClick={handleLogout}>Logout</button>

      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton href={item.href}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;