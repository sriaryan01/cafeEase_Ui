import React, { useEffect, useState, useMemo } from "react";
import UserTable from "./UserPageComponents/UserTable";
import UserForm from "./UserPageComponents/UserForm";
import UserModal from "./UserPageComponents/UserModal";
import UserSearchBar from "./UserPageComponents/UserSearchBar";
import {
  getAllUsers,
  updateUser,
  signUp,
} from "../../Services/user_service";
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
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Add, FilterList, Clear } from "@mui/icons-material";
import { toast } from "react-toastify";

function User() {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setAllUsers(response);
      setUsers(response);
    } catch (error) {
      toast.error("Error fetching users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = [...allUsers];

    // Filter by role
    if (filterRole !== "all") {
      filtered = filtered.filter((u) => u.role === filterRole);
    }

    // Filter by status
    if (filterStatus !== "all") {
      const statusValue = filterStatus === "active";
      filtered = filtered.filter((u) => (u.status === "true") === statusValue);
    }

    // Sort users
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "role":
          aValue = a.role.toLowerCase();
          bValue = b.role.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [allUsers, filterRole, filterStatus, sortBy, sortOrder]);

  const handleAdd = async (user) => {
    try {
      // Validate required fields
      if (!user.name || user.name.trim() === "") {
        toast.error("User name is required");
        return;
      }
      if (!user.email || user.email.trim() === "") {
        toast.error("Email is required");
        return;
      }

      if (selectedUser) {
        // Update existing user - convert to Map format expected by backend
        const userData = {
          id: selectedUser.id.toString(),
          name: user.name,
          email: user.email,
          contactNumber: user.contactNumber || "",
          role: user.role,
          status: user.status,
        };

        await updateUser(userData);
        toast.success("User updated successfully!");
      } else {
        // Add new user using signup
        const signupData = {
          name: user.name,
          email: user.email,
          contactNumber: user.contactNumber || "",
          password: "defaultPassword123", // You may want to generate or require password
          role: user.role,
        };

        await signUp(signupData);
        toast.success("User added successfully!");
      }
      
      // Refresh the user list
      await loadUsers();
      setModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error saving user. Please check the console for details.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      // Note: Delete endpoint might not exist, you may need to update status instead
      toast.error("Delete functionality not available. Please update user status instead.");
      // await deleteUser(id);
      // toast.success("User deleted successfully!");
      // loadUsers();
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  const handleBulkDelete = async () => {
    try {
      toast.error("Bulk delete not available. Please update user status instead.");
      // await bulkDeleteUsers(selectedUsers);
      // toast.success(`${selectedUsers.length} user(s) deleted successfully!`);
      // setSelectedUsers([]);
      // setBulkDeleteDialog(false);
      // loadUsers();
    } catch (error) {
      toast.error("Error deleting users");
    }
  };

  const handleAddUserClick = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearFilters = () => {
    setFilterRole("all");
    setFilterStatus("all");
    setSearchQuery("");
    setSortBy("name");
    setSortOrder("asc");
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#fe9e0d", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#666" }}>
            Loading Users...
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
            Manage Users
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
            }}
          >
            Add, edit, and manage user accounts
          </Typography>
        </Paper>

        {/* Search and Add Button */}
        <Paper elevation={2} sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <UserSearchBar
              id="searchbar"
              style={{ flex: 1, minWidth: "200px" }}
              onSearch={handleSearch}
              value={searchQuery}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddUserClick}
              sx={{
                height: "55px",
                backgroundColor: "#fe9e0d",
                color: "white",
                fontWeight: 600,
                px: 3,
                "&:hover": {
                  backgroundColor: "#ff8c00",
                  boxShadow: "0 4px 12px rgba(254, 158, 13, 0.4)",
                },
              }}
            >
              Add User
            </Button>
          </Box>
        </Paper>

        {/* Filters and Sorting */}
        <Paper elevation={2} sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", mb: selectedUsers.length > 0 ? 2 : 0 }}>
            <FilterList sx={{ color: "#fe9e0d", mr: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#666", mr: 1 }}>
              Filters:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={filterRole}
                label="Role"
                onChange={(e) => setFilterRole(e.target.value)}
                sx={{ backgroundColor: "white" }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{ backgroundColor: "white" }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
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
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="role">Role</MenuItem>
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

            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={clearFilters}
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
              Clear Filters
            </Button>

            {selectedUsers.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                  pt: 2,
                  borderTop: "1px solid #e0e0e0",
                  mt: 2,
                  width: "100%",
                }}
              >
                <Chip
                  label={`${selectedUsers.length} selected`}
                  sx={{
                    backgroundColor: "#fe9e0d",
                    color: "white",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#ff8c00",
                    },
                  }}
                  onDelete={() => setSelectedUsers([])}
                />
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => setBulkDeleteDialog(true)}
                  sx={{
                    fontWeight: 600,
                    boxShadow: "0 2px 8px rgba(244, 67, 54, 0.3)",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(244, 67, 54, 0.4)",
                    },
                  }}
                >
                  Delete Selected
                </Button>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
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
                  {allUsers.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
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
                  {filteredAndSortedUsers.filter(u => u.role === "admin").length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Admin Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
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
                  {selectedUsers.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Selected Items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Users Table */}
        <UserTable
          users={filteredAndSortedUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkSelect={setSelectedUsers}
          selectedUsers={selectedUsers}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <UserModal open={isModalOpen} onClose={() => setModalOpen(false)}>
          <UserForm onSave={handleAdd} selectedUser={selectedUser} />
        </UserModal>

        {/* Bulk Delete Dialog */}
        <Dialog
          open={bulkDeleteDialog}
          onClose={() => setBulkDeleteDialog(false)}
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
            Confirm Bulk Delete
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <DialogContentText>
              Are you sure you want to delete <strong>{selectedUsers.length}</strong> user(s)?
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => setBulkDeleteDialog(false)}
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
              onClick={handleBulkDelete}
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
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default User;