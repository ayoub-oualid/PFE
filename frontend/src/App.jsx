import React from 'react';
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <Header />
        <ToastContainer />
        <Container sx={{ my: 2 }}>
          <Outlet />
        </Container>
      </React.Fragment>
    </ThemeProvider>
  );
};

export default App;