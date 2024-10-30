import { logout } from "src/store/Slices/authSlice";

export function handleError(error: any,thunkAPI:any) {
    if (error && error?.status === 401 || error?.status === 403) {
        return thunkAPI.dispatch(logout())
    }
}