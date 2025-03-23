import { useContext } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import UserContext from '../../../lib/context/UserContext';

const ProtectedSpecialRoleRoute = ({allowedRoles = []}) => {
    const {user} = useContext(UserContext);

    const router = useNavigate()

    const location = useLocation()

    const navigateForbidden = () => {
        if (location.pathname.includes('/dashboard'))
            return router('/dashboard/forbidden')
        return router('/forbidden')
    }

    if (!user)
        return 
    if (allowedRoles.length === 0)
        return <Outlet/>;
    return allowedRoles.includes(user.role) ? <Outlet/> : navigateForbidden()
}

export default ProtectedSpecialRoleRoute