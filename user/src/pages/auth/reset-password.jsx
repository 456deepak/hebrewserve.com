import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  CircularProgress
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Eye, EyeSlash } from 'iconsax-react';
import axios from 'utils/axios';
import Swal from 'sweetalert2';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Extract token from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      // If no token is provided, redirect to forgot password
      navigate('/forgot-password');
    }
    
    // Initialize password strength indicator
    changePassword('');
  }, [location, navigate]);

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

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Reset Password</Typography>
            <Typography component={RouterLink} to="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Back to Login
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              password: '',
              confirmPassword: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              password: Yup.string()
                .max(255)
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters'),
              confirmPassword: Yup.string()
                .required('Confirm Password is required')
                .oneOf([Yup.ref('password')], 'Passwords must match')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              try {
                const response = await axios.post('/user/reset/password', {
                  token: token,
                  password: values.password
                });

                if (response.data.status || response.data.success) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Password Reset Successful',
                    text: 'Your password has been reset successfully. You can now login with your new password.',
                    confirmButtonText: 'Go to Login'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate('/login', { replace: true });
                    }
                  });
                  setStatus({ success: true });
                } else {
                  setStatus({ success: false });
                  setErrors({ submit: response.data.msg || 'Password reset failed' });
                }
              } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.response?.data?.msg || 'Password reset failed. Please try again.' });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Password */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password">New Password</InputLabel>
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
                        placeholder="Enter new password"
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
                      <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
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

                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}

                  {/* Reset Button */}
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
                      {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
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

export default ResetPassword;
