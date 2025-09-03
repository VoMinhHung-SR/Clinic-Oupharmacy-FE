import APIs, { authApi, endpoints } from "../../../../config/APIs"
import Cookies from "js-cookie"

export const fetchAccessToken = async (username, password) =>{
    
    const getInfoCurrentUser = async () => {
        try{
            const user = await authApi().get(endpoints['current-user'])
            if(user.status === 200){
                Cookies.set('user', JSON.stringify(user.data))
             }
        }catch(err){
            console.error(err)
        }
        
    }

    const response = await APIs.get(endpoints["auth-info"])
    if(response.status === 200){
        const res = await authApi().post(endpoints['login'], {
            'username': username,
            'password': password,
            'client_id': `${response.data.client_id}`,
            'client_secret': `${response.data.client_secret}`,
            'grant_type': 'password'
        })
        if (res.status === 200) {
            Cookies.set('token', res.data.access_token)
            Cookies.set('refresh_token', res.data.refresh_token)

            // info current user
            getInfoCurrentUser();
        }
    }
}

// Firebase Social Login
export const firebaseSocialLogin = async (idToken, provider) => {
    try {
        const response = await APIs.post('/auth/firebase/', {
            id_token: idToken,
            provider: provider
        });
        
        if (response.status === 200) {
            Cookies.set('token', response.data.access_token);
            Cookies.set('refresh_token', response.data.refresh_token);
            Cookies.set('user', JSON.stringify(response.data.user));
            return response.data;
        }
    } catch (error) {
        console.error('Firebase social login error:', error);
        throw error;
    }
};

// Google Login
export const googleLogin = async (idToken) => {
    return firebaseSocialLogin(idToken, 'google');
};

// Facebook Login
export const facebookLogin = async (idToken) => {
    return firebaseSocialLogin(idToken, 'facebook');
};