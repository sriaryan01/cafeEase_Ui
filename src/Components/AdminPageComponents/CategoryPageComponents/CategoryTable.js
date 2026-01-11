import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Checkbox,
  TablePagination,
  Box,
  Paper,
  Tooltip,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Image as ImageIcon, Visibility, Close } from "@mui/icons-material";

const CategoryTable = ({
  categories,
  onEdit,
  onDelete,
  onBulkSelect,
  selectedCategories = [],
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const [imageViewOpen, setImageViewOpen] = useState(false);
  const [selectedCategoryImage, setSelectedCategoryImage] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const handleViewImage = (category) => {
    setSelectedCategoryImage(category.image ? `data:image/jpeg;base64,${category.image}` : null);
    setSelectedCategoryName(category.name);
    setImageViewOpen(true);
  };

  const handleCloseImageView = () => {
    setImageViewOpen(false);
    setSelectedCategoryImage(null);
    setSelectedCategoryName("");
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = categories.map((c) => c.id);
      onBulkSelect?.(allIds);
    } else {
      onBulkSelect?.([]);
    }
  };

  const handleSelectOne = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      onBulkSelect?.(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onBulkSelect?.([...selectedCategories, categoryId]);
    }
  };

  const isSelected = (categoryId) => selectedCategories.includes(categoryId);
  const isAllSelected = categories.length > 0 && selectedCategories.length === categories.length;
  const isIndeterminate = selectedCategories.length > 0 && selectedCategories.length < categories.length;

  // Pagination logic
  const paginatedCategories = categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Paper elevation={2} sx={{ overflow: "hidden", borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#fe9e0d", background: "linear-gradient(135deg, #fe9e0d 0%, #ff8c00 100%)" }}>
            <TableRow>
              <TableCell padding="checkbox" sx={{ color: "white" }}>
                <Checkbox
                  indeterminate={isIndeterminate}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  sx={{ 
                    color: "white",
                    "&.Mui-checked": { color: "white" },
                    "&.MuiCheckbox-indeterminate": { color: "white" }
                  }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "1rem" }}>Image</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "1rem" }}>Category Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "1rem" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "1rem" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No categories found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCategories.map((category) => (
                <TableRow
                  key={category.id}
                  selected={isSelected(category.id)}
                  sx={{
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    "&.Mui-selected": { backgroundColor: "#fff3e0" },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected(category.id)}
                      onChange={() => handleSelectOne(category.id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: category.image ? "pointer" : "default",
                      }}
                      onClick={() => category.image && handleViewImage(category)}
                    >
                      {category.image ? (
                        <Avatar
                          src={`data:image/jpeg;base64,${category.image}`}
                          alt={category.name}
                          sx={{
                            width: 80,
                            height: 80,
                            border: "2px solid #fe9e0d",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                              boxShadow: "0 4px 12px rgba(254, 158, 13, 0.3)",
                            },
                          }}
                          variant="rounded"
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: "#e0e0e0",
                            border: "2px dashed #ccc",
                          }}
                          variant="rounded"
                        >
                          <ImageIcon sx={{ color: "#999" }} />
                        </Avatar>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: "#333" }}>
                      {category.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        display: "inline-block",
                        backgroundColor: category.status !== false && category.status !== "false" 
                          ? "#e8f5e9" 
                          : "#ffebee",
                        color: category.status !== false && category.status !== "false"
                          ? "#2e7d32"
                          : "#c62828",
                      }}
                    >
                      {category.status !== false && category.status !== "false" ? "Active" : "Inactive"}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center", flexWrap: "wrap" }}>
                      <Tooltip title="View Image">
                        <IconButton
                          onClick={() => handleViewImage(category)}
                          size="small"
                          sx={{
                            color: "#2196f3",
                            "&:hover": { backgroundColor: "#e3f2fd" },
                          }}
                          disabled={!category.image}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Category">
                        <IconButton
                          onClick={() => onEdit(category)}
                          size="small"
                          sx={{
                            color: "#fe9e0d",
                            "&:hover": { backgroundColor: "#fff3e0" },
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Category">
                        <IconButton
                          onClick={() => onDelete(category.id)}
                          size="small"
                          sx={{
                            color: "#f44336",
                            "&:hover": { backgroundColor: "#ffebee" },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {onPageChange && (
          <TablePagination
            component="div"
            count={categories.length}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#fafafa",
            }}
          />
        )}
      </Paper>

      {/* Image View Modal */}
      <Dialog
        open={imageViewOpen}
        onClose={handleCloseImageView}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "90vh",
            height: "90vh",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fe9e0d", color: "white" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedCategoryName} - Category Image
          </Typography>
          <IconButton onClick={handleCloseImageView} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            height: "100%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          {selectedCategoryImage ? (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
              }}
            >
              <img
                src={selectedCategoryImage}
                alt={selectedCategoryName}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", py: 8 }}>
              <ImageIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No image available for this category
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#fafafa", borderTop: "1px solid #e0e0e0" }}>
          <Button onClick={handleCloseImageView} variant="contained" sx={{ backgroundColor: "#fe9e0d", "&:hover": { backgroundColor: "#ff8c00" } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoryTable;

