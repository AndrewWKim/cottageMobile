import {
    FETCH_NEWS_LIST_DATA,
    FETCH_NEWS_LIST_DATA_SUCCESS,
    FETCH_NEWS_LIST_DATA_ERROR,
} from '../types/news'
import { SET_UNOPENED_NEWS } from '../types/common'

import newsService from '../../shared/services/newsService'

const fetchAllNews = () => async dispatch => {
    try {
        dispatch({ type: FETCH_NEWS_LIST_DATA })

        const allNews = await newsService.listAll()

        const unopenedNews = allNews.filter(
            news => news.isOpened === false,
        )

        const unopenedNewsCount = unopenedNews.length

        dispatch({ type: SET_UNOPENED_NEWS, unopenedNewsCount })

        dispatch({ type: FETCH_NEWS_LIST_DATA_SUCCESS, news: allNews })
    } catch (error) {
        dispatch({ type: FETCH_NEWS_LIST_DATA_ERROR, error })
        throw error
    }
}

export default {
    fetchAllNews,
}