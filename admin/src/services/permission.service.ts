import { appAxios } from "./appAxios.js";

const roleStore = (values:any) => {
  const action = `/permission/role/store`;
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

const roleUpdate = (values:any) => {
  const action = `/permission/role/update/${values._id}`;
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    formData.append(key, values[key]);
  });
  return appAxios.put(action, formData,{
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const accessUpdate = (values:any) => {
  const action = `/access/update/${values._id}`;
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    formData.append(key, values[key]);
  });
  return appAxios.put(action, formData,{
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const permissionStore = (values:any) => {
  const action = `/permission/store`;
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    if (['permissions'].includes(key)) {
      formData.append(key, JSON.stringify(values[key]));
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

const rolePermissionDropDown = (values:any) => {
  const action = `/permission/dropdown`;
  return appAxios.get(action);
};

const roleList = (values:any) => {
  const action = `/permission/list?roleId=${values?._id}&type=${values?.type}`;
  return appAxios.get(action);
};

const roleDelete = (values:any) => {
  const action = `/permission/role/delete`;
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


const permissionApiController = {
  roleStore,
  roleList,
  roleDelete,
  roleUpdate,
  permissionStore,
  accessUpdate,
  rolePermissionDropDown
};

export default permissionApiController;