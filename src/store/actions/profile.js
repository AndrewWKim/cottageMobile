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
} from '../types/profile'
import { TOGGLE_SNACKBAR_VISIBLE } from '../types/common'
import authActions from '../actions/auth'
import clientService from '../../shared/services/clientService'

const fetchCurrentClient = () => async dispatch => {
    try {
        dispatch({ type: FETCH_CURRENT_CLIENT })

        const currentClient = await clientService.getCurrentClient()

        // if ClientType was changed to Resident, logout Client
        if (currentClient.clientType === 2) {
            authActions.logout().then(() => {
                dispatch({
                    type: TOGGLE_SNACKBAR_VISIBLE,
                    isSnackBarVisible: true,
                    snackBarText: 'Доступ в приложение был отключен',
                })
            })
        }
        dispatch({ type: FETCH_CURRENT_CLIENT_SUCCESS, currentClient })
    } catch (error) {
        dispatch({ type: FETCH_CURRENT_CLIENT_ERROR })
        dispatch({
            type: TOGGLE_SNACKBAR_VISIBLE,
            isSnackBarVisible: true,
            error,
        })
        throw error.response.data
    }
}

const fetchCurrentResident = clientId => async dispatch => {
    try {
        dispatch({ type: FETCH_CURRENT_RESIDENT })

        const currentResident = await clientService.getClient(clientId)

        dispatch({ type: FETCH_CURRENT_RESIDENT_SUCCESS, currentResident })
    } catch (error) {
        dispatch({ type: FETCH_CURRENT_RESIDENT_ERROR })
        throw error.response.data
    }
}

const fetchCottageClients = cottageId => async dispatch => {
    try {
        dispatch({ type: FETCH_COTTAGE_RESIDENTS })

        const cottageClients = await clientService.getCottageClients(cottageId)

        dispatch({ type: FETCH_COTTAGE_RESIDENTS_SUCCESS, cottageClients })
    } catch (error) {
        dispatch({ type: FETCH_COTTAGE_RESIDENTS_ERROR })
        throw error.response.data
    }
}

const setQuestionnairesNavigator = questionnairesNavigator => async dispatch => {
    dispatch({ type: SET_QUESTIONNAIRES_NAVIGATOR, questionnairesNavigator })
}

export default {
    fetchCurrentClient,
    fetchCurrentResident,
    fetchCottageClients,
    setQuestionnairesNavigator,
}
