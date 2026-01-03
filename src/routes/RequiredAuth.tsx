import { useAuth, AuthContextType } from '../providers/AuthProvider';
import { useLocation, Outlet, Navigate } from 'react-router-dom';

export interface RequiredAuthProps {
  redirectTo?: string;
  /** Optional custom guard. Return true to allow access. */
  canAccess?: (auth: AuthContextType | undefined) => boolean;
}

export const RequiredAuth = ({ redirectTo = '/login', canAccess }: RequiredAuthProps) => {
  const auth = useAuth();
  const location = useLocation();

  const isAllowed = canAccess ? canAccess(auth) : Boolean(auth?.user);
  
  return isAllowed ? <Outlet /> : (
  <Navigate
    to={redirectTo}
    replace
    state={{ from: location.pathname }}
  />
);

}

export default RequiredAuth;
