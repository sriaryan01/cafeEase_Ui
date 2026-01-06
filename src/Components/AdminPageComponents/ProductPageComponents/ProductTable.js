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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { uploadGlbFile } from "../../../Services/product_service"; // ✅ import service

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
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [glbFile, setGlbFile] = useState(null);

  const handleOpenModal = (productId) => {
    setSelectedProductId(productId);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setGlbFile(null);
  };

  const handleUpload = async () => {
    if (!glbFile || !selectedProductId) return;

    try {
      await uploadGlbFile(selectedProductId, glbFile); // ✅ use service method
      handleCloseModal();
      if (onRefresh) onRefresh(); // refresh product list after upload
    } catch (error) {
      console.error("Error uploading GLB:", error);
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
                  onClick={() => handleOpenModal(product.id)}
                  sx={{ ml: 1 }}
                >
                  Upload GLB
                </Button>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(product)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onDelete(product.id)}>
                  <Delete />
                </IconButton>
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

      {/* ✅ Upload Modal */}
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Upload GLB File</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept=".glb"
            onChange={(e) => setGlbFile(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductTable;
