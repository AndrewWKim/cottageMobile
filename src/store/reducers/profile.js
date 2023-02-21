import {
    FETCH_CURRENT_CLIENT,
    FETCH_CURRENT_CLIENT_SUCCESS,
    FETCH_CURRENT_CLIENT_ERROR,
    FETCH_CURRENT_RESIDENT,
    FETCH_CURRENT_RESIDENT_SUCCESS,
    FETCH_CURRENT_RESIDENT_ERROR,
    FETCH_COTTAGE_RESIDENTS,
    FETCH_COTTAGE_RESIDENTS_SUCCESS,
    FETCH_COTTAGE_RESIDENTS_ERROR,
    SET_QUESTIONNAIRES_NAVIGATOR,
    CLEAR_PROFILE_DATA,
} from '../types/profile'

const initialState = {
    isLoading: false,
    currentClient: null,
    currentResident: null,
    cottageClients: [],
    questionnairesNavigator: null,
}

export default (state = initialState, payload) => {
    switch (payload.type) {
        case FETCH_CURRENT_CLIENT:
            return { ...state, isLoading: true }
        case FETCH_CURRENT_CLIENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                currentClient: payload.currentClient,
            }
        case FETCH_CURRENT_CLIENT_ERROR:
            return { ...state, isLoading: false }
        case FETCH_CURRENT_RESIDENT:
            return { ...state, isLoading: true }
        case FETCH_CURRENT_RESIDENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                currentResident: payload.currentResident,
            }
        case FETCH_CURRENT_RESIDENT_ERROR:
            return { ...state, isLoading: false }
        case FETCH_COTTAGE_RESIDENTS:
            return { ...state, isLoading: true }
        case FETCH_COTTAGE_RESIDENTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                cottageClients: payload.cottageClients,
            }
        case FETCH_COTTAGE_RESIDENTS_ERROR:
            return { ...state, isLoading: false }
        case SET_QUESTIONNAIRES_NAVIGATOR:
            return {
                ...state,
                questionnairesNavigator: payload.questionnairesNavigator,
            }
        case CLEAR_PROFILE_DATA:
            return initialState
        default:
            return state
    }
}
