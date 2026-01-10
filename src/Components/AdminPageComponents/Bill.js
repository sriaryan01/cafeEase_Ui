import React from "react";
import { Box, Paper, Typography, Card, CardContent, Grid } from "@mui/material";
import { Receipt } from "@mui/icons-material";

const Bill = () => {
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
            Bill Management
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
            }}
          >
            View and manage bills for orders
          </Typography>
        </Paper>

        {/* Info Card */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <CardContent>
            <Receipt sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Bills are managed through Orders
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}>
              To view or manage bills, please navigate to the Orders page where you can view bill details
              and download PDFs for each order.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Bill;