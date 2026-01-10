import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Card, CardContent, Grid, CircularProgress } from "@mui/material";
import {
  ShoppingCart,
  Category,
  People,
  Receipt,
  TrendingUp,
  Inventory,
} from "@mui/icons-material";
import { fetchCategories } from "../../Services/category_service";
import { adminProductList } from "../../Services/product_service";
import { getAllUsers } from "../../Services/user_service";
import { getAllOrdersForAdmin } from "../../Services/order_service";
import { toast } from "react-toastify";

const Home = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0,
    activeProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [products, categories, users, orders] = await Promise.all([
          adminProductList().catch(() => []),
          fetchCategories().catch(() => []),
          getAllUsers().catch(() => []),
          getAllOrdersForAdmin({}).catch(() => []),
        ]);

        const totalRevenue = orders.reduce(
          (sum, order) => sum + parseFloat(order.totalAmount || 0),
          0
        );

        setStats({
          totalProducts: products.length || 0,
          totalCategories: categories.length || 0,
          totalUsers: users.length || 0,
          totalOrders: orders.length || 0,
          activeProducts: products.filter((p) => p.status === "true").length || 0,
          pendingOrders: orders.filter((o) => o.orderStatus === "PENDING").length || 0,
          totalRevenue: totalRevenue,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error loading stats:", error);
        toast.error("Error loading dashboard statistics");
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Total Categories",
      value: stats.totalCategories,
      icon: <Category sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <People sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <Receipt sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      title: "Active Products",
      value: stats.activeProducts,
      icon: <Inventory sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      color: "#333",
    },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#fe9e0d", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#666" }}>
            Loading Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        {/* Header Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            background: "linear-gradient(135deg, #fe9e0d 0%, #ff8c00 100%)",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: 700,
              textAlign: "center",
              mb: 2,
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
            }}
          >
            Welcome to CafeEase Admin Panel - Overview and Statistics
          </Typography>
        </Paper>

        {/* Revenue Card */}
        <Card
          elevation={3}
          sx={{
            mb: 3,
            background: "linear-gradient(135deg, #fe9e0d 0%, #ff8c00 100%)",
            borderRadius: 2,
            p: 3,
          }}
        >
          <CardContent sx={{ textAlign: "center", color: "white" }}>
            <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
              Total Revenue
            </Typography>
            <Typography
              variant="h2"
              sx={{ fontWeight: 700, textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
            >
              ₹{stats.totalRevenue.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <Grid container spacing={2}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={2}
                sx={{
                  background: card.gradient,
                  color: card.color || "white",
                  borderRadius: 2,
                  height: "100%",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: card.color ? 0.8 : 0.9 }}>
                    {card.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;