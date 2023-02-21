import httpClient from './httpClient'

const getCottageBillings = async (userId, isForMeter) => {
    try {
        const requestParams = {
            isForMeter: isForMeter,
        }
        const response = await httpClient.get(
            `billing/cottage/${userId}`,
            requestParams,
        )
        return response.data
    } catch (error) {
        throw error
    }
}

const getCommunalBills = async cottageBillingId => {
    try {
        const response = await httpClient.get(
            `billing/cottage/bills/${cottageBillingId}`,
        )
        return response.data
    } catch (error) {
        throw error
    }
}

const getUnpaidFinanceCount = async userId => {
    try {
        const response = await httpClient.get(
            `billing/cottage/unpaid-finance/${userId}`,
        )
        return response.data
    } catch (error) {
        throw error
    }
}

const payWithCard = async (paymentType, clientId, cardId, billingId = null) => {
    const requestParams = {
        paymentType,
        clientId,
        cardId,
        billingId,
    }
    try {
        const response = await httpClient.get('billing/pay', requestParams)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

const getCardAddPage = async (paymentType, clientId) => {
    try {
        const requestParams = {
            paymentType: paymentType,
            clientId: clientId,
        }
        const response = await httpClient.get(`billing/card/add`, requestParams)
        return response.data
    } catch (error) {
        throw error
    }
}

const getPaymentPage = async (paymentType, clientId, billingId = null) => {
    try {
        const requestParams = {
            paymentType: paymentType,
            clientId: clientId,
            billingId: billingId
        }
        const response = await httpClient.get(`billing/over-limit/pay`, requestParams)
        return response.data
    } catch (error) {
        throw error
    }
}

const checkPayment = async orderId => {
    try {
        const requestParams = {
            orderId: orderId,
        }
        const response = await httpClient.get(
            `billing/payment/check`,
            requestParams,
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export default {
    getCottageBillings,
    getCommunalBills,
    getUnpaidFinanceCount,
    getCardAddPage,
    checkPayment,
    payWithCard,
    getPaymentPage
}
