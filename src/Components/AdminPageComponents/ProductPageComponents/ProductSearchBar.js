import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = ({ onSearch, value: controlledValue }) => {
  const [localValue, setLocalValue] = useState('');
  const value = controlledValue !== undefined ? controlledValue : localValue;

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setLocalValue(newValue);
    }
    if (onSearch) {
      onSearch(newValue);
    }
  };

  return (
    <TextField 
      style={{ paddingRight: '10px'}}
      placeholder="Search products by name or description..."
      value={value}
      onChange={handleChange}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
