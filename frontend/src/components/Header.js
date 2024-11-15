// src/components/Header.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Switch } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { ThemeContext } from '../contexts/ThemeContext';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Header({ userFirstName }) {
  const navigate = useNavigate();
  const { toggleTheme, mode } = useContext(ThemeContext);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const firstName = authService.getCurrentUser().userFirstName;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
        </Typography>
        <Typography variant="body1" sx={{ marginRight: 2 }}>
          Welcome, {firstName}
        </Typography>
        <Switch
          checked={mode === 'dark'}
          onChange={toggleTheme}
          color="default"
          inputProps={{ 'aria-label': 'theme toggle' }}
        />
        <IconButton color="inherit" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
