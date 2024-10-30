import Swal from 'sweetalert2';

const useSweetAlert = () => {
  const showSuccess = (
    title: string,
    text: string,
    showCancelButton = false,
    confirmButtonText = "Okay"
  ) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: "success",
      showCancelButton: showCancelButton,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmButtonText,
    });
  };

  const showError = (
    title: string,
    text: string,
    showCancelButton = false,
    confirmButtonText = "Okay"
  ) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: "error",
      showCancelButton: showCancelButton,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmButtonText,
    });
  };

  const showWarning = (
    title: string,
    text: string,
    showCancelButton = true,
    confirmButtonText = "Yes, delete it!"
  ) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: showCancelButton,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmButtonText,
    });
  };

  return { showSuccess, showError, showWarning };
};

export default useSweetAlert;
