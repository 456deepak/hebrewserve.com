import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  TextField,
  Paper,
  Divider,
  useTheme,
  alpha,
  CircularProgress,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowRight2, WalletMoney, Profile } from 'iconsax-react';
import axios from 'utils/axios';
import { openSnackbar } from 'api/snackbar';
import CommonDatatable from 'helpers/CommonDatatable';
import MainCard from 'components/MainCard';
import Swal from 'sweetalert2';
import useAuth from 'hooks/useAuth';


// Tab Panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`transfer-tabpanel-${index}`}
      aria-labelledby={`transfer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Create validation schemas with context
const createValidationSchemas = (maxAmount) => {
  // Validation schema for user-to-user transfer
  const userToUserSchema = Yup.object({
    user_id: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive')
      .min(10, 'Minimum transfer amount is $10')
      .test(
        'max-investment-percentage',
        `Amount exceeds 20% of your investment ($${maxAmount.toFixed(2)}). You can only transfer up to 20% of your investment in a day.`,
        function(value) {
          return !value || value <= maxAmount;
        }
      ),
    remark: Yup.string()
      .required('Remark is required')
      .min(3, 'Remark must be at least 3 characters')
      .max(250, 'Remark must be at most 250 characters')
  });

  // Validation schema for self transfer
  const selfTransferSchema = Yup.object({
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive')
      .min(10, 'Minimum transfer amount is $10')
      .test(
        'max-investment-percentage',
        `Amount exceeds 20% of your investment ($${maxAmount.toFixed(2)}). You can only transfer up to 20% of your investment in a day.`,
        function(value) {
          return !value || value <= maxAmount;
        }
      ),
    remark: Yup.string()
      .required('Remark is required')
      .min(3, 'Remark must be at least 3 characters')
      .max(250, 'Remark must be at most 250 characters')
  });

  return { userToUserSchema, selfTransferSchema };
};

export default function TransferFunds() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loadingUserToUser, setLoadingUserToUser] = useState(false);
  const [loadingSelfTransfer, setLoadingSelfTransfer] = useState(false);
  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);
  const [usernameValid, setUsernameValid] = useState(null);
  const [maxTransferAmount, setMaxTransferAmount] = useState(0);

  // Get user data from Auth context
  const { user } = useAuth();

  // Calculate maximum transfer amount (20% of total investment)
  const calculateMaxTransferAmount = () => {
    // Use last_investment_amount if available, otherwise fall back to total_investment
    const investmentAmount = user?.last_investment_amount > 0
      ? user.last_investment_amount
      : (user?.total_investment || 0);

    return investmentAmount * 0.2; // 20% of investment amount
  };

  // Create validation schemas with the current max transfer amount
  const { userToUserSchema, selfTransferSchema } = useMemo(() => {
    const maxAmount = calculateMaxTransferAmount();
    setMaxTransferAmount(maxAmount);
    return createValidationSchemas(maxAmount);
  }, [user?.last_investment_amount, user?.total_investment]);

  // API endpoint for transfer history
  const apiPoint = 'get-all-fund-transfers';

  // Table columns for transfer history
  const columns = useMemo(
    () => [
      {
        header: 'To User',
        accessorKey: 'user_id',
        cell: (props) => props.getValue() || '-'
      },
      {
        header: 'From User',
        accessorKey: 'user_id_from',
        cell: (props) => props.getValue() || 'Self'
      },
      {
        header: 'To Wallet',
        accessorKey: 'to_wallet',
        cell: (props) => {
          const value = props.getValue();
          return value == 'topup' ? 'Topup Wallet' : 'Main Wallet' ;
        }
      },
      {
        header: 'Amount',
        accessorKey: 'amount',
        cell: (props) => `$${parseFloat(props.getValue()).toFixed(2)}`
      },
      {
        header: 'Fee',
        accessorKey: 'amount',
        cell: (props) => {
           const val = props.getValue();
           return val * 0.02;
        }
      },
      {
        header: 'Remark',
        accessorKey: 'remark'
      },
      {
        header: 'Date',
        accessorKey: 'created_at',
        cell: (props) => new Date(props.getValue()).toLocaleString()
      }
    ],
    []
  );

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Check if username exists
  const checkUsername = async (username) => {
    if (!username || username.length < 3) return;

    try {
      setUsernameCheckLoading(true);
      const response = await axios.post('/user/checkReferID', { refer_id: username });
      setUsernameValid(response.data?.status);
    } catch (error) {
      setUsernameValid(false);
    } finally {
      setUsernameCheckLoading(false);
    }
  };

  // User to user transfer form
  const userToUserFormik = useFormik({
    initialValues: {
      user_id: '',
      amount: '',
      remark: ''
    },
    validationSchema: userToUserSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoadingUserToUser(true);

        // Submit transfer request - from main wallet to recipient's topup wallet
        const response = await axios.post('/add-fund-transfer', {
          ...values,
          type: 0, // User to user transfer type
          from_wallet: 'main', // Transfer from main wallet
          to_wallet: 'topup' // Transfer to topup wallet
        });
        
        if (response?.status) {
          // Show success message
          Swal.fire({
            title: 'Transfer Successful!',
            text: 'Funds have been transferred successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          

          // Reset form
          resetForm();
          setUsernameValid(null);
        }
      } catch (error) {
        // Show error message
        
        const errorMessage = error.message || 'Failed to transfer funds';

        if (errorMessage.includes('ICO Package') || errorMessage.includes('deposit funds') || errorMessage.includes('Insufficient')) {
          // Show a more helpful error with a link to deposit page
          Swal.fire({
            title: 'Insufficient Funds',
            html: 'You need to have sufficient funds in your main wallet. <br/><br/><a href="/user/deposit-funds" style="color: blue; text-decoration: underline;">Go to Deposit Funds</a>',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        } else {
          // Show regular error message
          openSnackbar({
            open: true,
            message: errorMessage,
            variant: 'alert',
            alert: {
              color: 'error'
            }
          });
        }
      } finally {
        setLoadingUserToUser(false);
      }
    }
  });

  // Self transfer form
  const selfTransferFormik = useFormik({
    initialValues: {
      amount: '',
      remark: ''
    },
    validationSchema: selfTransferSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoadingSelfTransfer(true);

        // Submit self transfer request - from main wallet to own topup wallet
        const response = await axios.post('/add-fund-transfer', {
          user_id: user?.username || '', // Self transfer
          amount: values.amount,
          remark: values.remark,
          type: 1, // Self transfer type
          from_wallet: 'main', // Transfer from main wallet
          to_wallet: 'topup' // Transfer to topup wallet
        });

        if (response?.status) {
          // Show success message
          Swal.fire({
            title: 'Transfer Successful!',
            text: 'Funds have been transferred to your top-up wallet successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });

          // Reset form
          setLoadingSelfTransfer(false);
          resetForm();
        }
      } catch (error) {
        // Show error message
        const errorMessage = error.response?.data?.message || error.response?.data?.msg || 'Failed to transfer funds';

        if (errorMessage.includes('ICO Package') || errorMessage.includes('deposit funds') || errorMessage.includes('Insufficient')) {
          // Show a more helpful error with a link to deposit page
          Swal.fire({
            title: 'Insufficient Funds',
            html: 'You need to have sufficient funds in your main wallet. <br/><br/>',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        } else {
          // Show regular error message
          openSnackbar({
            open: true,
            message: errorMessage,
            variant: 'alert',
            alert: {
              color: 'error'
            }
          });
        }
      } finally {
        setLoadingSelfTransfer(false);
      }
    }
  });

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <MainCard>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                mb: 2,
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main
                },
                '& .MuiTab-root.Mui-selected': {
                  color: theme.palette.primary.main
                }
              }}
            >
              <Tab
                label="User to User Transfer"
                icon={<Profile size={18} />}
                iconPosition="start"
              />
              <Tab
                label="Self Transfer"
                icon={<WalletMoney size={18} />}
                iconPosition="start"
              />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <form onSubmit={userToUserFormik.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="user_id">Recipient Username</InputLabel>
                      <OutlinedInput
                        id="user_id"
                        type="text"
                        value={userToUserFormik.values.user_id}
                        name="user_id"
                        placeholder="Enter recipient's username"
                        onChange={(e) => {
                          userToUserFormik.handleChange(e);
                          checkUsername(e.target.value);
                        }}
                        error={userToUserFormik.touched.user_id && Boolean(userToUserFormik.errors.user_id)}
                        fullWidth
                        endAdornment={
                          usernameCheckLoading ? (
                            <CircularProgress size={20} />
                          ) : usernameValid !== null ? (
                            usernameValid ? (
                              <Box sx={{ color: 'success.main' }}>✓</Box>
                            ) : (
                              <Box sx={{ color: 'error.main' }}>✗</Box>
                            )
                          ) : null
                        }
                      />
                      {userToUserFormik.touched.user_id && userToUserFormik.errors.user_id && (
                        <FormHelperText error>{userToUserFormik.errors.user_id}</FormHelperText>
                      )}
                      {usernameValid === false && userToUserFormik.values.user_id && (
                        <FormHelperText error>Username does not exist</FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="amount">Amount ($)</InputLabel>
                      <OutlinedInput
                        id="amount"
                        type="number"
                        value={userToUserFormik.values.amount}
                        name="amount"
                        placeholder="Enter transfer amount"
                        onChange={userToUserFormik.handleChange}
                        error={userToUserFormik.touched.amount && Boolean(userToUserFormik.errors.amount)}
                        fullWidth
                      />
                      {userToUserFormik.touched.amount && userToUserFormik.errors.amount && (
                        <FormHelperText error>{userToUserFormik.errors.amount}</FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="remark">Remark</InputLabel>
                      <OutlinedInput
                        id="remark"
                        type="text"
                        value={userToUserFormik.values.remark}
                        name="remark"
                        placeholder="Enter remark for this transfer"
                        onChange={userToUserFormik.handleChange}
                        error={userToUserFormik.touched.remark && Boolean(userToUserFormik.errors.remark)}
                        fullWidth
                        multiline
                        rows={2}
                      />
                      {userToUserFormik.touched.remark && userToUserFormik.errors.remark && (
                        <FormHelperText error>{userToUserFormik.errors.remark}</FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    {parseFloat(user?.wallet || 0) <= 0 && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        You need to have funds in your main wallet before transferring. Deposit funds to add balance.
                      </Alert>
                    )}

                    <Alert severity="info" sx={{ mb: 2 }}>
                      A 2% transfer fee will be deducted from the transfer amount.
                    </Alert>

                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Daily transfer limit: 20% of your {user?.last_investment_amount > 0 ? 'latest' : 'total'} investment (${maxTransferAmount.toFixed(2)}). You can only transfer up to this amount in a day.
                    </Alert>

                    {maxTransferAmount <= 0 && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        You need to have active investments to make transfers. <Button component={Link} to="/investments/invest" color="primary" sx={{ p: 0, minWidth: 'auto', textTransform: 'none', fontWeight: 'bold', textDecoration: 'underline' }}>Invest now</Button> to enable transfers.
                      </Alert>
                    )}

                    <LoadingButton
                      disableElevation
                      loading={loadingUserToUser}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<ArrowRight2 />}
                      disabled={!usernameValid || parseFloat(user?.wallet || 0) <= 0 || maxTransferAmount <= 0}
                    >
                      Transfer to User
                    </LoadingButton>
                  </Grid>
                </Grid>
              </form>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <form onSubmit={selfTransferFormik.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Transfer funds from your main wallet to your own top-up wallet.
                    </Alert>

                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Daily transfer limit: 20% of your {user?.last_investment_amount > 0 ? 'latest' : 'total'} investment (${maxTransferAmount.toFixed(2)}). You can only transfer up to this amount in a day.
                    </Alert>

                    {maxTransferAmount <= 0 && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        You need to have active investments to make transfers. <Button component={Link} to="/investments/invest" color="primary" sx={{ p: 0, minWidth: 'auto', textTransform: 'none', fontWeight: 'bold', textDecoration: 'underline' }}>Invest now</Button> to enable transfers.
                      </Alert>
                    )}

                    {parseFloat(user?.wallet || 0) <= 0 && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        You need to have funds in your main wallet before transferring. <Button component={Link} to="/user/deposit-funds" color="primary" sx={{ p: 0, minWidth: 'auto', textTransform: 'none', fontWeight: 'bold', textDecoration: 'underline' }}>Deposit funds</Button> to add balance.
                      </Alert>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="amount">Amount ($)</InputLabel>
                      <OutlinedInput
                        id="amount"
                        type="number"
                        value={selfTransferFormik.values.amount}
                        name="amount"
                        placeholder="Enter transfer amount"
                        onChange={selfTransferFormik.handleChange}
                        error={selfTransferFormik.touched.amount && Boolean(selfTransferFormik.errors.amount)}
                        fullWidth
                      />
                      {selfTransferFormik.touched.amount && selfTransferFormik.errors.amount && (
                        <FormHelperText error>{selfTransferFormik.errors.amount}</FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="remark">Remark</InputLabel>
                      <OutlinedInput
                        id="remark"
                        type="text"
                        value={selfTransferFormik.values.remark}
                        name="remark"
                        placeholder="Enter remark for this transfer"
                        onChange={selfTransferFormik.handleChange}
                        error={selfTransferFormik.touched.remark && Boolean(selfTransferFormik.errors.remark)}
                        fullWidth
                        multiline
                        rows={2}
                      />
                      {selfTransferFormik.touched.remark && selfTransferFormik.errors.remark && (
                        <FormHelperText error>{selfTransferFormik.errors.remark}</FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <LoadingButton
                      disableElevation
                      loading={loadingSelfTransfer}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<WalletMoney />}
                      disabled={parseFloat(user?.wallet || 0) <= 0 || maxTransferAmount <= 0}
                    >
                      Transfer to Top-up Wallet
                    </LoadingButton>
                  </Grid>
                </Grid>
              </form>
            </TabPanel>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={5}>
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
              Wallet Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={3}>
              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Main Wallet Balance
                </Typography>
                <Typography variant="h4" color="primary">
                  ${parseFloat(user?.wallet || 0).toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.1), borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Top-up Wallet Balance
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h4" color="secondary">
                    ${parseFloat(user?.wallet_topup || 0).toFixed(2)}
                  </Typography>
                  {parseFloat(user?.wallet_topup || 0) <= 0 && (
                    <Button
                      component={Link}
                      to="/user/deposit-funds"
                      variant="outlined"
                      color="secondary"
                      size="small"
                    >
                      Deposit
                    </Button>
                  )}
                </Stack>
              </Box>

              <Typography variant="body2" color="textSecondary">
                <strong>User to User Transfer:</strong> Transfer funds from your main wallet to another user's top-up wallet.
              </Typography>

              <Typography variant="body2" color="textSecondary">
                <strong>Self Transfer:</strong> Transfer funds from your main wallet to your own top-up wallet.
              </Typography>

              <Alert severity="warning" sx={{ mb: 2 }}>
                A 2% fee is charged for user-to-user transfers. No fee is charged for self transfers.
              </Alert>

              <Alert severity="warning">
                Daily transfer limit: You can only transfer up to 20% of your {user?.last_investment_amount > 0 ? 'latest' : 'total'} investment amount per day (${maxTransferAmount.toFixed(2)}). Multiple transfers are allowed as long as the total doesn't exceed this limit.
              </Alert>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <MainCard title="Transfer History">
            <CommonDatatable columns={columns} apiPoint={apiPoint} type={0} />
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}
