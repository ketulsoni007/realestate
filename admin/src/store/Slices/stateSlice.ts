import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stateApiController from "src/services/state.service";
import { handleResponse } from "src/utils/handle-response";
import { handleError } from "src/utils/handle-error";

export const stateStoreApi = createAsyncThunk('state/store', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await stateApiController.stateStore(formValues);
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

export const stateUpdateApi = createAsyncThunk('state/update', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await stateApiController.stateUpdate(formValues);
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

export const stateListApi = createAsyncThunk('state/view', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await stateApiController.stateView(formValues);
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

export const stateDeleteApi = createAsyncThunk('state/delete', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await stateApiController.stateDelete(formValues);
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

export const stateDetailApi = createAsyncThunk('state/detail', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await stateApiController.stateDetail(formValues);
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

export const stateDropdownApi = createAsyncThunk('state/dropdown', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await stateApiController.stateDropdown(formValues);
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
  isStateListData: "",
  isStateDetail: "",
  isStateDropDownOption: [],
  isApiStatus: {
    stateStoreApi: "",
    stateListApi: "",
    stateDeleteApi: "",
    stateUpdateApi: "",
    stateDropdownApi:"",
  },
};

const stateSlice = createSlice({
  name: "state",
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
      .addCase(stateDropdownApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, stateDropdownApi: 'loading' };
      })
      .addCase(stateDropdownApi.fulfilled, (state, action) => {
        state.isStateDropDownOption = action.payload;
        state.isApiStatus = { ...state.isApiStatus, stateDropdownApi: 'succeeded' };
      })
      .addCase(stateDropdownApi.rejected, (state) => {
        state.isStateDropDownOption = [];
        state.isApiStatus = { ...state.isApiStatus, stateDropdownApi: 'failed' };
      })
      .addCase(stateUpdateApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, stateUpdateApi: 'loading' };
      })
      .addCase(stateUpdateApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, stateUpdateApi: 'succeeded' };
      })
      .addCase(stateUpdateApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, stateUpdateApi: 'failed' };
      })
      .addCase(stateDetailApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, stateDetailApi: 'loading' };
      })
      .addCase(stateDetailApi.fulfilled, (state, action) => {
        state.isStateDetail = action.payload;
        state.isApiStatus = { ...state.isApiStatus, stateDetailApi: 'succeeded' };
      })
      .addCase(stateDetailApi.rejected, (state) => {
        state.isStateDetail = "";
        state.isApiStatus = { ...state.isApiStatus, stateDetailApi: 'failed' };
      })
      .addCase(stateDeleteApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, stateDeleteApi: 'loading' };
      })
      .addCase(stateDeleteApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, stateDeleteApi: 'succeeded' };
      })
      .addCase(stateDeleteApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, stateDeleteApi: 'failed' };
      })
      .addCase(stateStoreApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, stateStoreApi: 'loading' };
      })
      .addCase(stateStoreApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, stateStoreApi: 'succeeded' };
      })
      .addCase(stateStoreApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, stateStoreApi: 'failed' };
      })
      .addCase(stateListApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, stateListApi: 'loading' };
      })
      .addCase(stateListApi.fulfilled, (state, action) => {
        state.isStateListData = action.payload;
        state.isApiStatus = { ...state.isApiStatus, stateListApi: 'succeeded' };
      })
      .addCase(stateListApi.rejected, (state) => {
        state.isStateListData = "";
        state.isApiStatus = { ...state.isApiStatus, stateListApi: 'failed' };
      });
  },
});

export const { reset } = stateSlice.actions;
export default stateSlice.reducer;
