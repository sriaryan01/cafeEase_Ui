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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const UserTable = ({
  users,
  onEdit,
  onDelete,
  onBulkSelect,
  selectedUsers = [],
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = users.map((u) => u.id);
      onBulkSelect?.(allIds);
    } else {
      onBulkSelect?.([]);
    }
  };

  const handleSelectOne = (userId) => {
    if (selectedUsers.includes(userId)) {
      onBulkSelect?.(selectedUsers.filter((id) => id !== userId));
    } else {
      onBulkSelect?.([...selectedUsers, userId]);
    }
  };

  const isSelected = (userId) => selectedUsers.includes(userId);
  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length;

  // Pagination logic
  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Contact Number</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow 
              key={user.id}
              selected={isSelected(user.id)}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isSelected(user.id)}
                  onChange={() => handleSelectOne(user.id)}
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.contactNumber || 'N/A'}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status === "true" ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(user)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onDelete(user.id)}>
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
          count={users.length}
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

export default UserTable;

