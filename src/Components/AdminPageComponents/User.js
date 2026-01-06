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
} from "@mui/material";
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

  const loadUsers = async () => {
    try {
      const response = await getAllUsers();
      setAllUsers(response);
      setUsers(response);
    } catch (error) {
      toast.error("Error fetching users");
      console.error(error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Local filtering for search
    if (query.trim()) {
      const filtered = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );
      setAllUsers(filtered);
    } else {
      loadUsers();
    }
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

  return (
    <div className="user admin-page">
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center" }}>Manage Users</h1>

        {/* Search and Add Button */}
        <div
          className="top_div"
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          <UserSearchBar
            id="searchbar"
            style={{ flex: 1 }}
            onSearch={handleSearch}
            value={searchQuery}
          />
          <Button
            style={{ height: "55px" }}
            variant="contained"
            color="primary"
            onClick={handleAddUserClick}
          >
            Add User
          </Button>
        </div>

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
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={filterRole}
              label="Role"
              onChange={(e) => setFilterRole(e.target.value)}
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
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={clearFilters}>
            Clear Filters
          </Button>

          {selectedUsers.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip
                label={`${selectedUsers.length} selected`}
                color="primary"
                onDelete={() => setSelectedUsers([])}
              />
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => setBulkDeleteDialog(true)}
              >
                Delete Selected
              </Button>
            </Box>
          )}
        </Box>

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
        >
          <DialogTitle>Confirm Bulk Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete {selectedUsers.length} user(s)?
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBulkDeleteDialog(false)}>Cancel</Button>
            <Button
              onClick={handleBulkDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default User;