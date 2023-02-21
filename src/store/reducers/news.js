import {
    FETCH_NEWS_LIST_DATA,
    FETCH_NEWS_LIST_DATA_SUCCESS,
    FETCH_NEWS_LIST_DATA_ERROR,
    CLEAR_NEWS_DATA,
} from '../types/news'

const initialState = {
    isNewsListLoading: false,
    allNews: null,
    error: null,
}

export default (state = initialState, payload) => {
    switch (payload.type) {
        case FETCH_NEWS_LIST_DATA:
            return { ...state, isNewsListLoading: true }
        case FETCH_NEWS_LIST_DATA_SUCCESS:
            return {
                ...state,
                isNewsListLoading: false,
                allNews: payload.news,
            }
        case FETCH_NEWS_LIST_DATA_ERROR:
            return { ...state, isNewsListLoading: false, error: payload.error }
        case CLEAR_NEWS_DATA:
            return initialState
        default:
            return state
    }
}