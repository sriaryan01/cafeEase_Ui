import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Checkbox,
  TablePagination,
} from "@mui/material";
import { Cancel, Visibility, Receipt } from "@mui/icons-material";

const OrderTable = ({
  orders,
  onView,
  onCancel,
  onViewBill,
  onBulkSelect,
  selectedOrders = [],
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = orders.map((o) => o.orderId);
      onBulkSelect?.(allIds);
    } else {
      onBulkSelect?.([]);
    }
  };

  const handleSelectOne = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      onBulkSelect?.(selectedOrders.filter((id) => id !== orderId));
    } else {
      onBulkSelect?.([...selectedOrders, orderId]);
    }
  };

  const isSelected = (orderId) => selectedOrders.includes(orderId);
  const isAllSelected = orders.length > 0 && selectedOrders.length === orders.length;
  const isIndeterminate = selectedOrders.length > 0 && selectedOrders.length < orders.length;

  // Pagination logic
  const paginatedOrders = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const formatDate = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={isIndeterminate}
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Customer Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Customer Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Order Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total Quantity</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total Amount</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedOrders.map((order) => (
            <TableRow 
              key={order.orderId}
              selected={isSelected(order.orderId)}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isSelected(order.orderId)}
                  onChange={() => handleSelectOne(order.orderId)}
                />
              </TableCell>
              <TableCell>{order.orderId}</TableCell>
              <TableCell>{order.customerDetails?.name || 'N/A'}</TableCell>
              <TableCell>{order.customerDetails?.email || 'N/A'}</TableCell>
              <TableCell>{order.customerDetails?.contactNumber || 'N/A'}</TableCell>
              <TableCell>{formatDate(order.orderDateAndTime)}</TableCell>
              <TableCell>
                <span style={{
                  color: order.orderStatus === 'CANCELLED' ? 'red' : 
                         order.orderStatus === 'DELIVERED' ? 'green' : 'orange',
                  fontWeight: 'bold'
                }}>
                  {order.orderStatus}
                </span>
              </TableCell>
              <TableCell>{order.totalQuantity || 0}</TableCell>
              <TableCell>INR {order.totalAmount || 0}</TableCell>
              <TableCell>
                <IconButton onClick={() => onView(order)} color="primary" title="View Details">
                  <Visibility />
                </IconButton>
                <IconButton onClick={() => onViewBill(order.orderId)} color="secondary" title="View Bill">
                  <Receipt />
                </IconButton>
                {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
                  <IconButton onClick={() => onCancel(order.orderId)} color="error" title="Cancel Order">
                    <Cancel />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {onPageChange && (
        <TablePagination
          component="div"
          count={orders.length}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </>
  );
};

export default OrderTable;

