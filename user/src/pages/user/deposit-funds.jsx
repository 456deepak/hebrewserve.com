import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Grid,
  Stack,
  Typography,
  Paper,
  Divider,
  useTheme,
  alpha,
  CircularProgress,
  Tooltip,
  IconButton,
  Alert,
  Chip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Wallet, Copy, RefreshCircle } from 'iconsax-react';
import axios from 'utils/axios';
import { openSnackbar } from 'api/snackbar';
import CommonDatatable from 'helpers/CommonDatatable';
import MainCard from 'components/MainCard';
import Swal from 'sweetalert2';



export default function DepositFunds() {
  const theme = useTheme();
  const [walletLoading, setWalletLoading] = useState(false);
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [userWallet, setUserWallet] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [monitoringResult, setMonitoringResult] = useState(null);
  const [transactionProcessed, setTransactionProcessed] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);

  // API endpoint for deposit history
  const apiPoint = 'get-all-deposits';

  // Fetch user profile and check for existing wallet
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Check if user already has a wallet
        const response = await axios.get('/user/profile');
        console.log(response.data);
        if (response.data?.status && response.data?.result.wallet_address) {
          const userData = response.data.result;

          // If user has a wallet, use it
          if (userData.wallet_address && userData.wallet_private_key) {
            console.log('Using existing wallet from user profile');
            setUserWallet({
              address: userData.wallet_address,
              privateKey: userData.wallet_private_key
            });

            // Check if there are any recent deposits for this wallet
            try {
              const depositsResponse = await axios.get('/get-all-deposits', {
                params: {
                  limit: 5,
                  page: 1
                }
              });

              if (depositsResponse.data?.status &&
                  depositsResponse.data?.data?.results &&
                  depositsResponse.data?.data?.results.length > 0) {
                if (walletDeposits.length > 0) {
                  // Found a recent deposit for this wallet
                  const latestDeposit = walletDeposits[0];
                  setTransactionProcessed(true);
                  setMonitoringResult({
                    found: true,
                    amount: latestDeposit.amount,
                    currency: latestDeposit.currency || 'USDT',
                    alreadyProcessed: true,
                    txid: latestDeposit.txid
                  });
                }
              }
            } catch (error) {
              console.error('Error checking deposits:', error);
            }
          } else {
            // If user doesn't have a wallet, generate one only once
            console.log('No wallet found in user profile, generating new wallet');
            await handleGenerateWallet(true);
          }
        }
      } catch (error) {
        console.error('Error in wallet initialization:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Generate a new wallet
  const handleGenerateWallet = async (silent = false) => {
    try {
      // Check if user already has a wallet in state
      if (userWallet) {
        console.log('User already has a wallet, not generating a new one');
        return;
      }

      setWalletLoading(true);

      // Double-check with the server if user has a wallet
      const profileResponse = await axios.get('/user/profile');
      if (profileResponse.data?.status && profileResponse.data?.data?.result) {
        const userData = profileResponse.data.data.result;
        if (userData.wallet_address && userData.wallet_private_key) {
          console.log('User already has a wallet in profile, using existing wallet');
          setUserWallet({
            address: userData.wallet_address,
            privateKey: userData.wallet_private_key
          });
          return;
        }
      }

      // If we reach here, user doesn't have a wallet, so generate one
      const response = await axios.post('/generate-wallet');

      if (response.data?.status && response.data?.wallet) {
        // Check if this is an existing wallet or a new one
        if (response.data.existing) {
          console.log('Server returned existing wallet');
          setUserWallet(response.data.wallet);

          if (!silent) {
            // Show message about using existing wallet
            openSnackbar({
              open: true,
              message: 'Using your existing wallet',
              variant: 'alert',
              alert: {
                color: 'info'
              }
            });
          }
        } else {
          // This is a new wallet
          // If we're auto-generating on page load, save it immediately
          if (silent) {
            await saveWalletToProfile(response.data.wallet);
          } else {
            setWalletData(response.data.wallet);

            // Show success message
            openSnackbar({
              open: true,
              message: 'Wallet generated successfully!',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error generating wallet:', error);

      // Only show error message if not silent
      if (!silent) {
        openSnackbar({
          open: true,
          message: error.response?.data?.message || 'Failed to generate wallet',
          variant: 'alert',
          alert: {
            color: 'error'
          }
        });
      }
    } finally {
      setWalletLoading(false);
    }
  };

  // Helper function to save wallet to profile
  const saveWalletToProfile = async (wallet) => {
    try {
      const response = await axios.post('/save-wallet', {
        walletAddress: wallet.address,
        walletPrivateKey: wallet.privateKey
      });

      if (response.data?.status) {
        setUserWallet(wallet);
        setWalletData(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving wallet:', error);
      return false;
    }
  };

  // Save wallet to user profile
  const handleSaveWallet = async () => {
    try {
      if (!walletData) return;

      setWalletLoading(true);
      const success = await saveWalletToProfile(walletData);

      if (success) {
        // Show success message
        Swal.fire({
          title: 'Wallet Saved!',
          text: 'Your wallet has been saved to your profile.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error saving wallet:', error);

      // Show error message
      openSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to save wallet',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    } finally {
      setWalletLoading(false);
    }
  };

  // Start monitoring wallet for deposits
  const handleStartMonitoring = async () => {
    try {
      if (!userWallet) return;

      // Prevent multiple requests in a short time
      if (cooldownActive || transactionProcessed) {
        return;
      }

      setMonitoringLoading(true);
      setCooldownActive(true);

      const response = await axios.post('/start-monitoring', {
        walletAddress: userWallet.address,
        walletPrivateKey: userWallet.privateKey
      });

      if (response.data?.status) {
        setMonitoringResult(response.data.result);

        if (response.data.result.found) {
          // Mark transaction as processed to disable the button
          setTransactionProcessed(true);

          // If deposit was found and processed
          Swal.fire({
            title: 'Deposit Found!',
            text: `${response.data.result.amount} ${response.data.result.currency} has been transferred to your account.`,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Refresh the deposit history table
            window.location.reload();
          });
        } else {
          // If no deposit was found
          openSnackbar({
            open: true,
            message: response.data.result.message || 'No deposit found',
            variant: 'alert',
            alert: {
              color: 'warning'
            }
          });

          // Set a cooldown period of 30 seconds
          setTimeout(() => {
            setCooldownActive(false);
          }, 30000);
        }
      }
    } catch (error) {
      console.error('Error monitoring wallet:', error);

      // Show error message
      openSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to monitor wallet',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });

      // Reset cooldown after error
      setTimeout(() => {
        setCooldownActive(false);
      }, 10000);
    } finally {
      setMonitoringLoading(false);
    }
  };

  // Copy wallet address to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  // Table columns for deposit history
  const columns = useMemo(
    () => [
      {
        header: 'Amount',
        accessorKey: 'amount',
        cell: (props) => `$${parseFloat(props.getValue()).toFixed(2)}`
      },
      {
        header: 'Transaction ID',
        accessorKey: 'txid',
        cell: (props) => {
          const txid = props.getValue();
          return txid.length > 20 ? `${txid.substring(0, 10)}...${txid.substring(txid.length - 10)}` : txid;
        }
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const status = props.getValue();
          let statusText = 'Pending';
          let color = theme.palette.warning.main;

          if (status === 1) {
            statusText = 'Processing';
            color = theme.palette.info.main;
          } else if (status === 2) {
            statusText = 'Completed';
            color = theme.palette.success.main;
          }

          return (
            <Typography
              variant="body2"
              sx={{
                color: color,
                fontWeight: 'medium',
                backgroundColor: alpha(color, 0.1),
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block'
              }}
            >
              {statusText}
            </Typography>
          );
        }
      },
      {
        header: 'Date',
        accessorKey: 'created_at',
        cell: (props) => new Date(props.getValue()).toLocaleString()
      }
    ],
    [theme]
  );

  return (
    <>
      <Grid container spacing={3}>
        {/* Wallet Generation and Monitoring Section */}
        <Grid item xs={12}>
          <MainCard title="Your Crypto Wallet">
            <Grid container spacing={3}>
              {/* User's Wallet */}
              {userWallet && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Send USDT (BEP-20) to this wallet address, then click "Payment Done" when your transaction is complete.
                  </Alert>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      mb: 2
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Typography variant="subtitle1">Your Wallet Address:</Typography>
                      <Tooltip title={copySuccess || 'Copy to clipboard'}>
                        <IconButton size="small" onClick={() => copyToClipboard(userWallet.address)}>
                          <Copy size={16} />
                        </IconButton>
                      </Tooltip>
                      {copySuccess && <Chip label={copySuccess} color="success" size="small" />}
                    </Stack>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                      {userWallet.address}
                    </Typography>
                  </Paper>

                  {monitoringResult && (
                    <Alert
                      severity={monitoringResult.found ? "success" : "warning"}
                      sx={{ mb: 2 }}
                    >
                      {monitoringResult.found
                        ? `Deposit of ${monitoringResult.amount} ${monitoringResult.currency} found and processed successfully!${monitoringResult.alreadyProcessed ? ' (Already processed)' : ''}`
                        : monitoringResult.message || 'No deposit found. Please try again later.'}
                      {cooldownActive && !monitoringResult.found && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Please wait 30 seconds before trying again.
                        </Typography>
                      )}
                    </Alert>
                  )}

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Tooltip title="You already have a wallet. Only generate a new one if you're having issues with the current wallet.">
                        <span>
                          <LoadingButton
                            disableElevation
                            loading={walletLoading}
                            fullWidth
                            size="large"
                            variant="contained"
                            color="primary"
                            startIcon={<Wallet />}
                            onClick={() => handleGenerateWallet()}
                            sx={{ mb: { xs: 2, md: 0 } }}
                          >
                            Generate New Wallet
                          </LoadingButton>
                        </span>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <LoadingButton
                        disableElevation
                        loading={monitoringLoading}
                        fullWidth
                        size="large"
                        variant="contained"
                        color="success"
                        startIcon={<RefreshCircle />}
                        onClick={handleStartMonitoring}
                        disabled={transactionProcessed || cooldownActive}
                      >
                        {transactionProcessed
                          ? 'Payment Processed'
                          : cooldownActive && !monitoringLoading
                            ? 'Please Wait...'
                            : 'Payment Done'}
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {/* Generated Wallet (not yet saved) */}
              {!userWallet && walletData && (
                <Grid item xs={12}>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    This wallet has been generated but not saved to your profile yet. Save it to use for deposits.
                  </Alert>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                      mb: 2
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Typography variant="subtitle1">Wallet Address:</Typography>
                      <Tooltip title={copySuccess || 'Copy to clipboard'}>
                        <IconButton size="small" onClick={() => copyToClipboard(walletData.address)}>
                          <Copy size={16} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                      {walletData.address}
                    </Typography>
                  </Paper>
                  <LoadingButton
                    disableElevation
                    loading={walletLoading}
                    fullWidth
                    size="large"
                    variant="contained"
                    color="success"
                    onClick={handleSaveWallet}
                    sx={{ mb: 2 }}
                  >
                    Save Wallet to Profile
                  </LoadingButton>
                </Grid>
              )}

              {/* Loading state when no wallet is available yet */}
              {!userWallet && !walletData && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                </Grid>
              )}
            </Grid>
          </MainCard>
        </Grid>

        {/* <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.primary.dark, 0.05),
              height: '100%'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Deposit Instructions
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              <Typography variant="body1">
                <strong>Option 1: Automatic Deposit (Recommended)</strong>
              </Typography>
              <Typography variant="body1">
                1. A wallet has been automatically generated for you.
              </Typography>
              <Typography variant="body1">
                2. Send USDT (BEP-20) to your wallet address shown above.
              </Typography>
              <Typography variant="body1">
                3. After sending the payment, click the "Payment Done" button.
              </Typography>
              <Typography variant="body1">
                4. Your deposit will be automatically processed and added to your account.
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Note: Make sure to send only USDT (BEP-20) tokens to this address. Other tokens may be lost.
              </Typography>
            </Stack>
          </Paper>
        </Grid> */}

        <Grid item xs={12} md={12}>
          <MainCard title="Deposit History">
            <CommonDatatable columns={columns} apiPoint={apiPoint} type={1} />
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}
