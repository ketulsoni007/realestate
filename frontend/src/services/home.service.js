import axios from "axios";
import config from "../../config.js";

const API_URL = config.API_URL;

// const register = (values) => {
//   const action = `/auth/register`;
//   const formData = new FormData();

//   // Append each key-value pair to the FormData object
//   Object.keys(values).forEach((key) => {
//     if (Array.isArray(values[key])) {
//       values[key].forEach((file) => {
//         formData.append(key, file);
//       });
//     } else {
//       formData.append(key, values[key]);
//     }
//   });

//   // Note: Do not set Content-Type header for FormData; Axios handles it
//   return axios.post(API_URL + action, formData);
// };


// const login = (values) => {
//   const action = `/user/login`;
//   const formData = new FormData();

//   // Append form values to the FormData object
//   Object.keys(values).forEach((key) => {
//     formData.append(key, values[key]);
//   });

//   // You can also append additional data if needed
//   // formData.append("auth_key", auth_key);

//   return axios.post(API_URL + action, formData, {
//     headers: {
//       "Content-Type": "application/json"
//     },
//   });
// };
// const avatarsetups = (avatarFile) => {
//   // console.log("avatarFile", avatarFile);
//   const action = "/user/upload-avatar";

//   return axios.post(API_URL + action, avatarFile, {
//     // No need to set "Content-Type" header manually, it will be set automatically
//   });
// };


// const getuserschatlist = (formData) => {
//   const id = formData && formData.id ? formData.id : "";
//   const keywords = formData?.keywords ? formData.keywords : '';

//   const queryString = new URLSearchParams({
//     keywords
//   }).toString();

//   const action = `/user/user-list/${id}?${queryString}`;

//   return axios.get(API_URL + action, {
//     headers: {
//       "Content-Type": "application/json"
//     },
//   });
// };

const herodoctors = (formData) => {
  const action = `/home/heros`;

  return axios.get(API_URL + action, {
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${formData?.token}`
    },
  });
};

const finddoctors = (values) => {
  const title = values?.title || "";
  const action = `/home/find-doctors?keywords=${values?.keywords}&title=${title}`;

  return axios.get(API_URL + action, {
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${values?.token}`
    },
  });
};

const doctorDetails = (values) => {
  const action = `/home/doctor/${values?.id}`;

  return axios.get(API_URL + action, {
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${values?.token}`
    },
  });
};

const doctorExpDetails = (values) => {
  const action = `/home/doctor/exp-get/${values?.id}`;

  return axios.get(API_URL + action, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${values?.token}`
    },
  });
};

const doctorlists = (values) => {
  const action = `/booking/doctor/list`;

  return axios.get(API_URL + action, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${values?.token}`
    },
  });
};

const hourupdate = (values) => {
  const action = `/home/doctor/hour-update`;
  const formdata = new FormData();
  Object.keys(values).forEach((key) => {
    if (key === 'workingHours') {
      formdata.append(key, JSON.stringify(values[key]));
    } else {
      formdata.append(key, values[key]);
    }
  });

  return axios.post(API_URL + action, formdata, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${values?.token}`
    },
  });
};

const myappointment = (values) => {
  const action = `/booking/appointment/myappointment`;
  const formdata = new FormData();
  Object.keys(values).forEach((key) => {
    formdata.append(key, values[key]);
  });

  return axios.post(API_URL + action, formdata, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${values?.token}`
    },
  });
};

const statusupdate = (values) => {
  const action = `/booking/appointment/status-update`;
  const formdata = new FormData();
  Object.keys(values).forEach((key) => {
    formdata.append(key, values[key]);
  });

  return axios.post(API_URL + action, formdata, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${values?.token}`
    },
  });
};

const experienceupdate = (values) => {
  const action = `/home/doctor/exp-update`;
  const formdata = new FormData();
  Object.keys(values).forEach((key) => {
    if (key === 'education' || key === 'experience') {
      formdata.append(key, JSON.stringify(values[key]));
    } else {
      formdata.append(key, values[key]);
    }
  });

  return axios.post(API_URL + action, formdata, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${values?.token}`
    },
  });
};

const bookAppointment = (values) => {
  const action = `/booking/appointment/book`;
  const formData = new FormData();

  Object.keys(values).forEach((key) => {
    if (Array.isArray(values[key])) {
      values[key].forEach((file) => {
        formData.append(key, file);
      });
    } else {
      formData.append(key, values[key]);
    }
  });
  return axios.post(API_URL + action, formData, {
    headers: {
      "Authorization": `Bearer ${values?.token}`
    },
  });
};

const rateStore = (values) => {
  const action = `/rating/store`;
  const formdata = new FormData();
  Object.keys(values).forEach((key) => {
    if (key === 'education' || key === 'experience') {
      formdata.append(key, JSON.stringify(values[key]));
    } else {
      formdata.append(key, values[key]);
    }
  });

  return axios.post(API_URL + action, formdata, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${values?.token}`
    },
  });
};


const homeApiController = {
  herodoctors,
  myappointment,
  doctorlists,
  finddoctors,
  doctorDetails,
  doctorExpDetails,
  hourupdate,
  statusupdate,
  rateStore,
  bookAppointment,
  experienceupdate
};

export default homeApiController;