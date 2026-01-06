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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

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
            <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCategories.map((category) => (
            <TableRow 
              key={category.id}
              selected={isSelected(category.id)}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isSelected(category.id)}
                  onChange={() => handleSelectOne(category.id)}
                />
              </TableCell>
              <TableCell>
                {category.image ? (
                  <img 
                    src={`data:image/jpeg;base64,${category.image}`} 
                    alt={category.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                ) : (
                  <Box sx={{ width: '50px', height: '50px', bgcolor: '#f0f0f0', borderRadius: '4px' }} />
                )}
              </TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(category)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onDelete(category.id)}>
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
          count={categories.length}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </>
  );
};

export default CategoryTable;

