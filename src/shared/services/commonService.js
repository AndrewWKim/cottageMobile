import httpClient from './httpClient'

const getCameraIPs = async page => {
    try {
        const response = await httpClient.get(`common/camera-ips/${page}`)
        return response.data
    } catch (error) {
        throw error
    }
}

const getResidentTypes = async () => {
    try {
        const response = await httpClient.get('common/resident-types')
        return response.data
    } catch (error) {
        throw error
    }
}

export default {
    getCameraIPs,
    getResidentTypes,
}
