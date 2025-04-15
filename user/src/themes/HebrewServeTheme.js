import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { ThemeMode } from 'config';

// Define color palette - simpler combination
const primaryColor = '#3b82f6'; // Blue
const secondaryColor = '#64748b'; // Slate
const successColor = '#22c55e'; // Green
const warningColor = '#f59e0b'; // Amber
const errorColor = '#ef4444'; // Red
const infoColor = '#0ea5e9'; // Sky

// Create custom shadows
const customShadows = (mode) => ({
  z1: mode === ThemeMode.DARK
    ? `0px 8px 24px rgba(0, 0, 0, 0.3)`
    : `0px 8px 24px rgba(0, 0, 0, 0.08)`,
  z2: mode === ThemeMode.DARK
    ? `0px 2px 8px rgba(0, 0, 0, 0.3)`
    : `0px 2px 8px rgba(0, 0, 0, 0.08)`,
  primary: `0 0 0 2px ${alpha(primaryColor, 0.1)}`,
  secondary: `0 0 0 2px ${alpha(secondaryColor, 0.2)}`,
  error: `0 0 0 2px ${alpha(errorColor, 0.2)}`,
  warning: `0 0 0 2px ${alpha(warningColor, 0.2)}`,
  info: `0 0 0 2px ${alpha(infoColor, 0.2)}`,
  success: `0 0 0 2px ${alpha(successColor, 0.2)}`,
  grey: `0 0 0 2px ${alpha(secondaryColor, 0.2)}`,
  primaryButton: `0 14px 12px ${alpha(primaryColor, 0.2)}`,
  secondaryButton: `0 14px 12px ${alpha(secondaryColor, 0.2)}`,
  errorButton: `0 14px 12px ${alpha(errorColor, 0.2)}`,
  warningButton: `0 14px 12px ${alpha(warningColor, 0.2)}`,
  infoButton: `0 14px 12px ${alpha(infoColor, 0.2)}`,
  successButton: `0 14px 12px ${alpha(successColor, 0.2)}`,
  greyButton: `0 14px 12px ${alpha(secondaryColor, 0.2)}`
});

// Create theme
const HebrewServeTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryColor,
      light: alpha(primaryColor, 0.8),
      dark: '#4338ca',
      contrastText: '#ffffff'
    },
    secondary: {
      main: secondaryColor,
      light: alpha(secondaryColor, 0.8),
      dark: '#ea580c',
      contrastText: '#ffffff'
    },
    success: {
      main: successColor,
      light: alpha(successColor, 0.8),
      dark: '#059669',
      contrastText: '#ffffff'
    },
    warning: {
      main: warningColor,
      light: alpha(warningColor, 0.8),
      dark: '#d97706',
      contrastText: '#ffffff'
    },
    error: {
      main: errorColor,
      light: alpha(errorColor, 0.8),
      dark: '#dc2626',
      contrastText: '#ffffff'
    },
    info: {
      main: infoColor,
      light: alpha(infoColor, 0.8),
      dark: '#2563eb',
      contrastText: '#ffffff'
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
      dark: '#0f172a',
      light: '#334155'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      disabled: '#64748b'
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      A100: '#cbd5e1',
      A200: '#94a3b8',
      A400: '#64748b',
      A700: '#334155'
    },
    divider: alpha('#cbd5e1', 0.12)
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      textTransform: 'none'
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.5
    },
    overline: {
      fontWeight: 600,
      fontSize: '0.75rem',
      lineHeight: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.1)',
    '0px 4px 8px rgba(0, 0, 0, 0.12)',
    '0px 6px 12px rgba(0, 0, 0, 0.14)',
    '0px 8px 16px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.18)',
    '0px 12px 24px rgba(0, 0, 0, 0.2)',
    '0px 14px 28px rgba(0, 0, 0, 0.22)',
    '0px 16px 32px rgba(0, 0, 0, 0.24)',
    '0px 18px 36px rgba(0, 0, 0, 0.26)',
    '0px 20px 40px rgba(0, 0, 0, 0.28)',
    '0px 22px 44px rgba(0, 0, 0, 0.3)',
    '0px 24px 48px rgba(0, 0, 0, 0.32)',
    '0px 26px 52px rgba(0, 0, 0, 0.34)',
    '0px 28px 56px rgba(0, 0, 0, 0.36)',
    '0px 30px 60px rgba(0, 0, 0, 0.38)',
    '0px 32px 64px rgba(0, 0, 0, 0.4)',
    '0px 34px 68px rgba(0, 0, 0, 0.42)',
    '0px 36px 72px rgba(0, 0, 0, 0.44)',
    '0px 38px 76px rgba(0, 0, 0, 0.46)',
    '0px 40px 80px rgba(0, 0, 0, 0.48)',
    '0px 42px 84px rgba(0, 0, 0, 0.5)',
    '0px 44px 88px rgba(0, 0, 0, 0.52)',
    '0px 46px 92px rgba(0, 0, 0, 0.54)',
    '0px 48px 96px rgba(0, 0, 0, 0.56)'
  ],
  customShadows: customShadows('dark'),
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          padding: '8px 16px',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
          }
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)'
          }
        },
        containedPrimary: {
          backgroundColor: primaryColor,
          '&:hover': {
            backgroundColor: '#1d4ed8' // Darker blue
          }
        },
        containedSecondary: {
          backgroundColor: secondaryColor,
          '&:hover': {
            backgroundColor: '#475569' // Darker slate
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.16)',
          overflow: 'hidden',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.2)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none'
        },
        elevation1: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)'
        },
        elevation2: {
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.14)'
        },
        elevation3: {
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.16)'
        },
        elevation4: {
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.18)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
          backgroundImage: 'none'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: alpha('#cbd5e1', 0.12)
        },
        head: {
          fontWeight: 600,
          backgroundColor: alpha('#1e293b', 0.6)
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)'
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: alpha('#0f172a', 0.9),
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
          fontSize: '0.75rem',
          padding: '8px 12px',
          borderRadius: 8
        }
      }
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#0f172a', 0.8),
          backdropFilter: 'blur(4px)'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.24)'
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha('#cbd5e1', 0.12)
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6
        }
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        circle: {
          strokeLinecap: 'round'
        }
      }
    }
  }
});

export default HebrewServeTheme;
