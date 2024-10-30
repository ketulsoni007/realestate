import axios from "axios";
import { config } from "../config-global.js";
import { appAxios } from "./appAxios.js";
// import {store} from "../store";

const cityStore = (values:any) => {
  const action = `/city/store`;
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

const cityUpdate = (values:any) => {
  const action = `/city/update/${values._id}`;
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

const cityView = (values:any) => {
  const { page, rowsPerPage }:any = values;
  const action = `/city/view?page=${page}&rowsPerPage=${rowsPerPage}`;
  return appAxios.get(action);
};

const cityDelete = (values:any) => {
  const action = `/city/delete`;
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

const cityDetail = (values:any) => {
  const action = `/city/detail/${values?._id}`;
  return appAxios.get(action);
};

const cityDropdown = (values:any) => {
  const action = `/city/dropdown?stateId=${values?._id}`;
  return appAxios.get(action);
};


const cityApiController = {
  cityStore,
  cityUpdate,
  cityView,
  cityDetail,
  cityDelete,
  cityDropdown,
};

export default cityApiController;