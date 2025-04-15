import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Divider,
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
  CircularProgress
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Eye, EyeSlash } from 'iconsax-react';
import Swal from 'sweetalert2';

// hooks
import useAuth from 'hooks/useAuth';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
            <Typography component={RouterLink} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Don't have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              username: '',
              password: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().max(255).required('Username is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              try {
                await login(values.username, values.password);

                // Show success message
                Swal.fire({
                  icon: 'success',
                  title: 'Login Successful',
                  text: `Welcome back, ${values.username}!`,
                  timer: 1500,
                  showConfirmButton: false
                });

                console.log('Login successful, redirecting to dashboard...');
                // Redirect to dashboard analytics
                navigate('/dashboard/analytics', { replace: true });
              } catch (err) {
                console.error('Login error:', err);
                setStatus({ success: false });
                setErrors({ submit: err.response?.data?.message || 'Invalid credentials. Please try again.' });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Username/Email */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="username">Username/Email</InputLabel>
                      <OutlinedInput
                        id="username"
                        type="text"
                        value={values.username}
                        name="username"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter username or email"
                        fullWidth
                        error={Boolean(touched.username && errors.username)}
                      />
                      {touched.username && errors.username && (
                        <FormHelperText error id="helper-text-username">
                          {errors.username}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Password */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                  </Grid>

                  {/* Remember Me & Forgot Password */}
                  <Grid item xs={12} sx={{ mt: -1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <FormControlLabel
                        control={<Checkbox name="remember" color="primary" size="small" />}
                        label={<Typography variant="body2">Keep me signed in</Typography>}
                      />
                      <Link
                        variant="body2"
                        component={RouterLink}
                        to="/forgot-password"
                        color="primary"
                        sx={{ textDecoration: 'none' }}
                      >
                        Forgot Password?
                      </Link>
                    </Stack>
                  </Grid>

                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}

                  {/* Login Button */}
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
                      {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Login'}
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

export default Login;
