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

const initialState: any = {
  isSideBarList: [],
  isPermissionList: [],
  isApiStatus: {
    sidebarApi: "",
    permissionListApi: "",
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
