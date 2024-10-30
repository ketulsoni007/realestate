import axios from "axios";
import { config } from "../config-global.js";
import { appAxios } from "./appAxios.js";
// import {store} from "../store";

const API_URL = config.API_URL;

const countryStore = (values:any) => {
  const action = `/country/store`;
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
  return appAxios.post(action, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const countryUpdate = (values:any) => {
  const action = `/country/update/${values._id}`;
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    formData.append(key, values[key]);
  });
  return appAxios.post(action, formData,{
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const countryView = (values:any) => {
  const { page, rowsPerPage }:any = values;
  const action = `/country/view?page=${page}&rowsPerPage=${rowsPerPage}`;
  return appAxios.get(action);
};

const countryDelete = (values:any) => {
  const action = `/country/delete`;
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    if (['ids'].includes(key)) {
      formData.append(key, JSON.stringify(values[key]));
    } else {
      formData.append(key, values[key]);
    }
  });
  return appAxios.delete(action, {
    data: formData,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const countryDetail = (values:any) => {
  const action = `/country/detail/${values?._id}`;
  return appAxios.get(action);
};

const countryDropdown = (values:any) => {
  const action = `/country/dropdown`;
  return appAxios.get(action);
};


const countryApiController = {
  countryStore,
  countryUpdate,
  countryView,
  countryDetail,
  countryDelete,
  countryDropdown,
};

export default countryApiController;