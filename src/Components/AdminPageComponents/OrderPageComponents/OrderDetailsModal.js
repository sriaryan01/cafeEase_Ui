import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const OrderDetailsModal = ({ open, onClose, order }) => {
  if (!order) return null;

  const formatDate = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Order Details - {order.orderId}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Information
            </Typography>
            <Typography>
              <strong>Order ID:</strong> {order.orderId}
            </Typography>
            <Typography>
              <strong>User Email:</strong> {order.userEmail || "N/A"}
            </Typography>
            <Typography>
              <strong>Order Date:</strong> {formatDate(order.orderDateAndTime)}
            </Typography>
            <Typography>
              <strong>Status:</strong> {order.orderStatus}
            </Typography>
            <Typography>
              <strong>Total Quantity:</strong> {order.totalQuantity || 0}
            </Typography>
            <Typography>
              <strong>Total Amount:</strong> INR {order.totalAmount || 0}
            </Typography>
          </Paper>

          {order.items && order.items.length > 0 && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Product Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Quantity</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Price</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.productName || "N/A"}</TableCell>
                      <TableCell>{item.quantity || 0}</TableCell>
                      <TableCell>INR {item.price || 0}</TableCell>
                      <TableCell>
                        INR {(item.quantity || 0) * (item.price || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;
