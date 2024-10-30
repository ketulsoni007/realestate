import React, { useEffect, useState } from "react";
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
import { authRegisterApi,roleDropDownApi } from "../../store/Slices/authSlice";

const Step1Schema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
  security_question: Yup.string().required("Security answer is required"),
  phone_number: Yup.string().required("Phone number is required"),
  role: Yup.string().required("Role is required"),
  profile_picture: Yup.mixed().required("Profile Picture Required"),
});

const Step2Schema = Yup.object().shape({
  commission_rate: Yup.number()
    .nullable()
    .typeError("Commission rate must be a number")
    .min(0, "Commission rate cannot be less than 0")
    .max(100, "Commission rate cannot exceed 100")
    .test("is-decimal", "Commission rate must have at most two decimal places", (value) => (value ? /^\d+(\.\d{1,2})?$/.test(value) : true))
    .when("role", {
      is: "broker", // When the role is 'broker'
      then: () => Yup.number().required("Commission rate is required for brokers"),
    }),
  agency_name: Yup.string().when("role", {
    is: "broker", // When the role is 'broker'
    then: () => Yup.string().required("Agency name is required for brokers"),
  }),
  license_number: Yup.string().when("role", {
    is: "broker", // When the role is 'broker'
    then: () => Yup.string().required("License number is required for brokers"),
  }),
});

const validationSchemaArray = [Step1Schema, Step2Schema];

const SignUp = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [fromStepTwo, setFromStepTwo] = useState(false);
  const width = useWindowWidth();
  const theme = useSelector((state) => state.ui.darkMode);
  const isRoleDropDownData = useSelector((state)=>state.auth.isRoleDropDownData);
  const RoleArray = isRoleDropDownData?.length > 0 ? isRoleDropDownData : [];

  useEffect(() => {
    dispatch(roleDropDownApi());
  }, []);
  

  // Initial values for the form
  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    security_question: "",
    phone_number: "",
    role: "",
    profile_picture: null,
    agency_name: "",
    commission_rate: "",
    license_number: "",
  };

  const handleImageChange = (event, setFormFieldValue) => {
    const file = event.currentTarget.files[0];
    setFormFieldValue("profile_picture", file);

    // Optionally, update the avatar preview immediately
    // const reader = new FileReader();
    // reader.onload = () => {
    //   form.setFieldValue('avatarPreview', reader.result);
    // };
    // reader.readAsDataURL(file);
  };

  const handleSubmit = (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
    try {
      if (values && (values?.role === "66ed5dc893048a3dada991a2" || values?.role === "66ed5dc893048a3dada991a3") && step === 1) {
        setStep(2);
        return;
      }
      dispatch(authRegisterApi(values))
        .then((action) => {
          if (action?.meta?.requestStatus === "fulfilled") {
            if (theme) {
              toastNotification.successDark("Login Success Full");
            } else {
              toastNotification.successLight("Login Success Full");
            }
            <Navigate to="/" replace={true} />
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
        className="relative z-0 flex-wrap min-h-screen gap-2 md:-mt-10 flex-center-center"
        style={{
          background: "url('/images/hero-bg-pattern.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}>
        <div className="absolute top-0 right-0 rounded-full bg-[#04a7ff]/30 dark:bg-[#04a7ff]/50 w-72 h-72 -z-10 blur-[120px]"></div>
        <div className="flex-1 basis-[20rem]">
          <Stack
            sx={{
              margin: "auto",
              marginTop: width <= 652 ? "50px" : "40px",
              paddingX: "3%", // Equivalent to px-[3%]
              "@media (min-width: 900px)": {
                // Equivalent to md:px-[6%]
                paddingX: "6%",
              },
            }}>
            <Paper elevation={0} sx={{ padding: 5, background: theme ? "#1C252E" : "transparent" }}>
              <Box>
                <Formik initialValues={initialValues} validationSchema={validationSchemaArray[step - 1]} onSubmit={handleSubmit}>
                  {({ errors, touched, isSubmitting, values, setFieldValue }) => {
                    return (
                      <Form>
                        {step === 1 ? (
                          <>
                            <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
                              {values.profile_picture instanceof File && (
                                <Avatar
                                  src={URL.createObjectURL(values.profile_picture)} // Create URL for the file object
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
                              <Field name="password">{({ field }) => <PasswordInput {...field} label="password" error={touched.password && !!errors.password} helperText={touched.password && errors.password} />}</Field>
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
                            <Box>
                              <CustomSelect value={values.role} onChange={(e) => setFieldValue("role", e.target.value)} label="Select Your Role" options={RoleArray} helperText={touched.role && errors.role ? errors.role : ""} error={touched.role && !!errors.role} customId="SignUp-role" />
                            </Box>
                            <Box>
                              <Field name="security_question">{({ field }) => <TextInput {...field} label="What is your birth place?" error={touched.security_question && !!errors.security_question} helperText={touched.security_question && errors.security_question} />}</Field>
                            </Box>
                            <Box className="mb-3">
                              {/* <Field name="profile_picture">
                                {({ field, form }) => (
                                  <TextInput
                                    fullWidth
                                    size="small"
                                    type="file"
                                    label="Profile Image"
                                    error={form.touched.profile_picture && !!form.errors.profile_picture}
                                    helperText={form.touched.profile_picture && form.errors.profile_picture}
                                    onChange={(event) => handleImageChange(event, form)}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                      inputProps: {
                                        accept: "image/*", // Restrict to image files
                                      },
                                    }}
                                  />
                                )}
                              </Field> */}
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
                          </>
                        ) : null}
                        {step === 2 ? (
                          <>
                            <Box sx={{ mb: 2 }}>
                              <Chip
                                sx={{
                                  backgroundColor: theme ? "#FFF" : "#1C252E",
                                  color: theme ? "#FFF" : "#131313",
                                  "& .MuiChip-label": {
                                    color: theme ? "#131313 !important" : "#FFF",
                                  },
                                }}
                                icon={<WestIcon sx={{ color:theme ? "#131313 !important" : "#FFF !important" }} />}
                                label="Back"
                                onClick={() => {
                                  setStep(1);
                                  setFromStepTwo(true);
                                }}
                              />
                            </Box>
                            <Box>
                              <Field name="agency_name">{({ field }) => <TextInput {...field} fullWidth label="Agency Name" error={touched.agency_name && !!errors.agency_name} helperText={touched.agency_name && errors.agency_name} />}</Field>
                            </Box>
                            <Box>
                              <Field name="commission_rate">
                                {({ field }) => (
                                  <TextInput
                                    {...field}
                                    fullWidth
                                    label="Commission Rate"
                                    error={touched.commission_rate && !!errors.commission_rate}
                                    helperText={touched.commission_rate && errors.commission_rate}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      // Allow digits and a single dot (for float)
                                      const formattedValue = value
                                        .replace(/[^0-9.]/g, "") // Remove any non-numeric and non-dot characters
                                        .replace(/(\..*)\./g, "$1"); // Prevent multiple dots
                                      setFieldValue("commission_rate", formattedValue);
                                    }}
                                  />
                                )}
                              </Field>
                            </Box>
                            <Box>
                              <Field name="license_number">{({ field }) => <TextInput {...field} fullWidth label="License Number" error={touched.license_number && !!errors.license_number} helperText={touched.license_number && errors.license_number} />}</Field>
                            </Box>
                          </>
                        ) : null}
                        <CommonButton type="submit" color="primary" fullWidth>
                          {fromStepTwo && values?.role === "broker" && step === 1 ? "Next" : "Sign In"}
                        </CommonButton>
                      </Form>
                    );
                  }}
                </Formik>
              </Box>
              <Box display={"flex"} flexDirection={"row"} alignItems={"baseline"}>
                <CustomText variant="body1" stylings={{ mt: 2, mr: 1 }}>
                  Already have an account
                </CustomText>
                <CustomText variant="body2" stylings={{ textDecoration: "underline", cursor: "pointer" }}>
                  <NavLink to="/signin">SignIn Here</NavLink>
                </CustomText>
              </Box>
            </Paper>
          </Stack>
        </div>
        {width > 991 ? (
          <div className="flex-1 basis-[20rem]">
            <img src="/images/hero-4.png" alt="" className="w-full" />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SignUp;
