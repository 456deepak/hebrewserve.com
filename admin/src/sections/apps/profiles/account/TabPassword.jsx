import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

// project-imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import { openSnackbar } from 'api/snackbar';
import { isNumber, isLowercaseChar, isUppercaseChar, isSpecialChar, minLength } from 'utils/password-validation';
import useAuth from 'hooks/useAuth';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import { Eye, EyeSlash, Minus, TickCircle } from 'iconsax-react';

// ==============================|| ACCOUNT PROFILE - PASSWORD CHANGE ||============================== //

export default function TabPassword() {
  const { changePassword } = useAuth();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <MainCard title="Change Admin Password">
      <Formik
        initialValues={{
          old: '',
          password: '',
          confirm: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          old: Yup.string().required('Old Password is required'),
          password: Yup.string()
            .required('New Password is required')
            .matches(
              /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
              'Password must contain at least 8 characters, one uppercase, one number and one special case character'
            ),
          confirm: Yup.string()
            .required('Confirm Password is required')
            .test('confirm', `Passwords don't match.`, (confirm, yup) => yup.parent.password === confirm)
        })}
        onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
          try {
            const response = await changePassword(values.old, values.password);

            if (response.status) {
              openSnackbar({
                open: true,
                message: response.msg || 'Password changed successfully.',
                variant: 'alert',
                alert: { color: 'success' }
              });

              resetForm();
              setStatus({ success: true });
            } else {
              throw new Error(response.msg || 'Failed to change password');
            }
          } catch (err) {
            console.error(err);
            openSnackbar({
              open: true,
              message: err.msg || err.message || 'Failed to change password',
              variant: 'alert',
              alert: { color: 'error' }
            });
            setStatus({ success: false });
            setErrors({ submit: err.msg || err.message || 'Failed to change password' });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item container spacing={3} xs={12} sm={6}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-old">Old Password</InputLabel>
                    <OutlinedInput
                      id="password-old"
                      placeholder="Enter Old Password"
                      type={showOldPassword ? 'text' : 'password'}
                      value={values.old}
                      name="old"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowOldPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                            color="secondary"
                          >
                            {showOldPassword ? <Eye /> : <EyeSlash />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete="password-old"
                    />
                  </Stack>
                  {touched.old && errors.old && (
                    <FormHelperText error id="password-old-helper">
                      {errors.old}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-password">New Password</InputLabel>
                    <OutlinedInput
                      id="password-password"
                      placeholder="Enter New Password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowNewPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                            color="secondary"
                          >
                            {showNewPassword ? <Eye /> : <EyeSlash />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete="password-password"
                    />
                  </Stack>
                  {touched.password && errors.password && (
                    <FormHelperText error id="password-password-helper">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-confirm">Confirm Password</InputLabel>
                    <OutlinedInput
                      id="password-confirm"
                      placeholder="Enter Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={values.confirm}
                      name="confirm"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                            color="secondary"
                          >
                            {showConfirmPassword ? <Eye /> : <EyeSlash />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete="password-confirm"
                    />
                  </Stack>
                  {touched.confirm && errors.confirm && (
                    <FormHelperText error id="password-confirm-helper">
                      {errors.confirm}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: { xs: 0, sm: 2, md: 4, lg: 5 } }}>
                  <Typography variant="h5">New Password must contain:</Typography>
                  <List sx={{ p: 0, mt: 1 }}>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: minLength(values.password) ? 'success.main' : 'inherit' }}>
                        {minLength(values.password) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary="At least 8 characters" />
                    </ListItem>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: isLowercaseChar(values.password) ? 'success.main' : 'inherit' }}>
                        {isLowercaseChar(values.password) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary="At least 1 lower letter (a-z)" />
                    </ListItem>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: isUppercaseChar(values.password) ? 'success.main' : 'inherit' }}>
                        {isUppercaseChar(values.password) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary="At least 1 uppercase letter (A-Z)" />
                    </ListItem>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: isNumber(values.password) ? 'success.main' : 'inherit' }}>
                        {isNumber(values.password) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary="At least 1 number (0-9)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ color: isSpecialChar(values.password) ? 'success.main' : 'inherit' }}>
                        {isSpecialChar(values.password) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary="At least 1 special characters" />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => resetForm()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isSubmitting || Object.keys(errors).length !== 0}
                    type="submit"
                    variant="contained"
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {isSubmitting ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
}
