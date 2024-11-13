import { appAxios } from "./appAxios.js";

const sidebarList = (values:any) => {
  const action = `/module/sidebar`;
  return appAxios.get(action);
};

const permissionList = (values:any) => {
  const action = `/module/permission/list`;
  return appAxios.get(action);
};
const notificationCount = (values:any) => {
  const action = `/notification/count`;
  return appAxios.get(action);
};

const notificationList = (values:any) => {
  const action = `/notification/list`;
  return appAxios.get(action);
};

const notificationView = (values:any) => {
  const action = `/notification/view/${values?.id}`;
  return appAxios.get(action);
};

const commonApiController = {
  sidebarList,
  permissionList,
  notificationCount,
  notificationList,
  notificationView
};

export default commonApiController;