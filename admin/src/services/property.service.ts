import { appAxios } from "./appAxios.js";


const propertyStore = (values:any) => {
  const action = `/property/store`;
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
  // Note: Do not set Content-Type header for FormData; Axios handles it
  return appAxios.post(action, formData);
};

const propertyUpdate = (values:any) => {
  const action = `/property/update/${values._id}`;
  const formData = new FormData();

  Object.keys(values).forEach((key) => {
    if (key === "old_images") {
      // If you want to send old_images as a JSON string
      formData.append(key, JSON.stringify(values[key]));
    } else if (Array.isArray(values[key])) {
      // For array fields (e.g., images or files), append each item
      values[key].forEach((file:any) => {
        formData.append(key, file);
      });
    } else {
      // For other fields, append the key-value pair
      formData.append(key, values[key]);
    }
  });

  // No need to manually set the Content-Type header for FormData
  return appAxios.post(action, formData);
};

const propertyView = (values:any) => {
  const { page, rowsPerPage } = values; // Destructure values to get page and rowsPerPage
  const action = `/property/view?page=${page}&rowsPerPage=${rowsPerPage}`; // Construct the URL with query parameters
  return appAxios.get(action);
};

const propertyDelete = (values:any) => {
  const action = `/property/delete`;
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

const propertyFeatureUpdate = (values: any) => {
  const action = `/property/feature`;
  const formData = new FormData();

  // Populate formData with values
  Object.keys(values).forEach((key) => {
    formData.append(key, values[key]);
  });

  return appAxios.post(action, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const propertyDetail = (values:any) => {
  const action = `/property/detail/${values?._id}`;
  return appAxios.get(action);
};

const propertyImport = (values:any) => {
  const action = `/property/import`;
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
  // Note: Do not set Content-Type header for FormData; Axios handles it
  return appAxios.post(action, formData);
};

const propertyExport = (values:any) => {
  const action = `/property/export?type=${values?.exportType}`;
  return appAxios.get(action,{
    responseType: "blob", // Important for file downloads
  });
};

const propertyExample = (values:any) => {
  const action = `/property/example`;
  return appAxios.get(action,{ responseType: 'blob' });
};

const propertyApiController = {
  propertyStore,
  propertyView,
  propertyDelete,
  propertyDetail,
  propertyUpdate,
  propertyImport,
  propertyExport,
  propertyExample,
  propertyFeatureUpdate,
};

export default propertyApiController;