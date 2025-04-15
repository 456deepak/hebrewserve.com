import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  CircularProgress
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'utils/axios';
import Swal from 'sweetalert2';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Forgot Password</Typography>
            <Typography component={RouterLink} to="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Back to Login
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          {emailSent ? (
            <Stack spacing={3}>
              <Typography variant="h4" color="success.main">
                Email Sent Successfully!
              </Typography>
              <Typography>
                We have sent a password reset link to your email address. Please check your inbox and follow the instructions to
                reset your password.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/login"
                sx={{ alignSelf: 'flex-start', mt: 2 }}
              >
                Return to Login
              </Button>
            </Stack>
          ) : (
            <Formik
              initialValues={{
                email: '',
                submit: null
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
              })}
              onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                  const response = await axios.post('/user/forgot/password', {
                    email: values.email
                  });

                  if (response.data.status || response.data.success) {
                    setEmailSent(true);
                    setStatus({ success: true });
                  } else {
                    setStatus({ success: false });
                    setErrors({ submit: response.data.msg || 'Something went wrong' });
                  }
                } catch (err) {
                  console.error(err);
                  setStatus({ success: false });
                  setErrors({ submit: err.response?.data?.msg || 'Something went wrong. Please try again.' });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <OutlinedInput
                          fullWidth
                          error={Boolean(touched.email && errors.email)}
                          id="email"
                          type="email"
                          value={values.email}
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                        />
                        {touched.email && errors.email && (
                          <FormHelperText error id="helper-text-email">
                            {errors.email}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    {errors.submit && (
                      <Grid item xs={12}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                      </Grid>
                    )}

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
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          )}
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default ForgotPassword;
