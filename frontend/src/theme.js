import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E88E5',      // Bleu plus vif
      light: '#64B5F6',
      dark: '#0D47A1',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF6D00',      // Orange vif
      light: '#FF9E40',
      dark: '#E65100',
      contrastText: '#fff',
    },
    success: {
      main: '#00C853',      // Vert vif
      light: '#69F0AE',
      dark: '#00A047',
    },
    warning: {
      main: '#FFD600',      // Jaune vif
      light: '#FFFF52',
      dark: '#C7A500',
      contrastText: '#000',
    },
    error: {
      main: '#FF1744',      // Rouge vif
      light: '#FF5252',
      dark: '#D50000',
      contrastText: '#fff',
    },
    info: {
      main: '#00B0FF',      // Bleu ciel vif
      light: '#80D8FF',
      dark: '#0091EA',
      contrastText: '#fff',
    },
    background: {
      default: '#F9FAFC',   // Fond légèrement plus clair
      paper: '#ffffff',
    },
    action: {
      active: '#0D47A1',
      hover: 'rgba(30, 136, 229, 0.08)',
      selected: 'rgba(30, 136, 229, 0.16)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
        elevation2: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 16,
          '&:last-child': {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(30, 136, 229, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(30, 136, 229, 0.2)',
            },
          },
        },
      },
    },
  },
});

export default theme;