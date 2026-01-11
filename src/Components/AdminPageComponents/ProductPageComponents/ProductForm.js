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
    try {
      // Prepare product data for update - only include fields that should be updated
      // Exclude image-related fields to prevent backend from clearing the image
      const productData = {
        name: product.name,
        categoryId: product.categoryId,
        description: product.description,
        price: product.price,
        status: product.status || "true", // Preserve status if it exists
      };
      
      // Only include id if updating an existing product
      if (product.id) {
        productData.id = product.id;
      }
      
      // Explicitly exclude any image-related fields that might cause backend to clear the image
      // These fields should never be sent in the update request
      
      // Save product first (this will return the created/updated product with ID)
      const savedProduct = await onSave(productData);
      
      // Only upload image if a NEW file was selected (not just viewing existing image)
      // This ensures we don't overwrite existing images when updating other product details
      const productId = savedProduct?.id || savedProduct?.data?.id || product.id;
      
      // Only upload if imageFile is set (meaning user selected a new file)
      // If imageFile is null, it means no new image was selected, so we skip upload
      if (imageFile && productId) {
        try {
          await uploadProductImage(productId, imageFile);
          toast.success('Product image uploaded successfully!');
          // Update preview with the uploaded image URL if available
          if (savedProduct?.imageUrl) {
            setImagePreview(savedProduct.imageUrl);
          }
        } catch (error) {
          console.error('Image upload error:', error);
          toast.error('Product saved but failed to upload image. Please try uploading again.');
        }
      }
      // If imageFile is null, we don't upload anything - existing image remains unchanged
    } catch (error) {
      console.error('Product save error:', error);
      // Error toast will be handled by onSave
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
