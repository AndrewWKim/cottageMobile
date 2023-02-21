import {
    SET_UNVOITED_IDEAS,
    SET_UNPAID_COMMUNAL_BILLS_COUNT,
    CLEAR_COMMON_DATA,
    TOGGLE_SECURITY_TAB_VISIBLE,
    SET_IS_PORTRAIT,
    SET_IS_CLIENT_CALL_BACK_SENT,
    TOGGLE_LOADER_VISIBLE,
    TOGGLE_SNACKBAR_VISIBLE,
    SET_NET_INFO_UNSUBSCRIBER,
    TOGGLE_CONFIRMATION_DIALOG,
    TOGGLE_NEW_CARD_DIALOG,
    SET_UNOPENED_IDEAS,
    SET_UNOPENED_NEWS,
    TOGGLE_SELECTOR_MODAL_VISIBLE,
    SET_SELECTOR_OPTIONS, TOGGLE_RULES_PAGE_VISIBLE,
} from '../types/common'

const initialState = {
    unvoitedIdeasCount: null,
    unopenedIdeasCount: 0,
    unopenedNewsCount: 0,
    unpaidCommunalBillsCount: null,
    securityVisible: false,
    loaderVisible: false,
    isPortrait: true,
    isClientCallBackSent: false,
    snackBarVisible: false,
    snackBarText: null,
    isLoading: false,
    netInfoUnsubscriber: null,
    confirmationDialogVisible: false,
    confirmText: null,
    confirmAction: null,
    newCardDialogVisible: false,
    selectorModalVisible: false,
    selectorOptions: [],
    selectorAction: null,
    rulesPageVisible: false,
    rulesHtml: null
}

export default (state = initialState, payload) => {
    switch (payload.type) {
        case SET_UNVOITED_IDEAS:
            return { ...state, unvoitedIdeasCount: payload.unvoitedIdeasCount }
        case SET_UNOPENED_IDEAS:
            return { ...state, unopenedIdeasCount: payload.unopenedIdeasCount }
        case SET_UNOPENED_NEWS:
            return { ...state, unopenedNewsCount: payload.unopenedNewsCount }
        case SET_UNPAID_COMMUNAL_BILLS_COUNT:
            return {
                ...state,
                unpaidCommunalBillsCount: payload.unpaidCommunalBillsCount,
            }
        case CLEAR_COMMON_DATA:
            return initialState
        case TOGGLE_SECURITY_TAB_VISIBLE:
            return { ...state, securityVisible: payload.isTabVisible }
        case TOGGLE_LOADER_VISIBLE:
            return { ...state, loaderVisible: payload.isLoaderVisible }
        case TOGGLE_SNACKBAR_VISIBLE:
            return {
                ...state,
                snackBarVisible: payload.isSnackBarVisible,
                snackBarText: payload.snackBarText,
            }
        case SET_IS_PORTRAIT:
            return { ...state, isPortrait: payload.isPortrait }
        case SET_IS_CLIENT_CALL_BACK_SENT:
            return {
                ...state,
                isClientCallBackSent: payload.isClientCallBackSent,
            }
        case SET_NET_INFO_UNSUBSCRIBER:
            return {
                ...state,
                netInfoUnsubscriber: payload.netInfoUnsubscriber,
            }
        case TOGGLE_CONFIRMATION_DIALOG:
            return {
                ...state,
                confirmationDialogVisible: payload.confirmationDialogVisible,
                confirmText: payload.confirmText,
                confirmAction: payload.confirmAction,
            }
        case TOGGLE_NEW_CARD_DIALOG:
            return {
                ...state,
                newCardDialogVisible: payload.newCardDialogVisible,
            }
        case TOGGLE_SELECTOR_MODAL_VISIBLE:
            return {
                ...state,
                selectorModalVisible: payload.selectorModalVisible,
                selectorOptions: payload.options || [],
                selectorAction: payload.action
            }
        case TOGGLE_RULES_PAGE_VISIBLE:
            return {
                ...state, 
                rulesPageVisible: payload.rulesPageVisible,
                rulesHtml: payload.rulesHtml
            }

        // case SET_SELECTOR_OPTIONS:
        //     return {
        //         ...state,
        //         selectorOptions: payload.options
        //     }
        default:
            return state
    }
}
