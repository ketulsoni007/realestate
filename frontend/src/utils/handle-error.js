import { logout } from "store/Slices/authSlice";

export function handleError(error, thunkAPI) {
    if (error && error?.status === 401 || error?.status === 403) {
        return thunkAPI.dispatch(logout())
    }
}