import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT,
    UPDATE_SESSION,
    CREATE_USER,
    CREATE_USER_ERROR,
    CREATE_USER_SUCCESS,
    CLEAR_SIGNUP_ERROR,
} from '../types/auth'

const initialState = {
    session: null,
    isLoading: false,
    isUserCreating: false,
    signUpError: null,
}

export default (state = initialState, payload) => {
    switch (payload.type) {
        case LOGIN:
            return { ...state, isLoading: true }
        case LOGIN_SUCCESS:
            return { ...state, isLoading: false, session: payload.session }
        case LOGIN_ERROR:
            return { ...state, isLoading: false }
        case LOGOUT:
            return { ...state, session: null }
        case UPDATE_SESSION:
            return { ...state, session: payload.session }
        case CREATE_USER:
            return { ...state, isUserCreating: true }
        case CREATE_USER_SUCCESS:
            return { ...state, isUserCreating: false }
        case CREATE_USER_ERROR:
            return {
                ...state,
                isUserCreating: false,
                signUpError: payload.errorData,
            }
        case CLEAR_SIGNUP_ERROR:
            return { ...state, signUpError: null }
        default:
            return state
    }
}
