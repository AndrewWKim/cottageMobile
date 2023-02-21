import httpClient from './httpClient'

const getSettings = async () => {
    try {
        const response = await httpClient.get(`newSideSettings`)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export default {
    getSettings,
}
