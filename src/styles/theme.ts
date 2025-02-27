import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000', 
    },
    secondary: {
      main: '#FFC107', 
    },
    background: {
      default: '#F8F9FA', 
      paper: '#FFFFFF', 
    },
    text: {
      primary: '#212121', 
      secondary: '#757575', 
    },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none', 
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', 
          padding: '10px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', 
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#212121', 
        },
      },
    },
  },
});
