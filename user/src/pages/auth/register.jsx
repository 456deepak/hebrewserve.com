import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
  MenuItem,
  Select,
  TextField,
  CircularProgress
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'utils/axios';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { Eye, EyeSlash } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import countries from 'data/countries';
import Swal from 'sweetalert2';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [referralValid, setReferralValid] = useState(null);
  const [referralChecking, setReferralChecking] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [emailChecking, setEmailChecking] = useState(false);
  const [initialReferralId, setInitialReferralId] = useState('');
  const [termsLink, setTermsLink] = useState('/user/terms');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  // Check if referral ID exists
  const checkReferralId = async (referralId) => {
    if (!referralId || referralId.trim() === '') {
      setReferralValid(false);
      return false;
    }

    // Special case for 'admin' - always valid
    if (referralId.trim() === 'admin') {
      setReferralValid(true);
      return true;
    }

    setReferralChecking(true);
    try {
      const response = await axios.post('/user/checkReferID', { refer_id: referralId }); // Keep as refer_id for this API
      const isValid = response.data.status || response.data.success;
      setReferralValid(isValid);
      return isValid;
    } catch (error) {
      console.error('Error checking referral ID:', error);
      setReferralValid(false);
      return false;
    } finally {
      setReferralChecking(false);
    }
  };

  // Check if email format is valid
  const checkEmail = async (email) => {
    if (!email || !email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
      setEmailValid(false);
      return false;
    }

    // Since there's no specific API endpoint for checking email uniqueness,
    // we'll just validate the format here and let the server handle uniqueness
    // during registration
    setEmailValid(true);
    return true;
  };

  // Function to get a default sponsor ID
  const getDefaultSponsorId = async () => {
    try {
      const response = await axios.get('/user/get-default-sponsor');
      if (response.data.status || response.data.success) {
        return response.data.data?.refer_id || 'admin';
      }
    } catch (error) {
      console.error('Error getting default sponsor:', error);
    }
    return 'admin'; // Fallback to admin if API fails
  };

  useEffect(() => {
    changePassword('');

    // Get a default sponsor ID when the page loads
    getDefaultSponsorId().then(defaultId => {
      // We'll use this in the Formik initialValues
      setInitialReferralId(defaultId);
      // Pre-validate it
      if (defaultId === 'admin') {
        setReferralValid(true);
      } else {
        checkReferralId(defaultId);
      }
    });
  }, []);

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Register</Typography>
            <Typography component={RouterLink} to="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Already have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              referralId: initialReferralId,
              password: '',
              confirmPassword: '',
              name: '',
              mobile: '',
              email: '',
              terms: false,
              submit: null
            }}
            enableReinitialize
            validationSchema={Yup.object().shape({
              referralId: Yup.string().required('Sponsor ID is required'),
              password: Yup.string()
                .max(255)
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters'),
              confirmPassword: Yup.string()
                .required('Confirm Password is required')
                .oneOf([Yup.ref('password')], 'Passwords must match'),
              name: Yup.string().max(255).required('Name is required'),
              mobile: Yup.string()
                .required('Mobile number is required')
                .matches(/^[0-9+\-\s]+$/, 'Invalid mobile number'),
              email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
              terms: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              try {
                // Validate referral ID
                const isReferralValid = await checkReferralId(values.referralId);
                if (!isReferralValid) {
                  setErrors({ referralId: 'Invalid Sponsor ID' });
                  return;
                }

                // Validate email uniqueness
                const isEmailValid = await checkEmail(values.email);
                if (!isEmailValid) {
                  setErrors({ email: 'Email is already registered' });
                  return;
                }

                // Submit registration
                const response = await axios.post('/user/signup', {
                  referralId: values.referralId, // Changed from refer_id to referralId to match backend expectation
                  password: values.password,
                  name: values.name,
                  phone_number: values.mobile,
                  email: values.email,
                  userAddress: values.email // Set userAddress to email for login purposes
                });

                if (response.data.status || response.data.success) {
                  // Check if a sponsor ID was returned in the response
                  const sponsorID = response.data.data?.sponsorID;

                  Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    html: sponsorID
                      ? `Your account has been created successfully.<br><br><strong>Your Sponsor ID:</strong> ${sponsorID}<br><br>Please save this ID for future reference. You'll need it when others register using your sponsorship.`
                      : 'Your account has been created successfully. Please check your email for verification.',
                    confirmButtonText: 'Go to Login'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate('/login', { replace: true });
                    }
                  });
                  setStatus({ success: true });
                } else {
                  setStatus({ success: false });
                  setErrors({ submit: response.data.msg || 'Registration failed' });
                }
              } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.response?.data?.msg || 'Registration failed. Please try again.' });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue, setFieldTouched }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Sponsor ID */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <InputLabel htmlFor="referralId">Sponsor ID*</InputLabel>
                        <Button
                          variant="text"
                          size="small"
                          color="primary"
                          onClick={async () => {
                            try {
                              // Get a default sponsor ID from the system
                              const response = await axios.get('/user/get-default-sponsor');
                              if (response.data.status || response.data.success) {
                                const defaultSponsorId = response.data.data?.refer_id || 'admin';
                                setFieldValue('referralId', defaultSponsorId);
                                setFieldTouched('referralId', true);
                                // For admin, we don't need to check as it's always valid
                                if (defaultSponsorId === 'admin') {
                                  setReferralValid(true);
                                } else {
                                  checkReferralId(defaultSponsorId);
                                }
                              }
                            } catch (error) {
                              console.error('Error getting default sponsor:', error);
                              // Fallback to a default value if API fails
                              setFieldValue('referralId', 'admin');
                              setFieldTouched('referralId', true);
                              // Admin is always valid
                              setReferralValid(true);
                            }
                          }}
                        >
                          Get Sponsor ID
                        </Button>
                      </Box>
                      <OutlinedInput
                        id="referralId"
                        type="text"
                        value={values.referralId}
                        name="referralId"
                        onBlur={(e) => {
                          handleBlur(e);
                          checkReferralId(values.referralId);
                        }}
                        onChange={(e) => {
                          handleChange(e);
                          setReferralValid(null);
                        }}
                        placeholder="Enter sponsor ID"
                        fullWidth
                        error={Boolean(touched.referralId && errors.referralId)}
                        endAdornment={
                          referralChecking ? (
                            <InputAdornment position="end">
                              <CircularProgress size={20} />
                            </InputAdornment>
                          ) : referralValid !== null ? (
                            <InputAdornment position="end">
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  bgcolor: referralValid ? 'success.main' : 'error.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {referralValid ? '✓' : '✗'}
                              </Box>
                            </InputAdornment>
                          ) : null
                        }
                      />
                      {touched.referralId && errors.referralId && (
                        <FormHelperText error id="helper-text-referralId">
                          {errors.referralId}
                        </FormHelperText>
                      )}
                      <FormHelperText>
                        Click "Get Sponsor ID" to automatically get a valid sponsor ID, or enter one manually if you have it.
                      </FormHelperText>
                    </Stack>
                  </Grid>

                  {/* Password */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password">Password*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          changePassword(e.target.value);
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                              color="secondary"
                            >
                              {showPassword ? <EyeSlash /> : <Eye />}
                            </IconButton>
                          </InputAdornment>
                        }
                        placeholder="Enter password"
                      />
                      {touched.password && errors.password && (
                        <FormHelperText error id="helper-text-password">
                          {errors.password}
                        </FormHelperText>
                      )}
                    </Stack>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle1" fontSize="0.75rem">
                            {level?.label}
                          </Typography>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>

                  {/* Confirm Password */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="confirmPassword">Confirm Password*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={values.confirmPassword}
                        name="confirmPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={handleClickShowConfirmPassword}
                              edge="end"
                              color="secondary"
                            >
                              {showConfirmPassword ? <EyeSlash /> : <Eye />}
                            </IconButton>
                          </InputAdornment>
                        }
                        placeholder="Confirm password"
                      />
                      {touched.confirmPassword && errors.confirmPassword && (
                        <FormHelperText error id="helper-text-confirm-password">
                          {errors.confirmPassword}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Name */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">Name*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.name && errors.name)}
                        id="name"
                        type="text"
                        value={values.name}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your name"
                      />
                      {touched.name && errors.name && (
                        <FormHelperText error id="helper-text-name">
                          {errors.name}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Country */}
                  {/* <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="country">Country*</InputLabel>
                      <Select
                        fullWidth
                        error={Boolean(touched.country && errors.country)}
                        id="country"
                        value={values.country}
                        name="country"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        displayEmpty
                      >
                        <MenuItem disabled value="">
                          -- Select Country --
                        </MenuItem>
                        {countries.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.country && errors.country && (
                        <FormHelperText error id="helper-text-country">
                          {errors.country}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid> */}

                  {/* Mobile */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="mobile">Mobile*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.mobile && errors.mobile)}
                        id="mobile"
                        type="text"
                        value={values.mobile}
                        name="mobile"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                      />
                      {touched.mobile && errors.mobile && (
                        <FormHelperText error id="helper-text-mobile">
                          {errors.mobile}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email">Email*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.email && errors.email)}
                        id="email"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={(e) => {
                          handleBlur(e);
                          checkEmail(values.email);
                        }}
                        onChange={(e) => {
                          handleChange(e);
                          setEmailValid(null);
                        }}
                        placeholder="Enter email address"
                        endAdornment={
                          emailChecking ? (
                            <InputAdornment position="end">
                              <CircularProgress size={20} />
                            </InputAdornment>
                          ) : emailValid !== null ? (
                            <InputAdornment position="end">
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  bgcolor: emailValid ? 'success.main' : 'error.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {emailValid ? '✓' : '✗'}
                              </Box>
                            </InputAdornment>
                          ) : null
                        }
                      />
                      {touched.email && errors.email && (
                        <FormHelperText error id="helper-text-email">
                          {errors.email}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Terms */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.terms}
                            onChange={handleChange}
                            name="terms"
                            color="primary"
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            I agree to the{' '}
                            <Link component={RouterLink} to={termsLink} target="_blank" underline="hover">
                              Terms and Conditions
                            </Link>
                          </Typography>
                        }
                      />
                      {touched.terms && errors.terms && (
                        <FormHelperText error id="helper-text-terms">
                          {errors.terms}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default Register;
