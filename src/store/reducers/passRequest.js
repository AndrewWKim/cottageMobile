import {
    FETCH_PASS_REQUEST_LIST,
    FETCH_PASS_REQUEST_LIST_SUCCESS,
    FETCH_PASS_REQUEST_LIST_ERROR,
    CLEAR_PASS_REQUEST_DATA,
    SET_PASS_REQUEST_TYPE,
} from '../types/passRequest'

const initialState = {
    isLoading: false,
    passRequests: null,
    error: null,
    passRequestType: null,
}

export default (state = initialState, payload) => {
    switch (payload.type) {
        case FETCH_PASS_REQUEST_LIST:
            return { ...state, isLoading: true }
        case FETCH_PASS_REQUEST_LIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                passRequests: payload.passRequests,
            }
        case FETCH_PASS_REQUEST_LIST_ERROR:
            return { ...state, isLoading: false, error: payload.error }
        case SET_PASS_REQUEST_TYPE:
            return { ...state, passRequestType: payload.passRequestType }
        case CLEAR_PASS_REQUEST_DATA:
            return initialState
        default:
            return state
    }
}
