import React, { useState, useMemo, useEffect } from 'react';
import {
  Grid,
  Button,
  InputLabel,
  Stack,
  TextField,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Paper,
  Autocomplete,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'components/MainCard';
import { openSnackbar } from 'api/snackbar';
import axios from 'utils/axios';
import { LoadingButton } from '@mui/lab';
import { ArrowRight2, Home3, SearchNormal1, Refresh, MoneyAdd } from 'iconsax-react';
import CommonDatatable from 'helpers/CommonDatatable';

// Validation schema for fund transfer
const validationSchema = yup.object({
  user_id: yup.string().required('User ID is required'),
  amount: yup.number().required('Amount is required').positive('Amount must be positive'),
  remark: yup.string().required('Remark is required').min(3, 'Remark must be at least 3 characters'),
});

export default function FundTransferManagement() {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Columns for the fund transfers table
  const columns = useMemo(
    () => [
      {
        header: 'User',
        accessorKey: 'username',
        cell: (props) => {
          const row = props.row.original;
          return row.username || row.user || 'N/A';
        }
      },
      {
        header: 'From',
        accessorKey: 'user_from',
        cell: (props) => {
          const value = props.getValue();
          return value =="Admin" ? "Admin" : value;
        }
      },
      {
        header: 'Wallet Type',
        accessorKey: 'to_wallet',
        cell: (props) => {
          const value = props.getValue();
          return value == 'topup' ? 'Topup Wallet' : 'Main Wallet' ;
        }
      },
      {
        header: 'Amount',
        accessorKey: 'amount',
        cell: (props) => {
          const value = props.getValue();
          return value ? `$${Number(value).toFixed(2)}` : '$0.00';
        }
      },
      {
        header: 'Remark',
        accessorKey: 'remark',
        cell: (props) => {
          const value = props.getValue();
          return value || 'No remark';
        }
      },
      {
        header: 'Date',
        accessorKey: 'created_at',
        cell: (props) => {
          const value = props.getValue();
          return value ? new Date(value).toLocaleString() : 'N/A';
        },
        enableColumnFilter: false,
        enableGrouping: false
      }
    ],
    []
  );

  // Form for fund transfer
  const formik = useFormik({
    initialValues: {
      user_id: '',
      amount: '',
      remark: '',
      type: 0 // 0: Main wallet, 1: Topup wallet
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        // Submit fund transfer request
        console.log('Submitting fund transfer:', values);
        const response = await axios.post('/add-fund-transfer', values);
        console.log('Fund transfer response:', response.data);

        if (response.data?.status) {
          // Show success message
          openSnackbar({
            open: true,
            message: response.data.msg || 'Fund transferred successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            }
          });

          // Reset form
          resetForm();
          setSelectedUser(null);
          setSearchQuery('');
          setTransferSuccess(true);

          // Hide success message after 5 seconds
          setTimeout(() => {
            setTransferSuccess(false);
          }, 5000);
        }
      } catch (error) {
        console.error('Fund transfer error:', error.response?.data || error.message);
        // Show error message
        openSnackbar({
          open: true,
          message: error.response?.data?.msg || 'Failed to transfer funds',
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

  // Search for users
  const handleSearch = async () => {
    if (!searchQuery || searchQuery.length < 2) {
      openSnackbar({
        open: true,
        message: 'Please enter at least 2 characters to search',
        variant: 'alert',
        alert: {
          color: 'warning'
        }
      });
      return;
    }

    try {
      setSearchLoading(true);
      const response = await axios.get(`/search-users?query=${searchQuery}`);

      if (response.data?.status) {
        setSearchResults(response.data.result || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle user selection
  const handleUserSelect = (event, user) => {
    setSelectedUser(user);
    if (user) {
      formik.setFieldValue('user_id', user.username);
    } else {
      formik.setFieldValue('user_id', '');
    }
  };

  // Reset the form and selected user
  const handleReset = () => {
    formik.resetForm();
    setSelectedUser(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <Stack spacing={3}>
      <MainCard title="Transfer Funds to User">
        {transferSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Fund transfer completed successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {/* User search section */}
              <Stack spacing={1}>
                <InputLabel>Search User</InputLabel>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    placeholder="Search by username, name, or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                  <LoadingButton
                    variant="contained"
                    onClick={handleSearch}
                    loading={searchLoading}
                    startIcon={<SearchNormal1 />}
                  >
                    Search
                  </LoadingButton>
                </Stack>
              </Stack>

              {/* User selection dropdown */}
              <Autocomplete
                id="user-select"
                options={searchResults}
                getOptionLabel={(option) => `${option.username} (${option.name || 'No name'}) - ${option.email || 'No email'}`}
                value={selectedUser}
                onChange={handleUserSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select User"
                    placeholder="Select a user from search results"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />

              {/* Selected user details */}
              {selectedUser && (
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">Selected User Details</Typography>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Username:</Typography>
                      <Typography variant="body2" fontWeight="bold">{selectedUser.username}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Main Wallet Balance:</Typography>
                      <Typography variant="body2" fontWeight="bold">${selectedUser.wallet?.toFixed(2) || '0.00'}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Topup Wallet Balance:</Typography>
                      <Typography variant="body2" fontWeight="bold">${selectedUser.wallet_topup?.toFixed(2) || '0.00'}</Typography>
                    </Stack>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                {/* User ID field */}
                <Stack spacing={1}>
                  <InputLabel htmlFor="user_id">User ID</InputLabel>
                  <TextField
                    fullWidth
                    id="user_id"
                    name="user_id"
                    type="text"
                    placeholder="Enter User ID or Username"
                    value={formik.values.user_id}
                    onChange={formik.handleChange}
                    error={formik.touched.user_id && Boolean(formik.errors.user_id)}
                    helperText={formik.touched.user_id && formik.errors.user_id}
                    disabled={!!selectedUser}
                  />
                </Stack>

                {/* Amount field */}
                <Stack spacing={1}>
                  <InputLabel htmlFor="amount">Amount</InputLabel>
                  <TextField
                    fullWidth
                    id="amount"
                    name="amount"
                    placeholder="Enter amount to transfer"
                    type="number"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                  />
                </Stack>

                {/* Wallet type selection */}
                <Stack spacing={1}>
                  <InputLabel htmlFor="type">Destination Wallet</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      id="type"
                      name="type"
                      value={formik.values.type}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value={0}>Main Wallet</MenuItem>
                      <MenuItem value={1}>Topup Wallet</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                {/* Remark field */}
                <Stack spacing={1}>
                  <InputLabel htmlFor="remark">Remark</InputLabel>
                  <TextField
                    fullWidth
                    id="remark"
                    name="remark"
                    placeholder="Enter remark for this transfer"
                    type="text"
                    value={formik.values.remark}
                    onChange={formik.handleChange}
                    error={formik.touched.remark && Boolean(formik.errors.remark)}
                    helperText={formik.touched.remark && formik.errors.remark}
                  />
                </Stack>

                {/* Action buttons */}
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    startIcon={<Refresh />}
                  >
                    Reset
                  </Button>
                  <LoadingButton
                    type="submit"
                    loading={loading}
                    variant="contained"
                    loadingPosition="start"
                    startIcon={<MoneyAdd />}
                    disabled={!formik.values.user_id || !formik.values.amount || !formik.values.remark}
                  >
                    Transfer Funds
                  </LoadingButton>
                </Stack>
              </Stack>
            </form>
          </Grid>
        </Grid>
      </MainCard>

      {/* Fund Transfer History */}
      <MainCard title="Fund Transfer History">
        <CommonDatatable
          columns={columns}
          apiPoint="get-all-fund-transfers"
          type={2}
          refreshData={transferSuccess}
        />
      </MainCard>
    </Stack>
  );
}
