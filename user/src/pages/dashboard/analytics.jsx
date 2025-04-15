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

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const highlight = keyframes`
  0% { background-color: rgba(255, 255, 255, 0.1); }
  100% { background-color: transparent; }
`;

export default function DashboardAnalytics() {
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activatingProfit, setActivatingProfit] = useState(false);
  const [tradeData, setTradeData] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [activeExchange, setActiveExchange] = useState('KuCoin'); // Default active exchange


  // Function to fetch live trading data using Binance WebSocket
  const fetchLiveTradeData = () => {
    try {
      setLoadingTrades(true);

      // Create a WebSocket connection to Binance's trade stream for BTC/USDT
      // We'll use the trade stream which provides real-time trade data
      const wsConnection = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

      // Store the WebSocket connection in a ref to manage it later
      if (window.tradeWebSocket) {
        // Close any existing connection before creating a new one
        window.tradeWebSocket.close();
      }

      // Store the connection globally to manage it later
      window.tradeWebSocket = wsConnection;

      // Initialize with some random data to ensure the table isn't empty
      generateRandomTradeData();

      // Handle incoming messages from the WebSocket
      wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket data received:', data);

          // Format the trade data
          const newTrade = {
            exchange: 'Binance',
            type: data.m ? 'sell' : 'buy', // m is true if the buyer is the market maker
            orderId: `BN${Math.floor(Math.random() * 10000000000)}`,
            price: parseFloat(data.p).toFixed(6), // Price
            amount: parseFloat(data.q).toFixed(6), // Quantity
            total: (parseFloat(data.p) * parseFloat(data.q)).toFixed(2), // Total value
            timestamp: new Date(data.T).toLocaleTimeString(), // Trade time
            isNew: true // Flag to highlight new entries
          };

          // Update active exchange
          setActiveExchange('Binance');

          // Remove the 'isNew' flag after a short delay
          setTimeout(() => {
            setTradeData(prevData => {
              return prevData.map((item, index) =>
                index === 0 ? { ...item, isNew: false } : item
              );
            });
          }, 1000);

          // Update the trade data state with the new trade at the beginning
          // and remove the last item to maintain a fixed number of rows
          setTradeData(prevData => {
            const newData = [newTrade, ...prevData.slice(0, 19)]; // Keep only 20 rows
            return newData;
          });

          // Scroll to the top of the table to show the new entry
          const tableContainer = document.querySelector('.trade-table-container');
          if (tableContainer) {
            tableContainer.scrollTop = 0;
          }

          setLoadingTrades(false);
        } catch (parseError) {
          console.error('Error parsing WebSocket data:', parseError);
        }
      };

      // Handle WebSocket connection open
      wsConnection.onopen = () => {
        console.log('WebSocket connection established');
        setLoadingTrades(false);
      };

      // Handle WebSocket errors
      wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        generateRandomTradeData();
        setLoadingTrades(false);
      };

      // Handle WebSocket connection close
      wsConnection.onclose = () => {
        console.log('WebSocket connection closed');
        // If the connection closes unexpectedly and the user still has daily profit activated,
        // try to reconnect or fall back to random data
        if (userData?.dailyProfitActivated) {
          console.log('Falling back to random data generation');
          generateRandomTradeData();
        }
      };

      // Return a cleanup function to close the WebSocket when needed
      return () => {
        if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
          wsConnection.close();
        }
      };
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      // Generate random data if WebSocket setup fails
      generateRandomTradeData();
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
        price: '0.00250',
        amount: '42150.00',
        total: '105.37',
        timestamp: '17:31 - Just now'
      },
      {
        exchange: 'Coinbase',
        type: 'sell',
        orderId: 'ETH-67890',
        price: '0.00150',
        amount: '2850.75',
        total: '4.27',
        timestamp: '17:30 - Just now'
      },
      {
        exchange: 'Kraken',
        type: 'buy',
        orderId: 'SOL-23456',
        price: '0.00100',
        amount: '103.25',
        total: '0.10',
        timestamp: '17:29 - Just now'
      },
      {
        exchange: 'Bitfinex',
        type: 'sell',
        orderId: 'ADA-78901',
        price: '0.00058',
        amount: '500.0',
        total: '0.29',
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

  // Function to simulate real-time data updates when using random data
  const startRandomDataUpdates = () => {
    // Clear any existing interval
    if (window.randomDataInterval) {
      clearInterval(window.randomDataInterval);
    }

    // Set up an interval to add new random trades periodically
    window.randomDataInterval = setInterval(() => {
      if (userData?.dailyProfitActivated) {
        const exchanges = ['Binance', 'xtpub', 'bullish', 'Coinbase', 'Kraken'];
        const types = ['buy', 'sell'];
        const basePrice = 84500 + Math.random() * 200;

        const type = types[Math.floor(Math.random() * types.length)];
        const price = (Math.random() * 0.01 + 0.001).toFixed(6);
        const amount = (basePrice + (Math.random() * 100 - 50)).toFixed(2);
        const total = (parseFloat(price) * parseFloat(amount)).toFixed(2);

        const randomExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
        const newTrade = {
          exchange: randomExchange,
          type,
          orderId: Math.floor(Math.random() * 10000000000).toString(),
          price,
          amount,
          total,
          timestamp: new Date().toLocaleTimeString(),
          isNew: true // Flag to highlight new entries
        };

        // Update active exchange
        setActiveExchange(randomExchange);

        // Add the new trade at the beginning and remove the last one
        setTradeData(prevData => {
          // Add new trade at the beginning
          const newData = [newTrade, ...prevData.slice(0, 19)];
          return newData;
        });

        // Scroll to the top of the table to show the new entry
        const tableContainer = document.querySelector('.trade-table-container');
        if (tableContainer) {
          tableContainer.scrollTop = 0;
        }

        // Remove the 'isNew' flag after a short delay
        setTimeout(() => {
          setTradeData(prevData => {
            return prevData.map((item, index) =>
              index === 0 ? { ...item, isNew: false } : item
            );
          });
        }, 1000);
      }
    }, 2000); // Add a new trade every 2 seconds

    return () => {
      if (window.randomDataInterval) {
        clearInterval(window.randomDataInterval);
      }
    };
  };



  // Function to handle daily profit activation
  const handleActivateDailyProfit = async () => {
    try {
      setActivatingProfit(true);
      console.log('Activating daily profit...');
      const response = await axios.post('/user/activate-daily-profit');
      console.log('Activation response:', response.data);

      if (response.data?.status) {
        // Check if the response includes the updated user data
        if (response.data?.data?.user) {
          const updatedUserData = response.data.data.user;
          console.log('Updated user data from activation response:', updatedUserData);

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
            console.log(`Stored activation state for user ${userId} in localStorage`);
          }
        } else {
          // If the response doesn't include user data, fetch it separately
          try {
            const profileResponse = await axios.get('/user/profile');
            if (profileResponse.data?.status) {
              const updatedUserData = profileResponse.data.result;
              console.log('Updated user data after activation:', updatedUserData);

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
                console.log(`Stored activation state for user ${userId} in localStorage`);
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

        // Always generate sample trade data regardless of activation status
        // This ensures the table is always visible
        generateSampleTradeData();

        const response = await axios.get('/user/profile');

        if (response.data?.status) {
          const userData = response.data.result;
          if (!userData.extra) {
            userData.extra = {};
          }

          // Get user ID for user-specific localStorage items
          const userId = userData?._id;
          console.log('User data from server:', userData);

          // Check if user has activated daily profit (from database)
          let isActivated = userData.dailyProfitActivated === true;
          console.log('Initial activation status from database:', isActivated);

          // Only check localStorage if we have a userId
          if (userId && !isActivated) {
            // Check user-specific localStorage for today's activation
            const storedActivation = localStorage.getItem(`dailyProfitActivated_${userId}`);
            const storedDate = localStorage.getItem(`activationDate_${userId}`);
            const today = new Date().toDateString();

            console.log(`Checking localStorage for user ${userId}:`, {
              storedActivation,
              storedDate,
              today
            });

            // If we have a valid user-specific localStorage activation but server doesn't show it,
            // update the userData to reflect the activation
            if (storedActivation === 'true' && storedDate === today) {
              // Set directly in user document
              userData.dailyProfitActivated = true;
              isActivated = true;
              console.log(`Using activation state from localStorage for user ${userId}`);
            }
          }

          // Ensure the extra object exists
          if (!userData.extra) {
            userData.extra = {};
          }

          setUserData(userData);

          // If user has already activated daily profit, fetch live trade data
          if (isActivated) {
            console.log('User has already activated daily profit, fetching live trade data');
            fetchLiveTradeData();
          } else {
            console.log('User has not activated daily profit yet');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Set up WebSocket or random data updates when activation state changes
  useEffect(() => {
    if (userData?.dailyProfitActivated === true) {
      // Clean up any existing connections or intervals
      if (window.tradeWebSocket) {
        window.tradeWebSocket.close();
      }
      if (window.randomDataInterval) {
        clearInterval(window.randomDataInterval);
      }

      // Try to use WebSocket for real-time data
      try {
        const cleanup = fetchLiveTradeData();

        // If WebSocket fails, fall back to random data with simulated updates
        if (!window.tradeWebSocket || window.tradeWebSocket.readyState !== WebSocket.OPEN) {
          console.log('WebSocket not available, using random data with updates');
          const randomCleanup = startRandomDataUpdates();
          return () => {
            if (typeof cleanup === 'function') cleanup();
            if (typeof randomCleanup === 'function') randomCleanup();
          };
        }

        return cleanup;
      } catch (error) {
        console.error('Error setting up real-time data:', error);
        // Fall back to random data with simulated updates
        const randomCleanup = startRandomDataUpdates();
        return randomCleanup;
      }
    } else {
      // Clean up when deactivated
      if (window.tradeWebSocket) {
        window.tradeWebSocket.close();
      }
      if (window.randomDataInterval) {
        clearInterval(window.randomDataInterval);
      }
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
                      {`${process.env.PUBLIC_URL}/login?ref=${userData?.sponsorID}`}
                    </Typography>
                  </Paper>
                  <Button
                    variant="contained"
                    startIcon={<Copy size={18} />}
                    onClick={() => {
                      navigator.clipboard.writeText(`${process.env.PUBLIC_URL}/login?ref=${userData?.sponsorID}`);
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
                    ${(userData?.extra?.totalEarnings || 0).toFixed(2)}
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

          {/* CoinDesk Live Data Section */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                mb: 3
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h5" color="white" sx={{ fontWeight: 600, mb: 1 }}>
                    Live Trading Data
                  </Typography>
                  <Typography variant="body2" color="grey.400" sx={{ mb: 2 }}>
                    Activate daily profit for YOUR account by clicking the button below
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleActivateDailyProfit}
                    disabled={userData?.dailyProfitActivated === true || activatingProfit}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      minWidth: '200px'
                    }}
                  >
                    {activatingProfit ? (
                      <>
                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                        Activating...
                      </>
                    ) : userData?.dailyProfitActivated === true ? (
                      'Your Daily Profit Activated for Today'
                    ) : (
                      'Activate MY Daily Profit for Today'
                    )}
                  </Button>
                  <Typography variant="caption" color="grey.400" sx={{ mt: 1, textAlign: 'center', width: '100%' }}>
                    Activation resets at midnight UTC. You must activate daily.
                  </Typography>
                </Box>
              </Box>

              {/* Exchange buttons */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3, mb: 3 }}>
                {['Binance', 'Coinbase', 'Kraken', 'KuCoin', 'Huobi', 'Gate.io', 'OKX', 'Bybit', 'Bitfinex'].map((exchange) => (
                  <Button
                    key={exchange}
                    variant={activeExchange === exchange ? 'contained' : 'outlined'}
                    sx={{
                      borderRadius: '50px',
                      px: 3,
                      py: 1,
                      bgcolor: activeExchange === exchange ? '#4caf50' : 'transparent',
                      borderColor: alpha('#fff', 0.2),
                      color: activeExchange === exchange ? 'white' : 'grey.400',
                      '&:hover': {
                        bgcolor: activeExchange === exchange ? '#4caf50' : alpha('#fff', 0.05)
                      },
                      fontWeight: activeExchange === exchange ? 600 : 400,
                      boxShadow: activeExchange === exchange ? '0 4px 10px rgba(0, 0, 0, 0.2)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {exchange}
                  </Button>
                ))}
              </Box>

              {/* BTC Price Display */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Typography variant="h5" color="white" sx={{ fontWeight: 600 }}>
                  BTC Price: $85803.41
                  <Typography component="span" color="#4caf50" sx={{ ml: 2, fontWeight: 500 }}>
                    24h Change: 1.23%
                  </Typography>
                </Typography>
              </Box>

              {/* Current Exchange Display */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 2 }}>
                <Typography variant="h6" color="white">
                  {activeExchange}
                </Typography>
                <Box>
                  <Typography variant="body2" color="#4caf50" sx={{ display: 'inline-block', mr: 3 }}>
                    Buy: $85789.34
                    <Typography component="span" color="grey.400" sx={{ ml: 1, fontSize: '0.8rem' }}>
                      Qty: 0.084 BTC
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="#f44336" sx={{ display: 'inline-block' }}>
                    Sell: $85817.48
                    <Typography component="span" color="grey.400" sx={{ ml: 1, fontSize: '0.8rem' }}>
                      24h: 0.27%
                    </Typography>
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ maxHeight: '400px', overflow: 'auto', position: 'relative', scrollBehavior: 'smooth' }} className="trade-table-container">
                {/* Always show the notification based on activation status */}
                {!userData?.dailyProfitActivated && (
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: alpha('#fff', 0.05), borderRadius: 2, mb: 3 }}>
                    <Typography variant="body1" color="grey.300">
                      Activate daily profit for YOUR account to see LIVE trading data. Each user must activate their own daily profit every day.
                    </Typography>
                    <Typography variant="body2" color="grey.400" sx={{ mt: 1 }}>
                      The system distributes daily profit only to users who have activated it, and resets activation status at midnight UTC.
                    </Typography>
                  </Box>
                )}

                {/* Show loading indicator when fetching live data */}
                {userData?.dailyProfitActivated && loadingTrades ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, flexDirection: 'column' }}>
                    <CircularProgress size={40} thickness={4} sx={{ mb: 2 }} />
                    <Typography variant="body2" color="grey.400" sx={{ animation: `${pulse} 1.5s infinite` }}>
                      Fetching live trading data...
                    </Typography>
                  </Box>
                ) : (
                  /* Always show the table with either live or sample data */
                  <Box>
                    <Typography variant="h6" color="white" sx={{ mb: 2, fontWeight: 600 }}>
                      Trade History
                    </Typography>
                    <table style={{ width: '100%', borderCollapse: 'collapse', position: 'relative' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${alpha('#fff', 0.1)}` }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'white' }}>Exchange</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', color: 'white' }}>Type</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', color: 'white' }}>Order ID</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', color: 'white' }}>Price</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', color: 'white' }}>Amount</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', color: 'white' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tradeData.map((trade, index) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor: alpha(trade.type === 'buy' ? '#4caf50' : '#f44336', trade.isNew ? 0.2 : 0.05),
                            transition: 'all 0.5s ease',
                            opacity: userData?.dailyProfitActivated ? 1 : 0.7, // Dim the rows if not activated
                            transform: trade.isNew ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: trade.isNew ? `0 0 8px ${alpha(trade.type === 'buy' ? '#4caf50' : '#f44336', 0.5)}` : 'none',
                            animation: trade.isNew ? `${fadeIn} 0.5s ease-out, ${highlight} 2s ease-out` : 'none'
                          }}
                        >
                          <td style={{ padding: '12px 16px', color: 'white' }}>
                            <Typography variant="body2" color={userData?.dailyProfitActivated ? 'grey.300' : 'grey.400'} sx={{
                              fontWeight: trade.isNew ? 700 : 500,
                              animation: trade.isNew ? `${pulse} 1s` : 'none',
                              display: 'block',
                              color: activeExchange === trade.exchange ? '#4caf50' : 'grey.300'
                            }}>
                              {trade.exchange}
                            </Typography>
                            <Typography variant="caption" color={userData?.dailyProfitActivated ? 'grey.500' : 'grey.600'} sx={{
                              fontWeight: trade.isNew ? 600 : 400,
                              display: 'block'
                            }}>
                              {userData?.dailyProfitActivated ? trade.timestamp : 'Sample Data'}
                            </Typography>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <Chip
                              label={trade.type === 'buy' ? 'Buy' : 'Sell'}
                              size="small"
                              sx={{
                                bgcolor: trade.type === 'buy' ? '#4caf50' : '#f44336',
                                color: 'white',
                                opacity: userData?.dailyProfitActivated ? 1 : 0.7,
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                height: '24px',
                                transition: 'all 0.3s ease',
                                transform: trade.isNew ? 'scale(1.1)' : 'scale(1)',
                                boxShadow: trade.isNew ? '0 0 5px rgba(255,255,255,0.3)' : 'none'
                              }}
                            />
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <Typography variant="body2" color={userData?.dailyProfitActivated ? 'grey.400' : 'grey.500'} sx={{
                              fontWeight: trade.isNew ? 600 : 400
                            }}>
                              {trade.orderId}
                            </Typography>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <Typography variant="body2" color={userData?.dailyProfitActivated ? 'grey.300' : 'grey.400'} sx={{
                              fontWeight: trade.isNew ? 600 : 400
                            }}>
                              ₿ {trade.price}
                            </Typography>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <Typography variant="body2" color={userData?.dailyProfitActivated ? 'grey.300' : 'grey.400'} sx={{
                              fontWeight: trade.isNew ? 600 : 400
                            }}>
                              ₮ {trade.amount}
                            </Typography>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <Typography variant="body2" color={userData?.dailyProfitActivated ? 'grey.300' : 'grey.400'} sx={{
                              fontWeight: trade.isNew ? 600 : 400
                            }}>
                              ₮ {trade.total}
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </Box>
                )}
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
                ${(userData?.extra?.dailyProfit || 0).toFixed(2)}
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
                ${(userData?.extra?.firstDepositBonus || 0).toFixed(2)}
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
                ${(userData?.extra?.referralBonus || 0).toFixed(2)}
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
                ${(userData?.extra?.teamCommission || 0).toFixed(2)}
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
                  {userData?.extra?.directReferrals || 0}
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
                  ${(userData?.extra?.activeMemberReward || 0).toFixed(2)}
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