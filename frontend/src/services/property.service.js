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
  const action = `/property/detail/${values?.id}`;
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

const propertyApiController = {
  propertyList,
  propertyCategoryList,
  propertyFeatureList,
  propertySearchList,
  propertyFilterList,
  propertyDetail
};

export default propertyApiController;