import * as React from 'react';
import { alpha, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../components/AppNavbar';
import SideMenu from '../components/SideMenu';
import theme from '../theme'; // Assuming you have a theme.js file exporting your MUI theme
import UserManagement from '../components/UserManagement';

const UsersScreen = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        
        <AppNavbar />
        <SideMenu />
        {/* Contenu principal */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <UserManagement />
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default UsersScreen;