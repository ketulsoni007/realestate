import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import propertyApiController from "services/property.service";
import { handleResponse } from "utils/handle-response";
import { handleError } from "utils/handle-error";

export const propertyListApi = createAsyncThunk('property/list', async (formValues, thunkAPI) => {
    try {
        const response = await propertyApiController.propertyList(formValues);
        return handleResponse(response, thunkAPI)
    } catch (error) {
        handleError(error, thunkAPI);
        const errorMessage =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        const status = error?.response?.status ?? 410;
        const errors = error?.response?.data?.errors ?? '';
        return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
    }
});

export const propertyCategoryListApi = createAsyncThunk('property/category/list', async (formValues, thunkAPI) => {
    try {
        const response = await propertyApiController.propertyCategoryList(formValues);
        return handleResponse(response, thunkAPI)
    } catch (error) {
        handleError(error, thunkAPI);
        const errorMessage =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        const status = error?.response?.status ?? 410;
        const errors = error?.response?.data?.errors ?? '';
        return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
    }
});

export const propertyFeaturedListApi = createAsyncThunk('property/featured/list', async (formValues, thunkAPI) => {
    try {
        const response = await propertyApiController.propertyFeatureList(formValues);
        return handleResponse(response, thunkAPI)
    } catch (error) {
        handleError(error, thunkAPI);
        const errorMessage =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        const status = error?.response?.status ?? 410;
        const errors = error?.response?.data?.errors ?? '';
        return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
    }
});

export const propertySearchListApi = createAsyncThunk('property/search/list', async (formValues, thunkAPI) => {
    try {
        const response = await propertyApiController.propertySearchList(formValues);
        return handleResponse(response, thunkAPI)
    } catch (error) {
        handleError(error, thunkAPI);
        const errorMessage =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        const status = error?.response?.status ?? 410;
        const errors = error?.response?.data?.errors ?? '';
        return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
    }
});

export const propertyFilterListApi = createAsyncThunk('property/filter/list', async (formValues, thunkAPI) => {
    try {
        const response = await propertyApiController.propertyFilterList(formValues);
        return handleResponse(response, thunkAPI)
    } catch (error) {
        handleError(error, thunkAPI);
        const errorMessage =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        const status = error?.response?.status ?? 410;
        const errors = error?.response?.data?.errors ?? '';
        return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
    }
});

export const propertyDetailApi = createAsyncThunk('property/details', async (formValues, thunkAPI) => {
    try {
        const response = await propertyApiController.propertyDetail(formValues);
        return handleResponse(response, thunkAPI)
    } catch (error) {
        handleError(error, thunkAPI);
        const errorMessage =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        const status = error?.response?.status ?? 410;
        const errors = error?.response?.data?.errors ?? '';
        return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
    }
});

export const propertyContactApi = createAsyncThunk('property/contact', async (formValues, thunkAPI) => {
    try {
        const response = await propertyApiController.propertyContact(formValues);
        return handleResponse(response, thunkAPI)
    } catch (error) {
        handleError(error, thunkAPI);
        const errorMessage =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        const status = error?.response?.status ?? 410;
        const errors = error?.response?.data?.errors ?? '';
        return thunkAPI.rejectWithValue({ status: status, message: errorMessage, errors: errors });
    }
});

const initialState = {
    isPropertyListData: [],
    isPropertyCategoryList: [],
    isPropertyFeatureList: [],
    isPropertySearchList: [],
    isPropertyFilterList: {},
    isPropertyDetail: {},
    isSearchFilterText: '',
    isApiStatus: {
        propertyListApi: "",
        propertyCategoryListApi: "",
        propertyFeaturedListApi: "",
        propertySearchListApi: "",
        propertyFilterListApi: "",
        propertyDetailApi: "",
        propertyContactApi:"",
    },
};

const propertySlice = createSlice({
    name: "property",
    initialState,
    reducers: {
        reset: () => initialState,
        PropertySearchListReset: (state, action) => {
            state.isPropertySearchList = [];
        },
        PropertySearchText: (state, action) => {
            state.isSearchFilterText = action.payload;
        },
        PropertyWishListToggle: (state, action) => {
            state.isPropertyDetail = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(propertyContactApi.pending, (state) => {
                state.isApiStatus = { ...state.isApiStatus, propertyContactApi: 'loading' };
            })
            .addCase(propertyContactApi.fulfilled, (state, action) => {
                state.isApiStatus = { ...state.isApiStatus, propertyContactApi: 'succeeded' };
            })
            .addCase(propertyContactApi.rejected, (state) => {
                state.isApiStatus = { ...state.isApiStatus, propertyContactApi: 'failed' };
            })
            .addCase(propertyDetailApi.pending, (state) => {
                state.isApiStatus = { ...state.isApiStatus, propertyDetailApi: 'loading' };
            })
            .addCase(propertyDetailApi.fulfilled, (state, action) => {
                state.isPropertyDetail = action.payload;
                state.isApiStatus = { ...state.isApiStatus, propertyDetailApi: 'succeeded' };
            })
            .addCase(propertyDetailApi.rejected, (state) => {
                state.isPropertyDetail = {};
                state.isApiStatus = { ...state.isApiStatus, propertyDetailApi: 'failed' };
            })
            .addCase(propertyFilterListApi.pending, (state) => {
                state.isApiStatus = { ...state.isApiStatus, propertyFilterListApi: 'loading' };
            })
            .addCase(propertyFilterListApi.fulfilled, (state, action) => {
                state.isPropertyFilterList = action.payload;
                state.isApiStatus = { ...state.isApiStatus, propertyFilterListApi: 'succeeded' };
            })
            .addCase(propertyFilterListApi.rejected, (state) => {
                state.isPropertyFilterList = {};
                state.isApiStatus = { ...state.isApiStatus, propertyFilterListApi: 'failed' };
            })
            .addCase(propertySearchListApi.pending, (state) => {
                state.isApiStatus = { ...state.isApiStatus, propertySearchListApi: 'loading' };
            })
            .addCase(propertySearchListApi.fulfilled, (state, action) => {
                state.isPropertySearchList = action.payload;
                state.isApiStatus = { ...state.isApiStatus, propertySearchListApi: 'succeeded' };
            })
            .addCase(propertySearchListApi.rejected, (state) => {
                state.isPropertySearchList = [];
                state.isApiStatus = { ...state.isApiStatus, propertySearchListApi: 'failed' };
            })
            .addCase(propertyFeaturedListApi.pending, (state) => {
                state.isApiStatus = { ...state.isApiStatus, propertyFeaturedListApi: 'loading' };
            })
            .addCase(propertyFeaturedListApi.fulfilled, (state, action) => {
                state.isPropertyFeatureList = action.payload;
                state.isApiStatus = { ...state.isApiStatus, propertyFeaturedListApi: 'succeeded' };
            })
            .addCase(propertyFeaturedListApi.rejected, (state) => {
                state.isPropertyFeatureList = [];
                state.isApiStatus = { ...state.isApiStatus, propertyFeaturedListApi: 'failed' };
            })
            .addCase(propertyCategoryListApi.pending, (state) => {
                state.isApiStatus = { ...state.isApiStatus, propertyCategoryListApi: 'loading' };
            })
            .addCase(propertyCategoryListApi.fulfilled, (state, action) => {
                state.isPropertyCategoryList = action.payload;
                state.isApiStatus = { ...state.isApiStatus, propertyCategoryListApi: 'succeeded' };
            })
            .addCase(propertyCategoryListApi.rejected, (state) => {
                state.isPropertyCategoryList = [];
                state.isApiStatus = { ...state.isApiStatus, propertyCategoryListApi: 'failed' };
            })
            .addCase(propertyListApi.pending, (state) => {
                state.isApiStatus = { ...state.isApiStatus, propertyListApi: 'loading' };
            })
            .addCase(propertyListApi.fulfilled, (state, action) => {
                state.isPropertyListData = action.payload;
                state.isApiStatus = { ...state.isApiStatus, propertyListApi: 'succeeded' };
            })
            .addCase(propertyListApi.rejected, (state) => {
                state.isPropertyListData = [];
                state.isApiStatus = { ...state.isApiStatus, propertyListApi: 'failed' };
            });
    },
});

export const { reset, PropertySearchListReset, PropertySearchText,PropertyWishListToggle } = propertySlice.actions;
export default propertySlice.reducer;
