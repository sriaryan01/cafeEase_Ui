import React from 'react';
import '../../../CSS/AdminProductPage.css';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

const CategoryModal = ({ open, onClose, children }) => {
  const childArray = React.Children.toArray(children);
  const selectedCategory = childArray[0]?.props.selectedCategory;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {selectedCategory ? 'Edit Category' : 'Add Category'}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default CategoryModal;

