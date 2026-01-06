/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import icon from "../../Assets/Icon.png"

import { BsCart2 } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import LoginIcon from '@mui/icons-material/Login';
import Category from '@mui/icons-material/LocalDining';

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuOptions = [
    {

      text: "Home",
      href: "#Home",
      icon: <HomeIcon />,
    },
    {

      text: "Category",
      href: "#Category",
      icon: <Category />,
    },
    {
      text: "Contact",
      href: "#Contact",
      icon: <PhoneRoundedIcon />,
    },
    {
      text: "Login/Signup",
      href: "#Login",
      icon: <LoginIcon />,
    }
  ];
  return (
    <nav id="landing-page-nav"> 
      <div className="nav-logo-container">
        <img src={icon} alt="CafeEase" width={200} />
      </div>

      <div className="navbar-links-container">
        <a href="#Home"><button>Home</button></a>
        <a href="#Category"><button>Categories</button></a>
        <a href="#Contact"><button>Contact</button></a>
        <a href="#Login"><button id="primary-button" type="submit" >Login/Sign up</button></a>
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
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;
