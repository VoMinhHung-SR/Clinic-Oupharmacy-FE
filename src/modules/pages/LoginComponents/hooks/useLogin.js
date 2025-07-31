import { useContext, useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from 'yup';
import { fetchAccessToken } from '../services';
import { authApi, endpoints } from '../../../../config/APIs';
import { useNavigate } from 'react-router';
import { userContext } from '../../../../App';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import UserContext from '../../../../lib/context/UserContext';
import { ROLE_DOCTOR, ROLE_NURSE } from '../../../../lib/constants';

const useLogin = () => {
    const {t} = useTranslation(['yup-validate'])
    const {user,dispatch} = useContext(UserContext)
    const [openError, setOpenError] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const nav = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
      };

    const mutation = useMutation((data) =>
        fetchAccessToken(data.username, data.password),
    );

    const onSubmit = async (data) => {
        setOpenBackdrop(true)
        // fetch access token 
        // require 2 params username and password
        const res = await mutation.mutateAsync((data), {
             onSuccess: (data) => {
               // info current user
               getInfoCurrentUser();
            },onError:(err) =>{
                setOpenError(true);
                setOpenBackdrop(false);
                console.log(err);
            }
        });

        setOpenBackdrop(false);
    };

    const getInfoCurrentUser = async () => {
        const user = await authApi().get(endpoints['current-user'])
        Cookies.set('user', JSON.stringify(user.data))
        dispatch({
            'type': 'login',
            'payload': user.data
        })
        if (user !== null) {
            if (user.data.role === ROLE_DOCTOR || user.data.role === ROLE_NURSE)
                return nav('/dashboard')
            return nav("/")
        }
    }
    const loginSchema = Yup.object().shape({
        username: Yup.string()
        .required(t('yupEmailRequired'))
        .max(150, t('yupEmailMaxLength')),
        password: Yup.string()
        .required(t('yupPasswordRequired'))
        .max(128,   t('yupPasswordMaxLength')),
    })

    return {
        openBackdrop,loginSchema,
        openError,
        onSubmit,
        setOpenError, showPassword, handleTogglePassword
    }
}
export default useLogin;