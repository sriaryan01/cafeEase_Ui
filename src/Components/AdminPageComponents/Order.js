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
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import { FilterList, Clear, Search, CalendarToday } from "@mui/icons-material";
import { toast } from "react-toastify";
import BillModal from "../DashboardPageComponents/BillModal";
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
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrdersForAdmin({});
      setAllOrders(response);
      setOrders(response);
    } catch (error) {
      toast.error("Error fetching orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const orderId = searchQuery.trim() || null;

      const searchRequest = {
        orderId: orderId ? parseInt(orderId, 10) : null,
        startTime: selectedStartDate || null,
        endTime: selectedEndDate || null,
        customer: {
          name: customerName || null,
          email: customerEmail || null,
          contactNumber: customerContact || null,
          id: null,
        },
      };

      const response = await getAllOrdersForAdmin(searchRequest);
      setAllOrders(response);
      setOrders(response);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching orders");
    } finally {
      setLoading(false);
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
    setCustomerName("");
    setCustomerEmail("");
    setCustomerContact("");
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSortBy("orderId");
    setSortOrder("desc");
    loadOrders();
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading && allOrders.length === 0) {
    return (
      <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#fe9e0d", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#666" }}>
            Loading Orders...
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
            Manage Orders
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
            }}
          >
            View, manage, and track all customer orders
          </Typography>
        </Paper>

        {/* Search and Filters */}
        <Paper elevation={2} sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
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
              startIcon={<CalendarToday />}
              sx={{
                borderColor: "#ccc",
                "&:hover": {
                  borderColor: "#fe9e0d",
                  backgroundColor: "#fff3e0",
                  color: "#fe9e0d",
                },
              }}
            >
              Date Range
            </Button>
            <TextField
              size="small"
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              sx={{ minWidth: 180, backgroundColor: "white" }}
            />
            <TextField
              size="small"
              label="Customer Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              sx={{ minWidth: 220, backgroundColor: "white" }}
            />
            <TextField
              size="small"
              label="Customer Contact"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              sx={{ minWidth: 160, backgroundColor: "white" }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<Search />}
              sx={{
                backgroundColor: "#fe9e0d",
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#ff8c00",
                  boxShadow: "0 4px 12px rgba(254, 158, 13, 0.4)",
                },
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={clearFilters}
              startIcon={<Clear />}
              sx={{
                borderColor: "#ccc",
                color: "#666",
                "&:hover": {
                  borderColor: "#fe9e0d",
                  backgroundColor: "#fff3e0",
                  color: "#fe9e0d",
                },
              }}
            >
              Clear
            </Button>
          </Box>
        </Paper>

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
        <Paper elevation={2} sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <FilterList sx={{ color: "#fe9e0d", mr: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#666", mr: 1 }}>
              Filters:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{ backgroundColor: "white" }}
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
                sx={{ backgroundColor: "white" }}
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
                sx={{ backgroundColor: "white" }}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <Card
              elevation={2}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {allOrders.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card
              elevation={2}
              sx={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {filteredAndSortedOrders.filter(o => o.orderStatus === "PENDING").length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Pending Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card
              elevation={2}
              sx={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  ₹{filteredAndSortedOrders.length > 0 
                    ? (filteredAndSortedOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0) / filteredAndSortedOrders.length).toFixed(2)
                    : "0.00"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Average Order Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card
              elevation={2}
              sx={{
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                color: "white",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {filteredAndSortedOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Revenue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Orders Table */}
        <Box sx={{ position: "relative" }}>
          {loading && allOrders.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
                borderRadius: 2,
              }}
            >
              <CircularProgress size={40} sx={{ color: "#fe9e0d" }} />
            </Box>
          )}
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
        </Box>

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
        <Dialog
          open={cancelDialog}
          onClose={() => setCancelDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: "400px",
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: "#f44336",
              color: "white",
              fontWeight: 600,
            }}
          >
            Confirm Cancel Order
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <DialogContentText>
              Are you sure you want to cancel order <strong>{orderToCancel}</strong>? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => setCancelDialog(false)}
              variant="outlined"
              sx={{
                borderColor: "#ccc",
                "&:hover": {
                  borderColor: "#999",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCancel}
              color="error"
              variant="contained"
              sx={{
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(244, 67, 54, 0.3)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(244, 67, 54, 0.4)",
                },
              }}
            >
              Confirm Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Order;