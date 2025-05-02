import { useState, useMemo } from 'react';
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

  // Get user data from Auth context
  const { user } = useAuth();

  // Handle tab change
  const handleTabChange = (event, newValue) => {
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
                        ${parseFloat(user?.extra?.deposits || 0).toFixed(2)}
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
                        ${parseFloat(user?.extra?.withdrawals || 0).toFixed(2)}
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
