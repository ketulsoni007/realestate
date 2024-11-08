import { appAxios } from "./appAxios.js";

const propertyList = (values) => {
  const action = `/property/list`;
  return appAxios.get(action);
};

const propertyCategoryList = (values) => {
  const action = `/property/categories`;
  return appAxios.get(action);
};

const propertyFeatureList = (values) => {
  const action = `/property/featured`;
  return appAxios.get(action);
};

const propertySearchList = (values) => {
  const action = `/property/search?keyword=${values?.keyword}`;
  return appAxios.get(action);
};

const propertyDetail = (values) => {
  const action = `/property/detail/${values?.id}?user=${values?.user}`;
  return appAxios.get(action);
};

const propertyFilterList = (values) => {
  const action = `/property/filter`;
  const formData = new FormData();
  if(values){
    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
  }

  return appAxios.post(action, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  // return appAxios.get(action);
};

const propertyContact = (values) => {
  const action = `/property/contact`;
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

const propertyApiController = {
  propertyList,
  propertyCategoryList,
  propertyFeatureList,
  propertySearchList,
  propertyFilterList,
  propertyDetail,
  propertyContact
};

export default propertyApiController;