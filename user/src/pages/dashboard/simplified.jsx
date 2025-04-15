import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, useTheme, alpha, Container, Paper, Avatar, Button, Chip, IconButton } from '@mui/material';
import {
  Chart,
  Wallet,
  People,
  MoneyRecive,
  TrendUp,
  DollarCircle,
  Copy,
  ArrowRight,
  Medal
} from 'iconsax-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'utils/axios';

// Animation styles
import { styled, keyframes } from '@mui/material/styles';

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components with animations
const AnimatedBox = styled(Box)(({ theme, delay = 0 }) => ({
  opacity: 0,
  animation: `${fadeInUp} 0.6s ${delay}s forwards ease-out`
}));

const AnimatedPaper = styled(Paper)(({ theme, delay = 0 }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  opacity: 0,
  animation: `${fadeInUp} 0.6s ${delay}s forwards ease-out`,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
  }
}));

const StatCard = styled(Paper)(({ theme, delay = 0, color = 'primary' }) => ({
  borderRadius: 16,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  opacity: 0,
  animation: `${fadeInUp} 0.6s ${delay}s forwards ease-out`,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
  }
}));

const PackageCard = styled(Paper)(({ theme, delay = 0, color = 'primary' }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  height: '100%',
  opacity: 0,
  animation: `${fadeInUp} 0.6s ${delay}s forwards ease-out`,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
  }
}));

const CardHeader = styled(Box)(({ theme, bgcolor = theme.palette.primary.main }) => ({
  padding: theme.spacing(3),
  backgroundColor: bgcolor,
  color: theme.palette.common.white
}));

const CardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper
}));

const SimplifiedDashboard = () => {
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/v1/user/profile');
        if (response.data.success) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCopyReferralLink = () => {
    const referralLink = `${window.location.origin}/login?ref=${userData?.username}`;
    navigator.clipboard.writeText(referralLink);
    Swal.fire({
      icon: 'success',
      title: 'Referral Link Copied!',
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <Container maxWidth="xl">
      {/* Page Title */}
      <AnimatedBox delay={0.1} sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your HebrewServe trading dashboard
        </Typography>
      </AnimatedBox>

      {/* User Profile Card */}
      <AnimatedPaper elevation={3} delay={0.2} sx={{ mb: 4 }}>
        <Box sx={{ p: 3, position: 'relative' }}>
          <Grid container spacing={3}>
            {/* User Profile Section */}
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Avatar
                  sx={{
                    width: { xs: 80, md: 100 },
                    height: { xs: 80, md: 100 },
                    border: '3px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.7)
                  }}
                  src="/default-profile.png"
                  alt="Profile"
                />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
                    <Chip
                      label={`ID: ${userData?.id?.substring(0, 6)}`}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                        color: theme.palette.primary.light,
                        fontWeight: 'bold',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                    <Typography variant="h5" color="common.white" sx={{ fontWeight: 600 }}>
                      Welcome back!
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" color="grey.300" sx={{ fontWeight: 500 }}>
                      {userData?.username || 'Username not available'}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        navigator.clipboard.writeText(userData?.username || '');
                        Swal.fire({
                          icon: 'success',
                          title: 'Username Copied!',
                          showConfirmButton: false,
                          timer: 1500
                        });
                      }}
                      sx={{
                        color: 'grey.400',
                        bgcolor: alpha('#fff', 0.05),
                        '&:hover': { bgcolor: alpha('#fff', 0.1) }
                      }}
                    >
                      <Copy size={16} variant="Bold" />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="grey.400" sx={{ mt: 1 }}>
                    Account Balance: <span style={{ color: theme.palette.success.light, fontWeight: 600 }}>${(userData?.wallet || 0).toFixed(2)}</span>
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Referral Link Section */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  justifyContent: { xs: 'flex-start', md: 'center' }
                }}
              >
                <Typography variant="subtitle1" color="grey.300" gutterBottom sx={{ fontWeight: 500 }}>
                  Your Referral Link
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha('#fff', 0.05),
                    border: `1px solid ${alpha('#fff', 0.1)}`,
                    mb: 2
                  }}
                >
                  <Typography
                    variant="body2"
                    color="grey.300"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {`${window.location.origin}/login?ref=${userData?.username}`}
                  </Typography>
                </Paper>
                <Button
                  variant="contained"
                  startIcon={<Copy size={18} />}
                  onClick={handleCopyReferralLink}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Copy Referral Link
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Bottom Stats Bar */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            borderTop: `1px solid ${alpha('#fff', 0.1)}`,
            bgcolor: alpha('#000', 0.2)
          }}
        >
          <Box
            sx={{
              py: 2,
              px: 3,
              flex: { xs: '0 0 100%', sm: '0 0 50%', md: '0 0 33.333%' },
              borderRight: { xs: 'none', sm: `1px solid ${alpha('#fff', 0.1)}` },
              borderBottom: { xs: `1px solid ${alpha('#fff', 0.1)}`, md: 'none' }
            }}
          >
            <Typography variant="body2" color="grey.500" gutterBottom>
              Total Investment
            </Typography>
            <Typography variant="h6" color="common.white" sx={{ fontWeight: 600 }}>
              ${(userData?.total_investment || 0).toFixed(2)}
            </Typography>
          </Box>

          <Box
            sx={{
              py: 2,
              px: 3,
              flex: { xs: '0 0 100%', sm: '0 0 50%', md: '0 0 33.333%' },
              borderRight: { md: `1px solid ${alpha('#fff', 0.1)}` },
              borderBottom: { xs: `1px solid ${alpha('#fff', 0.1)}`, sm: 'none' }
            }}
          >
            <Typography variant="body2" color="grey.500" gutterBottom>
              Direct Referrals
            </Typography>
            <Typography variant="h6" color="common.white" sx={{ fontWeight: 600 }}>
              {userData?.extra?.directReferrals || 0} users
            </Typography>
          </Box>

          <Box
            sx={{
              py: 2,
              px: 3,
              flex: { xs: '0 0 100%', md: '0 0 33.333%' }
            }}
          >
            <Typography variant="body2" color="grey.500" gutterBottom>
              Total Earnings
            </Typography>
            <Typography variant="h6" color="common.white" sx={{ fontWeight: 600 }}>
              ${(userData?.extra?.totalEarnings || 0).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </AnimatedPaper>

      {/* Main Stats */}
      <AnimatedBox delay={0.3} sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'white' }}>
          Dashboard Overview
        </Typography>

        <Grid container spacing={3}>
          {/* Main Stats Row */}
          <Grid item xs={12} md={4}>
            <StatCard delay={0.4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" color="grey.400" gutterBottom>
                    Total Investment
                  </Typography>
                  <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>
                    ${(userData?.total_investment || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    p: 1.5,
                    color: theme.palette.primary.main
                  }}
                >
                  <Chart variant="Bold" size={24} />
                </Avatar>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="grey.400">
                  Total amount invested in trading packages
                </Typography>
              </Box>
            </StatCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <StatCard delay={0.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" color="grey.400" gutterBottom>
                    Wallet Balance
                  </Typography>
                  <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>
                    ${(userData?.wallet || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                    p: 1.5,
                    color: theme.palette.success.main
                  }}
                >
                  <Wallet variant="Bold" size={24} />
                </Avatar>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="grey.400">
                  Your current wallet balance
                </Typography>
              </Box>
            </StatCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <StatCard delay={0.6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" color="grey.400" gutterBottom>
                    Total Earnings
                  </Typography>
                  <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>
                    ${(userData?.extra?.totalEarnings || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    p: 1.5,
                    color: theme.palette.primary.main
                  }}
                >
                  <DollarCircle variant="Bold" size={24} />
                </Avatar>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="grey.400">
                  Sum of all your earnings
                </Typography>
              </Box>
            </StatCard>
          </Grid>
        </Grid>
      </AnimatedBox>

      {/* Income Stats */}
      <AnimatedBox delay={0.7} sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'white' }}>
          Income Breakdown
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard delay={0.8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    mr: 2,
                    color: theme.palette.primary.main
                  }}
                >
                  <TrendUp size={20} />
                </Avatar>
                <Typography variant="h6" color="white">
                  Daily Profit
                </Typography>
              </Box>
              <Typography variant="h4" color="white" sx={{ fontWeight: 700, mb: 1 }}>
                ${(userData?.extra?.dailyProfit || 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="grey.300">
                2.5% daily profit from investments
              </Typography>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard delay={0.9}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.2),
                    mr: 2,
                    color: theme.palette.warning.main
                  }}
                >
                  <Medal size={20} />
                </Avatar>
                <Typography variant="h6" color="white">
                  First Deposit
                </Typography>
              </Box>
              <Typography variant="h4" color="white" sx={{ fontWeight: 700, mb: 1 }}>
                ${(userData?.extra?.firstDepositBonus || 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="grey.300">
                Bonus from your first investment
              </Typography>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard delay={1.0}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                    mr: 2,
                    color: theme.palette.success.main
                  }}
                >
                  <People size={20} />
                </Avatar>
                <Typography variant="h6" color="white">
                  Referral Bonus
                </Typography>
              </Box>
              <Typography variant="h4" color="white" sx={{ fontWeight: 700, mb: 1 }}>
                ${(userData?.extra?.referralBonus || 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="grey.300">
                Earnings from direct referrals
              </Typography>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard delay={1.1}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    mr: 2,
                    color: theme.palette.primary.main
                  }}
                >
                  <MoneyRecive size={20} />
                </Avatar>
                <Typography variant="h6" color="white">
                  Team Commission
                </Typography>
              </Box>
              <Typography variant="h4" color="white" sx={{ fontWeight: 700, mb: 1 }}>
                ${(userData?.extra?.teamCommission || 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="grey.300">
                Earnings from your team (3 levels)
              </Typography>
            </StatCard>
          </Grid>
        </Grid>
      </AnimatedBox>

      {/* Trading Packages */}
      <AnimatedBox delay={1.2} sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'white' }}>
          Investment Opportunities
        </Typography>

        <Grid container spacing={3}>
          {/* Trading Package Card */}
          <Grid item xs={12} md={4}>
            <PackageCard delay={1.3}>
              <CardHeader bgcolor={theme.palette.primary.main}>
                <Typography variant="h4" color="common.white" sx={{ fontWeight: 700 }}>
                  Trading Package
                </Typography>
              </CardHeader>

              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.primary.main, mr: 1.5 }} />
                    Min Investment: $50
                  </Typography>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.primary.main, mr: 1.5 }} />
                    Max Investment: $10,000
                  </Typography>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.primary.main, mr: 1.5 }} />
                    Daily Profit: 2.5%
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  to="/user/trading-package"
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                  endIcon={<ArrowRight size={18} />}
                >
                  Invest Now
                </Button>
              </CardContent>
            </PackageCard>
          </Grid>

          {/* Referral Bonus Card */}
          <Grid item xs={12} md={4}>
            <PackageCard delay={1.4}>
              <CardHeader bgcolor={theme.palette.warning.main}>
                <Typography variant="h4" color="common.white" sx={{ fontWeight: 700 }}>
                  Referral Bonus
                </Typography>
              </CardHeader>

              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.warning.main, mr: 1.5 }} />
                    Direct Referral Bonus: Up to $700
                  </Typography>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.warning.main, mr: 1.5 }} />
                    Team Commission: 3 Levels (16%, 8%, 4%)
                  </Typography>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.warning.main, mr: 1.5 }} />
                    First Deposit Bonus: Up to $500
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  to="/user/direct-referral-bonus"
                  variant="contained"
                  color="warning"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                  endIcon={<ArrowRight size={18} />}
                >
                  View Details
                </Button>
              </CardContent>
            </PackageCard>
          </Grid>

          {/* Active Member Rewards Card */}
          <Grid item xs={12} md={4}>
            <PackageCard delay={1.5}>
              <CardHeader bgcolor={theme.palette.success.main}>
                <Typography variant="h4" color="common.white" sx={{ fontWeight: 700 }}>
                  Member Rewards
                </Typography>
              </CardHeader>

              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.success.main, mr: 1.5 }} />
                    Rewards based on team size and referrals
                  </Typography>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.success.main, mr: 1.5 }} />
                    Earn up to $200,000 in rewards
                  </Typography>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.success.main, mr: 1.5 }} />
                    15 reward levels available
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  to="/user/active-member-reward"
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                  endIcon={<ArrowRight size={18} />}
                >
                  View Rewards
                </Button>
              </CardContent>
            </PackageCard>
          </Grid>
        </Grid>
      </AnimatedBox>
    </Container>
  );
};

export default SimplifiedDashboard;
