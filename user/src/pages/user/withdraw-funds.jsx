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
  Chip,
  TextField,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  Avatar
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Wallet, Copy, MoneyRecive, DollarCircle } from 'iconsax-react';
import axios from 'utils/axios';
import { openSnackbar } from 'api/snackbar';
import CommonDatatable from 'helpers/CommonDatatable';
import MainCard from 'components/MainCard';
import Swal from 'sweetalert2';

export default function WithdrawFunds() {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    // Removed unused withdrawalAddress state
    const [errors, setErrors] = useState({});
    const [withdrawalHistory, setWithdrawalHistory] = useState([]);
    const [userWallet, setUserWallet] = useState(null);

    // API endpoint for withdrawal history
    const apiPoint = 'get-all-withdrawals';

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/user/profile');
                console.log('User profile response:', response.data);

                if (response.data?.status) {
                    const userData = response.data.result || response.data.data?.result;
                    setUserData(userData);

                    // If user has a withdrawal wallet, store it in userWallet
                    if (userData && userData.withdraw_wallet) {
                        setUserWallet({
                            address: userData.withdraw_wallet
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                openSnackbar({
                    open: true,
                    message: 'Failed to load user profile',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Table columns for withdrawal history
    const columns = useMemo(
        () => [
            {
                header: 'Wallet Address',
                accessorKey: 'address',
                cell: (props) => {
                    const address = props.getValue();
                    return address ?
                        address.length > 15 ?
                            `${address.substring(0, 8)}...${address.substring(address.length - 8)}` :
                            address :
                        '';
                }
            },
            {
                header: 'Amount (USDT)',
                accessorKey: 'amount',
                cell: (props) => `$${parseFloat(props.getValue()).toFixed(2)}`
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.getValue();
                    let statusText = 'Pending';
                    let color = theme.palette.warning.main;

                    if (status === 1) {
                        statusText = 'Completed';
                        color = theme.palette.success.main;
                    } else if (status === 2) {
                        statusText = 'Rejected';
                        color = theme.palette.error.main;
                    }

                    return (
                        <Chip
                            label={statusText}
                            size="small"
                            sx={{
                                color: color,
                                bgcolor: alpha(color, 0.1),
                                fontWeight: 'medium'
                            }}
                        />
                    );
                }
            },
            {
                header: 'Transaction ID',
                accessorKey: 'txid',
                cell: (props) => {
                    const txid = props.getValue();
                    return txid ?
                        txid.length > 20 ?
                            `${txid.substring(0, 10)}...${txid.substring(txid.length - 10)}` :
                            txid :
                        'N/A';
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

    // Validate withdrawal form
    const validateForm = () => {
        const newErrors = {};

        if (!withdrawalAmount || isNaN(withdrawalAmount) || parseFloat(withdrawalAmount) <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        } else if (userData && parseFloat(withdrawalAmount) > userData.wallet) {
            newErrors.amount = 'Amount exceeds your wallet balance';
        }

        // Check if user has set a withdrawal wallet
        if (!userData?.withdraw_wallet) {
            newErrors.address = 'Please set a withdrawal wallet address in your profile settings';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle withdrawal request
    const handleWithdrawal = async () => {
        if (!validateForm()) return;

        // Ensure the user has set a withdrawal wallet
        if (!userData?.withdraw_wallet) {
            setErrors({
                ...errors,
                address: 'Please set a withdrawal wallet address in your profile settings'
            });
            return;
        }

        try {
            // Confirm withdrawal
            const result = await Swal.fire({
                title: 'Confirm Withdrawal',
                text: `Are you sure you want to withdraw $${withdrawalAmount} to your registered withdrawal wallet?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: theme.palette.primary.main,
                cancelButtonColor: theme.palette.error.main,
                confirmButtonText: 'Yes, withdraw!'
            });

            if (result.isConfirmed) {
                setLoading(true);

                // Send withdrawal request to server
                const response = await axios.post('/request-withdrawal', {
                    amount: withdrawalAmount,
                    walletAddress: userData.withdraw_wallet // Always use the registered withdrawal wallet
                });

                console.log('Withdrawal response:', response.data);

                if (response.data?.status) {
                    // Update user's wallet balance
                    setUserData(prev => ({
                        ...prev,
                        wallet: prev.wallet - parseFloat(withdrawalAmount)
                    }));

                    // Reset form
                    setWithdrawalAmount('');

                    // Show success message
                    Swal.fire({
                        title: 'Withdrawal Requested!',
                        text: 'Your withdrawal request has been submitted successfully. It will be processed shortly.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    throw new Error(response.data?.message || 'Failed to process withdrawal');
                }
            }
        } catch (error) {
            console.error('Error processing withdrawal:', error);

            Swal.fire({
                title: 'Withdrawal Failed',
                text: error.response?.data?.message || error.message || 'An error occurred while processing your withdrawal',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Grid container spacing={3}>
                {/* Withdrawal Form Section */}
                <Grid item xs={12}>
                    <MainCard title="Withdraw Funds">
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        )}

                        <Grid container spacing={3}>
                            {/* Wallet Balance Card */}
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
                                                Main Wallet Balance
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
                                            Available for withdrawal
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Top-up Wallet Balance Card */}
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
                                                Top-up Wallet Balance
                                            </Typography>
                                            <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>
                                                ${(userData?.wallet_topup || 0).toFixed(2)}
                                            </Typography>
                                        </Box>
                                        <Avatar
                                            sx={{
                                                bgcolor: alpha(theme.palette.warning.main, 0.2),
                                                p: 1.5,
                                                color: theme.palette.warning.main
                                            }}
                                        >
                                            <Wallet variant="Bold" size={24} />
                                        </Avatar>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="grey.400">
                                            Used for investments
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Withdrawal Form */}
                            <Grid item xs={12} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        height: '100%',
                                        bgcolor: alpha(theme.palette.primary.dark, 0.05),
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    <Typography variant="h5" gutterBottom>
                                        Request Withdrawal
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Amount (USDT)
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Enter amount"
                                            value={withdrawalAmount}
                                            onChange={(e) => setWithdrawalAmount(e.target.value)}
                                            disabled={loading}
                                            error={!!errors.amount}
                                            helperText={errors.amount}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <DollarCircle size={20} />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl fullWidth sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Withdrawal Wallet Address
                                            <Chip
                                                label="Read Only"
                                                size="small"
                                                color="primary"
                                                sx={{ ml: 1, fontSize: '0.7rem' }}
                                            />
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="0x..."
                                            value={userData?.withdraw_wallet || ''}
                                            disabled={true}
                                            error={!!errors.address}
                                            helperText={errors.address || (userData?.withdraw_wallet ? 'You can only withdraw to this registered wallet address' : 'Set your withdrawal wallet in your profile settings')}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Wallet size={20} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: userData?.withdraw_wallet && (
                                                    <InputAdornment position="end">
                                                        <Tooltip title="Copy Address">
                                                            <IconButton
                                                                edge="end"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(userData.withdraw_wallet);
                                                                    openSnackbar({
                                                                        open: true,
                                                                        message: 'Address copied to clipboard',
                                                                        variant: 'alert',
                                                                        alert: {
                                                                            color: 'success'
                                                                        }
                                                                    });
                                                                }}
                                                            >
                                                                <Copy size={16} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiInputBase-input.Mui-disabled': {
                                                    WebkitTextFillColor: theme.palette.text.primary,
                                                    opacity: 0.8
                                                }
                                            }}
                                        />
                                        {!userData?.withdraw_wallet && (
                                            <FormHelperText sx={{ color: theme.palette.warning.main }}>
                                                You haven't set a withdrawal wallet yet. Please update your profile settings first.
                                            </FormHelperText>
                                        )}
                                    </FormControl>

                                    <LoadingButton
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        loading={loading}
                                        onClick={handleWithdrawal}
                                        startIcon={<MoneyRecive />}
                                        disabled={!userData || userData.wallet <= 0 || !userData.withdraw_wallet}
                                    >
                                        Withdraw Funds
                                    </LoadingButton>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Withdrawal Guidelines */}
                        <Box sx={{ mt: 3 }}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="subtitle2">
                                    Withdrawal Guidelines:
                                </Typography>
                                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                    <li>Minimum withdrawal amount is $10 USDT</li>
                                    <li>Withdrawals are processed within 24-48 hours</li>
                                    <li>You must set your withdrawal wallet in your profile settings</li>
                                    <li>Withdrawals can only be made to your registered withdrawal wallet</li>
                                    <li>A 5% admin fee applies to all withdrawals</li>
                                </ul>
                            </Alert>
                        </Box>
                    </MainCard>
                </Grid>

                {/* Withdrawal History Section */}
                <Grid item xs={12}>
                    <MainCard title="Withdrawal History">
                        <CommonDatatable columns={columns} apiPoint={apiPoint} type={1} />
                    </MainCard>
                </Grid>
            </Grid>
        </>
    )
}
