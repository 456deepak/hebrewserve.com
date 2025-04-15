// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// project-imports
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';
import { FormControl, MenuItem, Select } from '@mui/material';
import axios from 'utils/axios';

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
    const formik = useFormik({
        initialValues: {
            user_id: '',
            amount: '',
            remark: '',
            type: 'tasksIncome'
        },
        validationSchema,
        onSubmit: async (data) => {

            try {
                // triggering
                const response = await axios.post('/add-fund-deduct/', data);
                if (response.status === 200)
                    openSnackbar({
                        open: true,
                        message: 'Fund Deducted Successfully',
                        variant: 'alert',

                        alert: {
                            color: 'success'
                        }
                    })
            } catch (error) {
                openSnackbar({
                    open: true,
                    message: error?.message || 'Something went wrong !!!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                })
            }
        }
    });

    return (
        <MainCard>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="User ID">User ID</InputLabel>
                            <TextField
                                fullWidth
                                id="User ID"
                                name="user_id"
                                type="text"
                                placeholder="Enter User ID"
                                value={formik.values.user_id}
                                onChange={formik.handleChange}
                                error={formik.touched.user_id && Boolean(formik.errors.user_id)}
                                helperText={formik.touched.user_id && formik.errors.user_id}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="amount">Amount</InputLabel>
                            <TextField
                                fullWidth
                                id="amount"
                                name="amount"
                                placeholder="Enter your amount"
                                type="number"
                                value={formik.values.amount}
                                onChange={formik.handleChange}
                                error={formik.touched.amount && Boolean(formik.errors.amount)}
                                helperText={formik.touched.amount && formik.errors.amount}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="email-signup">Wallet Type</InputLabel>
                            <FormControl fullWidth>
                                {/* <InputLabel id="demo-simple-select-label">Select Wallet Type</InputLabel> */}
                                <Select
                                    fullWidth
                                    id="type-signup"
                                    value={formik.values.type}
                                    name="type"
                                    onChange={formik.handleChange}
                                    inputProps={{}}
                                    autoFocus
                                >
                                    {/* <MenuItem value={0}>Wallet</MenuItem>
                                    <MenuItem value={1}>Topup Wallet</MenuItem> */}
                                    <MenuItem value={'tasksIncome'}>Tasks Wallet</MenuItem>
                                    <MenuItem value={'levelIncome'}>Level Wallet</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="remark">Remark</InputLabel>
                            <TextField
                                fullWidth
                                id="remark"
                                name="remark"
                                placeholder="Enter your remark"
                                type="text"
                                value={formik.values.remark}
                                onChange={formik.handleChange}
                                error={formik.touched.remark && Boolean(formik.errors.remark)}
                                helperText={formik.touched.remark && formik.errors.remark}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="flex-end">
                            <AnimateButton>
                                <Button variant="contained" type="submit">
                                    Transfer Fund
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </MainCard>
    );
}
