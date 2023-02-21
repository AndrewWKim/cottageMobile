import {
    FETCH_IDEA_LIST_DATA,
    FETCH_IDEA_LIST_DATA_SUCCESS,
    FETCH_IDEA_LIST_DATA_ERROR,
    CLEAR_IDEAS_DATA,
    FETCH_CREATOR_IDEA_LIST_DATA,
    FETCH_CREATOR_IDEA_LIST_DATA_SUCCESS,
    FETCH_CREATOR_IDEA_LIST_DATA_ERROR,
} from '../types/idea'

const initialState = {
    isIdeaListLoading: false,
    ideas: null,
    error: null,
    creatorIdeas: null,
}

export default (state = initialState, payload) => {
    switch (payload.type) {
        case FETCH_IDEA_LIST_DATA:
            return { ...state, isIdeaListLoading: true }
        case FETCH_IDEA_LIST_DATA_SUCCESS:
            return {
                ...state,
                isIdeaListLoading: false,
                ideas: payload.ideas,
            }
        case FETCH_IDEA_LIST_DATA_ERROR:
            return { ...state, isIdeaListLoading: false, error: payload.error }
        case FETCH_CREATOR_IDEA_LIST_DATA:
            return { ...state, isIdeaListLoading: true }
        case FETCH_CREATOR_IDEA_LIST_DATA_SUCCESS:
            return {
                ...state,
                isIdeaListLoading: false,
                creatorIdeas: payload.ideas,
            }
        case FETCH_CREATOR_IDEA_LIST_DATA_ERROR:
            return { ...state, isIdeaListLoading: false, error: payload.error }
        case CLEAR_IDEAS_DATA:
            return initialState
        default:
            return state
    }
}
