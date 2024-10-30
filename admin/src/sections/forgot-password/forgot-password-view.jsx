import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { InputLabel } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useDispatch } from 'react-redux';
import { authLoginApi } from 'src/store/Slices/authSlice';
import { toastNotificationAdmin } from 'src/components/CustomToastAdmin/CustomToastAdmin';


// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  security_question: Yup.string().required('Answer is required'),
});

export function ForgotPasswordView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

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
        <Typography variant="h5">Forgot Password</Typography>
        <Typography variant="body2" color="text.secondary">
          Password Resetted ?
          <Link
            variant="subtitle2"
            sx={{ ml: 0.5, cursor: 'pointer' }}
            onClick={() => router.push('/signIn')}
          >
            Sign In
          </Link>
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSignIn}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      >
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

        <InputLabel sx={{ mb: 2, ml: 1 }}>What is your birth place?</InputLabel>
        <TextField
          fullWidth
          name="security_question"
          label="Answer"
          InputLabelProps={{ shrink: true }}
          value={formik.values.security_question}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.security_question && Boolean(formik.errors.security_question)}
          helperText={formik.touched.security_question && formik.errors.security_question}
          sx={{ mb: 3 }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
          loading={formik.isSubmitting}
        >
          Reset Password
        </LoadingButton>
      </Box>
    </>
  );
}
