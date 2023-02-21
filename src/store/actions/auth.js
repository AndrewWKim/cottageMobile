import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT,
    CREATE_USER,
    CREATE_USER_SUCCESS,
    CREATE_USER_ERROR,
    CLEAR_SIGNUP_ERROR,
    UPDATE_SESSION,
} from '../types/auth'
import { CLEAR_IDEAS_DATA } from '../types/idea'
import { CLEAR_BILLINGS_DATA } from '../types/billing'
import { CLEAR_COMMON_DATA } from '../types/common'
import { CLEAR_PROFILE_DATA } from '../types/profile'
import { CLEAR_PASS_REQUEST_DATA } from '../types/passRequest'

import authService from '../../shared/services/authService'
import clientService from '../../shared/services/clientService'
import pushNotifications from '../../shared/utils/pushNotifications'

const login = (username, password, signature) => async dispatch => {
    try {
        dispatch({ type: LOGIN })
        let session = null;

        if (signature) {
            session = await authService.loginWithBiometric(signature)
        } else {
            session = await authService.login(username, password)
        }
        dispatch({ type: LOGIN_SUCCESS, session })
    } catch (error) {
        dispatch({ type: LOGIN_ERROR })
        if (!(error instanceof Error)) {
            throw new Error(error.message)
        } else {
            throw error.response.data
        }
    }
}

const logout = () => async dispatch => {
    await authService.logout()
    pushNotifications.unsubscribeFromPushNotifications()

    dispatch({ type: LOGOUT })
    dispatch({ type: CLEAR_IDEAS_DATA })
    dispatch({ type: CLEAR_BILLINGS_DATA })
    dispatch({ type: CLEAR_COMMON_DATA })
    dispatch({ type: CLEAR_PROFILE_DATA })
    dispatch({ type: CLEAR_PASS_REQUEST_DATA })
}

const signUp = accountData => async dispatch => {
    try {
        dispatch({ type: CREATE_USER })

        const newUser = {
            registrationCode: accountData.registrationCode,
            username: accountData.username,
            password: accountData.password,
        }

        await clientService.createUserForClient(newUser)

        dispatch(login(newUser.username, newUser.password))

        dispatch({ type: CREATE_USER_SUCCESS })
    } catch (error) {
        const errorData = error.response.data
        dispatch({ type: CREATE_USER_ERROR, errorData })
        throw errorData
    }
}

const updateSession = session => async dispatch => {
    dispatch({ type: UPDATE_SESSION, session })
}

const clearSignUpError = () => async dispatch => {
    dispatch({ type: CLEAR_SIGNUP_ERROR })
}

export default {
    login,
    logout,
    signUp,
    clearSignUpError,
    updateSession,
}
