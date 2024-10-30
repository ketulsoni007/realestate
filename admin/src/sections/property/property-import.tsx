import React, { useMemo } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Modal, Box, Typography, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/store';
import { Grid } from '@mui/material';
import {
  CommonButton,
  CommonExcellDropZone,
  CustomSwitch,
  TextInput,
} from 'src/components/InputFields/field';
import { toastNotificationAdmin } from 'src/components/CustomToastAdmin/CustomToastAdmin';
import { OpenPropertyFailedImportLog, OpenPropertyImport, propertyImportApi, propertyListApi } from 'src/store/Slices/propertySlice';

const PropertyImportModal = () => {
  const dispatch = useAppDispatch();
  const isOpenPropertyImport = useAppSelector((state) => state.property.isOpenPropertyImport);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width: { md: '720px', sm: '520px', xs: '320px' },
    p: 4,
    boxShadow: 24,
    borderRadius: 2,
    textAlign: 'center',
  };

  const initialState = {
    file:null,
  };

  const validationSchema = Yup.object({
    file: Yup.mixed().required('Excell is required'),
  });

  const handleExcellUpload = (files: any, setFormValue: any) => {
    setFormValue('file', files);
  };

  const handleSubmit = (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
    try {
        dispatch(propertyImportApi(values))
          .then((action) => {
            if (action?.meta?.requestStatus === 'fulfilled') {
              toastNotificationAdmin.success('Property imported successfully');
              dispatch(OpenPropertyImport(false));
              dispatch(propertyListApi({page:0,rowsPerPage:5}));
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
              } else if(status === 400){
                dispatch(OpenPropertyFailedImportLog({data:action?.payload?.unimportedData ?? [],open:true}));
                dispatch(propertyListApi({page:0,rowsPerPage:5}));
              }else{
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
    <Modal open={isOpenPropertyImport} onClose={() => dispatch(OpenPropertyImport(false))}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Import Property
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Some columns contain dropdown selections. In order to work correctly, please use values
          from the dropdown.
        </Alert>
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
                    <CommonExcellDropZone
                      uploadType="single"
                      onUpload={(e: any) => handleExcellUpload(e, setFieldValue)}
                      setFieldValue={setFieldValue} // Pass setFieldValue here
                      error={touched.file && !!errors.file}
                    />
                    <ErrorMessage name="file">
                      {(msg) => <div style={{ color: '#FF5630', fontSize: '0.75rem' }}>{msg}</div>}
                    </ErrorMessage>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      display={'flex'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      flexWrap={'wrap'}
                    >
                      <Box>
                        
                      </Box>
                      <Box>
                        <CommonButton type="submit" stylings={{ mr: 2, ml: 1 }}>
                          Import
                        </CommonButton>
                        <CommonButton
                          type="button"
                          stylings={{ mr: 0 }}
                          themeMode="dark"
                          onClick={() => {
                            dispatch(OpenPropertyImport(false));
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

export default PropertyImportModal;
