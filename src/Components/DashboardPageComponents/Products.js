import React, { useState, useEffect, useMemo } from 'react';
import { productList, productListByCategory, searchProducts } from '../../Services/product_service';
import { fetchCart } from '../../Services/cart_service';
import Menu from './Menu';
import BannerBackground from "../../Assets/home-banner-background.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './Spinner';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  InputAdornment,
  Button,
  Paper
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

const Products = () => {
  const { id: categoryId } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItemsIdToQuantityMap, setCartItemsIdToQuantityMap] = useState(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let productsData;
        if(categoryId == null){
          productsData = await productList();
        } else{
          productsData = await productListByCategory(categoryId);
        }
        console.log("Products fetched successfully")
        await setIdToQuantityMapFromCart(setCartItemsIdToQuantityMap);
        setAllProducts(productsData);
        setProducts(productsData);
        setLoading(false);

      } catch (error) {
        toast.error("Error fetching products");
        setLoading(false);
        console.log("Error while fetching products");
      }
    };

    fetchProducts();
  }, [categoryId]);

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = await searchProducts(query);
        setAllProducts(response);
      } catch (error) {
        console.error('Search error:', error);
        // Fall back to local filtering
      }
    } else {
      // Reset to original products
      const fetchProducts = async () => {
        try {
          let productsData;
          if(categoryId == null){
            productsData = await productList();
          } else{
            productsData = await productListByCategory(categoryId);
          }
          setAllProducts(productsData);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
      fetchProducts();
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

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
          aValue = a.categoryName?.toLowerCase() || '';
          bValue = b.categoryName?.toLowerCase() || '';
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
  }, [allProducts, minPrice, maxPrice, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('name');
    setSortOrder('asc');
    handleSearch('');
  };

  if (loading) {
    return <div><Spinner/></div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='product-container'>
      <div className="home-bannerImage-container">
        <img src={BannerBackground} alt="" />
      </div>
      
      {/* Search and Filter Bar */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, mx: 'auto', maxWidth: '1200px' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: showFilters ? 2 : 0 }}>
          <TextField
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
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

          <Button 
            variant="outlined" 
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>

          {(searchQuery || minPrice || maxPrice) && (
            <Button 
              variant="outlined" 
              startIcon={<Clear />}
              onClick={clearFilters}
              color="secondary"
            >
              Clear
            </Button>
          )}
        </Box>

        {showFilters && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', pt: 2, borderTop: 1, borderColor: 'divider' }}>
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
          </Box>
        )}
      </Paper>

      {filteredAndSortedProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <p>No products found matching your criteria.</p>
        </Box>
      ) : (
        filteredAndSortedProducts.map(product => (
          <Menu key={product.id} product={product} cartItemsIdToQuantityMap={cartItemsIdToQuantityMap}/>
        ))
      )}
    </div>
  );
};

export default Products;

async function setIdToQuantityMapFromCart(setCartItemsIdToQuantityMap) {
  const cart = await fetchCart();
  const map = new Map();
  if (cart !== null) {
    cart.items.forEach((item) => {
      map.set(item.productId, item.quantity);
    });
    setCartItemsIdToQuantityMap(map);
  }
}
