import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cityApiController from "src/services/city.service";
import { handleResponse } from "src/utils/handle-response";
import { handleError } from "src/utils/handle-error";

export const cityStoreApi = createAsyncThunk('city/store', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await cityApiController.cityStore(formValues);
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

export const cityUpdateApi = createAsyncThunk('city/update', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await cityApiController.cityUpdate(formValues);
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

export const cityListApi = createAsyncThunk('city/view', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await cityApiController.cityView(formValues);
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

export const cityDeleteApi = createAsyncThunk('city/delete', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await cityApiController.cityDelete(formValues);
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

export const cityDetailApi = createAsyncThunk('city/detail', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await cityApiController.cityDetail(formValues);
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

export const cityDropdownApi = createAsyncThunk('city/dropdown', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await cityApiController.cityDropdown(formValues);
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
  isCityListData: "",
  isCityDetail: "",
  isCityDropDownOption: [],
  isApiStatus: {
    cityStoreApi: "",
    cityListApi: "",
    cityDeleteApi: "",
    cityUpdateApi: "",
    cityDropdownApi: "",
  },
};

const citySlice = createSlice({
  name: "city",
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
      .addCase(cityDropdownApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, cityDropdownApi: 'loading' };
      })
      .addCase(cityDropdownApi.fulfilled, (state, action) => {
        state.isCityDropDownOption = action.payload;
        state.isApiStatus = { ...state.isApiStatus, cityDropdownApi: 'succeeded' };
      })
      .addCase(cityDropdownApi.rejected, (state) => {
        state.isCityDropDownOption = [];
        state.isApiStatus = { ...state.isApiStatus, cityDropdownApi: 'failed' };
      })
      .addCase(cityUpdateApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, cityUpdateApi: 'loading' };
      })
      .addCase(cityUpdateApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, cityUpdateApi: 'succeeded' };
      })
      .addCase(cityUpdateApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, cityUpdateApi: 'failed' };
      })
      .addCase(cityDetailApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, cityDetailApi: 'loading' };
      })
      .addCase(cityDetailApi.fulfilled, (state, action) => {
        state.isCityDetail = action.payload;
        state.isApiStatus = { ...state.isApiStatus, cityDetailApi: 'succeeded' };
      })
      .addCase(cityDetailApi.rejected, (state) => {
        state.isCityDetail = "";
        state.isApiStatus = { ...state.isApiStatus, cityDetailApi: 'failed' };
      })
      .addCase(cityDeleteApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, cityDeleteApi: 'loading' };
      })
      .addCase(cityDeleteApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, cityDeleteApi: 'succeeded' };
      })
      .addCase(cityDeleteApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, cityDeleteApi: 'failed' };
      })
      .addCase(cityStoreApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, cityStoreApi: 'loading' };
      })
      .addCase(cityStoreApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, cityStoreApi: 'succeeded' };
      })
      .addCase(cityStoreApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, cityStoreApi: 'failed' };
      })
      .addCase(cityListApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, cityListApi: 'loading' };
      })
      .addCase(cityListApi.fulfilled, (state, action) => {
        state.isCityListData = action.payload;
        state.isApiStatus = { ...state.isApiStatus, cityListApi: 'succeeded' };
      })
      .addCase(cityListApi.rejected, (state) => {
        state.isCityListData = "";
        state.isApiStatus = { ...state.isApiStatus, cityListApi: 'failed' };
      });
  },
});

export const { reset } = citySlice.actions;
export default citySlice.reducer;
