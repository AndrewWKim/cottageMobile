import {
    FETCH_COTTAGE_BILLINGS,
    FETCH_COTTAGE_BILLINGS_SUCCESS,
    FETCH_COTTAGE_BILLINGS_ERROR,
    FETCH_COMMUNAL_BILLS,
    FETCH_COMMUNAL_BILLS_SUCCESS,
    FETCH_COMMUNAL_BILLS_ERROR,
    CLEAR_BILLINGS_DATA,
    SET_CURRENT_COTTAGE_BILLING_ID,
    TOGGLE_PAYMENT_PAGE_VISIBLE,
    SET_PAYMENT_DATA,
    SET_CURRENT_CARD_ID,
    SET_TIMER_DATA,
    CLEAR_TIMER
} from '../types/billing'
import { initialTimer } from '../../shared/const/constants'

const initialState = {
    cottageBillings: [],
    communalBills: [],
    currentCottageBillingId: null,
    isLoading: false,
    paymentPageVisible: false,
    htmlPaymentForm: null,
    currentCardId: null,
    orderId: null,
    timerData: initialTimer,
}

export default (state = initialState, payload) => {
    switch (payload.type) {
        case FETCH_COTTAGE_BILLINGS:
            return { ...state, isLoading: true }
        case FETCH_COTTAGE_BILLINGS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                cottageBillings: payload.cottageBillings,
            }
        case FETCH_COTTAGE_BILLINGS_ERROR:
            return { ...state, isLoading: false }
        case FETCH_COMMUNAL_BILLS:
            return { ...state, isLoading: true }
        case FETCH_COMMUNAL_BILLS_SUCCESS:
            return { ...state, communalBills: payload.communalBills }
        case FETCH_COMMUNAL_BILLS_ERROR:
            return { ...state, isLoading: false }
        case CLEAR_BILLINGS_DATA:
            return initialState
        case SET_CURRENT_COTTAGE_BILLING_ID:
            return {
                ...state,
                currentCottageBillingId: payload.cottageBillingId,
            }
        case TOGGLE_PAYMENT_PAGE_VISIBLE:
            //PIVDENNIY - change logic here, when pay from card, need to change html in store
            return { ...state, paymentPageVisible: payload.paymentPageVisible }
        case SET_PAYMENT_DATA:
            //PIVDENNIY - change logic here
            return {
                ...state,
                htmlPaymentForm: payload.htmlPaymentForm,
                orderId: payload.orderId,
            }
        case SET_TIMER_DATA:
            return {
                ...state,
                timerData: payload.timerData,
            }
        case SET_CURRENT_CARD_ID:
            return { ...state, currentCardId: payload.cardId }
        case CLEAR_TIMER:
            return {
                ...state,
                timerData: payload.timerData,
                paymentPageVisible: payload.paymentPageVisible,
                htmlPaymentForm: payload.htmlPaymentForm,
                orderId: payload.orderId,
            }
        default:
            return state
    }
}
