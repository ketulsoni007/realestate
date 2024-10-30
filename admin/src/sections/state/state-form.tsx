import { Box, Card, Grid, Stack } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useEffect, useMemo } from 'react';
import { CommonButton, CustomSelect, CustomSwitch, TextInput } from 'src/components/InputFields/field';
import * as Yup from 'yup';
import useWindowWidth from 'src/hooks/use-window-width';
import { useNavigate } from 'react-router-dom';
import { toastNotificationAdmin } from 'src/components/CustomToastAdmin/CustomToastAdmin';
import { countryDropdownApi, countryStoreApi, countryUpdateApi } from 'src/store/Slices/countrySlice';
import { useAppDispatch } from 'src/store';
import { useSelector } from 'react-redux';
import { stateStoreApi, stateUpdateApi } from 'src/store/Slices/stateSlice';

const StateForm = ({ currentModule }:any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isCountryDropDownOption = useSelector((state:any)=>state.country.isCountryDropDownOption);

  useEffect(()=>{
    dispatch(countryDropdownApi({}))
  },[]);

  const initialState = useMemo(() => {
    if (currentModule) {
      return {
        _id: currentModule._id || null,
        name: currentModule.name || '',
        country: currentModule?.country || '',
        isActive: currentModule?.isActive ? currentModule?.isActive : false,
      };
    }
    return {
      _id: null,
      name: '',
      country: '',
      isActive: true,
    };
  }, [currentModule]);

  const yupSchema = Yup.object({
    _id: Yup.string().nullable(),
    name: Yup.string().required('Name is required'),
    country: Yup.string().required('Country is required'),
    isActive: Yup.boolean(),
  });

  const handleSubmit = (values:any, { setErrors, setStatus, setSubmitting, resetForm }:any) => {
    try {
      if (values?._id) {
        dispatch(stateUpdateApi(values))
          .then((action) => {
            if (action?.meta?.requestStatus === "fulfilled") {
              navigate('/state');
              toastNotificationAdmin.success('State updated successfully');
            } else if (action?.meta?.requestStatus === "rejected") {
              const message = action?.payload?.message ?? 'Something went wrong';
              const status = action?.payload?.status ?? 410;
              const errors = action?.payload?.errors ?? [];
              if (status === 422) {
                const formattedErrors = errors.reduce((acc:any, error:any) => {
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
      } else {
        dispatch(stateStoreApi(values))
          .then((action) => {
            if (action?.meta?.requestStatus === "fulfilled") {
              navigate('/state');
              toastNotificationAdmin.success('State created successfully');
            } else if (action?.meta?.requestStatus === "rejected") {
              const message = action?.payload?.message ?? 'Something went wrong';
              const status = action?.payload?.status ?? 410;
              const errors = action?.payload?.errors ?? [];
              if (status === 422) {
                const formattedErrors = errors.reduce((acc:any, error:any) => {
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
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setStatus({ error: "An unexpected error occurred." });
      setSubmitting(false);
    }
  };


  return (
    <Stack component={Card} elevation={3} sx={{ p: { lg: 5, xs: 1 } }}>
      <Grid container justifyContent="flex-end" alignItems="center">
        <Grid item sm={12}>
          <Formik
            initialValues={initialState}
            validationSchema={yupSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, handleChange, values, errors, touched, setFieldValue }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field name="name">{({ field }:any) => <TextInput {...field} label="Name" type="text" error={touched.name && !!errors.name} helperText={touched.name && errors.name} />}</Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="country">{({ field }:any) => <CustomSelect {...field} label="Country" error={touched.country && !!errors.country} helperText={touched.country && errors.country} options={isCountryDropDownOption} loading={false} />}</Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box>
                          <Field name="isActive">{({ field }:any) => (<CustomSwitch {...field} label="Active" labelPlacement="end" error={touched.isActive && !!errors.isActive} helperText={touched.isActive && errors.isActive} />)}</Field>
                        </Box>
                        <Box>
                          <CommonButton type='submit' stylings={{ mr: 2,ml:1 }}>Submit</CommonButton>
                          <CommonButton type='button' stylings={{ mr: 0 }} themeMode='dark' onClick={() => navigate('/state')}>Cancel</CommonButton>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Form>
              )
            }}
          </Formik>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default StateForm;
