import { appAxios } from "./appAxios.js";

const wisListStore = (values) => {
  const action = `/profile/wishlist/store`;
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    formData.append(key, values[key]);
  });
  return appAxios.post(action, formData, {
    headers: {
      "Content-Type": "application/json"
    },
  });
};

const profileApiController = {
  wisListStore,
};

export default profileApiController;