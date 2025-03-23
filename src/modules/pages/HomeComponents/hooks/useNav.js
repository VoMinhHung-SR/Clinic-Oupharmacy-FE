import Cookies from "js-cookie";
import { useContext } from "react";
import { userContext } from "../../../../App";
import { useNavigate } from "react-router";
import UserContext from "../../../../lib/context/UserContext";
const useNav = () =>{
    const {user, dispatch} = useContext(UserContext);
    const router = useNavigate();

    const handleLogout = () =>{
        Cookies.remove('token')
        Cookies.remove('user')
        Cookies.remove('refresh_token')
        if (user !== null)
            dispatch({
                "type": "logout",
                "payload": null
        })

        return router('/login')
    }
    const handleChangingPage = (address) => {
        router(address)
    }

    return {
        user,
        handleLogout, handleChangingPage
    }
}
export default useNav;