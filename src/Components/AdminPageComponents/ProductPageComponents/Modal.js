import React from 'react';
import '../../../CSS/AdminProductPage.css';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

const Modal = ({ open, onClose, children }) => {
  const childArray = React.Children.toArray(children);
  const selectedProduct = childArray[0]?.props.selectedProduct;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {selectedProduct ? 'Edit Product' : 'Add Product'}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;
