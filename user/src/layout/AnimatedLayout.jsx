import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useTheme, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeIn } from '../utils/animations';

// Styled components
const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden'
}));

const BackgroundPattern = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
  backgroundSize: '30px 30px',
  pointerEvents: 'none',
  zIndex: 0
}));

const GradientOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `radial-gradient(circle at 20% 20%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 40%), 
               radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 40%)`,
  pointerEvents: 'none',
  zIndex: 0
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  opacity: 0,
  animation: `${fadeIn} 0.6s forwards ease-out`
}));

const AnimatedLayout = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PageWrapper>
      <BackgroundPattern />
      <GradientOverlay />
      
      <ContentWrapper>
        {!isLoading && (
          <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, flex: 1 }}>
            <Outlet />
          </Container>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
};

export default AnimatedLayout;
