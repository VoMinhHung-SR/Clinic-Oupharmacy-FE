import axios from 'axios'
import Cookies from 'js-cookie'
import {
    ACCESS_TOKEN_COOKIE_EXPIRES_DAYS,
    REFRESH_TOKEN_COOKIE_EXPIRES_DAYS,
    AUTH_COOKIE_OPTIONS,
} from '../constants'

let refreshInFlight = null
let oauthInfoInFlight = null

export const persistAuthCookies = ({ access_token, refresh_token }) => {
    if (access_token) {
        Cookies.set('token', access_token, {
            ...AUTH_COOKIE_OPTIONS,
            expires: ACCESS_TOKEN_COOKIE_EXPIRES_DAYS,
        })
    }
    if (refresh_token) {
        Cookies.set('refresh_token', refresh_token, {
            ...AUTH_COOKIE_OPTIONS,
            expires: REFRESH_TOKEN_COOKIE_EXPIRES_DAYS,
        })
    }
}

export const clearAuthCookies = () => {
    Cookies.remove('token')
    Cookies.remove('refresh_token')
}

const getOAuth2Info = async ({ baseURL, endpoints }) => {
    if (!oauthInfoInFlight) {
        oauthInfoInFlight = axios
            .get(`${baseURL}${endpoints['auth-info']}`)
            .then((res) => res.data)
            .finally(() => {
                oauthInfoInFlight = null
            })
    }
    return oauthInfoInFlight
}

export const refreshAccessToken = async ({ baseURL, endpoints }) => {
    if (!refreshInFlight) {
        refreshInFlight = (async () => {
            const refreshToken = Cookies.get('refresh_token')
            if (!refreshToken) {
                clearAuthCookies()
                return null
            }

            const oauthInfo = await getOAuth2Info({ baseURL, endpoints })
            const payload = {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: oauthInfo.client_id,
                client_secret: oauthInfo.client_secret,
            }

            const res = await axios.post(`${baseURL}${endpoints.login}`, payload)
            if (res.status !== 200 || !res.data?.access_token) {
                clearAuthCookies()
                return null
            }

            persistAuthCookies(res.data)
            return res.data.access_token
        })()
            .catch(() => {
                clearAuthCookies()
                return null
            })
            .finally(() => {
                refreshInFlight = null
            })
    }

    return refreshInFlight
}
