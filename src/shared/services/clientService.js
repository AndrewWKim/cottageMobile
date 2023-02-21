import httpClient from './httpClient'

const createUserForClient = async user => {
    try {
        const response = await httpClient.post('clients/user', user)
        return response.data
    } catch (error) {
        throw error
    }
}

const getCurrentClient = async () => {
    try {
        const response = await httpClient.get('clients/current')
        return response.data
    } catch (error) {
        throw error
    }
}

const getClient = async clientId => {
    try {
        const response = await httpClient.get(`clients/${clientId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

const updateClient = async client => {
    try {
        //client.dateOfBirth = client.dateOfBirth ? client.dateOfBirth.replace(/:/g, "-") : null
        const response = await httpClient.put('clients', client)
        return response.data
    } catch (error) {
        throw error
    }
}

const updateClientBiometrics = async signature => {
    try {
        const response = await httpClient.put('clients/biometrics', {signature: signature})
        return response.data
    } catch (error) {
        throw error
    }
}

const getCottageClients = async cottageId => {
    try {
        const requestParams = {
            exceptCurrentClient: true,
        }
        const response = await httpClient.get(
            `clients/cottage/${cottageId}`,
            requestParams,
        )
        return response.data
    } catch (error) {
        throw error
    }
}

const createClientCard = async (clientId, card) => {
    try {
        const response = await httpClient.post(`clients/${clientId}/card`, card)
        return response.data
    } catch (error) {
        throw error
    }
}

export default {
    createUserForClient,
    getCurrentClient,
    updateClient,
    getCottageClients,
    getClient,
    createClientCard,
    updateClientBiometrics
}
