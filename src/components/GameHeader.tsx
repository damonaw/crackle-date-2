import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Brightness4, Brightness7, Functions } from '@mui/icons-material';

interface GameHeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <AppBar
      position="static"
      color="primary"
      elevation={0}
      sx={{
        width: '100%',
        margin: 0,
        boxSizing: 'border-box'
      }}
    >
      <Toolbar sx={{
        width: '100%',
        maxWidth: 'none',
        px: 2,
        boxSizing: 'border-box'
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Functions color="inherit" />
          <Typography variant="h5" component="h1" fontWeight="bold">
            Crackle Date
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="inherit" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default GameHeader;