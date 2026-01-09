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
  DialogContentText
} from '@mui/material';
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

  const fetchProducts = async () => {
    try {
    const response = await adminProductList();
      setAllProducts(response);
    setProducts(response);
    } catch (error) {
      toast.error('Error fetching products');
      console.error(error);
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

  return (
    <div className='product admin-page'>
      <div style={{ padding: '20px'}}>
      <h1 style={{ textAlign: 'center' }}>Manage Products</h1>
      
      {/* Search and Add Button */}
      <div className='top_div' style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
        <SearchBar 
          id='searchbar' 
          style={{ flex: 1 }} 
          onSearch={handleSearch}
          value={searchQuery}
        />
        <Button 
          style={{height:'55px'}} 
          variant="contained" 
          color="primary" 
          onClick={handleAddProductClick}
        >
          Add Product
        </Button>
      </div>

      {/* Filters and Sorting */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            label="Category"
            onChange={(e) => setFilterCategory(e.target.value)}
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
          sx={{ width: 120 }}
        />

        <TextField
          size="small"
          label="Max Price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          sx={{ width: 120 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
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
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      
        <Button variant="outlined" onClick={clearFilters}>
          Clear Filters
        </Button>

        {selectedProducts.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={`${selectedProducts.length} selected`} 
              color="primary" 
              onDelete={() => setSelectedProducts([])}
            />
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              onClick={() => setBulkDeleteDialog(true)}
            >
              Delete Selected
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="small"
              onClick={() => {
                setBulkStatusValue(true);
                setBulkStatusDialog(true);
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
            >
              Deactivate Selected
            </Button>
          </Box>
        )}
      </Box>
      
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
      <Dialog open={bulkDeleteDialog} onClose={() => setBulkDeleteDialog(false)}>
        <DialogTitle>Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedProducts.length} product(s)? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleBulkDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Status Update Dialog */}
      <Dialog open={bulkStatusDialog} onClose={() => setBulkStatusDialog(false)}>
        <DialogTitle>Confirm Status Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {bulkStatusValue ? 'activate' : 'deactivate'} {selectedProducts.length} product(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleBulkStatusUpdate} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </div>
  )
}

export default Product