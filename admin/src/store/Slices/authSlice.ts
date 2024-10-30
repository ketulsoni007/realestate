import { createSlice, createAsyncThunk,PayloadAction } from "@reduxjs/toolkit";
import authApiController from "../../services/auth.service";
import { handleResponse } from "src/utils/handle-response";
import { handleError } from "src/utils/handle-error";


export const authRegisterApi = createAsyncThunk('user/register', async (formValues: any, thunkAPI: any) => {
  try {
    const response = await authApiController.register(formValues);
    if (response && response.status === 200) {
      return response.data;
    } else {
      const errorMessage = (response?.data?.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    const errorMessage = (error?.response?.data?.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status, message: errorMessage, errors });
  }
});

export const authUserCheckApi = createAsyncThunk('user/check', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await authApiController.userCheck(formValues);
    if (response && response.status === 200) {
      return response.data;
    } else {
      const errorMessage = (response && response.data && response.data.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
  } catch (error) {
    handleError(error,thunkAPI);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const roleDropDownApi = createAsyncThunk('user/roles/dropdown', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await authApiController.roles(formValues);
    if (response && response.status === 200) {
      return response.data;
    } else {
      const errorMessage = (response && response.data && response.data.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
  } catch (error) {
    handleError(error,thunkAPI);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const profileUpdateApi = createAsyncThunk('user/profile/update', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await authApiController.profilesUpdates(formValues);
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

export const passwordChangeApi = createAsyncThunk('user/password/change', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await authApiController.passwords(formValues);
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

export const authLoginApi = createAsyncThunk('user/login', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await authApiController.login(formValues);
    if (response && response.status === 200) {
      return response.data;
    } else {
      const errorMessage = (response && response.data && response.data.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
  } catch (error) {
    handleError(error,thunkAPI);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

export const authLogoutApi = createAsyncThunk('user/logout', async (formValues:any, thunkAPI:any) => {
  try {
    const response = await authApiController.logoutservice(formValues);
    if (response && response.status === 200) {
      return response.data;
    } else {
      const errorMessage = (response && response.data && response.data.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.log('error: ', error);
    const errorMessage =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const status = error?.response?.status ?? 410;
    const errors = error?.response?.data?.errors ?? '';
    return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
  }
});

const initialState: any = {
  isLoggedIn: false,
  user: null,
  isToken: "",
  isRegisterStep: 1,
  isRoleDropDownData: [],
  isApiStatus: {
    authRegisterApi: "",
    authLoginApi: "",
    profileUpdateApi: "",
    passwordChangeApi: "",
    roleDropDownApi: "",
    authLogoutApi: "",
    authUserCheckApi: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    tokenSetUp: (state, action) => {
      state.isToken = action.payload;
    },
    UserUpdate: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isToken = null
    },
    RegisterStep: (state, action) => {
      if (state.isRegisterStep > 0) {
        if (action.payload.slide === 'next') {
          state.isRegisterStep = state.isRegisterStep + 1;
        } else if (action.payload.slide === 'previous') {
          state.isRegisterStep = state.isRegisterStep - 1;
        }
      } else {
        state.isRegisterStep = 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authUserCheckApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, authUserCheckApi: 'loading' };
      })
      .addCase(authUserCheckApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, authUserCheckApi: 'succeeded' };
      })
      .addCase(authUserCheckApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, authUserCheckApi: 'failed' };
      })
      .addCase(authLogoutApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, authLogoutApi: 'loading' };
      })
      .addCase(authLogoutApi.fulfilled, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
        state.isToken = null;
        state.isApiStatus = { ...state.isApiStatus, authLogoutApi: 'succeeded' };
      })
      .addCase(authLogoutApi.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.isToken = null;
        state.isApiStatus = { ...state.isApiStatus, authLogoutApi: 'failed' };
      })
      .addCase(roleDropDownApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, roleDropDownApi: 'loading' };
      })
      .addCase(roleDropDownApi.fulfilled, (state, action) => {
        state.isRoleDropDownData = action.payload;
        state.isApiStatus = { ...state.isApiStatus, roleDropDownApi: 'succeeded' };
      })
      .addCase(roleDropDownApi.rejected, (state) => {
        state.isRoleDropDownData = [];
        state.isApiStatus = { ...state.isApiStatus, roleDropDownApi: 'failed' };
      })
      .addCase(passwordChangeApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, passwordChangeApi: 'loading' };
      })
      .addCase(passwordChangeApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, passwordChangeApi: 'succeeded' };
      })
      .addCase(passwordChangeApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, passwordChangeApi: 'failed' };
      })
      .addCase(profileUpdateApi.pending, (state) => {
        state.isApiStatus = { ...state.isApiStatus, profileUpdateApi: 'loading' };
      })
      .addCase(profileUpdateApi.fulfilled, (state, action) => {
        state.isApiStatus = { ...state.isApiStatus, profileUpdateApi: 'succeeded' };
      })
      .addCase(profileUpdateApi.rejected, (state) => {
        state.isApiStatus = { ...state.isApiStatus, profileUpdateApi: 'failed' };
      })
      .addCase(authRegisterApi.pending, (state) => {
        state.isApiStatus.authRegisterApi = "loading";
      })
      .addCase(authRegisterApi.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action?.payload?.user;
        state.isToken = action?.payload?.token;
        state.isApiStatus.authRegisterApi = "succeeded";
      })
      .addCase(authRegisterApi.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.isToken = null;
        state.isApiStatus.authRegisterApi = "failed";
      })
      .addCase(authLoginApi.pending, (state) => {
        state.isApiStatus.authLoginApi = "loading";
      })
      .addCase(authLoginApi.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.isToken = action.payload.token;
        state.isApiStatus.authLoginApi = "succeeded";
      })
      .addCase(authLoginApi.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.isToken = null;
        state.isApiStatus.authLoginApi = "failed";
      });
  },
});

export const { reset, logout, tokenSetUp, RegisterStep, UserUpdate } = authSlice.actions;
export default authSlice.reducer;
