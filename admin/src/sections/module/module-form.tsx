import { Box, Card, Grid, Stack } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useMemo } from 'react';
import { CommonButton, CommonTextArea, CustomSwitch, IconInput, TextInput } from 'src/components/InputFields/field';
import * as Yup from 'yup';
import useWindowWidth from 'src/hooks/use-window-width';
import { useNavigate } from 'react-router-dom';
import { toastNotificationAdmin } from 'src/components/CustomToastAdmin/CustomToastAdmin';
import { countryStoreApi, countryUpdateApi } from 'src/store/Slices/countrySlice';
import { useAppDispatch } from 'src/store';
import { moduleStoreApi, moduleUpdateApi } from 'src/store/Slices/moduleSlice';
import LayersIcon from '@mui/icons-material/Layers';
import { sidebarApi } from 'src/store/Slices/commonSlice';
import { RoleListReset } from 'src/store/Slices/permissionSlice';

const ModuleForm = ({ currentModule }:any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialState = useMemo(() => {
    if (currentModule) {
      return {
        _id: currentModule._id || null,
        name: currentModule.name || '',
        description: currentModule.description || '',
        icon: currentModule.icon || '',
        route: currentModule.route || '',
        order: currentModule.order || '',
        isActive: currentModule?.isActive ? currentModule?.isActive : false,
      };
    }
    return {
      _id: null,
      name:'',
      description:'',
      icon:'',
      route:'',
      order:'',
      isActive: true,
    };
  }, [currentModule]);

  const yupSchema = Yup.object({
    _id: Yup.string().nullable(),
    name: Yup.string().required('Name is required'),
    description: Yup.string(), // Adding description
    icon: Yup.string().required('Icon is required'), // Adding icon
    route: Yup.string(), // Adding route
    order: Yup.number(), // Adding order
    isActive: Yup.boolean(),
  });

  const handleSubmit = (values:any, { setErrors, setStatus, setSubmitting, resetForm }:any) => {
    try {
      if (values?._id) {
        dispatch(moduleUpdateApi(values))
          .then((action) => {
            if (action?.meta?.requestStatus === "fulfilled") {
              dispatch(sidebarApi({}))
              dispatch(RoleListReset())
              navigate('/module');
              toastNotificationAdmin.success('Module updated successfully');
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
        dispatch(moduleStoreApi(values))
          .then((action) => {
            if (action?.meta?.requestStatus === "fulfilled") {
              dispatch(sidebarApi({}))
              navigate('/module');
              dispatch(RoleListReset())
              toastNotificationAdmin.success('Module created successfully');
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
                    <Grid item xs={12} md={6}>
                      <Field name="name">{({ field }:any) => <TextInput {...field} label="Name" type="text" error={touched.name && !!errors.name} helperText={touched.name && errors.name} />}</Field>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field name="route">{({ field }:any) => <TextInput {...field} label="Route" type="text" error={touched.route && !!errors.route} helperText={touched.route && errors.route} />}</Field>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field name="icon">{({ field }:any) => <TextInput {...field} label="Icon" type="text" error={touched.icon && !!errors.icon} helperText={touched.icon && errors.icon} />}</Field>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field name="order">{({ field }:any) => <IconInput {...field} label="Order" type="number" error={touched.order && !!errors.order} icon={<LayersIcon />} helperText={touched.order && errors.order} />}</Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="description">{({ field }:any) => <CommonTextArea {...field} label="Description" error={touched.description && !!errors.description} helperText={touched.description && errors.description} />}</Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box>
                          <Field name="isActive">{({ field }:any) => (<CustomSwitch {...field} label="Active" labelPlacement="end" error={touched.isActive && !!errors.isActive} helperText={touched.isActive && errors.isActive} />)}</Field>
                        </Box>
                        <Box>
                          <CommonButton type='submit' stylings={{ mr: 2,ml:1 }}>Submit</CommonButton>
                          <CommonButton type='button' stylings={{ mr: 0 }} themeMode='dark' onClick={() => navigate('/module')}>Cancel</CommonButton>
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

export default ModuleForm;
