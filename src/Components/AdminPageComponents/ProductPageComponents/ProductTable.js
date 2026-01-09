import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  TablePagination,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Edit, Delete, ViewInAr, Image as ImageIcon, AddPhotoAlternate, Close } from "@mui/icons-material";
import { uploadGlbFile, getProductGlb, getProductImage, uploadProductImage } from "../../../Services/product_service";
import { toast } from "react-toastify";
import "@google/model-viewer";

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  onStatusToggle,
  onRefresh,
  onBulkSelect,
  selectedProducts = [],
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const [glbUploadOpen, setGlbUploadOpen] = useState(false);
  const [glbViewOpen, setGlbViewOpen] = useState(false);
  const [imageViewOpen, setImageViewOpen] = useState(false);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [glbFile, setGlbFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [glbUrl, setGlbUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingGlb, setLoadingGlb] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const handleOpenGlbUpload = (productId) => {
    setSelectedProductId(productId);
    setGlbUploadOpen(true);
  };

  const handleCloseGlbUpload = () => {
    setGlbUploadOpen(false);
    setGlbFile(null);
    setSelectedProductId(null);
  };

  const handleGlbUpload = async () => {
    if (!glbFile || !selectedProductId) return;

    try {
      await uploadGlbFile(selectedProductId, glbFile);
      toast.success("GLB file uploaded successfully!");
      handleCloseGlbUpload();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error uploading GLB:", error);
      toast.error("Failed to upload GLB file");
    }
  };

  const handleViewGlb = async (productId) => {
    setSelectedProductId(productId);
    setLoadingGlb(true);
    setGlbViewOpen(true);
    try {
      const url = await getProductGlb(productId);
      setGlbUrl(url);
    } catch (error) {
      console.error("Error loading GLB:", error);
      setGlbUrl(null);
    } finally {
      setLoadingGlb(false);
    }
  };

  const handleCloseGlbView = () => {
    setGlbViewOpen(false);
    if (glbUrl) {
      URL.revokeObjectURL(glbUrl);
      setGlbUrl(null);
    }
    setSelectedProductId(null);
  };

  const handleViewImage = async (productId) => {
    setSelectedProductId(productId);
    setLoadingImage(true);
    setImageViewOpen(true);
    try {
      const url = await getProductImage(productId);
      setImageUrl(url);
    } catch (error) {
      console.error("Error loading image:", error);
      setImageUrl(null);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleCloseImageView = () => {
    setImageViewOpen(false);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
    setSelectedProductId(null);
  };

  const handleOpenImageUpload = (productId) => {
    setSelectedProductId(productId);
    setImageUploadOpen(true);
  };

  const handleCloseImageUpload = () => {
    setImageUploadOpen(false);
    setImageFile(null);
    setSelectedProductId(null);
  };

  const handleImageUpload = async () => {
    if (!imageFile || !selectedProductId) return;

    try {
      await uploadProductImage(selectedProductId, imageFile);
      toast.success("Image uploaded successfully!");
      handleCloseImageUpload();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = products.map((p) => p.id);
      onBulkSelect?.(allIds);
    } else {
      onBulkSelect?.([]);
    }
  };

  const handleSelectOne = (productId) => {
    if (selectedProducts.includes(productId)) {
      onBulkSelect?.(selectedProducts.filter((id) => id !== productId));
    } else {
      onBulkSelect?.([...selectedProducts, productId]);
    }
  };

  const isSelected = (productId) => selectedProducts.includes(productId);
  const isAllSelected = products.length > 0 && selectedProducts.length === products.length;
  const isIndeterminate = selectedProducts.length > 0 && selectedProducts.length < products.length;

  // Pagination logic
  const paginatedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={isIndeterminate}
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>In Stock</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>3D Image</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedProducts.map((product) => (
            <TableRow 
              key={product.id}
              selected={isSelected(product.id)}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isSelected(product.id)}
                  onChange={() => handleSelectOne(product.id)}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.categoryName}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>
                <Switch
                  checked={product.status === "true"}
                  onChange={() =>
                    onStatusToggle(
                      product.id,
                      product.status === "true" ? false : true
                    )
                  }
                  color="primary"
                />
              </TableCell>
              <TableCell>
                {product.hasImage3D ? "Yes" : "No"}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleOpenGlbUpload(product.id)}
                  sx={{ ml: 1 }}
                >
                  Upload GLB
                </Button>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  <IconButton 
                    onClick={() => handleViewGlb(product.id)} 
                    size="small"
                    title="View GLB"
                    disabled={!product.hasImage3D}
                  >
                    <ViewInAr />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleViewImage(product.id)} 
                    size="small"
                    title="View Photo"
                  >
                    <ImageIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleOpenImageUpload(product.id)} 
                    size="small"
                    title="Add Photo"
                  >
                    <AddPhotoAlternate />
                  </IconButton>
                  <IconButton onClick={() => onEdit(product)} size="small" title="Edit">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete(product.id)} size="small" title="Delete">
                    <Delete />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {onPageChange && (
        <TablePagination
          component="div"
          count={products.length}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}

      {/* GLB Upload Modal */}
      <Dialog open={glbUploadOpen} onClose={handleCloseGlbUpload}>
        <DialogTitle>Upload GLB File</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept=".glb"
            onChange={(e) => setGlbFile(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGlbUpload}>Cancel</Button>
          <Button onClick={handleGlbUpload} variant="contained" color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* GLB View Modal */}
      <Dialog 
        open={glbViewOpen} 
        onClose={handleCloseGlbView}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            height: "90vh",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          View 3D Model - Product ID: {selectedProductId}
          <IconButton
            onClick={handleCloseGlbView}
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, position: "relative", height: "100%" }}>
          {loadingGlb ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <CircularProgress />
            </Box>
          ) : glbUrl ? (
            <model-viewer
              src={glbUrl}
              alt="3D Model"
              camera-controls
              auto-rotate
              shadow-intensity="1"
              exposure="1"
              environment-image="neutral"
              style={{
                width: "100%",
                height: "100%",
                minHeight: "500px",
                backgroundColor: "#f5f5f5",
              }}
            />
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", p: 3 }}>
              <Typography>3D model not available for this product</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Image View Modal */}
      <Dialog 
        open={imageViewOpen} 
        onClose={handleCloseImageView}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          View Product Image - Product ID: {selectedProductId}
          <IconButton
            onClick={handleCloseImageView}
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loadingImage ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
              <CircularProgress />
            </Box>
          ) : imageUrl ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <img
                src={imageUrl}
                alt="Product"
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                }}
              />
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
              <Typography>Image not available for this product</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Image Upload Modal */}
      <Dialog open={imageUploadOpen} onClose={handleCloseImageUpload}>
        <DialogTitle>Upload Product Image</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageUpload}>Cancel</Button>
          <Button onClick={handleImageUpload} variant="contained" color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductTable;
