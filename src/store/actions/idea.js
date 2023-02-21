import {
    FETCH_IDEA_LIST_DATA,
    FETCH_IDEA_LIST_DATA_SUCCESS,
    FETCH_IDEA_LIST_DATA_ERROR,
    FETCH_CREATOR_IDEA_LIST_DATA,
    FETCH_CREATOR_IDEA_LIST_DATA_SUCCESS,
    FETCH_CREATOR_IDEA_LIST_DATA_ERROR,
} from '../types/idea'
import { SET_UNVOITED_IDEAS, SET_UNOPENED_IDEAS } from '../types/common'

import ideaService from '../../shared/services/ideaService'

const fetchIdeas = userId => async dispatch => {
    try {
        dispatch({ type: FETCH_IDEA_LIST_DATA })

        const ideasData = await ideaService.listAll(userId)

        const unvoitedIdeas = ideasData.ideas.filter(
            idea => idea.isVoted === false,
        )
        const unopenedIdeas = ideasData.ideas.filter(
            idea => idea.isOpened === false,
        )

        const unvoitedIdeasCount = unvoitedIdeas.length
        const unopenedIdeasCount = unopenedIdeas.length

        dispatch({ type: SET_UNVOITED_IDEAS, unvoitedIdeasCount })
        dispatch({ type: SET_UNOPENED_IDEAS, unopenedIdeasCount })

        dispatch({ type: FETCH_IDEA_LIST_DATA_SUCCESS, ideas: ideasData.ideas })
    } catch (error) {
        dispatch({ type: FETCH_IDEA_LIST_DATA_ERROR, error })
        throw error.response?.data || error
    }
}

const fetchCreatorIdeas = userId => async dispatch => {
    try {
        dispatch({ type: FETCH_CREATOR_IDEA_LIST_DATA })

        const ideasData = await ideaService.listByCreattor(userId)

        dispatch({
            type: FETCH_CREATOR_IDEA_LIST_DATA_SUCCESS,
            ideas: ideasData.ideas,
        })
    } catch (error) {
        dispatch({ type: FETCH_CREATOR_IDEA_LIST_DATA_ERROR, error })
        throw error.response.data
    }
}

export default {
    fetchIdeas,
    fetchCreatorIdeas,
}
