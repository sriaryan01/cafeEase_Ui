import React, { useEffect, useState, useMemo } from 'react'
import Navbar from './Navbar'
import ProductTable from './ProductPageComponents/ProductTable'
import ProductForm from './ProductPageComponents/ProductForm'
import Modal from './ProductPageComponents/Modal'
import SearchBar from './ProductPageComponents/ProductSearchBar'
import { 
  addProduct, 
  adminProductList, 
  updateProduct, 
  deleteProduct, 
  changeStatus,
  searchProducts,
  bulkDeleteProducts,
  bulkUpdateStatus
} from '../../Services/product_service';
import {fetchCategories} from '../../Services/category_service';
import { 
  Button, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField,
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
} from '@mui/material';
import { Add, FilterList, Clear } from '@mui/icons-material';
import { toast } from 'react-toastify';

function Product () {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);
  const [bulkStatusDialog, setBulkStatusDialog] = useState(false);
  const [bulkStatusValue, setBulkStatusValue] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
    const response = await adminProductList();
      setAllProducts(response);
    setProducts(response);
    } catch (error) {
      toast.error('Error fetching products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
    const response = await fetchCategories();
    setCategories(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by search query if provided
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(queryLower) ||
        (p.description && p.description.toLowerCase().includes(queryLower)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(queryLower))
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.categoryId === parseInt(filterCategory));
    }

    // Filter by status
    if (filterStatus !== 'all') {
      const statusValue = filterStatus === 'active';
      filtered = filtered.filter(p => (p.status === "true") === statusValue);
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(p => parseFloat(p.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => parseFloat(p.price) <= parseFloat(maxPrice));
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case 'category':
          aValue = a.categoryName.toLowerCase();
          bValue = b.categoryName.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [allProducts, filterCategory, filterStatus, minPrice, maxPrice, sortBy, sortOrder, searchQuery]);

  const handleAdd = async (product) => {
    try {
      let savedProduct;
      if (selectedProduct) {
        savedProduct = await updateProduct(product);
        toast.success('Product updated successfully!');
      } else {
        savedProduct = await addProduct(product);
        toast.success('Product added successfully!');
      }
      fetchProducts();
      setModalOpen(false);
      setSelectedProduct(null);
      // Return saved product so ProductForm can use the ID for image upload
      return savedProduct;
    } catch (error) {
      toast.error('Error saving product');
      throw error;
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
    await deleteProduct(id);
      toast.success('Product deleted successfully!');
    fetchProducts();
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const handleStatusToggle = async (id, status) => {
    try {
      let obj = {"id": id, "status": status};
      await changeStatus(obj);
      fetchProducts();
    } catch (error) {
      toast.error('Error updating product status');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteProducts(selectedProducts);
      toast.success(`${selectedProducts.length} product(s) deleted successfully!`);
      setSelectedProducts([]);
      setBulkDeleteDialog(false);
      fetchProducts();
    } catch (error) {
      toast.error('Error deleting products');
    }
  };

  const handleBulkStatusUpdate = async () => {
    try {
      await bulkUpdateStatus(selectedProducts, bulkStatusValue);
      toast.success(`Status updated for ${selectedProducts.length} product(s)!`);
      setSelectedProducts([]);
      setBulkStatusDialog(false);
      fetchProducts();
    } catch (error) {
      toast.error('Error updating product status');
    }
  };

  const handleAddProductClick = () => {
    setSelectedProduct(null); 
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
    setFilterCategory('all');
    setFilterStatus('all');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setSortBy('name');
    setSortOrder('asc');
  };

  useEffect(() => {
    fetchProducts();
    getCategories();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#fe9e0d", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#666" }}>
            Loading Products...
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
            Manage Products
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
            }}
          >
            Add, edit, and manage your products
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
            <SearchBar 
              id='searchbar' 
              style={{ flex: 1, minWidth: "200px" }} 
              onSearch={handleSearch}
              value={searchQuery}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddProductClick}
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
              Add Product
            </Button>
          </Box>
        </Paper>

        {/* Filters and Sorting */}
        <Paper elevation={2} sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: selectedProducts.length > 0 ? 2 : 0 }}>
            <FilterList sx={{ color: "#fe9e0d", mr: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#666", mr: 1 }}>
              Filters:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                label="Category"
                onChange={(e) => setFilterCategory(e.target.value)}
                sx={{ backgroundColor: "white" }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
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

            <TextField
              size="small"
              label="Min Price"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              sx={{ width: 120, backgroundColor: "white" }}
            />

            <TextField
              size="small"
              label="Max Price"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              sx={{ width: 120, backgroundColor: "white" }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ backgroundColor: "white" }}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="category">Category</MenuItem>
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

            {selectedProducts.length > 0 && (
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
                  label={`${selectedProducts.length} selected`}
                  sx={{
                    backgroundColor: "#fe9e0d",
                    color: "white",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#ff8c00",
                    },
                  }}
                  onDelete={() => setSelectedProducts([])}
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
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {
                    setBulkStatusValue(true);
                    setBulkStatusDialog(true);
                  }}
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Activate Selected
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    setBulkStatusValue(false);
                    setBulkStatusDialog(true);
                  }}
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Deactivate Selected
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
                  {allProducts.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Products
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
                  {filteredAndSortedProducts.filter(p => p.status === "true").length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Active Products
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
                  {selectedProducts.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Selected Items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Products Table */}
        <ProductTable 
          products={filteredAndSortedProducts} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onStatusToggle={handleStatusToggle}
          onBulkSelect={setSelectedProducts}
          selectedProducts={selectedProducts}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onRefresh={fetchProducts}
        />
        
        <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
          <ProductForm onSave={handleAdd} selectedProduct={selectedProduct} categories={categories} />
        </Modal>

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
              Are you sure you want to delete <strong>{selectedProducts.length}</strong> product(s)? This action cannot be undone.
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

        {/* Bulk Status Update Dialog */}
        <Dialog
          open={bulkStatusDialog}
          onClose={() => setBulkStatusDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: "400px",
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: "#2196f3",
              color: "white",
              fontWeight: 600,
            }}
          >
            Confirm Status Update
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <DialogContentText>
              Are you sure you want to <strong>{bulkStatusValue ? 'activate' : 'deactivate'}</strong> {selectedProducts.length} product(s)?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => setBulkStatusDialog(false)}
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
              onClick={handleBulkStatusUpdate}
              color="primary"
              variant="contained"
              sx={{
                fontWeight: 600,
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default Product