import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { useTheme, alpha, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { CircularProgress } from '@mui/material';

// animations
import { fadeIn, fadeInUp } from 'utils/animations';

// project-imports
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import HorizontalBar from './Drawer/HorizontalBar';
import Loader from 'components/Loader';
import AddCustomer from 'sections/apps/customer/AddCustomer';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import AuthGuard from 'utils/route-guard/AuthGuard';

import { DRAWER_WIDTH, MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// Styled components for animations
const AnimatedContainer = styled(Container)(({ theme }) => ({
  opacity: 0,
  animation: `${fadeIn} 0.6s forwards ease-out`,
  position: 'relative'
}));

const AnimatedBox = styled(Box)(({ theme }) => ({
  opacity: 0,
  animation: `${fadeInUp} 0.8s 0.2s forwards ease-out`,
  position: 'relative'
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

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery(theme.breakpoints.down('xl'));
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { container, miniDrawer, menuOrientation } = useConfig();

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      handlerDrawerOpen(!downXL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  // Add animation loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (menuMasterLoading) return <Loader />;

  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', width: '100%', position: 'relative', overflow: 'hidden' }}>
        <BackgroundPattern />
        <GradientOverlay />

        <Header />
        {!isHorizontal ? <Drawer /> : <HorizontalBar />}

        <Box component="main" sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)`, flexGrow: 1, p: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
          <Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit', mb: isHorizontal ? 2 : 'inherit' }} />

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : (
            <AnimatedContainer
              maxWidth={container ? 'xl' : false}
              sx={{
                xs: 0,
                ...(container && { px: { xs: 0, md: 2 } }),
                position: 'relative',
                minHeight: 'calc(100vh - 110px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Breadcrumbs />
              <AnimatedBox>
                <Outlet />
              </AnimatedBox>
              <Footer />
            </AnimatedContainer>
          )}
        </Box>
        <AddCustomer />
      </Box>
    </AuthGuard>
  );
}
