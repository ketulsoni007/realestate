import { appAxios } from "./appAxios.js";

const subModuleStore = (values:any) => {
  const action = `/submodule/store`;
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

const subModuleUpdate = (values:any) => {
  const action = `/submodule/update/${values._id}`;
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

const subModuleView = (values:any) => {
  const { page, rowsPerPage }:any = values;
  const action = `/submodule/view?page=${page}&rowsPerPage=${rowsPerPage}`;
  return appAxios.get(action);
};

const subModuleDelete = (values:any) => {
  const action = `/submodule/delete`;
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

const subModuleDetail = (values:any) => {
  const action = `/submodule/detail/${values?._id}`;
  return appAxios.get(action);
};

const subModuleDropdown = (values:any) => {
  const action = `/submodule/dropdown`;
  return appAxios.get(action);
};


const subModuleApiController = {
  subModuleStore,
  subModuleUpdate,
  subModuleView,
  subModuleDetail,
  subModuleDelete,
  subModuleDropdown,
};

export default subModuleApiController;