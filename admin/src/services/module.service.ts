import { appAxios } from "./appAxios.js";

const moduleStore = (values:any) => {
  const action = `/module/store`;
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

const moduleUpdate = (values:any) => {
  const action = `/module/update/${values._id}`;
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

const moduleView = (values:any) => {
  const { page, rowsPerPage }:any = values;
  const action = `/module/view?page=${page}&rowsPerPage=${rowsPerPage}`;
  return appAxios.get(action);
};

const moduleDelete = (values:any) => {
  const action = `/module/delete`;
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

const moduleDetail = (values:any) => {
  const action = `/module/detail/${values?._id}`;
  return appAxios.get(action);
};

const moduleDropdown = (values:any) => {
  const action = `/module/dropdown`;
  return appAxios.get(action);
};


const moduleApiController = {
  moduleStore,
  moduleUpdate,
  moduleView,
  moduleDetail,
  moduleDelete,
  moduleDropdown,
};

export default moduleApiController;