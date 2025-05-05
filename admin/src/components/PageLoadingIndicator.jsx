import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Fade, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

// This component shows a loading indicator during page transitions
const PageLoadingIndicator = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  
  // Track location changes to show loading indicator
  useEffect(() => {
    // Start loading
    setIsLoading(true);
    
    // Set a minimum display time to avoid flickering for fast loads
    const minDisplayTimer = setTimeout(() => {
      if (isLoading) {
        setShowIndicator(true);
      }
    }, 300); // Show indicator after 300ms of loading
    
    // Set a timeout to simulate completion if it takes too long
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
      setShowIndicator(false);
    }, 5000); // Max 5 seconds of loading indicator
    
    // Simulate page load completion
    const loadCompleteTimer = setTimeout(() => {
      setIsLoading(false);
      // Keep indicator visible briefly after load completes
      setTimeout(() => {
        setShowIndicator(false);
      }, 300);
    }, 800); // Simulate load completion after 800ms
    
    // Cleanup timers
    return () => {
      clearTimeout(minDisplayTimer);
      clearTimeout(loadingTimeout);
      clearTimeout(loadCompleteTimer);
    };
  }, [location.pathname]); // Re-run when route changes
  
  // Don't render anything if not showing indicator
  if (!showIndicator) return null;
  if(showIndicator)return null;
  return (
    <Fade in={showIndicator}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '8px',
          backgroundColor: (theme) => theme.palette.primary.main,
          color: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
        {/* <Typography variant="body2">Loading page...</Typography> */}
      </Box>
    </Fade>
  );
};

export default PageLoadingIndicator;
