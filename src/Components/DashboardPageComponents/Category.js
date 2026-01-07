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
  InputAdornment,
  Button,
  Paper
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

const Category = () => {
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const getCategory = async () => {
            try {
                const categoriesData = await fetchCategories();
                console.log("Categories fetched successfully");
                setAllCategories(categoriesData);
                setLoading(false);

            } catch (error) {
                setError(error);
                setLoading(false);
                console.log("Error while fetching categories");
            }
        };

        getCategory();
    }, []);

    // Handle search - just update the query, filtering happens in useMemo
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Filter categories based on search query (no sorting)
    const filteredAndSortedCategories = useMemo(() => {
        // Show all categories - only filter out if status is explicitly "false"
        let filtered = [...allCategories].filter(cat => {
            // Show category unless status is explicitly "false"
            return cat.status !== "false" && cat.status !== false;
        });

        // Filter by search query if provided
        if (searchQuery.trim()) {
            const queryLower = searchQuery.toLowerCase();
            filtered = filtered.filter(cat => 
                cat.name?.toLowerCase().includes(queryLower) ||
                (cat.description && cat.description.toLowerCase().includes(queryLower))
            );
        }

        return filtered;
    }, [allCategories, searchQuery]);

    const clearFilters = () => {
        setSearchQuery('');
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

            {/* Search Bar */}
            <Paper elevation={2} sx={{ p: 2, mb: 3, mx: 'auto', maxWidth: '1200px', width: 'calc(100% - 40px)' }}>
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