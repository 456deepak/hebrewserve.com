import { useState, useEffect } from 'react';

// material-ui
import {
  Box,
  Button,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
  Tooltip,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import axios from 'utils/axios';
import { openSnackbar } from 'api/snackbar';

// third-party
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// assets
import { TickCircle, CloseCircle, InfoCircle, Wallet, DollarCircle } from 'iconsax-react';

// table
import StaticDataTable from 'helpers/StaticDataTable';

// ==============================|| WITHDRAWAL MANAGEMENT ||============================== //

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`withdrawal-tabpanel-${index}`} aria-labelledby={`withdrawal-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `withdrawal-tab-${index}`,
    'aria-controls': `withdrawal-tabpanel-${index}`
  };
}

const WithdrawalManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // State for tabs
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('approve');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // Fetch withdrawals based on status
  const fetchWithdrawals = async (status = null) => {
    try {
      setLoading(true);
      let url = '/withdrawals';
      if (status !== null) {
        url += `?status=${status}`;
      }

      const response = await axios.get(url);
      console.log("Response for status", status, ":", response.data);

      if (response.data?.status) {
        // Ensure data is an array
        let withdrawalData = [];

        // Handle different response formats
        if (response.data.data && Array.isArray(response.data.data)) {
          withdrawalData = response.data.data;
        } else if (response.data.result && Array.isArray(response.data.result)) {
          withdrawalData = response.data.result;
        } else if (response.data.result && response.data.result.list && Array.isArray(response.data.result.list)) {
          withdrawalData = response.data.result.list;
        } else if (response.data.result && Object.keys(response.data.result).length === 0) {
          // Handle empty object result
          console.log('Empty result object received, using empty array');
          withdrawalData = [];
        } else {
          console.error('Could not find an array in the response:', response.data);
          setWithdrawals([]);
          throw new Error('Invalid data format received from server');
        }

        console.log('Processed withdrawal data for status', status, ':', withdrawalData);

        // If we're fetching a specific status but got all withdrawals, filter them
        if (status !== null && withdrawalData.length > 0) {
          // Always filter to ensure we only have the requested status
          console.log('Filtering withdrawals to match requested status:', status);
          withdrawalData = withdrawalData.filter(w => w.status === status);
        }

        setWithdrawals(withdrawalData);

        // Update stats if available
        if (response.data.stats) {
          setStats(response.data.stats);
        } else {
          // Calculate stats from the withdrawal data if not provided by API
          const calculatedStats = {
            pending: withdrawalData.filter(w => w.status === 0).length,
            approved: withdrawalData.filter(w => w.status === 1).length,
            rejected: withdrawalData.filter(w => w.status === 2).length,
            total: withdrawalData.length
          };
          setStats(calculatedStats);
        }
      } else {
        setWithdrawals([]);
        throw new Error(response.data?.message || 'Failed to fetch withdrawals');
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      setWithdrawals([]); // Ensure we set an empty array on error
      openSnackbar({
        open: true,
        message: error.message || 'Failed to fetch withdrawals',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleChange = (_, newValue) => {
    setValue(newValue);

    // Fetch withdrawals based on tab
    switch (newValue) {
      case 0: // All
        fetchWithdrawals();
        break;
      case 1: // Pending
        fetchWithdrawals(0);
        break;
      case 2: // Approved
        fetchWithdrawals(1);
        break;
      case 3: // Rejected
        fetchWithdrawals(2);
        break;
      default:
        fetchWithdrawals();
    }
  };

  // Handle withdrawal approval
  const handleApprove = async () => {
    try {
      setProcessingAction(true);

      // First, process the actual withdrawal using the own_pay function
      const processResponse = await axios.post('/withdrawals/process', {
        withdrawalId: selectedWithdrawal._id,
        amount: selectedWithdrawal.amount,
        walletAddress: selectedWithdrawal.address
      });

      if (!processResponse.data?.status) {
        throw new Error(processResponse.data?.message || 'Failed to process withdrawal payment');
      }
      console.log("processResponse" + selectedWithdrawal._id)
      console.log("processResponse" + processResponse.data?.transactionHash)
      // If payment was successful, update the withdrawal status
      const response = await axios.post('/withdrawals/approve', {
        withdrawalId: selectedWithdrawal._id,
        txid: processResponse.data?.transactionHash 
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

        // Refresh withdrawals
        fetchWithdrawals(value === 0 ? null : value - 1);
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

      const response = await axios.post('/withdrawals/reject', {
        withdrawalId: selectedWithdrawal._id,
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

        // Refresh withdrawals
        fetchWithdrawals(value === 0 ? null : value - 1);
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

  // Open dialog for approval/rejection
  const openActionDialog = (withdrawal, action) => {
    setSelectedWithdrawal(withdrawal);
    setDialogAction(action);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWithdrawal(null);
    setRejectionReason('');
    setPaymentConfirmed(false);
    setTransactionId('');
  };

  // Initial data fetch
  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // CommonDatatable columns
  const columns = [
    {
      header: 'User',
      accessorKey: 'user_id',
      cell: (props) => (
        <Stack direction="column" spacing={0.5}>
          <Typography variant="subtitle2">{props.row.original.user_name || 'Unknown User'}</Typography>
          <Typography variant="caption" color="textSecondary">{props.row.original.user_email || props.getValue()}</Typography>
        </Stack>
      )
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (props) => (
        <Stack direction="column" spacing={0.5}>
          <Typography variant="subtitle2" color="primary">${parseFloat(props.getValue()).toFixed(2)}</Typography>
          <Typography variant="caption" color="textSecondary">Fee: ${parseFloat(props.row.original.fee || 0).toFixed(2)}</Typography>
        </Stack>
      )
    },
    {
      header: 'Wallet Address',
      accessorKey: 'address',
      cell: (props) => {
        const value = props.getValue();
        return (
          <Tooltip title={value}>
            <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {value ? `${value.substring(0, 8)}...${value.substring(value.length - 8)}` : 'N/A'}
            </Typography>
          </Tooltip>
        );
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (props) => {
        const value = props.getValue();
        let color = theme.palette.warning.main;
        let label = 'Pending';

        if (value === 1) {
          color = theme.palette.success.main;
          label = 'Approved';
        } else if (value === 2) {
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
              fontWeight: 'medium'
            }}
          />
        );
      }
    },
    {
      header: 'Request Date',
      accessorKey: 'created_at',
      cell: (props) => {
        const value = props.getValue();
        return (
          <Typography variant="body2">
            {value ? format(new Date(value), 'MMM dd, yyyy HH:mm') : 'N/A'}
          </Typography>
        );
      }
    },
    {
      header: 'Actions',
      accessorKey: '_id',
      enableSorting: false,
      cell: (props) => {
        const row = props.row.original;

        // Only show action buttons for pending withdrawals
        if (row.status === 0) {
          return (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Approve Withdrawal">
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => openActionDialog(row, 'approve')}
                >
                  <TickCircle variant="Bold" size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Withdrawal">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => openActionDialog(row, 'reject')}
                >
                  <CloseCircle variant="Bold" size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Details">
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => navigate(`/withdrawals/details/${row._id}`)}
                >
                  <InfoCircle variant="Bold" size={20} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }

        // For approved/rejected withdrawals, only show view details
        return (
          <Tooltip title="View Details">
            <IconButton
              color="primary"
              size="small"
              onClick={() => navigate(`/withdrawals/details/${row._id}`)}
            >
              <InfoCircle variant="Bold" size={20} />
            </IconButton>
          </Tooltip>
        );
      }
    }
  ];

  return (
    <MainCard title="Withdrawal Management">
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item lg={3} sm={6} xs={12}>
              <MainCard
                sx={{
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  border: `1px solid ${theme.palette.warning.light}`
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: theme.palette.warning.main,
                      width: 50,
                      height: 50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2
                    }}
                  >
                    <DollarCircle variant="Bold" size={28} color="#fff" />
                  </Box>
                  <Stack>
                    <Typography variant="h3">{stats.pending}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Pending Withdrawals
                    </Typography>
                  </Stack>
                </Stack>
              </MainCard>
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <MainCard
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  border: `1px solid ${theme.palette.success.light}`
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: theme.palette.success.main,
                      width: 50,
                      height: 50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2
                    }}
                  >
                    <TickCircle variant="Bold" size={28} color="#fff" />
                  </Box>
                  <Stack>
                    <Typography variant="h3">{stats.approved}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Approved Withdrawals
                    </Typography>
                  </Stack>
                </Stack>
              </MainCard>
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <MainCard
                sx={{
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  border: `1px solid ${theme.palette.error.light}`
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: theme.palette.error.main,
                      width: 50,
                      height: 50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2
                    }}
                  >
                    <CloseCircle variant="Bold" size={28} color="#fff" />
                  </Box>
                  <Stack>
                    <Typography variant="h3">{stats.rejected}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Rejected Withdrawals
                    </Typography>
                  </Stack>
                </Stack>
              </MainCard>
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <MainCard
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${theme.palette.primary.light}`
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 50,
                      height: 50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2
                    }}
                  >
                    <Wallet variant="Bold" size={28} color="#fff" />
                  </Box>
                  <Stack>
                    <Typography variant="h3">{stats.total}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Withdrawals
                    </Typography>
                  </Stack>
                </Stack>
              </MainCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Tabs and Table */}
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="withdrawal management tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All Withdrawals" {...a11yProps(0)} />
              <Tab
                label={
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle1">Pending</Typography>
                    <Chip
                      label={stats.pending}
                      size="small"
                      color="warning"
                      sx={{ height: 20, minWidth: 20, fontSize: '0.75rem' }}
                    />
                  </Stack>
                }
                {...a11yProps(1)}
              />
              <Tab
                label={
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle1">Approved</Typography>
                    <Chip
                      label={stats.approved}
                      size="small"
                      color="success"
                      sx={{ height: 20, minWidth: 20, fontSize: '0.75rem' }}
                    />
                  </Stack>
                }
                {...a11yProps(2)}
              />
              <Tab
                label={
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle1">Rejected</Typography>
                    <Chip
                      label={stats.rejected}
                      size="small"
                      color="error"
                      sx={{ height: 20, minWidth: 20, fontSize: '0.75rem' }}
                    />
                  </Stack>
                }
                {...a11yProps(3)}
              />
            </Tabs>
          </Box>

          {/* CommonDatatable for each tab */}
          <TabPanel value={value} index={0}>
            <Box sx={{ mt: 2 }}>
              {withdrawals.length > 0 ? (
                <StaticDataTable
                  columns={columns}
                  data={withdrawals}
                  loading={loading}
                  title="All Withdrawals"
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      <Typography>Loading withdrawals...</Typography>
                    </>
                  ) : (
                    <Typography>No withdrawals found</Typography>
                  )}
                </Box>
              )}
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Box sx={{ mt: 2 }}>
              {/* For pending withdrawals (status === 0), we use the data directly from the API */}
              {/* This ensures we're showing exactly what the server returned */}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  <Typography>Loading pending withdrawals...</Typography>
                </Box>
              ) : withdrawals.length > 0 ? (
                <StaticDataTable
                  columns={columns}
                  data={withdrawals}
                  loading={false}
                  title="Pending Withdrawals"
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
                  <Typography>No pending withdrawals found</Typography>
                </Box>
              )}
            </Box>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Box sx={{ mt: 2 }}>
              {/* For approved withdrawals (status === 1), we use the data directly from the API */}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  <Typography>Loading approved withdrawals...</Typography>
                </Box>
              ) : withdrawals.length > 0 ? (
                <StaticDataTable
                  columns={columns}
                  data={withdrawals}
                  loading={false}
                  title="Approved Withdrawals"
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
                  <Typography>No approved withdrawals found</Typography>
                </Box>
              )}
            </Box>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Box sx={{ mt: 2 }}>
              {/* For rejected withdrawals (status === 2), we use the data directly from the API */}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  <Typography>Loading rejected withdrawals...</Typography>
                </Box>
              ) : withdrawals.length > 0 ? (
                <StaticDataTable
                  columns={columns}
                  data={withdrawals}
                  loading={false}
                  title="Rejected Withdrawals"
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
                  <Typography>No rejected withdrawals found</Typography>
                </Box>
              )}
            </Box>
          </TabPanel>
        </Grid>
      </Grid>

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
          {selectedWithdrawal && (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                {dialogAction === 'approve'
                  ? 'Are you sure you want to approve this withdrawal request? This will process the payment to the user\'s wallet.'
                  : 'Are you sure you want to reject this withdrawal request? Please provide a reason for rejection.'}
              </DialogContentText>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">User:</Typography>
                  <Typography variant="body1">{selectedWithdrawal.user_name || 'Unknown User'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Amount:</Typography>
                  <Typography variant="body1" color="primary">${parseFloat(selectedWithdrawal.amount).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Wallet Address:</Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{selectedWithdrawal.address}</Typography>
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

export default WithdrawalManagement;
