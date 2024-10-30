import { logout } from "src/store/Slices/authSlice";

export function handleResponse(response: any, thunkAPI: any) {
    console.log('response: ', response);
    if (response.status === 200) {
      return response.data;
    } else if (response.status === 404 || response.status === 401) {
      console.log('logout')
      thunkAPI.dispatch(logout()); // Trigger logout on 404
    }else{
      console.log('errorMessage')
      const errorMessage = (response?.data?.message) || 'Error occurred';
      throw new Error(errorMessage);
    }
}