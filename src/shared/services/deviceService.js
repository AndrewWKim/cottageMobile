import httpClient from './httpClient'

const subscribeDevice = async (clientId, deviceId) => {
    try {
        const response = await httpClient.post('devices', {
            clientId,
            playerId: deviceId,
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

const unsubscribeDevice = async deviceId => {
    try {
        const requestParams = {
            deviceId,
        }
        const response = await httpClient.put(`devices`, null, requestParams)
        return response.data
    } catch (e) {
        throw error.response.data
    }
}

export default { subscribeDevice, unsubscribeDevice }
