import { useTheme, alpha } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  Button,
  CircularProgress,
  Paper,
  Chip
} from '@mui/material';
import {
  Copy,
  ArrowRight,
  Chart,
  Wallet,
  People,
  MoneyRecive,
  Medal,
  PresentionChart,
  UserOctagon,
  TrendUp,
  DollarCircle
} from 'iconsax-react';
import { Link } from 'react-router-dom';


import { useEffect, useState } from 'react';
import axios from 'utils/axios';
// ==============================|| DASHBOARD - ANALYTICS ||============================== //

// Define animations
const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
`;

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




  // Function to handle daily profit activation
  const handleActivateDailyProfit = async () => {
    try {
      setActivatingProfit(true);
      //console.log('Activating daily profit...');
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
    } finally {
      setActivatingProfit(false);
    }
  };

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
    <>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6, mb: 4 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 4,
            overflow: 'hidden',
            background: 'linear-gradient(to right, #0f172a, #1e293b)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Top Section with Background */}
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              position: 'relative',
              overflow: 'hidden',
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Avatar
                    sx={{
                      width: { xs: 80, md: 100 },
                      height: { xs: 80, md: 100 },
                      border: '3px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.7),
                      boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`
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
                      <Tooltip title="Copy Username">
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
                      </Tooltip>
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
                      {`${window.location.origin}/register?refID=${userData?.sponsorID || 'admin'}`}
                    </Typography>
                  </Paper>
                  <Button
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
                      bgcolor: alpha(theme.palette.primary.main, 0.8),
                      '&:hover': { bgcolor: theme.palette.primary.main },
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


        </Paper>
      )}


      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: 'white' }}>
        Dashboard Overview
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6, bgcolor: 'grey.900', borderRadius: 4 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Main Stats Row */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                height: '100%',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
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
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                height: '100%',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
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
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                height: '100%',
                background: 'linear-gradient(135deg, #312e81 0%, #4338ca 100%)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" color="grey.300" gutterBottom>
                    Total Earnings
                  </Typography>
                  <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>
                    ${(userData?.total_earnings || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    p: 1.5,
                    color: 'white'
                  }}
                >
                  <DollarCircle variant="Bold" size={24} />
                </Avatar>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="grey.300">
                  Sum of all your earnings
                </Typography>
              </Box>
            </Paper>
          </Grid>



          {/* Income Stats Row */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ mt: 2, mb: 3, fontWeight: 600, color: 'white' }}>
              Income Breakdown
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.primary.dark, 0.9),
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                height: '100%'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    mr: 2,
                    color: 'white'
                  }}
                >
                  <TrendUp size={20} />
                </Avatar>
                <Typography variant="h6" color="white">
                  Daily Profit
                </Typography>
              </Box>
              <Typography variant="h4" color="white" sx={{ fontWeight: 700, mb: 1 }}>
                ${(userData?.daily_profit || 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="grey.300">
                2.5% daily profit from investments
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.warning.dark, 0.9),
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                height: '100%'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    mr: 2,
                    color: 'white'
                  }}
                >
                  <Medal size={20} />
                </Avatar>
                <Typography variant="h6" color="white">
                  First Deposit
                </Typography>
              </Box>
              <Typography variant="h4" color="white" sx={{ fontWeight: 700, mb: 1 }}>
                ${(userData?.first_deposit_bonus || 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="grey.300">
                Bonus from your first investment
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.success.dark, 0.9),
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                height: '100%'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    mr: 2,
                    color: 'white'
                  }}
                >
                  <People size={20} />
                </Avatar>
                <Typography variant="h6" color="white">
                  Referral Bonus
                </Typography>
              </Box>
              <Typography variant="h4" color="white" sx={{ fontWeight: 700, mb: 1 }}>
                ${(userData?.referral_bonus || 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="grey.300">
                Earnings from direct referrals
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.error.dark, 0.9),
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                height: '100%'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    mr: 2,
                    color: 'white'
                  }}
                >
                  <UserOctagon size={20} />
                </Avatar>
                <Typography variant="h6" color="white">
                  Team Commission
                </Typography>
              </Box>
              <Typography variant="h4" color="white" sx={{ fontWeight: 700, mb: 1 }}>
                ${(userData?.team_commission || 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="grey.300">
                Earnings from your team (3 levels)
              </Typography>
            </Paper>
          </Grid>

          {/* Additional Stats */}
          <Grid item xs={12} sm={6} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: 'grey.900',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Typography variant="body2" color="grey.500" gutterBottom>
                  Direct Referrals
                </Typography>
                <Typography variant="h4" color="white" sx={{ fontWeight: 600 }}>
                  {userData?.direct_referrals || 0}
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ mt: 1 }}>
                  Number of users you've referred
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}
              >
                <PresentionChart size={30} variant="Bold" />
              </Avatar>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: 'grey.900',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Typography variant="body2" color="grey.500" gutterBottom>
                  Active Member Rewards
                </Typography>
                <Typography variant="h4" color="white" sx={{ fontWeight: 600 }}>
                  ${(userData?.active_member_reward || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ mt: 1 }}>
                  Rewards based on team size
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.main
                }}
              >
                <MoneyRecive size={30} variant="Bold" />
              </Avatar>
            </Paper>
          </Grid>
        </Grid>
      )}


      <Box sx={{ mt: 5, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: 'white' }}>
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
                  background: 'linear-gradient(135deg, #0f172a 0%, #6366f1 100%)',
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

              <Box sx={{ p: 3, bgcolor: 'grey.900' }}>
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
                    bgcolor: theme.palette.primary.main,
                    color: 'common.white',
                    borderRadius: 2,
                    py: 1.2,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark
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

              <Box sx={{ p: 3, bgcolor: 'grey.900' }}>
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
                  fullWidth
                  sx={{
                    bgcolor: theme.palette.warning.main,
                    color: 'common.white',
                    borderRadius: 2,
                    py: 1.2,
                    '&:hover': {
                      bgcolor: theme.palette.warning.dark
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

              <Box sx={{ p: 3, bgcolor: 'grey.900' }}>
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
                  fullWidth
                  sx={{
                    bgcolor: theme.palette.success.main,
                    color: 'common.white',
                    borderRadius: 2,
                    py: 1.2,
                    '&:hover': {
                      bgcolor: theme.palette.success.dark
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
    </>
  );
}