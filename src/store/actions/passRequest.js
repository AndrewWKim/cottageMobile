import {
    FETCH_PASS_REQUEST_LIST,
    FETCH_PASS_REQUEST_LIST_SUCCESS,
    FETCH_PASS_REQUEST_LIST_ERROR,
    SET_PASS_REQUEST_TYPE,
} from '../types/passRequest'

import passRequestService from '../../shared/services/passRequest'

const fetchPassRequests = cottageId => async dispatch => {
    try {
        dispatch({ type: FETCH_PASS_REQUEST_LIST })

        const passRequests = await passRequestService.listAll(cottageId)

        dispatch({
            type: FETCH_PASS_REQUEST_LIST_SUCCESS,
            passRequests: passRequests,
        })
    } catch (error) {
        dispatch({ type: FETCH_PASS_REQUEST_LIST_ERROR, error })
        throw error.response.data
    }
}

const setPassRequestType = type => async dispatch => {
    dispatch({ type: SET_PASS_REQUEST_TYPE, passRequestType: type })
}

export default {
    fetchPassRequests,
    setPassRequestType,
}
