import httpClient from './httpClient'

const listAll = async userId => {
    try {
        const response = await httpClient.get(`ideas/${userId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

const voteIdea = async ideaVoteData => {
    try {
        const response = await httpClient.put(`ideas`, ideaVoteData)
        return response.data
    } catch (error) {
        throw error
    }
}

const listByCreattor = async userId => {
    try {
        const response = await httpClient.get(`ideas/creator/${userId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

const createIdea = async idea => {
    try {
        const response = await httpClient.post(`ideas`, idea)
        return response.data
    } catch (error) {
        throw error
    }
}

const readIdea = async id => {
    try {
        const response = await httpClient.put(`ideas/${id}/read`, null)
        return response.data
    } catch (error) {
        throw error
    }
}

export default {
    listAll,
    voteIdea,
    listByCreattor,
    createIdea,
    readIdea,
}
