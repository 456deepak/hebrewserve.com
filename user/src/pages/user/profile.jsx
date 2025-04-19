import { useOutletContext } from 'react-router';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import InputLabel from '@mui/material/InputLabel';
import Autocomplete from '@mui/material/Autocomplete';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import MainCard from 'components/MainCard';
import countries from 'data/countries';
import { openSnackbar } from 'api/snackbar';

// assets
import { Add, Home3 } from 'iconsax-react';
import axios from 'utils/axios';
import { useContext, useEffect, useState } from 'react';
import LoadingButton from 'components/@extended/LoadingButton';
import useAuth from 'hooks/useAuth';

// styles & constant
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = { PaperProps: { style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP } } };

import {
    CitySelect,
    CountrySelect,
    StateSelect,
    LanguageSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";


function useInputRef() {
    return useOutletContext();
}

// ==============================|| USER PROFILE - PERSONAL ||============================== //

export default function TabPersonal() {

    const [user, setUser] = useState()
    const [countryid, setCountryid] = useState(0);
    const [stateid, setstateid] = useState(0);

    const { updateProfile } = useAuth();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        setUser(user)
    }, [])

    const handleChangeDay = (event, date, setFieldValue) => {
        setFieldValue('dob', new Date(date.setDate(parseInt(event.target.value, 10))));
    };

    const handleChangeMonth = (event, date, setFieldValue) => {
        setFieldValue('dob', new Date(date.setMonth(parseInt(event.target.value, 10))));
    };

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    const inputRef = useInputRef();

    return (
        <MainCard
            content={false}
            title="Personal Information"
            sx={{
                bgcolor: '#2B3139',
                '& .MuiCardHeader-root': {
                    color: '#FFFFFF',
                    p: 3,
                    bgcolor: '#1E2026'
                },
                '& .MuiInputLabel-root': {
                    color: '#E0E3E7',
                    fontSize: '0.875rem'
                }
            }}
        >
            <Formik
                initialValues={{
                    firstname: user?.name?.split(' ')[0],
                    lastname: user?.name?.split(' ')[1],
                    email: user?.email,
                    dob: new Date((user?.dob || null)),
                    contact: user?.phone_number,
                    withdraw_wallet: user?.withdraw_wallet || '',
                    address: user?.address,
                    address1: '',
                    country: user?.country,
                    country_code: user?.country_code || '+91',
                    state: user?.state,
                    city: user?.city,
                    submit: null
                }}
                enableReinitialize={true}
                validationSchema={Yup.object().shape({
                    firstname: Yup.string().max(255).required('First Name is required.'),
                    lastname: Yup.string().max(255).required('Last Name is required.'),
                    email: Yup.string().email('Invalid email address.').max(255).required('Email is required.'),
                    dob: Yup.date().max(maxDate, 'Age should be 18+ years.'),
                    contact: Yup.number(),
                        // .test('len', 'Contact should be exactly 10 digit', (val) => val?.toString().length === 10),
                        // .required('Phone number is required'),
                    // wallet_address: Yup.string().required('Wallet Address is required'),
                    withdraw_wallet: Yup.string()
                        .matches(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid Ethereum address (0x...)')
                        .required('Withdrawal wallet address is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        let name = `${values?.firstname} ${values?.lastname}`
                        let dob = new Date(values?.dob).toLocaleDateString("en-US", { year: 'numeric', month: 'numeric', day: 'numeric' })
                        values = {
                            ...values,
                            name,
                            dob,
                            phone_number: values?.contact
                        }

                        delete values?.firstname
                        delete values?.lastname
                        delete values?.skill
                        delete values?.submit
                        delete values?.address1
                        delete values?.contact

                        const response = await axios.put('/user/update_profile', values)

                        if (response.status === 200) {
                            updateProfile()
                            openSnackbar({
                                open: true,
                                message: 'Personal profile updated successfully.',
                                variant: 'alert',
                                alert: { color: 'success' }
                            })
                            setStatus({ success: false })
                            setSubmitting(false)
                        } else
                            throw response.data
                    } catch (err) {
                        openSnackbar({
                            open: true,
                            message: err?.message,
                            variant: 'alert',
                            alert: { color: 'error' }
                        })
                        setStatus({ success: false });
                        setErrors({ submit: err.msg });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="personal-first-name">First Name</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="personal-first-name"
                                            value={values.firstname}
                                            name="firstname"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="First Name"
                                            autoFocus
                                            inputRef={inputRef}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: 'grey.800',
                                                    '& fieldset': {
                                                        borderColor: 'grey.700'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'primary.main'
                                                    },
                                                    '& input': {
                                                        color: 'common.white'
                                                    }
                                                }
                                            }}
                                        />
                                        {touched.firstname && errors.firstname && (
                                            <FormHelperText error id="personal-first-name-helper">
                                                {errors.firstname}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="personal-last-name">Last Name</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="personal-last-name"
                                            value={values.lastname}
                                            name="lastname"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Last Name"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: '#1E2026',
                                                    '& fieldset': {
                                                        borderColor: '#3E4554'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#F0B90B'
                                                    },
                                                    '& input': {
                                                        color: '#FFFFFF'
                                                    }
                                                }
                                            }}
                                        />
                                    </Stack>
                                    {touched.lastname && errors.lastname && (
                                        <FormHelperText error id="personal-last-name-helper">
                                            {errors.lastname}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="personal-email">Email Address</InputLabel>
                                        <TextField
                                            type="email"
                                            fullWidth
                                            value={values.email}
                                            name="email"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            id="personal-email"
                                            placeholder="Email Address"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: '#1E2026',
                                                    '& fieldset': {
                                                        borderColor: '#3E4554'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#F0B90B'
                                                    },
                                                    '& input': {
                                                        color: '#FFFFFF'
                                                    }
                                                }
                                            }}
                                        />
                                    </Stack>
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="personal-email-helper">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="dob-month">Date of Birth (+18)</InputLabel>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                            <Select
                                                fullWidth
                                                value={values.dob.getMonth().toString()}
                                                name="dob-month"
                                                onChange={(e) => handleChangeMonth(e, values.dob, setFieldValue)}
                                                sx={{
                                                    bgcolor: '#1E2026',
                                                    color: '#FFFFFF',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#3E4554'
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#F0B90B'
                                                    },
                                                    '& .MuiSvgIcon-root': {
                                                        color: '#FFFFFF'
                                                    }
                                                }}
                                            >
                                                <MenuItem value="0">January</MenuItem>
                                                <MenuItem value="1">February</MenuItem>
                                                <MenuItem value="2">March</MenuItem>
                                                <MenuItem value="3">April</MenuItem>
                                                <MenuItem value="4">May</MenuItem>
                                                <MenuItem value="5">June</MenuItem>
                                                <MenuItem value="6">July</MenuItem>
                                                <MenuItem value="7">August</MenuItem>
                                                <MenuItem value="8">September</MenuItem>
                                                <MenuItem value="9">October</MenuItem>
                                                <MenuItem value="10">November</MenuItem>
                                                <MenuItem value="11">December</MenuItem>
                                            </Select>
                                            <Select
                                                fullWidth
                                                value={values.dob.getDate().toString()}
                                                name="dob-date"
                                                onBlur={handleBlur}
                                                onChange={(e) => handleChangeDay(e, values.dob, setFieldValue)}
                                                MenuProps={MenuProps}
                                                sx={{
                                                    bgcolor: '#1E2026',
                                                    color: '#FFFFFF',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#3E4554'
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#F0B90B'
                                                    },
                                                    '& .MuiSvgIcon-root': {
                                                        color: '#FFFFFF'
                                                    }
                                                }}
                                            >
                                                {[
                                                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
                                                ].map((i) => (
                                                    <MenuItem
                                                        key={i}
                                                        value={i}
                                                        disabled={
                                                            (values.dob.getMonth() === 1 && i > (values.dob.getFullYear() % 4 === 0 ? 29 : 28)) ||
                                                            (values.dob.getMonth() % 2 !== 0 && values.dob.getMonth() < 7 && i > 30) ||
                                                            (values.dob.getMonth() % 2 === 0 && values.dob.getMonth() > 7 && i > 30)
                                                        }
                                                    >
                                                        {i}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    views={['year']}
                                                    value={values.dob}
                                                    maxDate={maxDate}
                                                    onChange={(newValue) => {
                                                        setFieldValue('dob', newValue);
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            bgcolor: '#1E2026',
                                                            color: '#FFFFFF',
                                                            '& fieldset': {
                                                                borderColor: '#3E4554'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: '#F0B90B'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </Stack>
                                    </Stack>
                                    {touched.dob && errors.dob && (
                                        <FormHelperText error id="personal-dob-helper">
                                            {errors.dob}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="personal-phone">Phone Number</InputLabel>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                            <Select
                                                value={values.country_code}
                                                name="country_code"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                sx={{
                                                    bgcolor: '#1E2026',
                                                    color: '#FFFFFF',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#3E4554'
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#F0B90B'
                                                    },
                                                    '& .MuiSvgIcon-root': {
                                                        color: '#FFFFFF'
                                                    }
                                                }}
                                            >
                                                {
                                                    values?.country_code
                                                        ?
                                                        <MenuItem selected value={values?.country_code}>{values?.country_code}</MenuItem>
                                                        : ""
                                                }
                                                <MenuItem value="+91">+91</MenuItem>
                                                <MenuItem value="1-671">1-671</MenuItem>
                                                <MenuItem value="+36">+36</MenuItem>
                                                <MenuItem value="(225)">(255)</MenuItem>
                                                <MenuItem value="+39">+39</MenuItem>
                                                <MenuItem value="1-876">1-876</MenuItem>
                                                <MenuItem value="+7">+7</MenuItem>
                                                <MenuItem value="(254)">(254)</MenuItem>
                                                <MenuItem value="(373)">(373)</MenuItem>
                                                <MenuItem value="1-664">1-664</MenuItem>
                                                <MenuItem value="+95">+95</MenuItem>
                                                <MenuItem value="(264)">(264)</MenuItem>
                                            </Select>
                                            <TextField
                                                fullWidth
                                                id="personal-contact"
                                                value={values.contact}
                                                name="contact"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Contact Number"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        bgcolor: '#1E2026',
                                                        '& fieldset': {
                                                            borderColor: '#3E4554'
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#F0B90B'
                                                        },
                                                        '& input': {
                                                            color: '#FFFFFF'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Stack>
                                    </Stack>
                                    {touched.contact && errors.contact && (
                                        <FormHelperText error id="personal-contact-helper">
                                            {errors.contact}
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="personal-withdraw_wallet">
                                            Withdrawal Wallet Address
                                            <Chip
                                                label="For Withdrawals"
                                                size="small"
                                                color="warning"
                                                sx={{ ml: 1, fontSize: '0.7rem' }}
                                            />
                                        </InputLabel>
                                        <TextField
                                            fullWidth
                                            id="personal-withdraw_wallet"
                                            value={values.withdraw_wallet}
                                            name="withdraw_wallet"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="0x..."
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: '#1E2026',
                                                    '& fieldset': {
                                                        borderColor: '#3E4554'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#F0B90B'
                                                    },
                                                    '& input': {
                                                        color: '#FFFFFF'
                                                    }
                                                }
                                            }}
                                        />
                                        <FormHelperText>
                                            Enter your Ethereum wallet address for withdrawals. This is the only address you'll be able to withdraw funds to.
                                        </FormHelperText>
                                    </Stack>
                                    {touched.withdraw_wallet && errors.withdraw_wallet && (
                                        <FormHelperText error id="personal-withdraw_wallet-helper">
                                            {errors.withdraw_wallet}
                                        </FormHelperText>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                        <CardHeader title="Address" />
                        <Divider />
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="personal-addrees1">Address</InputLabel>
                                        <TextField
                                            multiline
                                            rows={3}
                                            fullWidth
                                            id="personal-addrees1"
                                            value={values.address}
                                            name="address"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Address 01"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: 'grey.800',
                                                    '& fieldset': {
                                                        borderColor: 'grey.700'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'primary.main'
                                                    },
                                                    '& input': {
                                                        color: 'common.white'
                                                    }
                                                }
                                            }}
                                        />
                                    </Stack>
                                    {touched.address && errors.address && (
                                        <FormHelperText error id="personal-address-helper">
                                            {errors.address}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="personal-state">Country</InputLabel>
                                        <CountrySelect
                                            onChange={(e) => {
                                                setFieldValue("country", e.name);
                                                setFieldValue("country_code", `+${e.phone_code}`);
                                                setCountryid(e.id);
                                            }}
                                            placeHolder={values?.country || "Select Country"}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: 'grey.800',
                                                    '& fieldset': {
                                                        borderColor: 'grey.700'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'primary.main'
                                                    },
                                                    '& input': {
                                                        color: 'common.white'
                                                    }
                                                }
                                            }}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="personal-state">State</InputLabel>
                                        <StateSelect
                                            countryid={countryid}
                                            onChange={(e) => {
                                                setFieldValue("state", e.name);
                                                setstateid(e.id);
                                            }}
                                            placeHolder={values?.state || "Select State"}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: 'grey.800',
                                                    '& fieldset': {
                                                        borderColor: 'grey.700'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'primary.main'
                                                    },
                                                    '& input': {
                                                        color: 'common.white'
                                                    }
                                                }
                                            }}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="personal-state">City</InputLabel>
                                        <CitySelect
                                            countryid={countryid}
                                            stateid={stateid}
                                            onChange={(e) => {
                                                setFieldValue("city", e.name)
                                            }}
                                            placeHolder={values?.city || "Select City"}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: '#1E2026',
                                                    '& fieldset': {
                                                        borderColor: '#3E4554'
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#F0B90B'
                                                    },
                                                    '& input': {
                                                        color: '#FFFFFF'
                                                    }
                                                }
                                            }}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                                        <LoadingButton
                                            type="submit"
                                            loading={isSubmitting}
                                            disabled={isSubmitting || Object.keys(errors).length !== 0}
                                            variant="contained"
                                            sx={{
                                                bgcolor: '#F0B90B',
                                                color: '#FFFFFF',
                                                '&:hover': {
                                                    bgcolor: '#F0B90B',
                                                    opacity: 0.9
                                                }
                                            }}
                                        >
                                            Save Changes
                                        </LoadingButton>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                )}
            </Formik>
        </MainCard>
    );
}
