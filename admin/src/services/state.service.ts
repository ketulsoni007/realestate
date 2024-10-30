import axios from "axios";
import { config } from "../config-global.js";
import { appAxios } from "./appAxios.js";
// import {store} from "../store";

const API_URL = config.API_URL;

const stateStore = (values:any) => {
  const action = `/state/store`;
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

const stateUpdate = (values:any) => {
  const action = `/state/update/${values._id}`;
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

const stateView = (values:any) => {
  const { page, rowsPerPage }:any = values;
  const action = `/state/view?page=${page}&rowsPerPage=${rowsPerPage}`;
  return appAxios.get(action);
};

const stateDelete = (values:any) => {
  const action = `/state/delete`;
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

const stateDetail = (values:any) => {
  const action = `/state/detail/${values?._id}`;
  return appAxios.get(action);
};

const stateDropdown = (values:any) => {
  const action = `/state/dropdown?countryId=${values?._id}`;
  return appAxios.get(action);
};

const stateApiController = {
  stateStore,
  stateUpdate,
  stateView,
  stateDetail,
  stateDelete,
  stateDropdown,
};

export default stateApiController;