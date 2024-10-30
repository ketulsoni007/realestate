import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PublicRoute({ children }: any) {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;
