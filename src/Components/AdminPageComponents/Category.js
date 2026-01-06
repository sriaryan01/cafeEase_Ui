import React, { useEffect, useState, useMemo } from "react";
import CategoryTable from "./CategoryPageComponents/CategoryTable";
import CategoryForm from "./CategoryPageComponents/CategoryForm";
import CategoryModal from "./CategoryPageComponents/CategoryModal";
import CategorySearchBar from "./CategoryPageComponents/CategorySearchBar";
import {
  addCategory,
  fetchCategories,
  updateCategory,
  deleteCategory,
  searchCategories,
  bulkDeleteCategories,
  uploadCategoryImage,
} from "../../Services/category_service";
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

function Category() {
  const [allCategories, setAllCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      setAllCategories(response);
      setCategories(response);
    } catch (error) {
      toast.error("Error fetching categories");
      console.error(error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = await searchCategories(query);
        setAllCategories(response);
      } catch (error) {
        // If search fails, fall back to local filtering
        console.error("Search error:", error);
      }
    } else {
      loadCategories();
    }
  };

  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    let filtered = [...allCategories];

    // Sort categories
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
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
  }, [allCategories, sortBy, sortOrder]);

  const handleAdd = async (category, imageFile) => {
    try {
      // Validate required fields
      if (!category.name || category.name.trim() === "") {
        toast.error("Category name is required");
        return;
      }

      let savedCategory;
      if (selectedCategory) {
        // Update: send id, name, and image together
        savedCategory = await updateCategory(
          selectedCategory.id,
          category.name,
          imageFile
        );
        toast.success("Category updated successfully!");
      } else {
        // Add: send name and image together
        savedCategory = await addCategory(category.name, imageFile);
        toast.success("Category added successfully!");
      }

      console.log("Saved category response:", savedCategory);

      // Refresh the category list
      await loadCategories();
      setModalOpen(false);
      setSelectedCategory(null);
      return savedCategory;
    } catch (error) {
      console.error("Error saving category:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Extract error message from different possible locations
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.data?.message ||
        error.message ||
        "Error saving category. Please check the console for details.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully!");
      loadCategories();
    } catch (error) {
      toast.error("Error deleting category");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteCategories(selectedCategories);
      toast.success(
        `${selectedCategories.length} category(ies) deleted successfully!`
      );
      setSelectedCategories([]);
      setBulkDeleteDialog(false);
      loadCategories();
    } catch (error) {
      toast.error("Error deleting categories");
    }
  };

  const handleAddCategoryClick = () => {
    setSelectedCategory(null);
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
    setSearchQuery("");
    setSortBy("name");
    setSortOrder("asc");
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="category admin-page">
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center" }}>Manage Categories</h1>

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
          <CategorySearchBar
            id="searchbar"
            style={{ flex: 1 }}
            onSearch={handleSearch}
            value={searchQuery}
          />
          <Button
            style={{ height: "55px" }}
            variant="contained"
            color="primary"
            onClick={handleAddCategoryClick}
          >
            Add Category
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
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
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

          {selectedCategories.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip
                label={`${selectedCategories.length} selected`}
                color="primary"
                onDelete={() => setSelectedCategories([])}
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

        <CategoryTable
          categories={filteredAndSortedCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkSelect={setSelectedCategories}
          selectedCategories={selectedCategories}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <CategoryModal open={isModalOpen} onClose={() => setModalOpen(false)}>
          <CategoryForm
            onSave={handleAdd}
            selectedCategory={selectedCategory}
          />
        </CategoryModal>

        {/* Bulk Delete Dialog */}
        <Dialog
          open={bulkDeleteDialog}
          onClose={() => setBulkDeleteDialog(false)}
        >
          <DialogTitle>Confirm Bulk Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete {selectedCategories.length}{" "}
              category(ies)? This action cannot be undone.
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

export default Category;
