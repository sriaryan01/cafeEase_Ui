import React, { useState, useEffect, useMemo } from 'react';
import { fetchCategories, searchCategories } from '../../Services/category_service';
import 'react-toastify/dist/ReactToastify.css';
import BannerBackground from "../../Assets/home-banner-background.png";
import DefaultImage from  "../../Assets/no-image.png";
import '../../CSS/UserCategories.css';
import Spinner from './Spinner';
import { useNavigate } from "react-router-dom";
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

const Category = () => {
    const [allCategories, setAllCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const getCategory = async () => {
            try {
                const categoriesData = await fetchCategories();
                console.log("Categories fetched successfully");
                setAllCategories(categoriesData);
                setCategories(categoriesData);
                setLoading(false);

            } catch (error) {
                setError(error);
                setLoading(false);
                console.log("Error while fetching categories");
            }
        };

        getCategory();
    }, []);

    // Handle search
    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim()) {
            try {
                const response = await searchCategories(query);
                setAllCategories(response);
            } catch (error) {
                console.error('Search error:', error);
                // Fall back to local filtering
            }
        } else {
            // Reset to original categories
            const getCategory = async () => {
                try {
                    const categoriesData = await fetchCategories();
                    setAllCategories(categoriesData);
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            };
            getCategory();
        }
    };

    // Filter and sort categories
    const filteredAndSortedCategories = useMemo(() => {
        let filtered = [...allCategories].filter(cat => cat.status === "true"); // Only show active categories

        // Sort categories
        filtered.sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
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
    }, [allCategories, sortBy, sortOrder]);

    const clearFilters = () => {
        setSearchQuery('');
        setSortBy('name');
        setSortOrder('asc');
        handleSearch('');
    };

    if (loading) {
        return <div><Spinner /></div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='cart-container'>
            <div className="home-bannerImage-container bg-container">
                <img src={BannerBackground} alt="" className='backgoround-img' />
            </div>

            {/* Search and Filter Bar */}
            <Paper elevation={2} sx={{ p: 2, mb: 3, mx: 'auto', maxWidth: '1200px' }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField
                        placeholder="Search categories..."
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

                    {searchQuery && (
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
            </Paper>

            <div id="Category">
                {filteredAndSortedCategories.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <p>No categories found matching your criteria.</p>
                    </Box>
                ) : (
                    <div className="category-section-bottom">
                        {filteredAndSortedCategories.map(category => (
                            <CategoryItem key={category.id} category={category} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CategoryItem = ({ category }) => {
    const navigate = useNavigate();
    const handleViewProducts = (categoryId) => {
        navigate("/products/category/"+categoryId);
    };

    return (
        <div className="category-section-info">
            <div className="info-boxes-img-container">
                <img 
                    src={category.image ? `data:image/jpeg;base64,${category.image}`: DefaultImage} 
                    alt={category.name || "No image"} 
                    className="top-category-img" 
                />
            </div>
            <h2>{category.name}</h2>
            <button className='card-tag subtle' onClick={() => handleViewProducts(category.id)}>
                View Products
            </button>
        </div>
    );
};

export default Category;