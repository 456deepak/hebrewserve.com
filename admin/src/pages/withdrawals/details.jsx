import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  useTheme,
  alpha,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import axios from 'utils/axios';
import { openSnackbar } from 'api/snackbar';

// third-party
import { format } from 'date-fns';

// assets
import { ArrowLeft, TickCircle, CloseCircle, Copy, InfoCircle, Wallet, DollarCircle } from 'iconsax-react';

// ==============================|| WITHDRAWAL DETAILS ||============================== //

const WithdrawalDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  // State
  const [loading, setLoading] = useState(true);
  const [withdrawal, setWithdrawal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // Fetch withdrawal details
  const fetchWithdrawalDetails = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/withdrawals/${id}`);
      console.log('Withdrawal details response:', response.data);

      if (response.data?.status) {
        // Validate the data and handle different response formats
        let withdrawalData = null;

        if (response.data.data && typeof response.data.data === 'object') {
          withdrawalData = response.data.data;
        } else if (response.data.result && typeof response.data.result === 'object') {
          withdrawalData = response.data.result;
        } else {
          console.error('Invalid withdrawal data format:', response.data);
          throw new Error('Invalid withdrawal data format received from server');
        }

        if (!withdrawalData || typeof withdrawalData !== 'object') {
          console.error('Withdrawal data is not an object:', withdrawalData);
          throw new Error('Invalid withdrawal data format received from server');
        }

        console.log('Processed withdrawal data:', withdrawalData);
        setWithdrawal(withdrawalData);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch withdrawal details');
      }
    } catch (error) {
      console.error('Error fetching withdrawal details:', error);
      openSnackbar({
        open: true,
        message: error.message || 'Failed to fetch withdrawal details',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
      navigate('/withdrawals');
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    openSnackbar({
      open: true,
      message: 'Copied to clipboard',
      variant: 'alert',
      alert: {
        color: 'success'
      }
    });
  };

  // Open dialog for approval/rejection
  const openActionDialog = (action) => {
    setDialogAction(action);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRejectionReason('');
  };

  // Handle withdrawal approval
  const handleApprove = async () => {
    try {
      setProcessingAction(true);

      // First, process the actual withdrawal using the own_pay function
      const processResponse = await axios.post('/withdrawals/process', {
        withdrawalId: id,
        amount: withdrawal.amount,
        address: withdrawal.address
      });

      if (!processResponse.data?.status) {
        throw new Error(processResponse.data?.message || 'Failed to process withdrawal payment');
      }

      // If payment was successful, update the withdrawal status
      const response = await axios.post('/approve-withdrawal', {
        withdrawalId: id,
        txid: processResponse.data?.transactionHash || 'manual-process'
      });

      if (response.data?.status) {
        openSnackbar({
          open: true,
          message: 'Withdrawal processed and approved successfully',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        });

        // Refresh withdrawal details
        fetchWithdrawalDetails();
      } else {
        throw new Error(response.data?.message || 'Failed to approve withdrawal');
      }
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      openSnackbar({
        open: true,
        message: error.message || 'Failed to approve withdrawal',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    } finally {
      setProcessingAction(false);
      setOpenDialog(false);
    }
  };

  // Handle withdrawal rejection
  const handleReject = async () => {
    try {
      if (!rejectionReason) {
        openSnackbar({
          open: true,
          message: 'Please provide a reason for rejection',
          variant: 'alert',
          alert: {
            color: 'warning'
          }
        });
        return;
      }

      setProcessingAction(true);

      const response = await axios.post('/reject-withdrawal', {
        withdrawalId: id,
        reason: rejectionReason
      });

      if (response.data?.status) {
        openSnackbar({
          open: true,
          message: 'Withdrawal rejected successfully',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        });

        // Refresh withdrawal details
        fetchWithdrawalDetails();
      } else {
        throw new Error(response.data?.message || 'Failed to reject withdrawal');
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      openSnackbar({
        open: true,
        message: error.message || 'Failed to reject withdrawal',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    } finally {
      setProcessingAction(false);
      setOpenDialog(false);
      setRejectionReason('');
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (id) {
      fetchWithdrawalDetails();
    }
  }, [id]);

  // Get status chip
  const getStatusChip = (status) => {
    let color = theme.palette.warning.main;
    let label = 'Pending';

    if (status === 1) {
      color = theme.palette.success.main;
      label = 'Approved';
    } else if (status === 2) {
      color = theme.palette.error.main;
      label = 'Rejected';
    }

    return (
      <Chip
        label={label}
        size="small"
        sx={{
          bgcolor: alpha(color, 0.1),
          color: color,
          fontWeight: 'medium',
          fontSize: '0.875rem',
          px: 1
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MainCard
      title={
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={() => navigate('/withdrawals')}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="h3">Withdrawal Details</Typography>
        </Stack>
      }
    >
      {withdrawal ? (
        <Grid container spacing={3}>
          {/* Status Card */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: alpha(
                  withdrawal.status === 0
                    ? theme.palette.warning.main
                    : withdrawal.status === 1
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  0.1
                ),
                borderRadius: 2,
                border: `1px solid ${alpha(
                  withdrawal.status === 0
                    ? theme.palette.warning.main
                    : withdrawal.status === 1
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  0.2
                )}`
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      bgcolor:
                        withdrawal.status === 0
                          ? theme.palette.warning.main
                          : withdrawal.status === 1
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2
                    }}
                  >
                    {withdrawal.status === 0 ? (
                      <InfoCircle variant="Bold" size={24} color="#fff" />
                    ) : withdrawal.status === 1 ? (
                      <TickCircle variant="Bold" size={24} color="#fff" />
                    ) : (
                      <CloseCircle variant="Bold" size={24} color="#fff" />
                    )}
                  </Box>
                  <Stack>
                    <Typography variant="h4">
                      Withdrawal {getStatusChip(withdrawal.status)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Requested on {format(new Date(withdrawal.created_at), 'MMMM dd, yyyy HH:mm')}
                    </Typography>
                  </Stack>
                </Stack>

                {withdrawal.status === 0 && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={processingAction ? <CircularProgress size={20} /> : <TickCircle />}
                      disabled={processingAction}
                      onClick={() => openActionDialog('approve')}
                    >
                      Process & Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<CloseCircle />}
                      onClick={() => openActionDialog('reject')}
                    >
                      Reject
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* Withdrawal Details */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Withdrawal Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Withdrawal ID
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                          {withdrawal._id}
                        </Typography>
                        <Tooltip title="Copy ID">
                          <IconButton size="small" onClick={() => copyToClipboard(withdrawal._id)}>
                            <Copy size={16} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Amount
                      </Typography>
                      <Typography variant="h5" color="primary">
                        ${parseFloat(withdrawal.amount).toFixed(2)}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Fee
                      </Typography>
                      <Typography variant="body1">
                        ${parseFloat(withdrawal.fee || 0).toFixed(2)} ({((withdrawal.fee / withdrawal.amount) * 100).toFixed(1)}%)
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Net Amount
                      </Typography>
                      <Typography variant="body1">
                        ${parseFloat(withdrawal.net_amount || (withdrawal.amount - (withdrawal.fee || 0))).toFixed(2)}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Wallet Address
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                          {withdrawal.address}
                        </Typography>
                        <Tooltip title="Copy Address">
                          <IconButton size="small" onClick={() => copyToClipboard(withdrawal.address)}>
                            <Copy size={16} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Grid>

                  {withdrawal.txid && (
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Transaction ID
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                            {withdrawal.txid}
                          </Typography>
                          <Tooltip title="Copy Transaction ID">
                            <IconButton size="small" onClick={() => copyToClipboard(withdrawal.txid)}>
                              <Copy size={16} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </Grid>
                  )}

                  {withdrawal.status === 2 && withdrawal.extra?.rejectionReason && (
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" color="error">
                          Rejection Reason
                        </Typography>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.error.main, 0.05),
                            borderRadius: 1,
                            border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`
                          }}
                        >
                          <Typography variant="body2">
                            {withdrawal.extra.rejectionReason}
                          </Typography>
                        </Paper>
                      </Stack>
                    </Grid>
                  )}

                  {withdrawal.status === 1 && withdrawal.processed_at && (
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" color="success.main">
                          Processed On
                        </Typography>
                        <Typography variant="body1">
                          {format(new Date(withdrawal.processed_at), 'MMMM dd, yyyy HH:mm')}
                        </Typography>
                      </Stack>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* User Information */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  User Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="textSecondary">
                      User ID
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                        {withdrawal.user_id}
                      </Typography>
                      <Tooltip title="Copy User ID">
                        <IconButton size="small" onClick={() => copyToClipboard(withdrawal.user_id)}>
                          <Copy size={16} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {withdrawal.user_name || 'N/A'}
                    </Typography>
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {withdrawal.user_email || 'N/A'}
                    </Typography>
                  </Stack>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(`/user/details/${withdrawal.user_id}`)}
                  >
                    View User Profile
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="textSecondary">
            Withdrawal not found
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/withdrawals')}
          >
            Back to Withdrawals
          </Button>
        </Box>
      )}

      {/* Approval/Rejection Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogAction === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
        </DialogTitle>
        <DialogContent>
          {withdrawal && (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                {dialogAction === 'approve'
                  ? 'Are you sure you want to approve this withdrawal request? This will process the payment to the user\'s wallet.'
                  : 'Are you sure you want to reject this withdrawal request? Please provide a reason for rejection.'}
              </DialogContentText>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">User:</Typography>
                  <Typography variant="body1">{withdrawal.user_name || 'Unknown User'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Amount:</Typography>
                  <Typography variant="body1" color="primary">${parseFloat(withdrawal.amount).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Wallet Address:</Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{withdrawal.address}</Typography>
                </Grid>
                {dialogAction === 'approve' ? (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Approving this withdrawal will automatically process the payment to the user's wallet using the system's cryptocurrency wallet.
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Please ensure there are sufficient funds in the system wallet before proceeding.
                    </Typography>
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Reason for Rejection"
                      multiline
                      rows={3}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      required
                    />
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={processingAction}>
            Cancel
          </Button>
          {dialogAction === 'approve' ? (
            <Button
              onClick={handleApprove}
              color="success"
              variant="contained"
              disabled={processingAction}
              startIcon={processingAction ? <CircularProgress size={20} /> : <TickCircle />}
            >
              {processingAction ? 'Processing...' : 'Process & Approve'}
            </Button>
          ) : (
            <Button
              onClick={handleReject}
              color="error"
              variant="contained"
              disabled={processingAction || !rejectionReason}
              startIcon={processingAction ? <CircularProgress size={20} /> : <CloseCircle />}
            >
              {processingAction ? 'Processing...' : 'Reject'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default WithdrawalDetails;
