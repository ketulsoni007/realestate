import React from "react";
import { Stack, Button, Paper, Box, Typography, Snackbar } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CommonButton, CustomText, PasswordInput, TextInput } from "../../components/fields/field";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import useWindowWidth from "../../hooks/windowWidth";
import { authLoginApi } from "../../store/Slices/authSlice";
import { toast } from "react-toastify";
import { toastNotification } from "../../components/CustomToast/CustomToast";
// Import from the file where components are defined

// Validation schema with Yup
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SignIn = () => {
  const dispatch = useDispatch();
  const width = useWindowWidth();
  const theme = useSelector((state) => state.ui.darkMode);

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
    try {
      dispatch(authLoginApi(values))
        .then((action) => {
          if (action?.meta?.requestStatus === "fulfilled") {
            if(theme){
              toastNotification.successDark('Login Success Full');
            }else{
              toastNotification.successLight('Login Success Full');
            }
          } else if (action?.meta?.requestStatus === "rejected") {
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
              if(theme){
                toastNotification.errorDark(message);
              }else{
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
              paddingX: "3%", // Equivalent to px-[3%]
              "@media (min-width: 900px)": {
                // Equivalent to md:px-[6%]
                paddingX: "6%",
              },
            }}>
            <Paper elevation={0} sx={{ padding: 5, background: theme ? "#1C252E" : "transparent" }}>
              <Box>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                  {({ errors, touched, isSubmitting }) => (
                    <Form>
                      <Box sx={{ mb: 1 }}>
                        <Field name="email">{({ field }) => <TextInput {...field} label="Email" type="email" error={touched.email && !!errors.email} helperText={touched.email && errors.email} />}</Field>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Field name="password">{({ field }) => <PasswordInput {...field} label="password" error={touched.password && !!errors.password} helperText={touched.password && errors.password} />}</Field>
                      </Box>
                      <CommonButton type="submit" color="primary" fullWidth>
                        Sign In
                      </CommonButton>
                    </Form>
                  )}
                </Formik>
              </Box>
              <Box display={"flex"} flexDirection={"row"} alignItems={"baseline"}>
                <CustomText variant="body1" stylings={{ mt: 2, mr: 1 }}>
                  Don't have an account
                </CustomText>
                <CustomText variant="body2" stylings={{ textDecoration: "underline", cursor: "pointer" }}>
                  <NavLink to="/signup">SignUp Here</NavLink>
                </CustomText>
              </Box>
            </Paper>
          </Stack>
        </div>
        {width > 652 ? (
          <div className="flex-1 basis-[20rem]">
            <img src="/images/hero-4.png" alt="" className="w-full" />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SignIn;
