import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commonApiController from "src/services/common.service";
import { handleResponse } from "src/utils/handle-response";
import { handleError } from "src/utils/handle-error";

export const sidebarApi = createAsyncThunk('common/sidebar/list', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await commonApiController.sidebarList(formValues);
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

export const permissionListApi = createAsyncThunk('common/permission/list', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await commonApiController.permissionList(formValues);
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

export const notificationCountApi = createAsyncThunk('common/notification/count', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await commonApiController.notificationCount(formValues);
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
export const notificationListApi = createAsyncThunk('common/notification/list', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await commonApiController.notificationList(formValues);
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
export const notificationViewApi = createAsyncThunk('common/notification/view', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await commonApiController.notificationView(formValues);
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
  isSideBarList: [],
  isPermissionList: [],
  isNotificatioCount:0,
  isNotificatioList:[],
  isNotificatioView:{},
  isApiStatus: {
    sidebarApi: "",
    permissionListApi: "",
    notificationListApi:"",
  },
};

const commonSlice = createSlice({
  name: "common",
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
    .addCase(notificationViewApi.pending, (state) => {
      state.isApiStatus = { ...state.isApiStatus, notificationViewApi: 'loading' };
    })
    .addCase(notificationViewApi.fulfilled, (state, action) => {
      state.isNotificatioView = action.payload;
      state.isApiStatus = { ...state.isApiStatus, notificationViewApi: 'succeeded' };
    })
    .addCase(notificationViewApi.rejected, (state) => {
      state.isNotificatioView = {};
      state.isApiStatus = { ...state.isApiStatus, notificationViewApi: 'failed' };
    })
    .addCase(notificationListApi.pending, (state) => {
      state.isApiStatus = { ...state.isApiStatus, notificationListApi: 'loading' };
    })
    .addCase(notificationListApi.fulfilled, (state, action) => {
      state.isNotificatioList = action.payload;
      state.isApiStatus = { ...state.isApiStatus, notificationListApi: 'succeeded' };
    })
    .addCase(notificationListApi.rejected, (state) => {
      state.isNotificatioList = [];
      state.isApiStatus = { ...state.isApiStatus, notificationListApi: 'failed' };
    })
    .addCase(notificationCountApi.pending, (state) => {
      state.isApiStatus = { ...state.isApiStatus, notificationCountApi: 'loading' };
    })
    .addCase(notificationCountApi.fulfilled, (state, action) => {
      state.isNotificatioCount = action.payload;
      state.isApiStatus = { ...state.isApiStatus, notificationCountApi: 'succeeded' };
    })
    .addCase(notificationCountApi.rejected, (state) => {
      state.isNotificatioCount = 0;
      state.isApiStatus = { ...state.isApiStatus, permissionListApi: 'failed' };
    })
      .addCase(permissionListApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, permissionListApi: 'loading' };
      })
      .addCase(permissionListApi.fulfilled, (state, action) => {
        state.isPermissionList = action.payload;
        state.isApiStatus = { ...state.isApiStatus, permissionListApi: 'succeeded' };
      })
      .addCase(permissionListApi.rejected, (state) => {
        state.isPermissionList = [];
        state.isApiStatus = { ...state.isApiStatus, permissionListApi: 'failed' };
      })
      .addCase(sidebarApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, sidebarApi: 'loading' };
      })
      .addCase(sidebarApi.fulfilled, (state, action) => {
        state.isSideBarList = action.payload;
        state.isApiStatus = { ...state.isApiStatus, sidebarApi: 'succeeded' };
      })
      .addCase(sidebarApi.rejected, (state) => {
        state.isSideBarList = [];
        state.isApiStatus = { ...state.isApiStatus, sidebarApi: 'failed' };
      });
  },
});

export const { reset } = commonSlice.actions;
export default commonSlice.reducer;
