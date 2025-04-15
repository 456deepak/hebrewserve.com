import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';

// project-imports
import HebrewServeTheme from './HebrewServeTheme';

// ==============================|| HEBREW SERVE THEME - MAIN  ||============================== //

export default function ThemeCustomization({ children }) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={HebrewServeTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ThemeCustomization.propTypes = { children: PropTypes.node };
