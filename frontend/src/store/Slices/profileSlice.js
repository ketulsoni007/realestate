import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import propertyApiController from "services/property.service";
import { handleResponse } from "utils/handle-response";
import { handleError } from "utils/handle-error";
import profileApiController from "services/profile.service";

export const wishListStoreApi = createAsyncThunk('profile/wishlist/store', async (formValues, thunkAPI) => {
    try {
        const response = await profileApiController.wisListStore(formValues);
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
    isProfileTab:0,
    isApiStatus: {
        wishListStoreApi: "",
    },
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        reset: () => initialState,
        ProfileTab: (state, action) => {
            state.isProfileTab = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(wishListStoreApi.pending, (state) => {
                state.isApiStatus = { ...state.isApiStatus, wishListStoreApi: 'loading' };
            })
            .addCase(wishListStoreApi.fulfilled, (state) => {
                state.isApiStatus = { ...state.isApiStatus, wishListStoreApi: 'succeeded' };
            })
            .addCase(wishListStoreApi.rejected, (state) => {
                state.isApiStatus = { ...state.isApiStatus, wishListStoreApi: 'failed' };
            });
    },
});

export const { reset,ProfileTab } = profileSlice.actions;
export default profileSlice.reducer;
