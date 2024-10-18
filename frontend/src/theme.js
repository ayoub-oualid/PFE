import { createTheme } from '@mui/material/styles';
import { frFR } from '@mui/material/locale';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6f00',
      light: '#ff943d', // Added light variant
      dark: '#c43e00', // Added dark variant
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff9f45',
      light: '#ffcf74',
      dark: '#c87015',
      contrastText: '#000000',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', // Prevents all-caps buttons
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 24px',
          transition: 'all 0.3s ease',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#ff9f45',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(255, 111, 0, 0.2)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#ec6e15',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#ff6f00',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
        },
      },
    },
  },
}, frFR); // Add French locale

export default theme;