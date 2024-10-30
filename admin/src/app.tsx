import 'src/global.css';
import Fab from '@mui/material/Fab';
import { Router } from 'src/routes/sections';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { ThemeProvider } from 'src/theme/theme-provider';
import { useEffect } from 'react';
import { useAppDispatch } from './store';
import { permissionListApi, sidebarApi } from './store/Slices/commonSlice';

// ----------------------------------------------------------------------

interface TokenData {
  isToken: string; // Adjust type based on your actual token structure
}

export default function App() {
  useScrollToTop();
  const dispatch = useAppDispatch();
  const storage = localStorage.getItem('estate-admin-auth');
  const tokenData: TokenData | null = storage ? JSON.parse(storage) : null;
  let token = tokenData?.isToken || null;

  useEffect(() => {
    const fetchSidebarData = async () => {
      if (token) {
        // await dispatch(sidebarApi({})).unwrap();
        await dispatch(permissionListApi({})).unwrap();
      }
    };
    fetchSidebarData();
  }, [token]);

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
