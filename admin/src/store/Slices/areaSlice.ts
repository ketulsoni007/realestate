import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import areaApiController from "src/services/area.service";
import { handleResponse } from "src/utils/handle-response";
import { handleError } from "src/utils/handle-error";

export const areaStoreApi = createAsyncThunk('area/store', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await areaApiController.areaStore(formValues);
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

export const areaUpdateApi = createAsyncThunk('area/update', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await areaApiController.areaUpdate(formValues);
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

export const areaListApi = createAsyncThunk('area/view', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await areaApiController.areaView(formValues);
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

export const areaDeleteApi = createAsyncThunk('area/delete', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await areaApiController.areaDelete(formValues);
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

export const areaDetailApi = createAsyncThunk('area/detail', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await areaApiController.areaDetail(formValues);
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

export const areaDropdownApi = createAsyncThunk('area/dropdown', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await areaApiController.areaDropdown(formValues);
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
  isAreaListData: "",
  isAreaDetail: "",
  isAreaDropDownOption: [],
  isApiStatus: {
    areaStoreApi: "",
    areaListApi: "",
    areaDeleteApi: "",
    areaUpdateApi: "",
    areaDropdownApi: "",
  },
};

const areaSlice = createSlice({
  name: "area",
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
      .addCase(areaDropdownApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, areaDropdownApi: 'loading' };
      })
      .addCase(areaDropdownApi.fulfilled, (state, action) => {
        state.isAreaDropDownOption = action.payload;
        state.isApiStatus = { ...state.isApiStatus, areaDropdownApi: 'succeeded' };
      })
      .addCase(areaDropdownApi.rejected, (state) => {
        state.isAreaDropDownOption = [];
        state.isApiStatus = { ...state.isApiStatus, areaDropdownApi: 'failed' };
      })
      .addCase(areaUpdateApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, areaUpdateApi: 'loading' };
      })
      .addCase(areaUpdateApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, areaUpdateApi: 'succeeded' };
      })
      .addCase(areaUpdateApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, areaUpdateApi: 'failed' };
      })
      .addCase(areaDetailApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, areaDetailApi: 'loading' };
      })
      .addCase(areaDetailApi.fulfilled, (state, action) => {
        state.isAreaDetail = action.payload;
        state.isApiStatus = { ...state.isApiStatus, areaDetailApi: 'succeeded' };
      })
      .addCase(areaDetailApi.rejected, (state) => {
        state.isAreaDetail = "";
        state.isApiStatus = { ...state.isApiStatus, areaDetailApi: 'failed' };
      })
      .addCase(areaDeleteApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, areaDeleteApi: 'loading' };
      })
      .addCase(areaDeleteApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, areaDeleteApi: 'succeeded' };
      })
      .addCase(areaDeleteApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, areaDeleteApi: 'failed' };
      })
      .addCase(areaStoreApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, areaStoreApi: 'loading' };
      })
      .addCase(areaStoreApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, areaStoreApi: 'succeeded' };
      })
      .addCase(areaStoreApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, areaStoreApi: 'failed' };
      })
      .addCase(areaListApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, areaListApi: 'loading' };
      })
      .addCase(areaListApi.fulfilled, (state, action) => {
        state.isAreaListData = action.payload;
        state.isApiStatus = { ...state.isApiStatus, areaListApi: 'succeeded' };
      })
      .addCase(areaListApi.rejected, (state) => {
        state.isAreaListData = "";
        state.isApiStatus = { ...state.isApiStatus, areaListApi: 'failed' };
      });
  },
});

export const { reset } = areaSlice.actions;
export default areaSlice.reducer;
