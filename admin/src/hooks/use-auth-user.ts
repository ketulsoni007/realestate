// // hooks/useCheckUser.js
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { authLogoutApi, authUserCheckApi, logout } from 'src/store/Slices/authSlice';
// import { CONFIG } from 'src/config-global';
// import { useAppDispatch } from 'src/store';

// interface TokenData {
//   isToken: string; // Adjust type based on your actual token structure
// }

// const useCheckUser = () => {
//   const dispatch = useAppDispatch();
//   const storage = localStorage.getItem('estate-admin-auth');
//   const tokenData: TokenData | null = storage ? JSON.parse(storage) : null;
//   const isToken = tokenData?.isToken || null;

//   useEffect(() => {
//     const checkUserToken = async () => {
//       if (isToken) {
//         dispatch(authUserCheckApi({})).then((action)=>{
//           if(action?.meta?.requestStatus === 'rejected'){
//             // dispatch(logout());
//           }
//         })
//       }
//     };
//     checkUserToken();
//   }, [isToken]);
// };

// export default useCheckUser;
