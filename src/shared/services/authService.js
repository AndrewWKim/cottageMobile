import { COTTAGE_SESSION_STORAGE_KEY } from '../../shared/const/constants'
import moment from 'moment'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import { CLIENT_ID, AUTH_BASE_URL, BASE_URL } from '../const/constants'

const login = async (username, password) => {
    try {
        let tokenFormData = new FormData()
        tokenFormData.append('client_id', CLIENT_ID)
        tokenFormData.append('grant_type', 'password')
        tokenFormData.append('userName', username)
        tokenFormData.append('password', password)

        const tokenResponse = await axios.post(
            '/connect/token',
            tokenFormData,
            {
                baseURL: AUTH_BASE_URL,
            },
        )

        const token = tokenResponse.data

        const AuthStr = 'Bearer '.concat(token.access_token)

        const user = (
            await axios.get('/connect/userinfo', {
                baseURL: AUTH_BASE_URL,
                headers: { Authorization: AuthStr },
            })
        ).data

        const session = {
            token,
            expirationDateTime: moment()
                .add(token.expires_in, 'seconds')
                .toDate(),
            user,
        }

        await AsyncStorage.setItem(
            COTTAGE_SESSION_STORAGE_KEY,
            JSON.stringify(session),
        )

        return session
    } catch (error) {
        throw error
    }
}

const loginWithBiometric = async (signature) => {
    try {
        let tokenFormData = new FormData()
        tokenFormData.append('client_id', CLIENT_ID)
        tokenFormData.append('grant_type', 'biometric')
        tokenFormData.append('signature', signature)

        const tokenResponse = await axios.post(
            '/connect/token',
            tokenFormData,
            {
                baseURL: AUTH_BASE_URL,
            },
        )

        const token = tokenResponse.data

        const AuthStr = 'Bearer '.concat(token.access_token)

        const user = (
            await axios.get('/connect/userinfo', {
                baseURL: AUTH_BASE_URL,
                headers: { Authorization: AuthStr },
            })
        ).data

        const session = {
            token,
            expirationDateTime: moment()
                .add(token.expires_in, 'seconds')
                .toDate(),
            user,
        }

        await AsyncStorage.setItem(
            COTTAGE_SESSION_STORAGE_KEY,
            JSON.stringify(session),
        )

        return session
    } catch (error) {
        throw error
    }
}

const logout = async () => {
    await AsyncStorage.removeItem(COTTAGE_SESSION_STORAGE_KEY)
}

const refreshAuth = async () => {
    const session = JSON.parse(
        await AsyncStorage.getItem(COTTAGE_SESSION_STORAGE_KEY),
    )

    try {
        let tokenFormData = new FormData()
        tokenFormData.append('client_id', CLIENT_ID)
        tokenFormData.append('grant_type', 'refresh_token')
        tokenFormData.append('refresh_token', session.token.refresh_token)

        const tokenResponse = await axios.post(
            '/connect/token',
            tokenFormData,
            {
                baseURL: AUTH_BASE_URL,
            },
        )
        const token = tokenResponse.data
        const user = session.user

        const newSession = {
            token,
            expirationDateTime: moment()
                .add(token.expires_in, 'seconds')
                .toDate(),
            user,
        }

        await AsyncStorage.setItem(
            COTTAGE_SESSION_STORAGE_KEY,
            JSON.stringify(newSession),
        )

        return newSession
    } catch (error) {
        throw error
    }
}

const getSession = async () => {
    const session = JSON.parse(
        await AsyncStorage.getItem(COTTAGE_SESSION_STORAGE_KEY),
    )
    return session
}

const resetPassword = async (registrationCode, password) => {
    try {
        const request = await axios.post(
            '/api/auth/reset-password',
            { registrationCode, password },
            {
                baseURL: BASE_URL,
            },
        )
        return request.data
    } catch (error) {
        throw error.response.data
    }
}

export default {
    login,
    logout,
    refreshAuth,
    getSession,
    resetPassword,
    loginWithBiometric
}
