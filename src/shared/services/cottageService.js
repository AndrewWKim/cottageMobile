import httpClient from './httpClient'

const updateCottage = async cottage => {
    try {
        const response = await httpClient.put('cottages', cottage)
        return response.data
    } catch (error) {
        throw error
    }
}

export default {
    updateCottage,
}
