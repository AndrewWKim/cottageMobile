import {
    TOGGLE_SECURITY_TAB_VISIBLE,
    SET_IS_PORTRAIT,
    SET_IS_CLIENT_CALL_BACK_SENT,
    TOGGLE_LOADER_VISIBLE,
    TOGGLE_SNACKBAR_VISIBLE,
    SET_NET_INFO_UNSUBSCRIBER,
    TOGGLE_CONFIRMATION_DIALOG,
    TOGGLE_NEW_CARD_DIALOG,
    TOGGLE_SELECTOR_MODAL_VISIBLE,
    SET_SELECTOR_OPTIONS, TOGGLE_RULES_PAGE_VISIBLE,
} from '../types/common'

const toggleSecurityTab = isTabVisible => async dispatch => {
    dispatch({ type: TOGGLE_SECURITY_TAB_VISIBLE, isTabVisible })
    if (!isTabVisible) {
        setTimeout(() => {
            dispatch({
                type: SET_IS_CLIENT_CALL_BACK_SENT,
                isClientCallBackSent: false,
            })
        }, 300)
    }
}

const toggleSnackBar = (isSnackBarVisible, snackBarText) => async dispatch => {
    dispatch({ type: TOGGLE_SNACKBAR_VISIBLE, isSnackBarVisible, snackBarText })
}

const toggleLoader = isLoaderVisible => async dispatch => {
    dispatch({ type: TOGGLE_LOADER_VISIBLE, isLoaderVisible })
}

const toggleConfirmationDialog = (
    confirmationDialogVisible,
    confirmText,
    confirmAction,
) => async dispatch => {
    dispatch({
        type: TOGGLE_CONFIRMATION_DIALOG,
        confirmationDialogVisible,
        confirmText,
        confirmAction,
    })
}

const setIsPortrait = isPortrait => async dispatch => {
    dispatch({ type: SET_IS_PORTRAIT, isPortrait })
}

const setIsClientCallBackSent = isClientCallBackSent => async dispatch => {
    dispatch({ type: SET_IS_CLIENT_CALL_BACK_SENT, isClientCallBackSent })
}

const setNetInfoUnsubscriber = netInfoUnsubscriber => async dispatch => {
    dispatch({ type: SET_NET_INFO_UNSUBSCRIBER, netInfoUnsubscriber })
}

const toggleNewCardDialog = newCardDialogVisible => async dispatch => {
    dispatch({ type: TOGGLE_NEW_CARD_DIALOG, newCardDialogVisible })
}

const toggleSelectorModal = (selectorModalVisible, options, action) => async dispatch => {
    dispatch({ type: TOGGLE_SELECTOR_MODAL_VISIBLE, selectorModalVisible, options, action })
}

const toggleRulesPageVisible = (rulesPageVisible, rulesHtml) => async dispatch => {
    dispatch({type: TOGGLE_RULES_PAGE_VISIBLE, rulesPageVisible, rulesHtml})
}



export default {
    toggleSecurityTab,
    setIsPortrait,
    setIsClientCallBackSent,
    toggleLoader,
    toggleSnackBar,
    setNetInfoUnsubscriber,
    toggleConfirmationDialog,
    toggleNewCardDialog,
    toggleSelectorModal,
    toggleRulesPageVisible
}
