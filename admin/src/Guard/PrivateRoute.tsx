import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }: any) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  
  if (!isLoggedIn) {
    return <Navigate to="/signIn" replace />;
  }

  return children;
}

export default PrivateRoute;
