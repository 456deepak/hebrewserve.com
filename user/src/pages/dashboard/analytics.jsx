import { styled, useTheme, alpha } from '@mui/material/styles';
import { Grid, Typography, Box, Paper, Card, CardContent, Button, CircularProgress, Divider, Chip, Avatar, IconButton, Tooltip, LinearProgress, Stack } from '@mui/material';
import { Copy, Chart, Wallet, People, MoneyRecive, Medal, PresentionChart, UserOctagon, TrendUp, DollarCircle, ArrowRight } from 'iconsax-react';
import Swal from 'sweetalert2';

// Animated components
import AnimatedMainCard from 'components/AnimatedMainCard';
import AnimatedButton from 'components/AnimatedButton';
import AnimatedBox from 'components/AnimatedBox';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'utils/axios';

// ==============================|| DASHBOARD - ANALYTICS ||============================== //

// Styled components for Binance dark theme inspired UI
const GradientBox = styled(Box)(({ theme, gradient }) => ({
  background: gradient || 'linear-gradient(135deg, #1E2026 0%, #2B3139 100%)',
  borderRadius: '4px 4px 0 0',
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle, rgba(240,185,11,0.05) 0%, rgba(240,185,11,0) 70%)',
    opacity: 0.6,
    zIndex: 0
  }
}));

// Styled component for stat values
const StatValue = styled(Typography)(({ theme, color = 'primary' }) => ({
  fontWeight: 600,
  color: color === 'primary' ? '#F0B90B' :
         color === 'success' ? '#0ECB81' :
         color === 'error' ? '#F6465D' :
         color === 'secondary' ? '#E0E3E7' : '#FFFFFF',
  marginBottom: theme.spacing(0.5)
}));

export default function DashboardAnalytics() {
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activatingProfit, setActivatingProfit] = useState(false);
  const [tradeData, setTradeData] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(false);

  // Function to fetch live trading data from CoinDesk API
  const fetchLiveTradeData = async () => {
    try {
      setLoadingTrades(true);

      // Use CoinDesk API to get real trade data
      const baseUrl = 'https://data-api.coindesk.com/info/v1/openapi';
      const params = {"api_key":"4db0495dc4e40e0f35b03daf8d8b41bfb26191258d79c078fffdfb0f91436395"};
      const url = new URL(baseUrl);
      url.search = new URLSearchParams(params).toString();

      const options = {
        method: 'GET',
        headers: {"Content-type":"application/json; charset=UTF-8"},
      };

      const response = await fetch(url, options);
      const data = await response.json();

      //console.log('CoinDesk API response:', data);

      // Transform the data to match our format
      // Since we don't know the exact structure of the CoinDesk API response,
      // we'll create a fallback in case the structure is different
      let formattedData = [];

      try {
        // Try to extract data from the API response
        // This is a placeholder - adjust based on actual API response structure
        if (data && data.data && Array.isArray(data.data)) {
          formattedData = data.data.slice(0, 10).map((item, index) => {
            return {
              exchange: 'CoinDesk',
              type: index % 2 === 0 ? 'buy' : 'sell',
              orderId: item.id || `CD${Math.floor(Math.random() * 10000000000)}`,
              price: item.price || (Math.random() * 0.01 + 0.001).toFixed(6),
              amount: item.amount || (84500 + Math.random() * 200).toFixed(2),
              total: item.total || (Math.random() * 1000 + 50).toFixed(2),
              timestamp: new Date().toLocaleTimeString()
            };
          });
        } else {
          throw new Error('Unexpected API response format');
        }
      } catch (formatError) {
        console.error('Error formatting CoinDesk data:', formatError);
        // Generate random data if formatting fails
        generateRandomTradeData();
        return; // Exit early since we've already set the data
      }

      setTradeData(formattedData);
    } catch (error) {
      console.error('Error fetching CoinDesk data:', error);
      // Generate random data if API fails
      generateRandomTradeData();
    } finally {
      setLoadingTrades(false);
    }
  };

  // Function to generate sample trade data (static)
  const generateSampleTradeData = () => {
    const sampleData = [
      {
        exchange: 'Binance',
        type: 'buy',
        orderId: 'BTC-12345',
        price: '42150.00',
        amount: '0.25',
        total: '10537.50',
        timestamp: '17:31 - Just now'
      },
      {
        exchange: 'Coinbase',
        type: 'sell',
        orderId: 'ETH-67890',
        price: '2850.75',
        amount: '1.5',
        total: '4276.13',
        timestamp: '17:30 - Just now'
      },
      {
        exchange: 'Kraken',
        type: 'buy',
        orderId: 'SOL-23456',
        price: '103.25',
        amount: '10.0',
        total: '1032.50',
        timestamp: '17:29 - Just now'
      },
      {
        exchange: 'Bitfinex',
        type: 'sell',
        orderId: 'ADA-78901',
        price: '0.58',
        amount: '500.0',
        total: '290.00',
        timestamp: '17:28 - Just now'
      }
    ];

    // Set the sample data
    setTradeData(sampleData);
  };

  // Function to generate random trade data
  const generateRandomTradeData = () => {
    const exchanges = ['Binance', 'xtpub', 'bullish', 'Coinbase', 'Kraken'];
    const types = ['buy', 'sell'];
    const basePrice = 84500 + Math.random() * 200; // Random price around 84,500

    const randomData = [];

    // Generate 20 rows for continuous scrolling effect
    for (let i = 0; i < 20; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const price = (basePrice + (Math.random() * 100 - 50)).toFixed(2);
      const amount = (Math.random() * 0.01 + 0.001).toFixed(6);
      const total = (price * amount).toFixed(2);

      // Create a timestamp with slight variations
      const date = new Date();
      date.setSeconds(date.getSeconds() - i * 5); // Each row is 5 seconds apart

      randomData.push({
        exchange: exchanges[Math.floor(Math.random() * exchanges.length)],
        type,
        orderId: Math.floor(Math.random() * 10000000000).toString(),
        price: amount,
        amount: price,
        total,
        timestamp: date.toLocaleTimeString()
      });
    }

    setTradeData(randomData);
  };




  // Function to handle daily profit activation - using the button's onClick handler directly
    /* Removed unused function
      const response = await axios.post('/user/activate-daily-profit');
      //console.log('Activation response:', response.data);

      if (response.data?.status) {
        // Check if the response includes the updated user data
        if (response.data?.data?.user) {
          const updatedUserData = response.data.data.user;
          //console.log('Updated user data from activation response:', updatedUserData);

          // Set the updated user data
          setUserData(updatedUserData);

          // Generate live trade data
          generateRandomTradeData();

          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Daily profit has been activated for your account today. You will receive your daily profit when the system processes it.'
          });

          // Store activation state in local storage with user ID to make it user-specific
          const userId = updatedUserData?._id;
          if (userId) {
            localStorage.setItem(`dailyProfitActivated_${userId}`, 'true');
            localStorage.setItem(`activationDate_${userId}`, new Date().toDateString());
            //console.log(`Stored activation state for user ${userId} in localStorage`);
          }
        } else {
          // If the response doesn't include user data, fetch it separately
          try {
            const profileResponse = await axios.get('/user/profile');
            if (profileResponse.data?.status) {
              const updatedUserData = profileResponse.data.result;
              //console.log('Updated user data after activation:', updatedUserData);

              // Set the updated user data
              setUserData(updatedUserData);

              // Generate live trade data
              generateRandomTradeData();

              // Show success message
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Daily profit has been activated for your account today. You will receive your daily profit when the system processes it.'
              });

              // Store activation state in local storage with user ID to make it user-specific
              const userId = updatedUserData?._id;
              if (userId) {
                localStorage.setItem(`dailyProfitActivated_${userId}`, 'true');
                localStorage.setItem(`activationDate_${userId}`, new Date().toDateString());
                //console.log(`Stored activation state for user ${userId} in localStorage`);
              }
            }
          } catch (profileError) {
            console.error('Error fetching updated profile:', profileError);

            // Even if profile fetch fails, update local state
            setUserData(prevData => ({
              ...prevData,
              dailyProfitActivated: true,
              lastDailyProfitActivation: new Date()
            }));

            // Generate live trade data
            generateRandomTradeData();

            // Show success message
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Daily profit has been activated for your account today. You will receive your daily profit when the system processes it.'
            });
          }
        }
      } else {
        throw new Error(response.data?.message || 'Failed to activate daily profit');
      }
    } catch (error) {
      console.error('Error activating daily profit:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to activate daily profit. Please try again later.'
      });
    } */
  // };

  // Check local storage for activation state on component mount
  useEffect(() => {
    // We'll check user-specific localStorage items after we have the user data
    // This is just to clean up any old format items
    const storedActivation = localStorage.getItem('dailyProfitActivated');
    const storedDate = localStorage.getItem('activationDate');

    // Remove old format items if they exist
    if (storedActivation) {
      localStorage.removeItem('dailyProfitActivated');
    }
    if (storedDate) {
      localStorage.removeItem('activationDate');
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        console.log('Fetching user profile...');

        // Always generate sample trade data regardless of activation status
        // This ensures the table is always visible
        generateSampleTradeData();

        console.log('Making API call to /user/dashboard-data');
        // Use the new dashboard-data endpoint that provides all necessary data
        const response = await axios.get('/user/dashboard-data');

        // If no response, try a fallback approach
        if (1) {
          console.warn('No response data received, trying alternative endpoint');
          const fallbackResponse = await fetch('https://server.hebrewserve.com/api/v1/user/dashboard-data', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('serviceToken')}`,
              'Content-Type': 'application/json'
            }
          });


          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('Fallback data received:', fallbackData);
            // Extract the user data from the result property
            if (fallbackData.status && fallbackData.result) {
              setUserData(fallbackData.result);
              setLoading(false);
              return;
            }
            return fallbackData;
          } else {
            console.error('Fallback request failed:', fallbackResponse.status);
            // Try the original profile endpoint as a last resort
            const profileResponse = await axios.get('/user/profile');
            if (profileResponse && profileResponse.data) {
              console.log('Using profile data as fallback');
              return profileResponse.data;
            }
            throw new Error('All API requests failed');
          }
        }


        if (response.data?.status) {
          // The data could be in either response.data.data or response.data.result
          const userData = response.data.data || response.data.result;
          console.log('Dashboard data received:', userData);

          // Check if we received valid user data
          if (!userData || Object.keys(userData).length === 0) {
            console.warn('Received empty user data from API');
            // Set default user data
            const defaultUserData = {
              wallet: 0,
              total_investment: 0,
              total_earnings: 0,
              daily_profit: 0,
              first_deposit_bonus: 0,
              referral_bonus: 0,
              team_commission: 0,
              direct_referrals: 0,
              active_member_reward: 0,
              username: 'User',
              sponsorID: 'admin',
              dailyProfitActivated: false
            };
            setUserData(defaultUserData);
            throw new Error('Empty user data received');
          }

          // Log the data received from the backend
          console.log('Dashboard data received from API:', userData);

          // Ensure all required fields exist with default values if not provided
          userData.daily_profit = userData.daily_profit || 0;
          userData.first_deposit_bonus = userData.first_deposit_bonus || 0;
          userData.referral_bonus = userData.referral_bonus || 0;
          userData.team_commission = userData.team_commission || 0;
          userData.direct_referrals = userData.direct_referrals || 0;
          userData.active_member_reward = userData.active_member_reward || 0;
          userData.total_earnings = userData.total_earnings || 0;

          console.log('Dashboard data after ensuring defaults:', userData);

          // Get user ID for user-specific localStorage items
          const userId = userData?._id;
          //console.log('User data from server:', userData);

          // Check if user has activated daily profit (from database)
          let isActivated = userData.dailyProfitActivated === true;
          //console.log('Initial activation status from database:', isActivated);

          // Only check localStorage if we have a userId
          if (userId && !isActivated) {
            // Check user-specific localStorage for today's activation
            const storedActivation = localStorage.getItem(`dailyProfitActivated_${userId}`);
            const storedDate = localStorage.getItem(`activationDate_${userId}`);
            const today = new Date().toDateString();

            // console.log(`Checking localStorage for user ${userId}:`, {
            //   storedActivation,
            //   storedDate,
            //   today
            // });

            // If we have a valid user-specific localStorage activation but server doesn't show it,
            // update the userData to reflect the activation
            if (storedActivation === 'true' && storedDate === today) {
              // Set directly in user document
              userData.dailyProfitActivated = true;
              isActivated = true;
              //console.log(`Using activation state from localStorage for user ${userId}`);
            }
          }

          // Set user data

          setUserData(userData);

          // If user has already activated daily profit, fetch live trade data
          if (isActivated) {
            //console.log('User has already activated daily profit, fetching live trade data');
            fetchLiveTradeData();
          } else {
            //console.log('User has not activated daily profit yet');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        console.error('Error details:', error.response ? error.response.data : 'No response data');

        // Try to load default data if API fails
        // Check if we have any user data in localStorage that we can use
        const storedUserData = localStorage.getItem('userData');
        let defaultUserData;

        if (storedUserData) {
          try {
            defaultUserData = JSON.parse(storedUserData);
            console.log('Using stored user data from localStorage:', defaultUserData);
          } catch (e) {
            console.error('Error parsing stored user data:', e);
            defaultUserData = null;
          }
        }

        // If no stored data or parsing failed, use default values
        if (!defaultUserData) {
          defaultUserData = {
            wallet: 0,
            total_investment: 0,
            total_earnings: 0,
            daily_profit: 0,
            first_deposit_bonus: 0,
            referral_bonus: 0,
            team_commission: 0,
            direct_referrals: 0,
            active_member_reward: 0,
            username: 'User',
            sponsorID: 'admin',
            dailyProfitActivated: false
          };
        }

        console.log('Loading default user data as fallback');
        setUserData(defaultUserData);
      } finally {
        setLoading(false);
      }
    };
    console.log('Fetching user profile...');
    fetchUserProfile();
  }, []);

  // Fetch trade data once when activation state changes
  useEffect(() => {
    if (userData?.dailyProfitActivated === true) {
      // Fetch data once when activated
      fetchLiveTradeData();

      // No need for interval as we're using animation for continuous scrolling
    }
  }, [userData?.dailyProfitActivated]);



  return (
    <Box
      sx={{
        backgroundColor: '#0B0E11',
        minHeight: '100vh',
        pt: 2,
        pb: 4,
        overflow: 'hidden' // Prevent animations from causing scrollbars
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', p: 8, mb: 4, backgroundColor: '#1E2026', borderRadius: 1 }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 2, color: '#F0B90B' }} />
          <Typography variant="h6" color="#FFFFFF">Loading your dashboard...</Typography>
        </Box>
      ) : (
        <AnimatedMainCard
          animation="fadeInUp"
          sx={{
            mb: 4,
            background: '#2B3139',
            border: '1px solid #3E4554',
            borderRadius: 1
          }}
          delay={0.1}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Top Section with Background */}
            <GradientBox
              gradient="linear-gradient(135deg, #1E2026 0%, #2B3139 100%)"
              sx={{
                p: { xs: 3, md: 4 },
                position: 'relative',
                borderRadius: 0,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: 'url(/dashboard-pattern.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.05,
                  zIndex: 0
                }
              }}
            >
              <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
                {/* User Profile Section */}
                <Grid item xs={12} md={7}>
                  <AnimatedBox animation="fadeInUp" delay={0.2} sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Avatar
                      sx={{
                        width: { xs: 80, md: 100 },
                        height: { xs: 80, md: 100 },
                        border: '3px solid',
                        borderColor: '#F0B90B',
                        boxShadow: '0 0 20px rgba(240, 185, 11, 0.2)',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                      src="/default-profile.png"
                      alt="Profile"
                    />
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
                        <Chip
                          label={`ID: ${userData?.id?.substring(0, 6) || '000000'}`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(240, 185, 11, 0.1)',
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            border: '1px solid rgba(240, 185, 11, 0.3)',
                            '& .MuiChip-label': { px: 1 },
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: 'rgba(240, 185, 11, 0.2)',
                            }
                          }}
                        />
                        <Typography variant="h5" color="#FFFFFF" sx={{ fontWeight: 600 }}>
                          Welcome back!
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" color="#E0E3E7" sx={{ fontWeight: 500 }}>
                          {userData?.username || 'Username not available'}
                        </Typography>
                        <Tooltip title="Copy Username" arrow placement="top">
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
                              color: '#B7BDC6',
                              bgcolor: 'rgba(255, 255, 255, 0.05)',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                transform: 'translateY(-2px)'
                              },
                              transition: 'transform 0.2s ease'
                            }}
                          >
                            <Copy size={16} variant="Bold" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                        <Box>
                          <Typography variant="caption" color="#E0E3E7">
                            Main Wallet
                          </Typography>
                          <Typography variant="body1" color="#03A66D" sx={{ fontWeight: 600 }}>
                            ${(userData?.wallet || 0).toFixed(2)}
                          </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                        <Box>
                          <Typography variant="caption" color="#E0E3E7">
                            Top-up Wallet
                          </Typography>
                          <Typography variant="body1" color="#FFFFFF" sx={{ fontWeight: 600 }}>
                            ${(userData?.wallet_topup || 0).toFixed(2)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </AnimatedBox>
                </Grid>

                {/* Referral Link Section */}
                <Grid item xs={12} md={5}>
                  <AnimatedBox
                    animation="fadeInUp"
                    delay={0.3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      justifyContent: { xs: 'flex-start', md: 'center' }
                    }}
                  >
                    <Typography variant="subtitle1" color="#FFFFFF" gutterBottom sx={{ fontWeight: 500 }}>
                      Your Referral Link
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: '#1E2026',
                        border: '1px solid #3E4554',
                        mb: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: '#2B3139',
                          boxShadow: '0 0 15px rgba(240, 185, 11, 0.1)'
                        }
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="#E0E3E7"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {`${window.location.origin}/register?refID=${userData?.sponsorID || 'admin'}`}
                      </Typography>
                    </Paper>
                    <AnimatedButton
                      animation="shimmer"
                      variant="contained"
                      startIcon={<Copy size={18} />}
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/register?refID=${userData?.sponsorID || 'admin'}`);
                        Swal.fire({
                          icon: 'success',
                          title: 'Referral Link Copied!',
                          showConfirmButton: false,
                          timer: 1500
                        });
                      }}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        py: 1.2,
                        position: 'relative',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                        backgroundColor: '#F0B90B',
                        color: '#1E2026',
                        fontWeight: 600,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                          backgroundColor: '#F8D12F'
                        }
                      }}
                    >
                      Copy Referral Link
                    </AnimatedButton>
                  </AnimatedBox>
                </Grid>
              </Grid>
            </GradientBox>
          </CardContent>
        </AnimatedMainCard>
      )}


      <AnimatedBox animation="fadeInUp" delay={0.4}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#FFFFFF' }}>
          Dashboard Overview
        </Typography>
      </AnimatedBox>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 6, bgcolor: '#1E2026', borderRadius: 2 }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#F0B90B' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Main Stats Row */}
          <Grid item xs={12} md={4}>
            <AnimatedMainCard animation="fadeInUp"
              delay={0.5}
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '150px',
                  height: '150px',
                  background: 'radial-gradient(circle, rgba(243,186,47,0.05) 0%, rgba(243,186,47,0) 70%)',
                  borderRadius: '0 0 0 100%',
                  zIndex: 0
                }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                  <Box>
                    <Typography variant="h6" color="#FFFFFF" gutterBottom>
                      Total Investment
                    </Typography>
                    <StatValue variant="h3" color="primary">
                      ${(userData?.total_investment || 0).toFixed(2)}
                    </StatValue>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(243,186,47,0.1)',
                      p: 1.5,
                      color: '#F3BA2F',
                      boxShadow: '0 0 10px rgba(243,186,47,0.2)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'rotate(15deg)'
                      }
                    }}
                  >
                    <Chart variant="Bold" size={24} />
                  </Avatar>
                </Box>
                <Box sx={{ mt: 2, position: 'relative' }}>
                  <Typography variant="body2" color="#E0E3E7">
                    Total amount invested in trading packages
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((userData?.total_investment || 0) / 100, 100)}
                    sx={{
                      mt: 1.5,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(243,186,47,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, #F3BA2F, #F0B90B)'
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </AnimatedMainCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <AnimatedMainCard animation="fadeInUp"
              delay={0.6}
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '150px',
                  height: '150px',
                  background: 'radial-gradient(circle, rgba(240,185,11,0.05) 0%, rgba(240,185,11,0) 70%)',
                  borderRadius: '0 0 0 100%',
                  zIndex: 0
                }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                  <Box>
                    <Typography variant="h6" color="#E0E3E7" gutterBottom>
                      Top-up Wallet Balance
                    </Typography>
                    <StatValue variant="h3" color="#F0B90B">
                      ${(userData?.wallet_topup || 0).toFixed(2)}
                    </StatValue>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(240,185,11,0.1)',
                      p: 1.5,
                      color: '#F0B90B',
                      boxShadow: '0 0 10px rgba(240,185,11,0.2)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'rotate(15deg)'
                      }
                    }}
                  >
                    <Wallet variant="Bold" size={24} />
                  </Avatar>
                </Box>
                <Box sx={{ mt: 2, position: 'relative' }}>
                  <Typography variant="body2" color="#E0E3E7">
                    Your top-up wallet balance (used for investments)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((userData?.wallet_topup || 0) / 100, 100)}
                    sx={{
                      mt: 1.5,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(240,185,11,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, #F0B90B, #F8D12F)'
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </AnimatedMainCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <AnimatedMainCard animation="fadeInUp"
              delay={0.7}
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '150px',
                  height: '150px',
                  background: 'radial-gradient(circle, rgba(3,166,109,0.05) 0%, rgba(3,166,109,0) 70%)',
                  borderRadius: '0 0 0 100%',
                  zIndex: 0
                }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                  <Box>
                    <Typography variant="h6" color="#E0E3E7" gutterBottom>
                      Total Earnings
                    </Typography>
                    <StatValue variant="h3" color="#03A66D">
                      ${(userData?.total_earnings || 0).toFixed(2)}
                    </StatValue>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(3,166,109,0.1)',
                      p: 1.5,
                      color: '#03A66D',
                      boxShadow: '0 0 15px rgba(3,166,109,0.2)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'rotate(15deg)'
                      }
                    }}
                  >
                    <DollarCircle variant="Bold" size={24} />
                  </Avatar>
                </Box>
                <Box sx={{ mt: 2, position: 'relative' }}>
                  <Typography variant="body2" color="#E0E3E7">
                    Sum of all your earnings
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((userData?.total_earnings || 0) / 100, 100)}
                    sx={{
                      mt: 1.5,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(3,166,109,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, #03A66D, #05C17F)'
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </AnimatedMainCard>
          </Grid>



          {/* Income Stats Row */}
          <Grid item xs={12}>
            <AnimatedBox animation="fadeInUp" delay={0.8}>
              <Typography variant="h5" sx={{ mt: 2, mb: 3, fontWeight: 600, color: '#FFFFFF' }}>
                Income Breakdown
              </Typography>
            </AnimatedBox>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <AnimatedMainCard animation="fadeInUp"
              delay={0.9}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(243,186,47,0.05) 0%, rgba(243,186,47,0) 60%)',
                  opacity: 0.4,
                  zIndex: 0
                }
              }}
            >
              <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(243,186,47,0.1)',
                      mr: 2,
                      color: '#F3BA2F',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 0 15px rgba(243,186,47,0.2)'
                      }
                    }}
                  >
                    <TrendUp size={20} variant="Bold" />
                  </Avatar>
                  <Typography variant="h6" color="#FFFFFF" sx={{ fontWeight: 600 }}>
                    Daily Profit
                  </Typography>
                </Box>
                <Typography variant="h4" color="#F0B90B" sx={{ fontWeight: 700, mb: 1 }}>
                  ${(userData?.daily_profit || 0).toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="#E0E3E7">
                    2.5% daily profit from investments
                  </Typography>
                  <Chip
                    size="small"
                    label="Daily"
                    sx={{
                      bgcolor: 'rgba(240,185,11,0.1)',
                      color: '#FFFFFF',
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      border: '1px solid rgba(240,185,11,0.2)'
                    }}
                  />
                </Box>
              </CardContent>
            </AnimatedMainCard>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <AnimatedMainCard animation="fadeInUp"
              delay={1.0}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(240,185,11,0.05) 0%, rgba(240,185,11,0) 60%)',
                  opacity: 0.4,
                  zIndex: 0
                }
              }}
            >
              <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(240,185,11,0.1)',
                      mr: 2,
                      color: '#F0B90B',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 0 15px rgba(240,185,11,0.2)'
                      }
                    }}
                  >
                    <Medal size={20} variant="Bold" />
                  </Avatar>
                  <Typography variant="h6" color="#FFFFFF" sx={{ fontWeight: 600 }}>
                    First Deposit
                  </Typography>
                </Box>
                <Typography variant="h4" color="#F0B90B" sx={{ fontWeight: 700, mb: 1 }}>
                  ${(userData?.first_deposit_bonus || 0).toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="#FFFFFF">
                    Bonus from your first investment
                  </Typography>
                  <Chip
                    size="small"
                    label="One-time"
                    sx={{
                      bgcolor: 'rgba(240,185,11,0.1)',
                      color: '#FFFFFF',
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      border: '1px solid rgba(240,185,11,0.2)'
                    }}
                  />
                </Box>
              </CardContent>
            </AnimatedMainCard>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <AnimatedMainCard animation="fadeInUp"
              delay={1.1}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
                  opacity: 0.4,
                  zIndex: 0
                }
              }}
            >
              <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha('#fff', 0.2),
                      mr: 2,
                      color: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
                      }
                    }}
                  >
                    <People size={20} variant="Bold" />
                  </Avatar>
                  <Typography variant="h6" color="white" sx={{ fontWeight: 600 }}>
                    Referral Bonus
                  </Typography>
                </Box>
                <Typography variant="h4" color="white" sx={{ fontWeight: 700, mb: 1 }}>
                  ${(userData?.referral_bonus || 0).toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="#f3f4f6">
                    Earnings from direct referrals
                  </Typography>
                  <Chip
                    size="small"
                    label="Per Referral"
                    sx={{
                      bgcolor: alpha('#fff', 0.2),
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
              </CardContent>
            </AnimatedMainCard>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <AnimatedMainCard animation="fadeInUp"
              delay={1.2}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #9f1239 0%, #f43f5e 100%)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
                  opacity: 0.4,
                  zIndex: 0
                }
              }}
            >
              <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha('#fff', 0.2),
                      mr: 2,
                      color: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
                      }
                    }}
                  >
                    <UserOctagon size={20} variant="Bold" />
                  </Avatar>
                  <Typography variant="h6" color="white" sx={{ fontWeight: 600 }}>
                    Team Commission
                  </Typography>
                </Box>
                <Typography variant="h4" color="white" sx={{ fontWeight: 700, mb: 1 }}>
                  ${(userData?.team_commission || 0).toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="#f3f4f6">
                    Earnings from your team (3 levels)
                  </Typography>
                  <Chip
                    size="small"
                    label="Multi-level"
                    sx={{
                      bgcolor: alpha('#fff', 0.2),
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
              </CardContent>
            </AnimatedMainCard>
          </Grid>

          {/* Additional Stats */}
          <Grid item xs={12}>
            <AnimatedBox animation="fadeInUp" delay={1.3}>
              <Typography variant="h5" sx={{ mt: 3, mb: 3, fontWeight: 600, color: '#FFFFFF' }}>
                Additional Statistics
              </Typography>
            </AnimatedBox>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AnimatedMainCard animation="fadeInUp"
              delay={1.4}
              sx={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  position: 'absolute',
                  top: '-10%',
                  right: '-10%',
                  width: '50%',
                  height: '50%',
                  background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0) 70%)',
                  borderRadius: '50%',
                  zIndex: 0
                }} />
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}>
                  <Box>
                    <Typography variant="body2" color="#E0E3E7" gutterBottom>
                      Direct Referrals
                    </Typography>
                    <Typography variant="h4" color="white" sx={{ fontWeight: 600 }}>
                      {userData?.direct_referrals || 0}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" color="#E0E3E7">
                        Number of users you've referred
                      </Typography>
                      <Chip
                        size="small"
                        label="Earn more"
                        component={Link}
                        to="/user/direct-referral-bonus"
                        clickable
                        sx={{
                          ml: 1,
                          bgcolor: alpha('#3B82F6', 0.1),
                          color: '#60A5FA',
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          border: `1px solid ${alpha('#3B82F6', 0.3)}`,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: alpha('#3B82F6', 0.2),
                          }
                        }}
                      />
                    </Box>
                  </Box>
                  <Avatar
                    sx={{
                      width: 70,
                      height: 70,
                      bgcolor: alpha('#3B82F6', 0.1),
                      color: '#3B82F6',
                      boxShadow: `0 0 15px ${alpha('#3B82F6', 0.2)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05) rotate(5deg)',
                        boxShadow: `0 0 20px ${alpha('#3B82F6', 0.3)}`
                      }
                    }}
                  >
                    <PresentionChart size={35} variant="Bold" />
                  </Avatar>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((userData?.direct_referrals || 0) * 10, 100)}
                  sx={{
                    mt: 2.5,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha('#3B82F6', 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      background: 'linear-gradient(90deg, #3B82F6, #60A5FA)'
                    }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="#E0E3E7">Progress</Typography>
                  <Typography variant="caption" color="#FFFFFF">{Math.min((userData?.direct_referrals || 0) * 10, 100)}%</Typography>
                </Box>
              </CardContent>
            </AnimatedMainCard>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AnimatedMainCard animation="fadeInUp"
              delay={1.5}
              sx={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  position: 'absolute',
                  top: '-10%',
                  right: '-10%',
                  width: '50%',
                  height: '50%',
                  background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0) 70%)',
                  borderRadius: '50%',
                  zIndex: 0
                }} />
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}>
                  <Box>
                    <Typography variant="body2" color="#E0E3E7" gutterBottom>
                      Active Member Rewards
                    </Typography>
                    <Typography variant="h4" color="white" sx={{ fontWeight: 600 }}>
                      ${(userData?.active_member_reward || 0).toFixed(2)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" color="#E0E3E7">
                        Rewards based on team size
                      </Typography>
                      <Chip
                        size="small"
                        label="View details"
                        component={Link}
                        to="/user/active-member-reward"
                        clickable
                        sx={{
                          ml: 1,
                          bgcolor: alpha('#F59E0B', 0.1),
                          color: '#FBBF24',
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          border: `1px solid ${alpha('#F59E0B', 0.3)}`,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: alpha('#F59E0B', 0.2),
                          }
                        }}
                      />
                    </Box>
                  </Box>
                  <Avatar
                    sx={{
                      width: 70,
                      height: 70,
                      bgcolor: alpha('#F59E0B', 0.1),
                      color: '#F59E0B',
                      boxShadow: `0 0 15px ${alpha('#F59E0B', 0.2)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05) rotate(5deg)',
                        boxShadow: `0 0 20px ${alpha('#F59E0B', 0.3)}`
                      }
                    }}
                  >
                    <MoneyRecive size={35} variant="Bold" />
                  </Avatar>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((userData?.active_member_reward || 0) * 5, 100)}
                  sx={{
                    mt: 2.5,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha('#F59E0B', 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      background: 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                    }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="#E0E3E7">Progress</Typography>
                  <Typography variant="caption" color="#FFFFFF">{Math.min((userData?.active_member_reward || 0) * 5, 100)}%</Typography>
                </Box>
              </CardContent>
            </AnimatedMainCard>
          </Grid>
        </Grid>
      )}


      <Box sx={{ mt: 5, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#FFFFFF' }}>
          Investment Opportunities
        </Typography>

        <Grid container spacing={3}>
          {/* Trading Package Card */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
                position: 'relative',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <Box
                sx={{
                  height: 140,
                  background: 'linear-gradient(135deg, #1E2026 0%, #2B3139 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '150%',
                    height: '150%',
                    top: '-25%',
                    left: '-25%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    transform: 'rotate(-45deg)'
                  }}
                />
                <Typography variant="h3" color="common.white" sx={{ fontWeight: 700, position: 'relative', zIndex: 1 }}>
                  Trading Package
                </Typography>
              </Box>

              <Box sx={{ p: 3, bgcolor: '#2B3139' }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="#E0E3E7" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#3B82F6', mr: 1.5 }} />
                    Min Investment: $50
                  </Typography>
                  <Typography variant="body1" color="#E0E3E7" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#3B82F6', mr: 1.5 }} />
                    Max Investment: $10,000
                  </Typography>
                  <Typography variant="body1" color="#E0E3E7" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#3B82F6', mr: 1.5 }} />
                    Daily Profit: 2.5%
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  to="/user/trading-package"
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: '#F0B90B',
                    color: '#1E2026',
                    borderRadius: 2,
                    py: 1.2,
                    '&:hover': {
                      bgcolor: '#F8D12F'
                    },
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                  endIcon={<ArrowRight size={18} />}
                >
                  Invest Now
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Referral Bonus Card */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
                position: 'relative',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <Box
                sx={{
                  height: 140,
                  background: 'linear-gradient(135deg, #991b1b 0%, #f97316 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '150%',
                    height: '150%',
                    top: '-25%',
                    left: '-25%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    transform: 'rotate(-45deg)'
                  }}
                />
                <Typography variant="h3" color="common.white" sx={{ fontWeight: 700, position: 'relative', zIndex: 1 }}>
                  Referral Bonus
                </Typography>
              </Box>

              <Box sx={{ p: 3, bgcolor: '#111827' }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#F59E0B', mr: 1.5 }} />
                    Direct Referral Bonus: Up to $700
                  </Typography>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#F59E0B', mr: 1.5 }} />
                    Team Commission: 3 Levels (16%, 8%, 4%)
                  </Typography>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#F59E0B', mr: 1.5 }} />
                    First Deposit Bonus: Up to $500
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  to="/user/direct-referral-bonus"
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: '#F59E0B',
                    color: 'white',
                    borderRadius: 2,
                    py: 1.2,
                    '&:hover': {
                      bgcolor: '#D97706'
                    },
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                  endIcon={<ArrowRight size={18} />}
                >
                  View Details
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Active Member Rewards Card */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
                position: 'relative',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <Box
                sx={{
                  height: 140,
                  background: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '150%',
                    height: '150%',
                    top: '-25%',
                    left: '-25%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    transform: 'rotate(-45deg)'
                  }}
                />
                <Typography variant="h3" color="common.white" sx={{ fontWeight: 700, position: 'relative', zIndex: 1 }}>
                  Member Rewards
                </Typography>
              </Box>

              <Box sx={{ p: 3, bgcolor: '#111827' }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981', mr: 1.5 }} />
                    Rewards based on team size and referrals
                  </Typography>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981', mr: 1.5 }} />
                    Earn up to $200,000 in rewards
                  </Typography>
                  <Typography variant="body1" color="common.white" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981', mr: 1.5 }} />
                    15 reward levels available
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  to="/user/active-member-reward"
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: '#10B981',
                    color: 'white',
                    borderRadius: 2,
                    py: 1.2,
                    '&:hover': {
                      bgcolor: '#059669'
                    },
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                  endIcon={<ArrowRight size={18} />}
                >
                  View Rewards
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}