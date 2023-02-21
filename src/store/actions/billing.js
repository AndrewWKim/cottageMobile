import {
    FETCH_COTTAGE_BILLINGS,
    FETCH_COTTAGE_BILLINGS_SUCCESS,
    FETCH_COTTAGE_BILLINGS_ERROR,
    FETCH_COMMUNAL_BILLS,
    FETCH_COMMUNAL_BILLS_SUCCESS,
    FETCH_COMMUNAL_BILLS_ERROR,
    SET_CURRENT_COTTAGE_BILLING_ID,
    TOGGLE_PAYMENT_PAGE_VISIBLE,
    SET_PAYMENT_DATA,
    SET_CURRENT_CARD_ID,
    SET_TIMER_DATA,
} from '../types/billing'
import { SET_UNPAID_COMMUNAL_BILLS_COUNT } from '../types/common'
import billingService from '../../shared/services/billingService'
import { initialTimer } from '../../shared/const/constants'

const fetchCottageBillings = (userId, isForMeter) => async dispatch => {
    try {
        dispatch({ type: FETCH_COTTAGE_BILLINGS })

        const cottageBillings = await billingService.getCottageBillings(
            userId,
            isForMeter,
        )

        dispatch({
            type: FETCH_COTTAGE_BILLINGS_SUCCESS,
            cottageBillings: cottageBillings,
        })
    } catch (error) {
        dispatch({ type: FETCH_COTTAGE_BILLINGS_ERROR })
        throw error.response.data
    }
}

const fetchCommunalBills = cottageBillingId => async dispatch => {
    try {
        dispatch({ type: FETCH_COMMUNAL_BILLS })

        const communalBills = cottageBillingId ? await billingService.getCommunalBills(
            cottageBillingId,
        ) : []

        dispatch({
            type: FETCH_COMMUNAL_BILLS_SUCCESS,
            communalBills: communalBills,
        })
    } catch (error) {
        dispatch({ type: FETCH_COMMUNAL_BILLS_ERROR })
        throw error.response.data
    }
}

const setCurrentCottageBillingId = cottageBillingId => async dispatch => {
    dispatch({
        type: SET_CURRENT_COTTAGE_BILLING_ID,
        cottageBillingId: cottageBillingId,
    })
}

const togglePaymentPageVisible = (
    paymentPageVisible,
    paymentData,
) => async dispatch => {
    if (paymentPageVisible) {
        dispatch({ type: TOGGLE_PAYMENT_PAGE_VISIBLE, paymentPageVisible })
        dispatch({
            type: SET_PAYMENT_DATA,
            htmlPaymentForm: paymentData.htmlPaymentForm,
            orderId: paymentData.orderId,
        })
    } else {
        dispatch({
            type: SET_TIMER_DATA,
            timerData: initialTimer,
        })
        dispatch({ type: TOGGLE_PAYMENT_PAGE_VISIBLE, paymentPageVisible })
        dispatch({
            type: SET_PAYMENT_DATA,
            htmlPaymentForm: null,
            orderId: null,
        })
    }
}

const getUnpaidCommunalBillsCount = userId => async dispatch => {
    try {
        const unpaidCommunalBillsCount = await billingService.getUnpaidFinanceCount(
            userId,
        )

        dispatch({
            type: SET_UNPAID_COMMUNAL_BILLS_COUNT,
            unpaidCommunalBillsCount,
        })
    } catch (error) {
        throw error.response.data
    }
}

const setCurrentCardId = cardId => async dispatch => {
    dispatch({ type: SET_CURRENT_CARD_ID, cardId })
}

const updateTimer = timerData => async dispatch => {
    const { tenMinutes, minutes, tenSeconds, seconds, timerCount } = timerData

    if (tenMinutes === 0 && minutes === 0 && tenSeconds == 0 && seconds === 0) {
        dispatch({
            type: CLEAR_TIMER,
            timerData: initialTimer,
            paymentPageVisible: false,
            htmlPaymentForm: null,
            orderId: null,
        })
    } else {
        dispatch({
            type: SET_TIMER_DATA,
            timerData: {
                tenMinutes:
                    tenMinutes === 0
                        ? 0
                        : minutes === 0 && tenSeconds === 0 && seconds === 0
                            ? tenMinutes - 1
                            : tenMinutes,
                minutes:
                    tenSeconds === 0 && seconds === 0 && minutes === 0
                        ? 9
                        : seconds === 0 && tenSeconds === 0
                            ? minutes - 1
                            : minutes,
                tenSeconds:
                    tenSeconds === 0 && seconds === 0
                        ? 5
                        : seconds === 0
                            ? tenSeconds - 1
                            : tenSeconds,
                seconds: seconds === 0 ? 9 : seconds - 1,
                timerCount: timerCount + 1,
            },
        })
    }
}

export default {
    fetchCottageBillings,
    fetchCommunalBills,
    setCurrentCottageBillingId,
    togglePaymentPageVisible,
    getUnpaidCommunalBillsCount,
    setCurrentCardId,
    updateTimer,
}
