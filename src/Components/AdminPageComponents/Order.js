import React, { useEffect, useState, useMemo } from "react";
import OrderTable from "./OrderPageComponents/OrderTable";
import OrderSearchBar from "./OrderPageComponents/OrderSearchBar";
import OrderDetailsModal from "./OrderPageComponents/OrderDetailsModal";
import {
  getAllOrdersForAdmin,
  cancelOrder,
} from "../../Services/order_service";
import { viewBill } from "../../Services/bill_service";
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import BillModal from "../DashboardPageComponents/BillModal";
import CalendarIcon from "../../Assets/calendar-icon.png";
import MyCalendar from "../DashboardPageComponents/Calendar";

function Order() {
  const [allOrders, setAllOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isBillModalOpen, setBillModalOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("orderId");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showCalendars, setShowCalendars] = useState(false);

  const loadOrders = async () => {
    try {
      const response = await getAllOrdersForAdmin(null, null, null);
      setAllOrders(response);
      setOrders(response);
    } catch (error) {
      toast.error("Error fetching orders");
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      const orderId = searchQuery.trim() || null;
      const response = await getAllOrdersForAdmin(
        orderId,
        selectedStartDate,
        selectedEndDate
      );
      setAllOrders(response);
      setOrders(response);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching orders");
    }
  };

  const handleDateChange = (startDate, endDate) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  };

  const toggleCalendars = () => {
    setShowCalendars((prev) => !prev);
  };

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...allOrders];

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((o) => o.orderStatus === filterStatus);
    }

    // Sort orders
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "orderId":
          aValue = a.orderId;
          bValue = b.orderId;
          break;
        case "date":
          aValue = new Date(a.orderDateAndTime || 0).getTime();
          bValue = new Date(b.orderDateAndTime || 0).getTime();
          break;
        case "amount":
          aValue = parseFloat(a.totalAmount || 0);
          bValue = parseFloat(b.totalAmount || 0);
          break;
        case "status":
          aValue = a.orderStatus || "";
          bValue = b.orderStatus || "";
          break;
        default:
          aValue = a.orderId;
          bValue = b.orderId;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [allOrders, filterStatus, sortBy, sortOrder]);

  const handleView = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleViewBill = async (orderId) => {
    try {
      const blob = await viewBill(orderId);
      setPdfBlob(blob);
      setBillModalOpen(true);
    } catch (error) {
      console.error("Error fetching bill:", error);
      toast.error("Error loading bill");
    }
  };

  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setCancelDialog(true);
  };

  const handleCancel = async () => {
    try {
      await cancelOrder(orderToCancel);
      toast.success("Order cancelled successfully!");
      setCancelDialog(false);
      setOrderToCancel(null);
      loadOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error cancelling order";
      toast.error(errorMessage);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearFilters = () => {
    setFilterStatus("all");
    setSearchQuery("");
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSortBy("orderId");
    setSortOrder("desc");
    loadOrders();
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="order admin-page">
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center" }}>Manage Orders</h1>

        {/* Search and Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginBottom: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <OrderSearchBar
            id="searchbar"
            style={{ flex: 1, minWidth: 200 }}
            onSearch={setSearchQuery}
            value={searchQuery}
          />
          <Button
            variant="outlined"
            onClick={toggleCalendars}
            startIcon={<img src={CalendarIcon} alt="Calendar" style={{ width: 20, height: 20 }} />}
          >
            Date Range
          </Button>
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="outlined" onClick={clearFilters}>
            Clear
          </Button>
        </Box>

        {showCalendars && (
          <Box sx={{ mb: 2 }}>
            <MyCalendar
              showCalendars={showCalendars}
              toggleCalendars={toggleCalendars}
              onDateChange={handleDateChange}
            />
          </Box>
        )}

        {/* Filters and Sorting */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginBottom: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="PROCESSING">Processing</MenuItem>
              <MenuItem value="DELIVERED">Delivered</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="orderId">Order ID</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="amount">Amount</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder}
              label="Order"
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <OrderTable
          orders={filteredAndSortedOrders}
          onView={handleView}
          onCancel={handleCancelClick}
          onViewBill={handleViewBill}
          onBulkSelect={setSelectedOrders}
          selectedOrders={selectedOrders}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <OrderDetailsModal
          open={isDetailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />

        {isBillModalOpen && (
          <BillModal
            pdfBlob={pdfBlob}
            onClose={() => {
              setBillModalOpen(false);
              setPdfBlob(null);
            }}
          />
        )}

        {/* Cancel Order Dialog */}
        <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
          <DialogTitle>Confirm Cancel Order</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to cancel order {orderToCancel}? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelDialog(false)}>Cancel</Button>
            <Button onClick={handleCancel} color="error" variant="contained">
              Confirm Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Order;