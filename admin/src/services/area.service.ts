import axios from "axios";
import { config } from "../config-global.js";
import { appAxios } from "./appAxios.js";
// import {store} from "../store";

const areaStore = (values:any) => {
  const action = `/area/store`;
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

const areaUpdate = (values:any) => {
  const action = `/area/update/${values._id}`;
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

const areaView = (values:any) => {
  const { page, rowsPerPage }:any = values;
  const action = `/area/view?page=${page}&rowsPerPage=${rowsPerPage}`;
  return appAxios.get(action);
};

const areaDelete = (values:any) => {
  const action = `/area/delete`;
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

const areaDetail = (values:any) => {
  const action = `/area/detail/${values?._id}`;
  return appAxios.get(action);
};

const areaDropdown = (values:any) => {
  const action = `/area/dropdown?cityId=${values?._id}`;
  return appAxios.get(action);
};


const areaApiController = {
  areaStore,
  areaUpdate,
  areaView,
  areaDetail,
  areaDelete,
  areaDropdown,
};

export default areaApiController;