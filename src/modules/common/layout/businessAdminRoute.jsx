import { useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isBusinessAdmin } from '../../../lib/auth';
import UserContext from '../../../lib/context/UserContext';

/** Clinic FE business admin (is_admin). Not Jazzmin superuser gate. */
const ProtectedBusinessAdminRoute = () => {
  const { user } = useContext(UserContext);
  const router = useNavigate();
  const location = useLocation();

  if (!user) return null;
  if (isBusinessAdmin(user)) return <Outlet />;
  if (location.pathname.includes('/dashboard')) {
    router('/dashboard/forbidden');
    return null;
  }
  router('/forbidden');
  return null;
};

export default ProtectedBusinessAdminRoute;
