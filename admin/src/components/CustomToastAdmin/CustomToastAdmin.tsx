import React from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

// CustomToast Component
const CustomToastAdmin = () => {
  const notify = {
    success: (message:any) => {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
    error: (message:any) => {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
    warning: (message:any) => {
      toast.warn(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
    info: (message:any) => {
      toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
  };

  return (
    <>
      <ToastContainer />
    </>
  );
};

// Exporting the notification functions directly
export const toastNotificationAdmin = {
  success: (message:any) => toast.success((message), {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme:'light',
    progress: undefined,
  }),
  error: (message:any) => toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme:'light',
    progress: undefined,
  }),
  warning: (message:any) => toast.warn(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme:'light',
    progress: undefined,
  }),
  info: (message:any) => toast.info(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme:'light',
    progress: undefined,
  }),
};

export default CustomToastAdmin;

