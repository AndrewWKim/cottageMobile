import axios from 'axios'
import { COTTAGE_SESSION_STORAGE_KEY } from '../const/constants'
import AsyncStorage from '@react-native-community/async-storage'
import authService from './authService'
import { BASE_URL } from '../const/constants'

const GET = 'GET'
const POST = 'POST'
const PUT = 'PUT'
const DELETE = 'DELETE'
const PATCH = 'PATCH'

const AUTH_URLS = ['connect/token']

axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accepts'] = 'application/json'
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })

    failedQueue = []
}

axios.interceptors.response.use(
    response => {
        return response
    },
    err => {
        const originalRequest = err.config

        if (err.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject })
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] =
                            'Bearer ' + token
                        return axios(originalRequest)
                    })
                    .catch(err => {
                        return Promise.reject(err)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true

            return new Promise(function (resolve, reject) {
                authService
                    .refreshAuth()
                    .then(session => {
                        axios.defaults.headers.common['Authorization'] =
                            'Bearer ' + session.token.access_token
                        originalRequest.headers['Authorization'] =
                            'Bearer ' + session.token.access_token
                        processQueue(null, session.token.access_token)
                        resolve(axios(originalRequest))
                    })
                    .catch(err => {
                        processQueue(err, null)
                        reject(err)
                    })
                    .then(() => {
                        isRefreshing = false
                    })
            })
        }

        return Promise.reject(err)
    },
)

axios.interceptors.request.use(
    async config => {
        const session = JSON.parse(
            await AsyncStorage.getItem(COTTAGE_SESSION_STORAGE_KEY),
        )

        if (session && session.token && !(config.url in AUTH_URLS)) {
            config.headers[
                'Authorization'
            ] = `Bearer ${session.token.access_token}`
        }
        return config
    },
    error => {
        throw error
    },
)

const createRequestConfig = async (method, url, params, body) => {
    const config = {
        method: method,
        data: body,
        url: url,
        baseURL: BASE_URL + '/api/',
        params: params,
    }

    return config
}

const request = async (method, url, params, body) => {
    const config = await createRequestConfig(method, url, params, body)
    let response = null

    try {
        response = await axios.request(config)
    } catch (err) {
        if (err.response.status === 401) {
            await authService.refreshAuth()
            response = await axios.request(config)
        } else {
            throw err
        }
    }

    return response
}

const get = async (url, params) => {
    return await request(GET, url, params, null)
}

const post = async (url, body, params) => {
    return await request(POST, url, params, body)
}

const put = async (url, body, params) => {
    return await request(PUT, url, params, body)
}

const delete_ = async (url, body, params) => {
    return await request(DELETE, url, params, body)
}

const patch = async (url, body, params) => {
    return await request(PATCH, url, params, body)
}

export default {
    get,
    post,
    put,
    delete: delete_,
    patch,
}
