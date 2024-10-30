import { Avatar, Box, Button, Card, Grid, Stack } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useMemo } from 'react';
import { CommonButton,TextInput } from 'src/components/InputFields/field';
import * as Yup from 'yup';
import { toastNotificationAdmin } from 'src/components/CustomToastAdmin/CustomToastAdmin';
import { useAppDispatch } from 'src/store';
import { CONFIG } from 'src/config-global';
import { UserUpdate, profileUpdateApi } from 'src/store/Slices/authSlice';

interface ProfileFormValues {
  _id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  role: any;
  phone_number: string;
  profile_picture: any;
  old_profile_picture: any;
  agency_name: string;
  commission_rate: string;
  license_number: string;
}

const ProfileForm = ({ currentModule }: { currentModule: ProfileFormValues }) => {
  const dispatch = useAppDispatch();

  const initialState = useMemo(() => {
    if (currentModule) {
      return {
        _id: currentModule._id || null,
        first_name: currentModule.first_name || '',
        last_name: currentModule.last_name || '',
        email: currentModule.email || '',
        phone_number: currentModule.phone_number || '',
        profile_picture: null,
        old_profile_picture: currentModule?.profile_picture || '',
        agency_name: currentModule?.agency_name || '',
        commission_rate: currentModule?.commission_rate || '',
        license_number: currentModule?.license_number || '',
      };
    }
    return {
      _id: null,
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      old_profile_picture: null,
      profile_picture: null,
      agency_name: '',
      commission_rate: '',
      license_number: '',
    };
  }, [currentModule]);

  const yupSchema = Yup.object({
    _id: Yup.string().nullable(),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone_number: Yup.string().required('Phone number is required'),
    profile_picture: Yup.mixed().nullable(),
  });

  const handleImageChange = (event: any, setFormFieldValue: any) => {
    const file = event.currentTarget.files[0];
    setFormFieldValue('profile_picture', file);
  };

  const handleSubmit = (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
    try {
      dispatch(profileUpdateApi(values))
        .then((action) => {
          if (action?.meta?.requestStatus === 'fulfilled') {
            if(action?.payload?.user){
              dispatch(UserUpdate(action.payload.user))
              toastNotificationAdmin.success('Profile updated successfully');
            }
          } else if (action?.meta?.requestStatus === 'rejected') {
            const message = action?.payload?.message ?? 'Something went wrong';
            const status = action?.payload?.status ?? 410;
            const errors = action?.payload?.errors ?? [];
            if (status === 422) {
              const formattedErrors = errors.reduce((acc: any, error: any) => {
                acc[error.path] = error.msg;
                return acc;
              }, {});
              setErrors(formattedErrors);
            } else {
              toastNotificationAdmin.error(message);
              setStatus({ error: message });
            }
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (error) {
      console.error('An error occurred:', error);
      setStatus({ error: 'An unexpected error occurred.' });
      setSubmitting(false);
    }
  };

  return (
    <Stack component={Card} elevation={3} sx={{ p: { lg: 5, xs: 1 } }}>
      <Grid container justifyContent="flex-end" alignItems="center">
        <Grid item sm={12}>
          <Formik initialValues={initialState} validationSchema={yupSchema} onSubmit={handleSubmit}>
            {({ handleSubmit, handleChange, values, errors, touched, setFieldValue }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}>
                        {values?.profile_picture ? (
                          <Avatar
                            src={URL.createObjectURL(values.profile_picture)}
                            sx={{ mb: 2, height: 80, width: 80 }}
                          />
                        ) : (
                          values.old_profile_picture && (
                            <Avatar
                              src={`${CONFIG.IMAGE_URL}/user/${values.old_profile_picture}`} // Use old profile picture
                              sx={{ mb: 2, height: 80, width: 80 }}
                            />
                          )
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field name="first_name">
                        {({ field }: any) => (
                          <TextInput
                            {...field}
                            label="First Name"
                            type="text"
                            error={touched.first_name && !!errors.first_name}
                            helperText={touched.first_name && errors.first_name}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field name="last_name">
                        {({ field }: any) => (
                          <TextInput
                            {...field}
                            label="Last Name"
                            type="text"
                            error={touched.last_name && !!errors.last_name}
                            helperText={touched.last_name && errors.last_name}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="email">
                        {({ field }: any) => (
                          <TextInput
                            {...field}
                            label="Email"
                            type="email"
                            error={touched.email && !!errors.email}
                            helperText={touched.email && errors.email}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="phone_number">
                        {({ field }: any) => (
                          <TextInput
                            {...field}
                            label="Phone Number"
                            type="number"
                            error={touched.phone_number && !!errors.phone_number}
                            helperText={touched.phone_number && errors.phone_number}
                          />
                        )}
                      </Field>
                    </Grid>
                    {currentModule?.role &&
                      (currentModule?.role?._id === '66ed5dc893048a3dada991a2' ||
                        currentModule?.role?._id === '66ed5dc893048a3dada991a3') && (
                        <>
                          <Grid item xs={12}>
                            <Field name="license_number">
                              {({ field }: any) => (
                                <TextInput
                                  {...field}
                                  label="License Number"
                                  type="text"
                                  error={touched.license_number && !!errors.license_number}
                                  helperText={touched.license_number && errors.license_number}
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid item xs={12}>
                            <Field name="agency_name">
                              {({ field }: any) => (
                                <TextInput
                                  {...field}
                                  label="Agency Name"
                                  type="text"
                                  error={touched.agency_name && !!errors.agency_name}
                                  helperText={touched.agency_name && errors.agency_name}
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid item xs={12}>
                            <Field name="commission_rate">
                              {({ field }: any) => (
                                <TextInput
                                  {...field}
                                  label="Commission Rate"
                                  type="number"
                                  error={touched.commission_rate && !!errors.commission_rate}
                                  helperText={touched.commission_rate && errors.commission_rate}
                                />
                              )}
                            </Field>
                          </Grid>
                        </>
                      )}
                    <Grid item xs={12}>
                      <Button fullWidth variant="outlined" color='success' component="label">
                        Profile Image
                        <input
                          type="file"
                          hidden
                          onChange={(event) => handleImageChange(event, setFieldValue)}
                        />
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display={'flex'} justifyContent={'end'} alignItems={'center'}>
                        <Box>
                          <CommonButton type="submit" stylings={{ mr: 0 }}>
                            Update
                          </CommonButton>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ProfileForm;
