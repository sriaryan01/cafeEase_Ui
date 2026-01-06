import React from "react";
import ReactDOM from "react-dom/client";
import LandingPage from "./Pages/LandingPage";
import ProductsDashBoard from "./Pages/UserProductsPage";
import CartDashboard from "./Pages/UserCartPage"
import AdminPage from "./Pages/AdminPage";
import Unauthorized from "./Pages/Unauthorized";
import NotFound from "./Pages/NotFound";
import ProtectedRoute from "./Services/ProtectedRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoriesDashboard from "./Pages/UserCategoriesPage";
import OrdersDashboard from "./Pages/UserOrdersPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/categories",
    element: <CategoriesDashboard />
  },

  {
    path: "/products",
    element: <ProductsDashBoard />
  },

  {
    path: "/products/category/:id",
    element: <ProductsDashBoard/>
  },

  {
    path: "/cart",
    element: <CartDashboard />
  },

  {
    path: "/orders",
    element: <OrdersDashboard />
  },

  {
    path: "/admin/*",
    element: <ProtectedRoute element={<AdminPage />} allowedRoles={['admin']} />, // Protecting the admin route
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />, // Adding the unauthorized route
  },
  {
    path: "/*",
    element: <NotFound />, // Adding the notfound route
  }
]);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ToastContainer />
    <RouterProvider router={router} />
  </React.StrictMode>
);