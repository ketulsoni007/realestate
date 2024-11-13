import React, { useEffect, useMemo, useState } from "react";
import { Stack, Button, Paper, Box, Typography, InputLabel, Avatar, Select, MenuItem, FormControl, FormHelperText, Chip, styled } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CommonButton, CustomSelect, CustomText, PasswordInput, TextInput } from "../../components/fields/field";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Navigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import useWindowWidth from "../../hooks/windowWidth";
import WestIcon from "@mui/icons-material/West";
import { toastNotification } from "../../components/CustomToast/CustomToast";
import { authRegisterApi, roleDropDownApi } from "../../store/Slices/authSlice";
import config from "config/config";

const validationSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone_number: Yup.string().required("Phone number is required"),
  profile_picture: Yup.mixed().nullable(),
});

const ProfileTabPage = () => {
  const dispatch = useDispatch();
  const width = useWindowWidth();
  const theme = useSelector((state) => state.ui.darkMode);
  const user = useSelector((state) => state.auth.user);

  const initialValues = useMemo(() => {
    if (user) {
      return {
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        phone_number: user?.phone_number || "",
        old_profile_picture: user?.profile_picture || "",
        profile_picture: null,
      };
    }
    return {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      old_profile_picture:'',
      profile_picture: null,
    };
  }, [user]);

  const handleImageChange = (event, setFormFieldValue) => {
    const file = event.currentTarget.files[0];
    setFormFieldValue("profile_picture", file);
  };

  const handleSubmit = (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
    try {
      dispatch(authRegisterApi(values))
        .then((action) => {
          if (action?.meta?.requestStatus === "fulfilled") {
            if (theme) {
              toastNotification.successDark("Login Success Full");
            } else {
              toastNotification.successLight("Login Success Full");
            }
            // <Navigate to="/" replace={true} />
          } else if (action?.meta?.requestStatus === "rejected") {
            const message = action?.payload?.message ?? "Something went wrong";
            const status = action?.payload?.status ?? 410;
            const errors = action?.payload?.errors ?? [];
            if (status === 422) {
              const formattedErrors = errors.reduce((acc, error) => {
                acc[error.path] = error.msg;
                return acc;
              }, {});
              setErrors(formattedErrors);
            } else {
              if (theme) {
                toastNotification.errorDark(message);
              } else {
                toastNotification.errorLight(message);
              }
              setStatus({ error: message });
            }
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (error) {
      console.error("An error occurred:", error);
      setStatus({ error: "An unexpected error occurred." });
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="relative z-0"
        style={{
          background: "url('/images/hero-bg-pattern.png')",
          backgroundRepeat: "repeat-y repeat-x",
          backgroundSize: "contain",
          minHeight: 'calc(100vh - 84px)',
          // display: 'flex',
          // justifyContent: 'center',
          // alignItems: 'center',
          width:'100%'
        }}>
        <Box sx={{ backgroundColor: theme ? "#1C252E" : "#FFF" }} p={2} py={5} display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Box 
          sx={{ 
            width: 'calc(100% - 100px)'
             }}
          >
            <Formik initialValues={initialValues} validationSchema={validationSchema} enableReinitialize onSubmit={handleSubmit}>
              {({ errors, touched, isSubmitting, values, setFieldValue }) => {
                return (
                  <Form>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
                      {values.profile_picture instanceof File ? (
                        <Avatar
                          src={URL.createObjectURL(values.profile_picture)}
                          sx={{ mb: 2, height: 80, width: 80 }}
                        />
                      ) : (
                        <Avatar
                          src={`${config?.IMAGE_URL}/user/${user?.profile_picture}`}
                          sx={{ mb: 2, height: 80, width: 80 }}
                        />
                      )}
                    </Box>
                    <Box>
                      <Field name="first_name">{({ field }) => <TextInput {...field} fullWidth label="First Name" error={touched.first_name && !!errors.first_name} helperText={touched.first_name && errors.first_name} />}</Field>
                    </Box>
                    <Box>
                      <Field name="last_name">{({ field }) => <TextInput {...field} fullWidth label="Last Name" error={touched.last_name && !!errors.last_name} helperText={touched.last_name && errors.last_name} />}</Field>
                    </Box>
                    <Box>
                      <Field name="email">{({ field }) => <TextInput {...field} label="Email" type="email" error={touched.email && !!errors.email} helperText={touched.email && errors.email} />}</Field>
                    </Box>
                    <Box>
                      <Field name="phone_number">
                        {({ field }) => (
                          <TextInput
                            {...field}
                            label="Phone Number"
                            error={touched.phone_number && !!errors.phone_number}
                            helperText={touched.phone_number && errors.phone_number}
                            onChange={(e) => {
                              const value = e.target.value;
                              const formattedValue = value.replace(/\D/g, "").slice(0, 10);
                              setFieldValue("phone_number", formattedValue);
                            }}
                          />
                        )}
                      </Field>
                    </Box>
                    <Box className="mb-3">
                      <Button
                        fullWidth
                        variant="outlined"
                        component="label"
                        sx={{
                          color: touched.profile_picture && errors.profile_picture ? "#d32f2f" : theme ? "#FFF" : "#000", // Text color based on theme
                          borderColor: touched.profile_picture && errors.profile_picture ? "#d32f2f" : theme ? "#FFF" : "#000", // Border color based on theme
                          paddingLeft: "2.5rem",
                          paddingRight: "2.5rem",
                          marginRight: 2,
                          "&:hover": {
                            backgroundColor: touched.profile_picture && errors.profile_picture ? "error.dark" : "transparent", // Darker red on hover when error
                          },
                        }}>
                        Profile Image
                        <input type="file" hidden onChange={(event) => handleImageChange(event, setFieldValue)} />
                      </Button>
                      <ErrorMessage name="profile_picture" component={"div"} style={{ color: "#d32f2f", fontSize: "0.75rem" }} />
                    </Box>
                    <CommonButton type="submit" color="primary" fullWidth mt={3}>
                      Update
                    </CommonButton>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default ProfileTabPage;
