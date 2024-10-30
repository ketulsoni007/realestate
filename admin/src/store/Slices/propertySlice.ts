import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import propertyApiController from "src/services/property.service";
import { handleResponse } from "src/utils/handle-response";
import { handleError } from "src/utils/handle-error";

export const propertyStoreApi = createAsyncThunk('property/store', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await propertyApiController.propertyStore(formValues);
    return handleResponse(response,thunkAPI)
  } catch (error) {
    handleError(error,thunkAPI);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const propertyUpdateApi = createAsyncThunk('property/update', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await propertyApiController.propertyUpdate(formValues);
    return handleResponse(response,thunkAPI)
  } catch (error) {
    handleError(error,thunkAPI);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const propertyFeatureUpdateApi = createAsyncThunk('property/feature/update', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await propertyApiController.propertyFeatureUpdate(formValues);
    return handleResponse(response,thunkAPI)
  } catch (error) {
    handleError(error,thunkAPI);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const propertyListApi = createAsyncThunk('property/view', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await propertyApiController.propertyView(formValues);
    return handleResponse(response,thunkAPI)
  } catch (error) {
    handleError(error,thunkAPI);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const propertyDeleteApi = createAsyncThunk('property/delete', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await propertyApiController.propertyDelete(formValues);
    return handleResponse(response,thunkAPI)
  } catch (error) {
    handleError(error,thunkAPI);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const propertyDetailApi = createAsyncThunk('property/detail', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await propertyApiController.propertyDetail(formValues);
    return handleResponse(response,thunkAPI)
  } catch (error) {
    handleError(error,thunkAPI);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const propertyImportApi = createAsyncThunk('property/import', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await propertyApiController.propertyImport(formValues);
    return handleResponse(response,thunkAPI)
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    const unimportedData = error?.response?.data?.unimportedData ?? [];
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors,unimportedData:unimportedData });
  }
});

export const propertyExportApi = createAsyncThunk('property/export', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await propertyApiController.propertyExport(formValues);
    return handleResponse(response,thunkAPI)
  } catch (error) {
    handleError(error,thunkAPI);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const propertyExampleApi = createAsyncThunk('property/example', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await propertyApiController.propertyExample(formValues);
    return handleResponse(response,thunkAPI)
  } catch (error) {
    handleError(error,thunkAPI);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

const initialState:any = {
  ispropertyListData: "",
  isPropertyDetail:"",
  isPropertyExampleData:"",
  isOpenPropertyImport:false,
  isOpenPropertyFailedImportLog:false,
  isPropertyFailedImportLog : [],
  isApiStatus: {
    propertyStoreApi: "",
    propertyListApi: "",
    propertyDeleteApi:"",
    propertyUpdateApi:"",
    propertyImportApi:"",
    propertyExportApi:"",
    propertyExampleApi:"",
    propertyFeatureUpdateApi:"",
  },
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    reset: () => initialState,
    OpenPropertyImport: (state, action) => {
      state.isOpenPropertyImport = action.payload;
    },
    OpenPropertyFailedImportLog: (state, action) => {
      state.isOpenPropertyFailedImportLog = action.payload.open;
      state.isPropertyFailedImportLog = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(propertyFeatureUpdateApi.pending, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyFeatureUpdateApi: 'loading' };
    })
    .addCase(propertyFeatureUpdateApi.fulfilled, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyFeatureUpdateApi: 'succeeded' };
    })
    .addCase(propertyFeatureUpdateApi.rejected, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyFeatureUpdateApi: 'failed' };
    })
    .addCase(propertyExampleApi.pending, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyExampleApi: 'loading' };
    })
    .addCase(propertyExampleApi.fulfilled, (state, action) => {
      state.isPropertyExampleData = action.payload;
      state.isApiStatus = { ...state.isApiStatus, propertyExampleApi: 'succeeded' };
    })
    .addCase(propertyExampleApi.rejected, (state) => {
      state.isPropertyExampleData = "";
      state.isApiStatus = { ...state.isApiStatus, propertyExampleApi: 'failed' };
    })
    .addCase(propertyExportApi.pending, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyExportApi: 'loading' };
    })
    .addCase(propertyExportApi.fulfilled, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyExportApi: 'succeeded' };
    })
    .addCase(propertyExportApi.rejected, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyExportApi: 'failed' };
    })
    .addCase(propertyImportApi.pending, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyImportApi: 'loading' };
    })
    .addCase(propertyImportApi.fulfilled, (state, action) => {
      state.isApiStatus = { ...state.isApiStatus, propertyImportApi: 'succeeded' };
    })
    .addCase(propertyImportApi.rejected, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyImportApi: 'failed' };
    })
    .addCase(propertyUpdateApi.pending, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyUpdateApi: 'loading' };
    })
    .addCase(propertyUpdateApi.fulfilled, (state, action) => {
      state.isApiStatus = { ...state.isApiStatus, propertyUpdateApi: 'succeeded' };
    })
    .addCase(propertyUpdateApi.rejected, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyUpdateApi: 'failed' };
    })
    .addCase(propertyDetailApi.pending, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyDetailApi: 'loading' };
    })
    .addCase(propertyDetailApi.fulfilled, (state, action) => {
      state.isPropertyDetail = action.payload;
      state.isApiStatus = { ...state.isApiStatus, propertyDetailApi: 'succeeded' };
    })
    .addCase(propertyDetailApi.rejected, (state) => {
      state.isPropertyDetail = "";
      state.isApiStatus = { ...state.isApiStatus, propertyDetailApi: 'failed' };
    })
    .addCase(propertyDeleteApi.pending, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyDeleteApi: 'loading' };
    })
    .addCase(propertyDeleteApi.fulfilled, (state, action) => {
      state.isApiStatus = { ...state.isApiStatus, propertyDeleteApi: 'succeeded' };
    })
    .addCase(propertyDeleteApi.rejected, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyDeleteApi: 'failed' };
    })
    .addCase(propertyStoreApi.pending, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyStoreApi: 'loading' };
    })
    .addCase(propertyStoreApi.fulfilled, (state, action) => {
      state.isApiStatus = { ...state.isApiStatus, propertyStoreApi: 'succeeded' };
    })
    .addCase(propertyStoreApi.rejected, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyStoreApi: 'failed' };
    })
    .addCase(propertyListApi.pending, (state) => {
      state.isApiStatus = { ...state.isApiStatus, propertyListApi: 'loading' };
    })
    .addCase(propertyListApi.fulfilled, (state, action) => {
      state.ispropertyListData = action.payload;
      state.isApiStatus = { ...state.isApiStatus, propertyListApi: 'succeeded' };
    })
    .addCase(propertyListApi.rejected, (state) => {
      state.ispropertyListData = "";
      state.isApiStatus = { ...state.isApiStatus, propertyListApi: 'failed' };
    });
  },
});

export const { reset,OpenPropertyImport,OpenPropertyFailedImportLog } = propertySlice.actions;
export default propertySlice.reducer;
