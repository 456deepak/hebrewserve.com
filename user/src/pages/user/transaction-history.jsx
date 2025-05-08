import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Chip,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import {
  ArrowDown,
  ArrowUp,
  ArrowRight,
  WalletMoney,
  MoneyRecive,
  MoneySend,
  Wallet3
} from 'iconsax-react';
import CommonDatatable from 'helpers/CommonDatatable';
import MainCard from 'components/MainCard';
import useAuth from 'hooks/useAuth';
import axios from 'utils/axios';

// Tab Panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`transaction-tabpanel-${index}`}
      aria-labelledby={`transaction-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TransactionHistory() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Get user data from Auth context
  const { user } = useAuth();

  // Fetch deposit and withdrawal totals if not available in user object
  useEffect(() => {
    const fetchTransactionTotals = async () => {
      if (!user) return;

      // If the user already has these values, use them
      if (user?.extra?.deposits !== undefined && user?.extra?.withdrawals !== undefined) {
        setTotalDeposits(parseFloat(user.extra.deposits || 0));
        setTotalWithdrawals(parseFloat(user.extra.withdrawals || 0));
        return;
      }

      setIsLoading(true);
      try {
        // Fetch all deposits
        const depositResponse = await axios.get('/get-all-deposits');
        if (depositResponse.data && depositResponse.data.status) {
          const deposits = depositResponse.data.data?.result || depositResponse.data.data || [];
          // Calculate total deposits by summing up all deposit amounts
          const totalDepositAmount = deposits.reduce((total, deposit) => {
            // Only count approved deposits (status 1 or 2)
            if (deposit.status === 1 || deposit.status === 2) {
              return total + parseFloat(deposit.amount || 0);
            }
            return total;
          }, 0);
          setTotalDeposits(totalDepositAmount);
        } else {
          // Fallback to total_investment if API fails
          setTotalDeposits(parseFloat(user?.total_investment || 0));
        }

        // Fetch all withdrawals
        const withdrawalResponse = await axios.get('/get-all-withdrawals');
        console.log(withdrawalResponse)
        if (withdrawalResponse.data && withdrawalResponse.data.status) {
          const withdrawals = withdrawalResponse.data.result.list 
          // Calculate total withdrawals by summing up all withdrawal amounts
          const totalWithdrawalAmount = withdrawals.reduce((total, withdrawal) => {
            // Only count approved withdrawals (status 1)
            if (withdrawal.status === 1) {
              return total + parseFloat(withdrawal.amount);
            }
            return total;
          }, 0);
         
          setTotalWithdrawals(totalWithdrawalAmount);
        } else {
          // Fallback to wallet_withdraw if API fails
          setTotalWithdrawals(parseFloat(user?.wallet_withdraw || 0));
        }
      } catch (error) {
        console.error('Error fetching transaction totals:', error);
        // Fallback to user object values
        setTotalDeposits(parseFloat(user?.total_investment || 0));
        setTotalWithdrawals(parseFloat(user?.wallet_withdraw || 0));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionTotals();
  }, [user]);

  // Handle tab change
  const handleTabChange = (_event, newValue) => {
    setTabValue(newValue);
  };

  // API endpoints for different transaction types
  const depositApiPoint = 'get-all-deposits';
  const withdrawalApiPoint = 'get-all-withdrawals';
  const transferApiPoint = 'get-all-fund-transfers';

  // Columns for deposit history
  const depositColumns = useMemo(
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
          return txid && txid.length > 20 ? `${txid.substring(0, 10)}...${txid.substring(txid.length - 10)}` : txid || '-';
        }
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const status = props.getValue();
          let statusText = 'Pending';
          let color = theme.palette.warning.main;

          if (status === 0) {
            statusText = 'Processing';
            color = theme.palette.warning.main;
          } else if (status === 2) {
            statusText = 'Completed';
            color = theme.palette.success.main;
          }else if (status === 1) {
            statusText = 'Rejected';
            color = theme.palette.warning.main;
          }
          return (
            <Chip
              label={statusText}
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
        header: 'Date',
        accessorKey: 'created_at',
        cell: (props) => new Date(props.getValue()).toLocaleString()
      }
    ],
    [theme]
  );

  // Columns for withdrawal history
  const withdrawalColumns = useMemo(
    () => [
      {
        header: 'Amount',
        accessorKey: 'amount',
        cell: (props) => `$${parseFloat(props.getValue()).toFixed(2)}`
      },
      {
        header: 'Fee',
        accessorKey: 'fee',
        cell: (props) => `$${parseFloat(props.getValue() || 0).toFixed(2)}`
      },
      {
        header: 'Net Amount',
        accessorKey: 'net_amount',
        cell: (props) => `$${parseFloat(props.getValue() || 0).toFixed(2)}`
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const status = props.getValue();
          let statusText = 'Pending';
          let color = theme.palette.warning.main;

          if (status === 2) {
            statusText = 'Rejected';
            color = theme.palette.warning.main;
          } else if (status === 1) {
            statusText = 'Completed';
            color = theme.palette.success.main;
          }

          return (
            <Chip
              label={statusText}
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
        header: 'Date',
        accessorKey: 'created_at',
        cell: (props) => new Date(props.getValue()).toLocaleString()
      }
    ],
    [theme]
  );

  // Columns for transfer history
  const transferColumns = useMemo(
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
        header: 'Amount',
        accessorKey: 'amount',
        cell: (props) => `$${parseFloat(props.getValue()).toFixed(2)}`
      },
      {
        header: 'Fee',
        accessorKey: 'fee',
        cell: (props) => `$${parseFloat(props.getValue() || 0).toFixed(2)}`
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

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    height: '100%'
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.success.main, 0.2)
                      }}
                    >
                      <MoneyRecive size={24} color={theme.palette.success.main} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Total Deposits
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        ${isLoading ? '...' : parseFloat(user?.extra?.deposits || totalDeposits || user?.total_investment || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    height: '100%'
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.error.main, 0.2)
                      }}
                    >
                      <MoneySend size={24} color={theme.palette.error.main} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Total Withdrawals
                      </Typography>
                      <Typography variant="h4" color="error.main">
                        ${isLoading ? '...' : parseFloat(user?.extra?.withdrawals || totalWithdrawals || user?.wallet_withdraw || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    height: '100%'
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.2)
                      }}
                    >
                      <Wallet3 size={24} color={theme.palette.primary.main} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Current Balance
                      </Typography>
                      <Typography variant="h4" color="primary.main">
                        ${parseFloat(user?.wallet || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <MainCard>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
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
                label="All Transactions"
                icon={<WalletMoney size={18} />}
                iconPosition="start"
              />
              <Tab
                label="Deposits"
                icon={<ArrowDown size={18} />}
                iconPosition="start"
              />
              <Tab
                label="Withdrawals"
                icon={<ArrowUp size={18} />}
                iconPosition="start"
              />
              <Tab
                label="Transfers"
                icon={<ArrowRight size={18} />}
                iconPosition="start"
              />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Recent Deposits
              </Typography>
              <CommonDatatable columns={depositColumns} apiPoint={depositApiPoint} type={1} limit={5} />

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Recent Withdrawals
              </Typography>
              <CommonDatatable columns={withdrawalColumns} apiPoint={withdrawalApiPoint} type={1} limit={5} />

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Recent Transfers
              </Typography>
              <CommonDatatable columns={transferColumns} apiPoint={transferApiPoint} type={1} limit={5} />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <CommonDatatable columns={depositColumns} apiPoint={depositApiPoint} type={1} />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <CommonDatatable columns={withdrawalColumns} apiPoint={withdrawalApiPoint} type={1} />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <CommonDatatable columns={transferColumns} apiPoint={transferApiPoint} type={1} />
            </TabPanel>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}
