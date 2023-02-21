import httpClient from './httpClient'

const listAll = async cottageId => {
    try {
        const response = await httpClient.get(
            `passRequests/cottage/${cottageId}`,
        )
        return response.data
    } catch (error) {
        throw error
    }
}

const createPassRequest = async passRequest => {
    try {
        const response = await httpClient.post('passRequests', passRequest)
        return response.data
    } catch (error) {
        throw error
    }
}

const deletePassRequest = async passRequestId => {
    try {
        const response = await httpClient.delete(
            `passRequests/${passRequestId}`,
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export default {
    listAll,
    createPassRequest,
    deletePassRequest,
}
