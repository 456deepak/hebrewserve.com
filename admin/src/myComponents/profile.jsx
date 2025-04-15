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

export default function UpdateProfile(props) {

    const [user, setUser] = useState(props?.user)
    const [countryid, setCountryid] = useState(0);
    const [stateid, setstateid] = useState(0);

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
        <MainCard content={false} title="Edit Profile" sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}>
            <Formik
                initialValues={{
                    id: user?._id,
                    firstname: user?.name?.split(' ')[0],
                    lastname: user?.name?.split(' ')[1],
                    email: user?.email,
                    dob: new Date((user?.dob || null)),
                    country_code: user?.country_code || '+91',
                    contact: user?.phone_number,
                    wallet_address: user?.wallet_address,
                    address: user?.address,
                    address1: '',
                    country: user?.country,
                    state: user?.state,
                    city: user?.city,
                    submit: null
                }}
                enableReinitialize={true}
                validationSchema={Yup.object().shape({
                    firstname: Yup.string().max(255).optional(),
                    lastname: Yup.string().max(255).optional(),
                    password: Yup.string().max(255).optional(),
                    email: Yup.string().email('Invalid email address.').max(255).optional(),
                    dob: Yup.date().max(maxDate, 'Age should be 18+ years.').optional(),
                    contact: Yup.number()
                        .test('len', 'Contact should be exactly 10 digit', (val) => val?.toString().length === 10)
                        .optional(),
                    wallet_address: Yup.string().optional(),
                    country: Yup.string().optional(),
                    state: Yup.string().optional()
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

                        const response = await axios.put('/update-user-profile', values)

                        if (response.status === 200) {
                            openSnackbar({
                                open: true,
                                message: 'Personal profile updated successfully.',
                                variant: 'alert',
                                alert: { color: 'success' }
                            })
                            setStatus({ success: false })
                            setSubmitting(false)
                            props?.setUpdateProfile(null)
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
                        <Box sx={{ p: 2.5 }}>
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
                                        />
                                    </Stack>
                                    {touched.firstname && errors.firstname && (
                                        <FormHelperText error id="personal-first-name-helper">
                                            {errors.firstname}
                                        </FormHelperText>
                                    )}
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
                                        <InputLabel htmlFor="personal-password">Set New Password</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="personal-password"
                                            value={values.password}
                                            name="password"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Password"
                                        />
                                    </Stack>
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="personal-password-helper">
                                            {errors.password}
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
                                                    sx={{ width: 1 }}
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
                                            <Select value={values.country_code} name="country_code" onBlur={handleBlur} onChange={handleChange}>
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
                                        <InputLabel htmlFor="personal-wallet_address">Wallet Address</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="personal-wallet_address"
                                            value={values.wallet_address}
                                            name="wallet_address"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Wallet Address"
                                        />
                                    </Stack>
                                    {touched.wallet_address && errors.wallet_address && (
                                        <FormHelperText error id="personal-wallet_address-helper">
                                            {errors.wallet_address}
                                        </FormHelperText>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                        <CardHeader title="Address" />
                        <Divider />
                        <Box sx={{ p: 2.5 }}>
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
                                        />
                                    </Stack>
                                    {touched.address && errors.address && (
                                        <FormHelperText error id="personal-address-helper">
                                            {errors.address}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                {/* <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="personal-addrees2">Address 02</InputLabel>
                                        <TextField
                                            multiline
                                            rows={3}
                                            fullWidth
                                            id="personal-addrees2"
                                            value={values.address1}
                                            name="address1"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Address 02"
                                        />
                                    </Stack>
                                </Grid> */}
                                {/* <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="personal-country">Country</InputLabel>
                                        <Autocomplete
                                            id="personal-country"
                                            fullWidth
                                            value={countries.filter((item) => item.code === values?.country)[0]}
                                            onBlur={handleBlur}
                                            onChange={(event, newValue) => {
                                                setFieldValue('country', newValue === null ? '' : newValue.code);
                                            }}
                                            options={countries}
                                            autoHighlight
                                            isOptionEqualToValue={(option, value) => option.code === value?.code}
                                            getOptionLabel={(option) => option.label}
                                            renderOption={(props, option) => (
                                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                    {option.code && (
                                                        <img
                                                            loading="lazy"
                                                            width="20"
                                                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                                            alt=""
                                                        />
                                                    )}
                                                    {option.label}
                                                    {option.code && `(${option.code}) ${option.phone}`}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Choose a country"
                                                    name="country"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: 'new-password' // disable autocomplete and autofill
                                                    }}
                                                />
                                            )}
                                        />
                                    </Stack>
                                    {touched.country && errors.country && (
                                        <FormHelperText error id="personal-country-helper">
                                            {errors.country}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="personal-state">State</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="personal-state"
                                            value={values.state}
                                            name="state"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="State"
                                        />
                                    </Stack>
                                    {touched.state && errors.state && (
                                        <FormHelperText error id="personal-state-helper">
                                            {errors.state}
                                        </FormHelperText>
                                    )}
                                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                                        <LoadingButton type="submit" style={{ margin: "2px" }} disabled={isSubmitting || Object.keys(errors).length !== 0} loading={isSubmitting} variant="contained" loadingPosition="start" startIcon={<Home3 />}>
                                            Save Profile
                                        </LoadingButton>
                                    </Stack>
                                </Grid> */}
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
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                                        <Button variant='contained' onClick={() => props?.setUpdateProfile(null)}>Close</Button>
                                        <LoadingButton type="submit" style={{ margin: "2px" }} disabled={isSubmitting || Object.keys(errors).length !== 0} loading={isSubmitting} variant="contained" loadingPosition="start" startIcon={<Home3 />}>
                                            Save Profile
                                        </LoadingButton>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                        {/* 
                            SKILLS: 
                                <CardHeader title="Skills" />
                                <Divider />
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', p: 2.5, m: 0 }} component="ul">
                                <Autocomplete
                                    multiple
                                    fullWidth
                                    id="tags-outlined"
                                    options={skills}
                                    value={values.skill}
                                    onBlur={handleBlur}
                                    getOptionLabel={(label) => label}
                                    onChange={(event, newValue) => {
                                    setFieldValue('skill', newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} name="skill" placeholder="Add Skills" />}
                                    renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                        key={index}
                                        {...getTagProps({ index })}
                                        variant="combined"
                                        label={option}
                                        deleteIcon={<Add style={{ fontSize: '0.75rem', transform: 'rotate(45deg)' }} />}
                                        sx={{ color: 'text.primary' }}
                                        />
                                    ))
                                    }
                                    sx={{
                                    '& .MuiOutlinedInput-root': {
                                        p: 0,
                                        '& .MuiAutocomplete-tag': { m: 1 },
                                        '& fieldset': { display: 'none' },
                                        '& .MuiAutocomplete-endAdornment': { display: 'none' },
                                        '& .MuiAutocomplete-popupIndicator': { display: 'none' }
                                    }
                                    }}
                                />
                                </Box> 
                        */}
                        {/* 
                            NOTES:
                            <CardHeader title="Note" />
                            <Divider />
                            <Box sx={{ p: 2.5 }}>
                                <TextField
                                    multiline
                                    rows={5}
                                    fullWidth
                                    value={values.note}
                                    name="note"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    id="personal-note"
                                    placeholder="Note"
                                />
                                {touched.note && errors.note && (
                                    <FormHelperText error id="personal-note-helper">
                                        {errors.note}
                                    </FormHelperText>
                                )}
                                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                                    <Button variant="outlined" color="secondary">
                                        Cancel
                                    </Button>
                                    <Button disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
                                        Save
                                    </Button>
                                </Stack>
                            </Box> 
                        */}
                    </form>
                )}
            </Formik>
        </MainCard >
    );
}
