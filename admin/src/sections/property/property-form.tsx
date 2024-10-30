import {
  Box,
  Button,
  Card,
  Grid,
  InputLabel,
  Stack,
  Switch,
  TextField,
  snackbarClasses,
} from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import {
  CommonButton,
  CommonDropZone,
  CommonTextEditor,
  CustomDatePicker,
  CustomSelect,
  CustomSwitch,
  IconInput,
  TextInput,
} from 'src/components/InputFields/field';
import * as Yup from 'yup';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import useWindowWidth from 'src/hooks/use-window-width';
import { ToggleButtonGroup } from '@mui/material';
import { ToggleButton } from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import GrassIcon from '@mui/icons-material/Grass';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import { propertyStoreApi, propertyUpdateApi } from 'src/store/Slices/propertySlice';
import { toastNotificationAdmin } from 'src/components/CustomToastAdmin/CustomToastAdmin';
import { useDispatch } from 'react-redux';
import { FormGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/store';
import { countryDropdownApi } from 'src/store/Slices/countrySlice';
import { stateDropdownApi } from 'src/store/Slices/stateSlice';
import { cityDropdownApi } from 'src/store/Slices/citySlice';
import { areaDropdownApi } from 'src/store/Slices/areaSlice';

const PropertyForm = ({ currentModule }: any) => {
  const width = useWindowWidth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const COUNTRY_OPTION = useAppSelector((state) => state.country.isCountryDropDownOption);
  const COUNTRY_LOADING = useAppSelector((state) => state.country.isApiStatus?.countryDropdownApi);
  const STATE_OPTION = useAppSelector((state) => state.state.isStateDropDownOption);
  const STATE_LOADING = useAppSelector((state) => state.state.isApiStatus?.stateDropdownApi);
  const CITY_OPTION = useAppSelector((state) => state.city.isCityDropDownOption);
  const CITY_LOADING = useAppSelector((state) => state.city.isApiStatus?.cityDropdownApi);
  const AREA_OPTION = useAppSelector((state) => state.area.isAreaDropDownOption);
  const AREA_LOADING = useAppSelector((state) => state.area.isApiStatus?.areaDropdownApi);
  const initialState = useMemo(() => {
    if (currentModule) {
      return {
        _id: currentModule._id || null,
        title: currentModule.title || '',
        description: currentModule.description || '',
        price: currentModule.price || '',
        street: currentModule.address?.street || '',
        city: currentModule.address?.city || '',
        area: currentModule.address?.area || '',
        state: currentModule.address?.state || '',
        zip_code: currentModule.address?.zip_code || '',
        country: currentModule.address?.country || '',
        type: currentModule.type || 'House',
        bedrooms: currentModule.bedrooms || '',
        bathrooms: currentModule.bathrooms || '',
        square_footage: currentModule.square_footage || '',
        lot_size: currentModule.lot_size || '',
        year_built: currentModule.year_built || '',
        status: currentModule.status || 'sale',
        availibility: currentModule.availibility || 'available',
        images: [],
        old_images: currentModule?.images?.length > 0 ? currentModule?.images : [],
        isActive: currentModule?.isActive ? currentModule?.isActive : false,
      };
    }
    return {
      _id: null,
      title: '',
      description: '',
      price: '',
      street: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      area: '',
      type: 'House',
      bedrooms: 1,
      bathrooms: 1,
      square_footage: '',
      lot_size: '',
      year_built: '',
      status: 'sale',
      availibility: 'available',
      images: [],
      old_images: [],
      isActive: true,
    };
  }, [currentModule]);

  const yupSchema = Yup.object({
    _id: Yup.string().nullable(),
    isActive: Yup.boolean(),
    title: Yup.string().required('Title is required'),
    country: Yup.string().required('Country is required'),
    street: Yup.string().required('Street is required'),
    area: Yup.string().required('Area is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    availibility: Yup.string().required('Availibility is required'),
    bedrooms: Yup.number().nullable(),
    bathrooms: Yup.number().nullable(),
    price: Yup.number().required('Price is required'),
    description: Yup.string().required('Description is required'),
    images: Yup.array().nullable(),
  });

  const handleImageUpload = (files: any, setFormValue: any) => {
    setFormValue('images', files);
  };

  const PROPERTY_TYPE_OPTION = [
    { value: 'House', label: 'House' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Land', label: 'Land' },
    { value: 'Office', label: 'Office' },
    { value: 'Villa', label: 'Villa' },
    // ... will add more later
  ];

  const PROPERTY_STATUS_OPTION = [
    { value: 'sale', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' },
  ];
  const PROPERTY_AVAILIBILITY_OPTION = [
    { value: 'available', label: 'Available' },
    { value: 'sold', label: 'Sold' },
    { value: 'pending', label: 'Pending' },
    // ... will add more later
  ];

  useEffect(() => {
    dispatch(countryDropdownApi({}));
  }, []);

  const handleSubmit = (values: any, { setErrors, setStatus, setSubmitting, resetForm }: any) => {
    try {
      if (!values.images?.length && (!values._id || !values.old_images?.length)) {
        setErrors({ images: 'At least 1 image is required' });
        return; // Stop submission
      }
      if (values?._id) {
        dispatch(propertyUpdateApi(values))
          .then((action) => {
            if (action?.meta?.requestStatus === 'fulfilled') {
              navigate('/property');
              toastNotificationAdmin.success('Property updated successfully');
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
      } else {
        dispatch(propertyStoreApi(values))
          .then((action) => {
            if (action?.meta?.requestStatus === 'fulfilled') {
              navigate('/property');
              toastNotificationAdmin.success('Property created successfully');
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
      }
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
                    <Grid item xs={12} md={6}>
                      <Field name="title">
                        {({ field }: any) => (
                          <TextInput
                            {...field}
                            label="Title"
                            type="text"
                            error={touched.title && !!errors.title}
                            helperText={touched.title && errors.title}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field name="price">
                        {({ field }: any) => (
                          <IconInput
                            {...field}
                            label="Price"
                            type="number"
                            error={touched.price && !!errors.price}
                            icon={<CurrencyRupeeIcon />}
                            helperText={touched.price && errors.price}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="country">
                        {({ field }: any) => (
                          <CustomSelect
                            {...field}
                            label="Country"
                            error={touched.country && !!errors.country}
                            helperText={touched.country && errors.country}
                            loading={COUNTRY_LOADING === 'loading'}
                            options={COUNTRY_OPTION}
                            onChange={(e: any) => {
                              if (e.target.value) {
                                setFieldValue('country', e.target.value);
                                setFieldValue('state', '');
                                setFieldValue('city', '');
                                dispatch(stateDropdownApi({ _id: e.target.value, type: 'select' }));
                              }
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="state">
                        {({ field }: any) => (
                          <CustomSelect
                            {...field}
                            label="State"
                            error={touched.state && !!errors.state}
                            helperText={touched.state && errors.state}
                            options={STATE_OPTION}
                            loading={STATE_LOADING === 'loading'}
                            noFound={values?.country ? null : 'Please Select Country First'}
                            onChange={(e: any) => {
                              if (e.target.value) {
                                setFieldValue('state', e.target.value);
                                setFieldValue('city', '');
                                dispatch(cityDropdownApi({ _id: e.target.value, type: 'select' }));
                              }
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="city">
                        {({ field }: any) => (
                          <CustomSelect
                            {...field}
                            label="City"
                            error={touched.city && !!errors.city}
                            helperText={touched.city && errors.city}
                            loading={CITY_LOADING === 'loading'}
                            noFound={values?.state ? null : 'Please Select State First'}
                            options={CITY_OPTION}
                            onChange={(e: any) => {
                              if (e.target.value) {
                                setFieldValue('city', e.target.value);
                                setFieldValue('area', '');
                                dispatch(areaDropdownApi({ _id: e.target.value, type: 'select' }));
                              }
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="area">
                        {({ field }: any) => (
                          <CustomSelect
                            {...field}
                            label="Area"
                            error={touched.area && !!errors.area}
                            helperText={touched.area && errors.area}
                            loading={AREA_LOADING === 'loading'}
                            noFound={values?.city ? null : 'Please Select City First'}
                            options={AREA_OPTION}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="street">
                        {({ field }: any) => (
                          <TextInput
                            {...field}
                            label="Street"
                            type="text"
                            error={touched.street && !!errors.street}
                            helperText={touched.street && errors.street}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="zip_code">
                        {({ field }: any) => (
                          <TextInput
                            {...field}
                            label="Zip Code"
                            type="text"
                            error={touched.zip_code && !!errors.zip_code}
                            helperText={touched.zip_code && errors.zip_code}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field name="bedrooms">
                        {({ field }: any) => (
                          <IconInput
                            {...field}
                            label="Bedrooms"
                            type="number"
                            error={touched.bedrooms && !!errors.bedrooms}
                            icon={<HotelIcon />}
                            helperText={touched.bedrooms && errors.bedrooms}
                            onChange={(e:any) => {
                              const bedrooms = e?.target?.value;
                              if (bedrooms == 1) {
                                setFieldValue('square_footage', 400);
                                setFieldValue('lot_size', 500)
                              } else if (bedrooms == 2) {
                                setFieldValue('square_footage', 700);
                                setFieldValue('lot_size', 1000)
                              } else if (bedrooms == 3) {
                                setFieldValue('square_footage', 1200);
                                setFieldValue('lot_size', 1500)
                              }
                              setFieldValue('bedrooms', bedrooms);
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field name="bathrooms">
                        {({ field }: any) => (
                          <IconInput
                            {...field}
                            label="Bathrooms"
                            type="number"
                            error={touched.bathrooms && !!errors.bathrooms}
                            icon={<BathtubIcon />}
                            helperText={touched.bathrooms && errors.bathrooms}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field name="square_footage">
                        {({ field }: any) => (
                          <IconInput
                            {...field}
                            label="Square Footage"
                            type="number"
                            error={touched.square_footage && !!errors.square_footage}
                            icon={<SquareFootIcon />}
                            helperText={touched.square_footage && errors.square_footage}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field name="lot_size">
                        {({ field }: any) => (
                          <IconInput
                            {...field}
                            label="Lot Size"
                            type="number"
                            error={touched.lot_size && !!errors.lot_size}
                            icon={<GrassIcon />}
                            helperText={touched.lot_size && errors.lot_size}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item md={6}>
                      <Field name="type">
                        {({ field }: any) => (
                          <CustomSelect
                            {...field}
                            label="Property Type"
                            error={touched.type && !!errors.type}
                            helperText={touched.type && errors.type}
                            options={PROPERTY_TYPE_OPTION}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item md={6}>
                      <Field name="status">
                        {({ field }: any) => (
                          <CustomSelect
                            {...field}
                            label="Property Status"
                            error={touched.status && !!errors.status}
                            helperText={touched.status && errors.status}
                            options={PROPERTY_STATUS_OPTION}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item md={12}>
                      <Field name="availibility">
                        {({ field }: any) => (
                          <CustomSelect
                            {...field}
                            label="Availability"
                            error={touched.availibility && !!errors.availibility}
                            helperText={touched.availibility && errors.availibility}
                            options={PROPERTY_AVAILIBILITY_OPTION}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="year_built" style={{ width: '100%' }}>
                        {({ field, form }: any) => (
                          <CustomDatePicker
                            {...field}
                            value={form.values.year_built} // Pass the Formik value for year_built
                            setFieldValue={form.setFieldValue} // Pass setFieldValue to update Formik state
                            attribute={'Y'} // Change to "Y-M-D" for the full date picker
                            error={form.touched.year_built && !!form.errors.year_built}
                            helperText={form.touched.year_built && form.errors.year_built}
                            label="Year Built" // Optional label prop
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      mb={{
                        lg: touched.description && !!errors.description ? 4 : 6,
                        md: touched.description && !!errors.description ? 4 : 7,
                        sm: touched.description && !!errors.description ? 4 : 7,
                      }}
                      sx={{
                        paddingBottom:
                          width < 380 ? '80px' : width < 600 ? '55px' : width < 637 ? '25px' : '',
                      }}
                    >
                      <CommonTextEditor
                        value={values.description}
                        onChange={(value: any) => setFieldValue('description', value)}
                        placeholder="Enter the description"
                        error={touched.description && !!errors.description}
                      />
                    </Grid>
                    {touched.description && !!errors.description && (
                      <Grid item xs={12} mb={2}>
                        <ErrorMessage name="description">
                          {(msg) => (
                            <div style={{ color: '#FF5630', fontSize: '0.75rem' }}>{msg}</div>
                          )}
                        </ErrorMessage>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <CommonDropZone
                        uploadType="multiple"
                        onUpload={(e: any) => handleImageUpload(e, setFieldValue)}
                        setFieldValue={setFieldValue} // Pass setFieldValue here
                        error={touched.images && !!errors.images}
                        old_images={values?.old_images}
                      />
                      <ErrorMessage name="images">
                        {(msg) => (
                          <div style={{ color: '#FF5630', fontSize: '0.75rem' }}>{msg}</div>
                        )}
                      </ErrorMessage>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
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
                          <CommonButton type="submit" stylings={{ mr: 2 }}>
                            Submit
                          </CommonButton>
                          <CommonButton
                            type="button"
                            themeMode="dark"
                            onClick={() => navigate('/property')}
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
        </Grid>
      </Grid>
    </Stack>
  );
};

export default PropertyForm;
