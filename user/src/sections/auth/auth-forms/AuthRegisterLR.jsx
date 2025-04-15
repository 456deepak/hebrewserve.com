import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';

// third-party
import * as Yup from 'yup';
import { Form, Formik } from 'formik';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { openSnackbar } from 'api/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import { MenuItem, Select } from '@mui/material';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {
  const { register, checkReferID } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const position = searchParams.get("position")
  const refID = searchParams.get("refID")

  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  /********************
   * REFER ID WORK
   ********************/

  const [refer_id, setRefer_id] = useState('');
  const [binaryRegistration, setBinaryRegistration] = useState(process.env.VITE_APP_BINARY_REGISTRATION);

  useEffect(() => {
    if (refID) 
      checkRefID(refID)
  }, [refID, position])

  const checkRefID = (data) => {
    checkReferID(data)
      .then((res) => {
        console.log(res.data?.result._id);
        setRefer_id(res.data?.result._id);
      })
      .catch((error) => {
        setRefer_id({ msg: 'Invalid Refer ID!' });
      });
  }

  const customHandleChange = async (data) => {
    setRefer_id(data)
    if (!data || data.length < 5 || data.length % 2 !== 0) return;
    checkRefID(data)
  };

  /********************
   * REFER ID WORK ENDS
   ********************/

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          position: position || 'L'
        }}
        validationSchema={Yup.object().shape({
          firstname: Yup.string()
            .required('Please enter name')
            .matches(/^[A-Za-z ]+$/, 'Only alphabetical characters and space are allowed')
            .max(30, 'Maximum limit is 30 characters'),
          lastname: Yup.string()
            .required('Please enter name')
            .matches(/^[A-Za-z ]+$/, 'Only alphabetical characters and space are allowed')
            .max(30, 'Maximum limit is 30 characters'),
          email: Yup.string()
            .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address')
            .required('Email is required'),
          password: Yup.string()
            .required('Please enter password')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[A-Z]/, 'Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 digit and 1 special character')
            .matches(/[a-z]/, 'Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 digit and 1 special character')
            .matches(/\d/, 'Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 digit and 1 special character')
            .matches(
              /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/,
              'Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 digit and 1 special character'
            ),
          position: Yup.string().required('Please select a position')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (refer_id?.msg) return alert('Invalid Refer ID !!!');

            await register(refer_id, values.firstname, values.lastname, values.email, values.password, values.position)
              .then(() => {
                setStatus({ success: true });
                setSubmitting(false);
                openSnackbar({
                  open: true,
                  message: 'Your registration has been successfully completed.',
                  variant: 'alert',

                  alert: {
                    color: 'success'
                  }
                });

                setTimeout(() => {
                  navigate('/login', { replace: true });
                }, 1500);
              })
              .catch((e) => {
                throw e;
              });
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors(err.message);
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => {
          return (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="refer_id-signup">Refer ID (Optional)</InputLabel>
                    <OutlinedInput
                      fullWidth
                      id="refer_id-signup"
                      type="text"
                      defaultValue={refer_id}
                      value={refer_id?.msg ? "" : refer_id}
                      onChange={(e) => customHandleChange(e.target.value)}
                      placeholder="Referral ID"
                      inputProps={{}}
                    />
                  </Stack>
                  <FormHelperText error id="helper-text-lastname-signup">
                    {refer_id?.msg}
                  </FormHelperText>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                    <OutlinedInput
                      id="firstname-login"
                      type="firstname"
                      value={values.firstname}
                      name="firstname"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="John"
                      fullWidth
                      error={Boolean(touched.firstname && errors.firstname)}
                    />
                  </Stack>
                  {touched.firstname && errors.firstname && (
                    <FormHelperText error id="helper-text-firstname-signup">
                      {errors.firstname}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.lastname && errors.lastname)}
                      id="lastname-signup"
                      type="lastname"
                      value={values.lastname}
                      name="lastname"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Doe"
                      inputProps={{}}
                    />
                  </Stack>
                  {touched.lastname && errors.lastname && (
                    <FormHelperText error id="helper-text-lastname-signup">
                      {errors.lastname}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                      id="email-login"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="demo@company.com"
                      inputProps={{}}
                    />
                  </Stack>
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-signup">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Grid>

                {binaryRegistration ? (
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email-signup">Position*</InputLabel>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select Position</InputLabel>
                        <Select
                          fullWidth
                          id="position-signup"
                          type="text"
                          value={values.position}
                          name="position"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                        >
                          <MenuItem value={'L'}>Left</MenuItem>
                          <MenuItem value={'R'}>Right</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                ) : (
                  ''
                )}

                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-signup">Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="password-signup"
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
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="secondary"
                          >
                            {showPassword ? <Eye /> : <EyeSlash />}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder="******"
                      inputProps={{}}
                    />
                  </Stack>

                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
                    </FormHelperText>
                  )}
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
                <Grid item xs={12}>
                  {Object.keys(errors).length > 0 ? (
                    <FormHelperText error id="helper-text-email-signup">
                      {JSON.stringify(errors)}
                    </FormHelperText>
                  ) : null}

                  <Typography variant="body2">
                    By Signing up, you agree to our &nbsp;
                    <Link variant="subtitle2" component={RouterLink} to="#">
                      Terms of Service
                    </Link>
                    &nbsp; and &nbsp;
                    <Link variant="subtitle2" component={RouterLink} to="#">
                      Privacy Policy
                    </Link>
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Create Account
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </>
  );
}
