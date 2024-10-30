import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import permissionApiController from "src/services/permission.service";
import { handleResponse } from "src/utils/handle-response";
import { handleError } from "src/utils/handle-error";

export const roleDropdownApi = createAsyncThunk('permission/dropdown', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await permissionApiController.rolePermissionDropDown(formValues);
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

export const roleListApi = createAsyncThunk('permission/list', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await permissionApiController.roleList(formValues);
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

export const roleStoreApi = createAsyncThunk('role/store', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await permissionApiController.roleStore(formValues);
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

export const roleUpdateApi = createAsyncThunk('role/update', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await permissionApiController.roleUpdate(formValues);
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

export const permissionStoreApi = createAsyncThunk('permission/store', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await permissionApiController.permissionStore(formValues);
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

export const roleDeleteApi = createAsyncThunk('role/delete', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await permissionApiController.roleDelete(formValues);
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

export const accessPannelUpdateApi = createAsyncThunk('access/update', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await permissionApiController.accessUpdate(formValues);
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
  isRoleList: {},
  isOpenRoleCreateModal: false,
  isOpenRoleManageModal: false,
  isOpenAccessPannelModal: false,
  isRoleDropdown: [],
  isRoleEditModalData:{},
  isApiStatus: {
    roleListApi: "",
    roleStoreApi: "",
    permissionStoreApi: "",
    roleDropdownApi: "",
    roleDeleteApi: "",
    roleUpdateApi: "",
    accessPannelUpdateApi:"",
  },
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    reset: () => initialState,
    OpenRoleCreateModal: (state, action) => {
      state.isOpenRoleCreateModal = action.payload;
    },
    RoleEditModalData: (state, action) => {
      state.isRoleEditModalData = action.payload;
    },
    OpenRoleManageModal: (state, action) => {
      state.isOpenRoleManageModal = action.payload;
    },
    OpenAccessPannelModal: (state, action) => {
      state.isOpenAccessPannelModal = action.payload;
    },
    RoleListReset: (state) => {
      state.isRoleList = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(accessPannelUpdateApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, accessPannelUpdateApi: 'loading' };
      })
      .addCase(accessPannelUpdateApi.fulfilled, (state) => {
        state.isApiStatus = { ...state.isApiStatus, accessPannelUpdateApi: 'succeeded' };
      })
      .addCase(accessPannelUpdateApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, accessPannelUpdateApi: 'failed' };
      })
      .addCase(roleUpdateApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, roleUpdateApi: 'loading' };
      })
      .addCase(roleUpdateApi.fulfilled, (state) => {
        state.isApiStatus = { ...state.isApiStatus, roleUpdateApi: 'succeeded' };
      })
      .addCase(roleUpdateApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, roleUpdateApi: 'failed' };
      })
      .addCase(roleDeleteApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, roleDeleteApi: 'loading' };
      })
      .addCase(roleDeleteApi.fulfilled, (state) => {
        state.isApiStatus = { ...state.isApiStatus, roleDeleteApi: 'succeeded' };
      })
      .addCase(roleDeleteApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, roleDeleteApi: 'failed' };
      })
      .addCase(roleDropdownApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, roleDropdownApi: 'loading' };
      })
      .addCase(roleDropdownApi.fulfilled, (state,action) => {
        state.isRoleDropdown = action.payload;
        state.isApiStatus = { ...state.isApiStatus, roleDropdownApi: 'succeeded' };
      })
      .addCase(roleDropdownApi.rejected, (state) => {
        state.isRoleDropdown = [];
        state.isApiStatus = { ...state.isApiStatus, roleDropdownApi: 'failed' };
      })
      .addCase(permissionStoreApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, permissionStoreApi: 'loading' };
      })
      .addCase(permissionStoreApi.fulfilled, (state) => {
        state.isApiStatus = { ...state.isApiStatus, permissionStoreApi: 'succeeded' };
      })
      .addCase(permissionStoreApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, permissionStoreApi: 'failed' };
      })
      .addCase(roleStoreApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, roleStoreApi: 'loading' };
      })
      .addCase(roleStoreApi.fulfilled, (state) => {
        state.isApiStatus = { ...state.isApiStatus, roleStoreApi: 'succeeded' };
      })
      .addCase(roleStoreApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, roleStoreApi: 'failed' };
      })
      .addCase(roleListApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, roleListApi: 'loading' };
      })
      .addCase(roleListApi.fulfilled, (state, action) => {
        state.isRoleList = action.payload;
        state.isApiStatus = { ...state.isApiStatus, roleListApi: 'succeeded' };
      })
      .addCase(roleListApi.rejected, (state) => {
        state.isRoleList = {};
        state.isApiStatus = { ...state.isApiStatus, roleListApi: 'failed' };
      });
  },
});

export const { reset, OpenRoleCreateModal,RoleListReset,OpenRoleManageModal,RoleEditModalData,OpenAccessPannelModal } = permissionSlice.actions;
export default permissionSlice.reducer;
