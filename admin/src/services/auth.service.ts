import axios from "axios";
import {config} from "../config-global.js";
import { appAxios } from "./appAxios.js";
// import {store} from "../store";

const API_URL = config.API_URL;

const register = (values:any) => {
  const action = `/auth/register`;
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    if (Array.isArray(values[key])) {
      values[key].forEach((file:any) => {
        formData.append(key, file);
      });
    } else {
      formData.append(key, values[key]);
    }
  });
  formData.append('requests', 'client');
  // Note: Do not set Content-Type header for FormData; Axios handles it
  return axios.post(API_URL + action, formData);
};

const profilesUpdates = (values:any) => {
  const action = `/auth/update/${values?._id}`;
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    if (Array.isArray(values[key])) {
      values[key].forEach((file:any) => {
        formData.append(key, file);
      });
    } else {
      formData.append(key, values[key]);
    }
  });

  // Note: Do not set Content-Type header for FormData; Axios handles it
  return appAxios.put(API_URL + action, formData);
};


const login = (values:any) => {
  const action = `/auth/login`;
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    formData.append(key, values[key]);
  });
  formData.append('requests', 'client');
  return axios.post(API_URL + action, formData, {
    headers: {
      "Content-Type": "application/json"
    },
  });
};

const roles = (values:any) => {
  const action = `/auth/roles`;
  return axios.get(API_URL + action);
};

const userCheck = (values:any) => {
  const action = `/auth/session`;
  return appAxios.get(action,{
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const update = (formData:any, token:any) => {
  const id = formData && formData.id ? formData.id : "";
  const action = `/user/update-user/${id}`;

  return axios.put(API_URL + action, formData, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
};

const logoutservice = (token:any) => {
  return appAxios.get('/auth/logout');
};

const passwords = (formData:any) => {
  const id = formData && formData.id ? formData.id : "";
  const action = `/auth/password`;

  return axios.post(API_URL + action, formData, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${formData?.token}`
    },
  });
};


const authApiController = {
  register,
  login,
  logoutservice,
  roles,
  profilesUpdates,
  update,
  passwords,
  userCheck,
};

export default authApiController;