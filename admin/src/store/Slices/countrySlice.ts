import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import countryApiController from "src/services/country.service";
import { handleError } from "src/utils/handle-error";
import { handleResponse } from "src/utils/handle-response";

export const countryStoreApi = createAsyncThunk('country/store', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await countryApiController.countryStore(formValues);
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

export const countryUpdateApi = createAsyncThunk('country/update', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await countryApiController.countryUpdate(formValues);
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

export const countryListApi = createAsyncThunk('country/view', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await countryApiController.countryView(formValues);
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

export const countryDeleteApi = createAsyncThunk('country/delete', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await countryApiController.countryDelete(formValues);
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

export const countryDetailApi = createAsyncThunk('country/detail', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await countryApiController.countryDetail(formValues);
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

export const countryDropdownApi = createAsyncThunk('country/dropdown', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await countryApiController.countryDropdown(formValues);
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
  isCountryListData: "",
  isCountryDetail: "",
  isCountryDropDownOption: [],
  isApiStatus: {
    countryStoreApi: "",
    countryListApi: "",
    countryDeleteApi: "",
    countryUpdateApi: "",
    countryDropdownApi: "",
  },
};

const countrySlice = createSlice({
  name: "country",
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
      .addCase(countryDropdownApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, countryDropdownApi: 'loading' };
      })
      .addCase(countryDropdownApi.fulfilled, (state, action) => {
        state.isCountryDropDownOption = action.payload;
        state.isApiStatus = { ...state.isApiStatus, countryDropdownApi: 'succeeded' };
      })
      .addCase(countryDropdownApi.rejected, (state) => {
        state.isCountryDropDownOption = [];
        state.isApiStatus = { ...state.isApiStatus, countryDropdownApi: 'failed' };
      })
      .addCase(countryUpdateApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, countryUpdateApi: 'loading' };
      })
      .addCase(countryUpdateApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, countryUpdateApi: 'succeeded' };
      })
      .addCase(countryUpdateApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, countryUpdateApi: 'failed' };
      })
      .addCase(countryDetailApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, countryDetailApi: 'loading' };
      })
      .addCase(countryDetailApi.fulfilled, (state, action) => {
        state.isCountryDetail = action.payload;
        state.isApiStatus = { ...state.isApiStatus, countryDetailApi: 'succeeded' };
      })
      .addCase(countryDetailApi.rejected, (state) => {
        state.isCountryDetail = "";
        state.isApiStatus = { ...state.isApiStatus, countryDetailApi: 'failed' };
      })
      .addCase(countryDeleteApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, countryDeleteApi: 'loading' };
      })
      .addCase(countryDeleteApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, countryDeleteApi: 'succeeded' };
      })
      .addCase(countryDeleteApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, countryDeleteApi: 'failed' };
      })
      .addCase(countryStoreApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, countryStoreApi: 'loading' };
      })
      .addCase(countryStoreApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, countryStoreApi: 'succeeded' };
      })
      .addCase(countryStoreApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, countryStoreApi: 'failed' };
      })
      .addCase(countryListApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, countryListApi: 'loading' };
      })
      .addCase(countryListApi.fulfilled, (state, action) => {
        state.isCountryListData = action.payload;
        state.isApiStatus = { ...state.isApiStatus, countryListApi: 'succeeded' };
      })
      .addCase(countryListApi.rejected, (state) => {
        state.isCountryListData = "";
        state.isApiStatus = { ...state.isApiStatus, countryListApi: 'failed' };
      });
  },
});

export const { reset } = countrySlice.actions;
export default countrySlice.reducer;
