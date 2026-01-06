import React from 'react';
import '../../../CSS/AdminProductPage.css';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

const UserModal = ({ open, onClose, children }) => {
  const childArray = React.Children.toArray(children);
  const selectedUser = childArray[0]?.props.selectedUser;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {selectedUser ? 'Edit User' : 'Add User'}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default UserModal;

