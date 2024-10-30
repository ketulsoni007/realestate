import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moduleApiController from "src/services/module.service";
import { handleResponse } from "src/utils/handle-response";
import { handleError } from "src/utils/handle-error";

export const moduleStoreApi = createAsyncThunk('module/store', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await moduleApiController.moduleStore(formValues);
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

export const moduleUpdateApi = createAsyncThunk('module/update', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await moduleApiController.moduleUpdate(formValues);
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

export const moduleListApi = createAsyncThunk('module/view', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await moduleApiController.moduleView(formValues);
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

export const moduleDeleteApi = createAsyncThunk('module/delete', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await moduleApiController.moduleDelete(formValues);
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

export const moduleDetailApi = createAsyncThunk('module/detail', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await moduleApiController.moduleDetail(formValues);
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

export const moduleDropdownApi = createAsyncThunk('module/dropdown', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await moduleApiController.moduleDropdown(formValues);
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

const initialState: any = {
  isModuleListData: "",
  isModuleDetail: "",
  isModuleDropDownOption: [],
  isApiStatus: {
    moduleStoreApi: "",
    moduleListApi: "",
    moduleDeleteApi: "",
    moduleUpdateApi: "",
    moduleDropdownApi: "",
  },
};

const moduleSlice = createSlice({
  name: "module",
  initialState,
  reducers: {
    reset: () => initialState,
    // loginSuccess: (state, action) => {
    //   state.isLoggedIn = true;
    //   state.user = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(moduleDropdownApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, moduleDropdownApi: 'loading' };
      })
      .addCase(moduleDropdownApi.fulfilled, (state, action) => {
        state.isModuleDropDownOption = action.payload;
        state.isApiStatus = { ...state.isApiStatus, moduleDropdownApi: 'succeeded' };
      })
      .addCase(moduleDropdownApi.rejected, (state) => {
        state.isModuleDropDownOption = [];
        state.isApiStatus = { ...state.isApiStatus, moduleDropdownApi: 'failed' };
      })
      .addCase(moduleUpdateApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, moduleUpdateApi: 'loading' };
      })
      .addCase(moduleUpdateApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, moduleUpdateApi: 'succeeded' };
      })
      .addCase(moduleUpdateApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, moduleUpdateApi: 'failed' };
      })
      .addCase(moduleDetailApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, moduleDetailApi: 'loading' };
      })
      .addCase(moduleDetailApi.fulfilled, (state, action) => {
        state.isModuleDetail = action.payload;
        state.isApiStatus = { ...state.isApiStatus, moduleDetailApi: 'succeeded' };
      })
      .addCase(moduleDetailApi.rejected, (state) => {
        state.isModuleDetail = "";
        state.isApiStatus = { ...state.isApiStatus, moduleDetailApi: 'failed' };
      })
      .addCase(moduleDeleteApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, moduleDeleteApi: 'loading' };
      })
      .addCase(moduleDeleteApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, moduleDeleteApi: 'succeeded' };
      })
      .addCase(moduleDeleteApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, moduleDeleteApi: 'failed' };
      })
      .addCase(moduleStoreApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, moduleStoreApi: 'loading' };
      })
      .addCase(moduleStoreApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, moduleStoreApi: 'succeeded' };
      })
      .addCase(moduleStoreApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, moduleStoreApi: 'failed' };
      })
      .addCase(moduleListApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, moduleListApi: 'loading' };
      })
      .addCase(moduleListApi.fulfilled, (state, action) => {
        state.isModuleListData = action.payload;
        state.isApiStatus = { ...state.isApiStatus, moduleListApi: 'succeeded' };
      })
      .addCase(moduleListApi.rejected, (state) => {
        state.isModuleListData = "";
        state.isApiStatus = { ...state.isApiStatus, moduleListApi: 'failed' };
      });
  },
});

export const { reset } = moduleSlice.actions;
export default moduleSlice.reducer;
