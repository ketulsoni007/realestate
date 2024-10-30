import { useState, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { toastNotificationAdmin } from 'src/components/CustomToastAdmin/CustomToastAdmin';
import { authLoginApi } from 'src/store/Slices/authSlice';
import { useDispatch } from 'react-redux';

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export function SignInView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '',
      security_question: '',
    },
    validationSchema,
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        const action = await dispatch(authLoginApi(values));

        if (action?.meta?.requestStatus === 'fulfilled') {
          toastNotificationAdmin.success('Login Successful');
          router.push('/'); // Redirect on successful login
        } else if (action?.meta?.requestStatus === 'rejected') {
          const message = action?.payload?.message ?? 'Something went wrong';
          const status = action?.payload?.status ?? 410;
          const errors = action?.payload?.errors ?? [];

          if (status === 422) {
            const formattedErrors = errors.reduce((acc, error) => {
              acc[error.path] = error.msg;
              return acc;
            }, {});
            setErrors(formattedErrors);
          } else {
            toastNotificationAdmin.error(message);
            setStatus({ error: message });
          }
        }
      } catch (error) {
        console.error('An error occurred:', error);
        toastNotificationAdmin.error('An unexpected error occurred.');
        setStatus({ error: 'An unexpected error occurred.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Form submission handler
  const handleSignIn = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSignIn} display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          fullWidth
          name="email"
          label="Email address"
          InputLabelProps={{ shrink: true }}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          sx={{ mb: 3 }}
        />

        <Link variant="body2" color="inherit" sx={{ mb: 1.5,cursor:'pointer' }} onClick={()=>router.push('/forgot-password')}>
          Forgot password?
        </Link>

        <TextField
          fullWidth
          name="password"
          label="Password"
          InputLabelProps={{ shrink: true }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ mb: 3 }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
          loading={false}
        >
          Sign in
        </LoadingButton>
      </Box>
    </>
  );
}
