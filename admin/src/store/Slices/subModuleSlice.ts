import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import subModuleApiController from "src/services/submodule.service";
import { handleResponse } from "src/utils/handle-response";
import { handleError } from "src/utils/handle-error";

export const subModuleStoreApi = createAsyncThunk('submodule/store', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await subModuleApiController.subModuleStore(formValues);
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

export const subModuleUpdateApi = createAsyncThunk('submodule/update', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await subModuleApiController.subModuleUpdate(formValues);
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

export const subModuleListApi = createAsyncThunk('submodule/view', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await subModuleApiController.subModuleView(formValues);
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

export const subModuleDeleteApi = createAsyncThunk('submodule/delete', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await subModuleApiController.subModuleDelete(formValues);
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

export const subModuleDetailApi = createAsyncThunk('submodule/detail', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await subModuleApiController.subModuleDetail(formValues);
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

export const subModuleDropdownApi = createAsyncThunk('submodule/dropdown', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await subModuleApiController.subModuleDropdown(formValues);
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
  isSubModuleListData: "",
  isSubModuleDetail: "",
  isSubModuleDropDownOption: [],
  isApiStatus: {
    subModuleStoreApi: "",
    subModuleListApi: "",
    subModuleDeleteApi: "",
    subModuleUpdateApi: "",
    subModuleDropdownApi: "",
  },
};

const subModuleSlice = createSlice({
  name: "subModule",
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
      .addCase(subModuleDropdownApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, subModuleDropdownApi: 'loading' };
      })
      .addCase(subModuleDropdownApi.fulfilled, (state, action) => {
        state.isSubModuleDropDownOption = action.payload;
        state.isApiStatus = { ...state.isApiStatus, subModuleDropdownApi: 'succeeded' };
      })
      .addCase(subModuleDropdownApi.rejected, (state) => {
        state.isSubModuleDropDownOption = [];
        state.isApiStatus = { ...state.isApiStatus, subModuleDropdownApi: 'failed' };
      })
      .addCase(subModuleUpdateApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, subModuleUpdateApi: 'loading' };
      })
      .addCase(subModuleUpdateApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, subModuleUpdateApi: 'succeeded' };
      })
      .addCase(subModuleUpdateApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, subModuleUpdateApi: 'failed' };
      })
      .addCase(subModuleDetailApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, subModuleDetailApi: 'loading' };
      })
      .addCase(subModuleDetailApi.fulfilled, (state, action) => {
        state.isSubModuleDetail = action.payload;
        state.isApiStatus = { ...state.isApiStatus, subModuleDetailApi: 'succeeded' };
      })
      .addCase(subModuleDetailApi.rejected, (state) => {
        state.isSubModuleDetail = "";
        state.isApiStatus = { ...state.isApiStatus, subModuleDetailApi: 'failed' };
      })
      .addCase(subModuleDeleteApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, subModuleDeleteApi: 'loading' };
      })
      .addCase(subModuleDeleteApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, subModuleDeleteApi: 'succeeded' };
      })
      .addCase(subModuleDeleteApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, subModuleDeleteApi: 'failed' };
      })
      .addCase(subModuleStoreApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, subModuleStoreApi: 'loading' };
      })
      .addCase(subModuleStoreApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, subModuleStoreApi: 'succeeded' };
      })
      .addCase(subModuleStoreApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, subModuleStoreApi: 'failed' };
      })
      .addCase(subModuleListApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, subModuleListApi: 'loading' };
      })
      .addCase(subModuleListApi.fulfilled, (state, action) => {
        state.isSubModuleListData = action.payload;
        state.isApiStatus = { ...state.isApiStatus, subModuleListApi: 'succeeded' };
      })
      .addCase(subModuleListApi.rejected, (state) => {
        state.isSubModuleListData = "";
        state.isApiStatus = { ...state.isApiStatus, subModuleListApi: 'failed' };
      });
  },
});

export const { reset } = subModuleSlice.actions;
export default subModuleSlice.reducer;
