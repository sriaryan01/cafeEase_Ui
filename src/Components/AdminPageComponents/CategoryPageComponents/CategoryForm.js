import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, Box, Typography } from '@mui/material';

const CategoryForm = ({ onSave, selectedCategory }) => {
  const [category, setCategory] = useState({
    name: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      setCategory({
        name: selectedCategory.name || '',
      });
      if (selectedCategory.image) {
        setImagePreview(`data:image/jpeg;base64,${selectedCategory.image}`);
      }
    } else {
      setCategory({
        name: '',
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [selectedCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) {
      return;
    }
    
    // Validate required fields
    if (!category.name || category.name.trim() === '') {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSave(category, imageFile);
    } catch (error) {
      // Error is already handled in the parent component
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} paddingTop={1}>
        <TextField
          fullWidth
          label="Category Name"
          name="name"
          value={category.name}
          onChange={handleChange}
          required
        />
        
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>Category Image</Typography>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="category-image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="category-image-upload">
            <Button variant="outlined" component="span" fullWidth>
              {imagePreview ? 'Change Image' : 'Upload Image'}
            </Button>
          </label>
          {imagePreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img 
                src={imagePreview} 
                alt="Category preview" 
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
              />
            </Box>
          )}
        </Box>
      
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (selectedCategory ? 'Update' : 'Add') + ' Category'}
        </Button>
      </Stack>
    </form>
  );
};

export default CategoryForm;

