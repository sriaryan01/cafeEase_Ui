import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack,Box, FormControl, InputLabel, Select, MenuItem, Typography} from '@mui/material';
import { uploadProductImage } from '../../../Services/product_service';
import { toast } from 'react-toastify';

const ProductForm = ({ onSave, selectedProduct, categories }) => {
  const [product, setProduct] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (selectedProduct) {
      setProduct(selectedProduct);
      setImagePreview(selectedProduct.imageUrl || null);
    } else {
      setProduct({
        name: '',
        categoryId: '',
        description: '',
        price: '',
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
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
    await onSave(product);
    
    // Upload image if a new one was selected
    if (imageFile && product.id) {
      try {
        await uploadProductImage(product.id, imageFile);
        toast.success('Product image uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload product image');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      
      <Stack spacing={2} paddingTop={1}>
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth >
            <InputLabel id="category-label"  style={{ backgroundColor: 'white', padding: '0 4px' }}>Category *</InputLabel>
            <Select style={{border: 'transparent'}}
              labelId="category-label"
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
              required
            >
              {categories.map((category, index) => (
                <MenuItem key={index} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Price"
          name="price"
          value={product.price}
          onChange={handleChange}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*',title: 'Price can only be numeric.', }}
          required
        />
        
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>Product Image</Typography>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="product-image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="product-image-upload">
            <Button variant="outlined" component="span" fullWidth>
              {imagePreview ? 'Change Image' : 'Upload Image'}
            </Button>
          </label>
          {imagePreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img 
                src={imagePreview} 
                alt="Product preview" 
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
              />
            </Box>
          )}
        </Box>
      
        <Button type="submit" variant="contained" color="primary">
          {selectedProduct ? 'Update' : 'Add'} Product
        </Button>
      </Stack>
    </form>
  );
};

export default ProductForm;
