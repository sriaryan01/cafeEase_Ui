import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const UserForm = ({ onSave, selectedUser }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    contactNumber: '',
    role: '',
    status: 'true',
  });

  useEffect(() => {
    if (selectedUser) {
      setUser({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        contactNumber: selectedUser.contactNumber || '',
        role: selectedUser.role || '',
        status: selectedUser.status || 'true',
      });
    } else {
      setUser({
        name: '',
        email: '',
        contactNumber: '',
        role: '',
        status: 'true',
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (user.isSubmitting) {
      return;
    }
    
    // Validate required fields
    if (!user.name || user.name.trim() === '') {
      return;
    }
    if (!user.email || user.email.trim() === '') {
      return;
    }
    
    try {
      await onSave(user);
    } catch (error) {
      // Error is already handled in the parent component
      console.error('Error in form submission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} paddingTop={1}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={user.name}
          onChange={handleChange}
          required
        />
        
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleChange}
          required
          disabled={!!selectedUser} // Email cannot be changed
        />
        
        <TextField
          fullWidth
          label="Contact Number"
          name="contactNumber"
          value={user.contactNumber}
          onChange={handleChange}
        />
        
        <FormControl fullWidth>
          <InputLabel id="role-label" style={{ backgroundColor: 'white', padding: '0 4px' }}>Role *</InputLabel>
          <Select
            labelId="role-label"
            name="role"
            value={user.role}
            onChange={handleChange}
            required
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth>
          <InputLabel id="status-label" style={{ backgroundColor: 'white', padding: '0 4px' }}>Status *</InputLabel>
          <Select
            labelId="status-label"
            name="status"
            value={user.status}
            onChange={handleChange}
            required
          >
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>
      
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
        >
          {selectedUser ? 'Update' : 'Add'} User
        </Button>
      </Stack>
    </form>
  );
};

export default UserForm;

