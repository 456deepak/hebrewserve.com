import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import MainCard from './MainCard';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  }

  handleGoHome = () => {
    window.location.href = '/dashboard/analytics';
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <MainCard>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', p: 3 }}>
            <Typography variant="h3" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', textAlign: 'center' }}>
              We're sorry, but there was an error loading this page. This could be due to a temporary issue or a problem with the application.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" color="primary" onClick={this.handleReload}>
                Reload Page
              </Button>
              <Button variant="outlined" color="secondary" onClick={this.handleGoHome}>
                Go to Dashboard
              </Button>
            </Box>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1, width: '100%', overflow: 'auto' }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Error Details (visible in development mode only):
                </Typography>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                </Typography>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
                  {this.state.errorInfo?.componentStack}
                </Typography>
              </Box>
            )}
          </Box>
        </MainCard>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
