import { appAxios } from "./appAxios.js";

const sidebarList = (values:any) => {
  const action = `/module/sidebar`;
  return appAxios.get(action);
};

const permissionList = (values:any) => {
  const action = `/module/permission/list`;
  return appAxios.get(action);
};

const commonApiController = {
  sidebarList,
  permissionList,
};

export default commonApiController;