import { logout } from "store/Slices/authSlice";

export function handleResponse(response, thunkAPI) {
    if (response.status === 200) {
      return response.data;
    } else if (response.status === 404 || response.status === 401) {
      thunkAPI.dispatch(logout()); // Trigger logout on 404
    }else{
      console.log('errorMessage')
      const errorMessage = (response?.data?.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
}