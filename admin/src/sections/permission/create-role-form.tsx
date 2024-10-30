import React, { useMemo } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Modal, Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/store';
import {
  OpenRoleCreateModal,
  RoleEditModalData,
  roleListApi,
  roleStoreApi,
  roleUpdateApi,
} from 'src/store/Slices/permissionSlice';
import { Grid } from '@mui/material';
import { CommonButton, CustomSwitch, TextInput } from 'src/components/InputFields/field';
import { toastNotificationAdmin } from 'src/components/CustomToastAdmin/CustomToastAdmin';

const CreateRole = () => {
  const dispatch = useAppDispatch();
  const isOpenRoleCreateModal = useAppSelector(
    (state: any) => state.permission.isOpenRoleCreateModal
  );
  const isRoleEditModalData = useAppSelector((state: any) => state.permission.isRoleEditModalData);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width: '90%',
    maxWidth: '1020px',
    maxHeight: '90%',
    overflowY: 'auto',
    boxShadow: 24,
    borderRadius: 2,
    zIndex: 99999999,
    p: 4,
  };

  const initialState = useMemo(() => {
    if (isRoleEditModalData) {
      return {
        _id: isRoleEditModalData._id || null,
        name: isRoleEditModalData.name || '',
        purpose: isRoleEditModalData.purpose || '',
        isActive: isRoleEditModalData?.isActive ? isRoleEditModalData?.isActive : false,
      };
    }
    return {
      _id: null,
      name: '',
      purpose: '',
      isActive: true,
    };
  }, [isRoleEditModalData]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    purpose: Yup.string().required('Purpose is required'),
    isActive: Yup.boolean(),
  });

  const handleSubmit = (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
    try {
      const ApiCall = values?._id ? roleUpdateApi : roleStoreApi;
      dispatch(ApiCall(values))
        .then((action) => {
          if (action?.meta?.requestStatus === 'fulfilled') {
            toastNotificationAdmin.success('Role created successfully');
            if (values?._id) {
              dispatch(RoleEditModalData({}));
              dispatch(roleListApi({}));
            }
            dispatch(OpenRoleCreateModal(false));
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
    <Modal
      aria-labelledby="create-role-modal-title"
      aria-describedby="create-role-modal-description"
      open={isOpenRoleCreateModal}
      onClose={() => dispatch(OpenRoleCreateModal(true))}
      sx={{ width: 'auto' }}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" mb={3}>
          Create Role
        </Typography>
        <Formik
          initialValues={initialState}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, errors, touched }) => {
            return (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field name="name">
                      {({ field }: any) => (
                        <TextInput
                          {...field}
                          label="Name"
                          type="text"
                          error={touched.name && !!errors.name}
                          helperText={touched.name && errors.name}
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field name="purpose">
                      {({ field }: any) => (
                        <TextInput
                          {...field}
                          label="Purpose"
                          type="text"
                          error={touched.purpose && !!errors.purpose}
                          helperText={touched.purpose && errors.purpose}
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      display={'flex'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      flexWrap={'wrap'}
                    >
                      <Box>
                        <Field name="isActive">
                          {({ field }: any) => (
                            <CustomSwitch
                              {...field}
                              label="Active"
                              labelPlacement="end"
                              error={touched.isActive && !!errors.isActive}
                              helperText={touched.isActive && errors.isActive}
                            />
                          )}
                        </Field>
                      </Box>
                      <Box>
                        <CommonButton type="submit" stylings={{ mr: 2, ml: 1 }}>
                          Submit
                        </CommonButton>
                        <CommonButton
                          type="button"
                          stylings={{ mr: 0 }}
                          themeMode="dark"
                          onClick={() => {
                            dispatch(RoleEditModalData({}));
                            dispatch(OpenRoleCreateModal(false));
                          }}
                        >
                          Cancel
                        </CommonButton>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Modal>
  );
};

export default CreateRole;
