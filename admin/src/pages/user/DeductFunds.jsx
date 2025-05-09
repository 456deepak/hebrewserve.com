// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// project-imports
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';
import { FormControl, MenuItem, Select, Autocomplete, CircularProgress } from '@mui/material';
import axios from 'utils/axios';
import { useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { MoneyRemove } from 'iconsax-react';

/**
 * 'Enter your email'
 * yup.string Expected 0 arguments, but got 1 */
const validationSchema = yup.object({
    user_id: yup.string().required('User Id is required'),
    amount: yup.number().required('Amount is required'),
    remark: yup.string().required('Remark is required'),
});

// ==============================|| FORM VALIDATION - LOGIN FORMIK  ||============================== //

export default function DeductFunds() {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userWallets, setUserWallets] = useState({
        main_wallet: 0,
        topup_wallet: 0
    });

    // Manual submit function to handle form submission
    const handleSubmit = async () => {
        // Validate form manually
        
        const errors = {};
        if (!formik.values.user_id) errors.user_id = 'User ID is required';
        if (!formik.values.amount) errors.amount = 'Amount is required';
        if (!formik.values.remark) errors.remark = 'Remark is required';
        
        console.log(formik.values)
        if (Object.keys(errors).length > 0) {
            // Set errors and return
            formik.setErrors(errors);
            return;
        }

        console.log('Manual submit with values:', formik.values);
        setLoading(true);
        
        try {
            // Submit fund deduction request
            console.log('Sending API request to /add-fund-deduct');
            const response = await axios.post('/add-fund-deduct', formik.values);
            console.log('API response:', response.data);

            if (response.data?.status) {
                // Show success message
                openSnackbar({
                    open: true,
                    message: response.data.msg || 'Fund deducted successfully',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                });

                // Reset form
                formik.resetForm();
                setSelectedUser(null);
                setSearchQuery('');
                setUserWallets({
                    main_wallet: 0,
                    topup_wallet: 0
                });
            } else {
                // Show error message
                openSnackbar({
                    open: true,
                    message: response.data?.msg || 'Failed to deduct fund',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                });
            }
        } catch (error) {
            console.error('API error:', error);
            openSnackbar({
                open: true,
                message: error?.response?.data?.msg || error?.message || 'Something went wrong!',
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch users based on search query
    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchQuery || searchQuery.length < 3) return;

            setSearchLoading(true);
            try {
                const response = await axios.get(`/search-users?query=${searchQuery}`);
                console.log(response.data)
                if (response.data?.status && response.data?.result) {
                    setUsers(response.data.result);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setSearchLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Fetch user wallet details when a user is selected
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!selectedUser) return;

            try {
                const response = await axios.get(`/get-user/${selectedUser.id}`);
                if (response.data?.status && response.data?.result) {
                    const userData = response.data.result;
                    console.log(userData)
                    setUserWallets({
                        main_wallet: userData.wallet || 0,
                        topup_wallet: userData.wallet_topup || 0,
                        // token_wallet: userData.wallet_token || 0,
                        // tasksIncome: userData.extra?.tasksIncome || 0,
                        // levelIncome: userData.extra?.levelIncome || 0
                    });

                    // Update the user_id field in the form
                    formik.setFieldValue('user_id', selectedUser.id);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [selectedUser]);

    const formik = useFormik({
        initialValues: {
            user_id: '',
            amount: '',
            remark: '',
            type: 'main_wallet'
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log('Form submitted with values:', values);
            setLoading(true);
            try {
                // Submit fund deduction request
                console.log('Sending API request to /add-fund-deduct');
                const response = await axios.post('/add-fund-deduct', values);
                console.log('API response:', response.data);

                if (response.data?.status) {
                    // Show success message
                    openSnackbar({
                        open: true,
                        message: response.data.msg || 'Fund deducted successfully',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        }
                    });

                    // Reset form
                    formik.resetForm();
                    setSelectedUser(null);
                    setSearchQuery('');
                    setUserWallets({
                        main_wallet: 0,
                        topup_wallet: 0
                    });
                } else {
                    // Show error message
                    openSnackbar({
                        open: true,
                        message: response.data?.msg || 'Failed to deduct fund',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        }
                    });
                }
            } catch (error) {
                console.error('API error:', error);
                openSnackbar({
                    open: true,
                    message: error?.response?.data?.msg || error?.message || 'Something went wrong!',
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

    // Handle user selection
    const handleUserSelect = (event, newValue) => {
        setSelectedUser(newValue);
    };

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Reset form
    const handleReset = () => {
        formik.resetForm();
        setSelectedUser(null);
        setSearchQuery('');
        setUserWallets({
            main_wallet: 0,
            topup_wallet: 0,
            // token_wallet: 0,
            // tasksIncome: 0,
            // levelIncome: 0
        });
    };

    // Get wallet balance based on selected type
    const getWalletBalance = (type) => {
        switch (type) {
            case 'main_wallet':
                return userWallets.main_wallet;
            case 'topup_wallet':
                return userWallets.topup_wallet;
            // case 'token_wallet':
            //     return userWallets.token_wallet;
            // case 'tasksIncome':
            //     return userWallets.tasksIncome;
            // case 'levelIncome':
            //     return userWallets.levelIncome;
            default:
                return 0;
        }
    };

    // Get wallet name based on type
    const getWalletName = (type) => {
        switch (type) {
            case 'main_wallet':
                return 'Main Wallet';
            case 'topup_wallet':
                return 'Topup Wallet';
            // case 'token_wallet':
            //     return 'Token Wallet';
            // case 'tasksIncome':
            //     return 'Tasks Income';
            // case 'levelIncome':
            //     return 'Level Income';
            default:
                return 'Unknown Wallet';
        }
    };

    return (
        <MainCard title="Deduct Funds from User Wallet">
            <Grid container spacing={3}>
                {/* User search */}
                <Grid item xs={12}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="user-search">Search User</InputLabel>
                        <Autocomplete
                            id="user-search"
                            options={users}
                            getOptionLabel={(option) => `${option.username} (${option.name || 'No Name'}) - ${option.id}`}
                            value={selectedUser}
                            onChange={handleUserSelect}
                            loading={searchLoading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Search by username, name, or ID"
                                    onChange={handleSearchChange}
                                    value={searchQuery}
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
                        <Typography variant="caption" color="textSecondary">
                            Type at least 3 characters to search
                        </Typography>
                    </Stack>
                </Grid>

                {/* User wallet details */}
                {selectedUser && (
                    <Grid item xs={12} >
                        <MainCard sx={{ bgcolor: 'background.paper', mb: 2, boxShadow: 1 }}>
                            <Stack spacing={2}>
                                <Typography variant="h5" color="text.primary">User Wallet Details</Typography>
                                <Divider />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Main Wallet:</Typography>
                                        <Typography variant="h6" color="text.primary">${userWallets.main_wallet.toFixed(2)}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Topup Wallet:</Typography>
                                        <Typography variant="h6" color="text.primary">${userWallets.topup_wallet.toFixed(2)}</Typography>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </MainCard>
                    </Grid>
                )}

                {/* Hidden user ID field */}
                <input type="hidden" name="user_id" value={formik.values.user_id} />

                {/* Wallet type selection */}
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="type">Select Wallet to Deduct From</InputLabel>
                        <FormControl fullWidth>
                            <Select
                                id="type"
                                name="type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                            >
                                <MenuItem value="main_wallet">Main Wallet</MenuItem>
                                <MenuItem value="topup_wallet">Topup Wallet</MenuItem>
                            </Select>
                        </FormControl>
                        {selectedUser && (
                            <Typography variant="caption">
                                Available Balance: ${getWalletBalance(formik.values.type).toFixed(2)} in {getWalletName(formik.values.type)}
                            </Typography>
                        )}
                    </Stack>
                </Grid>

                {/* Amount field */}
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="amount">Amount to Deduct</InputLabel>
                        <TextField
                            fullWidth
                            id="amount"
                            name="amount"
                            placeholder="Enter amount to deduct"
                            type="number"
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                            helperText={formik.touched.amount && formik.errors.amount}
                            inputProps={{ min: 0, step: 0.01 }}
                        />
                    </Stack>
                </Grid>

                {/* Remark field */}
                <Grid item xs={12}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="remark">Remark</InputLabel>
                        <TextField
                            fullWidth
                            id="remark"
                            name="remark"
                            placeholder="Enter reason for deduction"
                            value={formik.values.remark}
                            onChange={formik.handleChange}
                            error={formik.touched.remark && Boolean(formik.errors.remark)}
                            helperText={formik.touched.remark && formik.errors.remark}
                        />
                    </Stack>
                </Grid>

                {/* Action buttons */}
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Button variant="outlined" onClick={handleReset}>
                            Reset
                        </Button>
                        <LoadingButton
                            loading={loading}
                            variant="contained"
                            color="error"
                            loadingPosition="start"
                            startIcon={<MoneyRemove />}
                            disabled={!selectedUser || !formik.values.amount || !formik.values.remark}
                            onClick={handleSubmit}
                        >
                            Deduct Fund
                        </LoadingButton>
                    </Stack>
                </Grid>
            </Grid>
        </MainCard>
    );
}
