import httpClient from './httpClient'

const listAll = async () => {
    try {
        const response = await httpClient.get(`news/client`)
        return response.data
    } catch (error) {
        throw error
    }
}

const readNews = async id => {
    try {
        const response = await httpClient.put(`news/${id}/read`, null)
        return response.data
    } catch (error) {
        throw error
    }
}

export default {
    listAll,
    readNews,
}