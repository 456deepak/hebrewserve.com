import { useState, useMemo } from 'react';
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
  CircularProgress
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Wallet } from 'iconsax-react';
import axios from 'utils/axios';
import { openSnackbar } from 'api/snackbar';
import CommonDatatable from 'helpers/CommonDatatable';
import MainCard from 'components/MainCard';
import Swal from 'sweetalert2';

// Validation schema
const validationSchema = Yup.object({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(10, 'Minimum deposit amount is $10')
    .max(10000, 'Maximum deposit amount is $10,000'),
  txid: Yup.string()
    .required('Transaction ID is required')
    .min(32, 'Transaction ID must be at least 32 characters')
    .max(128, 'Transaction ID must be at most 128 characters'),
  address: Yup.string()
});

export default function DepositFunds() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [depositData, setDepositData] = useState([]);

  // API endpoint for deposit history
  const apiPoint = 'get-all-deposits';

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

  // Form handling
  const formik = useFormik({
    initialValues: {
      amount: '',
      txid: '',
      address: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        // Submit deposit request
        const response = await axios.post('/add-deposit', values);

        if (response.data?.status) {
          // Show success message
          Swal.fire({
            title: 'Deposit Submitted!',
            text: 'Your deposit request has been submitted successfully and is pending approval.',
            icon: 'success',
            confirmButtonText: 'OK'
          });

          // Reset form
          resetForm();
        }
      } catch (error) {
        // Show error message
        const errorMessage = error.response?.data?.message || error.response?.data?.msg || 'Failed to submit deposit request';

        // Show regular error message
        openSnackbar({
          open: true,
          message: errorMessage,
          variant: 'alert',
          alert: {
            color: 'error'
          }
        });
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MainCard title="Deposit Funds">
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="amount">Amount ($)</InputLabel>
                    <OutlinedInput
                      id="amount"
                      type="number"
                      value={formik.values.amount}
                      name="amount"
                      placeholder="Enter deposit amount"
                      onChange={formik.handleChange}
                      error={formik.touched.amount && Boolean(formik.errors.amount)}
                      fullWidth
                    />
                    {formik.touched.amount && formik.errors.amount && (
                      <FormHelperText error>{formik.errors.amount}</FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="txid">Transaction ID</InputLabel>
                    <OutlinedInput
                      id="txid"
                      type="text"
                      value={formik.values.txid}
                      name="txid"
                      placeholder="Enter transaction ID"
                      onChange={formik.handleChange}
                      error={formik.touched.txid && Boolean(formik.errors.txid)}
                      fullWidth
                    />
                    {formik.touched.txid && formik.errors.txid && (
                      <FormHelperText error>{formik.errors.txid}</FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="address">Wallet Address (Optional)</InputLabel>
                    <OutlinedInput
                      id="address"
                      type="text"
                      value={formik.values.address}
                      name="address"
                      placeholder="Enter wallet address (optional)"
                      onChange={formik.handleChange}
                      error={formik.touched.address && Boolean(formik.errors.address)}
                      fullWidth
                    />
                    {formik.touched.address && formik.errors.address && (
                      <FormHelperText error>{formik.errors.address}</FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <LoadingButton
                    disableElevation
                    loading={loading}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Wallet />}
                  >
                    Submit Deposit
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={6}>
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
                1. Enter the amount you wish to deposit (minimum $10, maximum $10,000).
              </Typography>
              <Typography variant="body1">
                2. Make the payment to the following wallet address:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              >
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                  0x1234567890abcdef1234567890abcdef12345678
                </Typography>
              </Paper>
              <Typography variant="body1">
                3. Enter the transaction ID from your payment.
              </Typography>
              <Typography variant="body1">
                4. Optionally, enter your wallet address if you made the payment from a different wallet.
              </Typography>
              <Typography variant="body1">
                5. Submit your deposit request.
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Note: Your deposit will be processed within 24 hours after confirmation on the blockchain.
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <MainCard title="Deposit History">
            <CommonDatatable columns={columns} apiPoint={apiPoint} type={1} />
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}
