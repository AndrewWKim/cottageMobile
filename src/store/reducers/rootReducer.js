import { combineReducers } from 'redux'
import common from './common'
import auth from './auth'
import idea from './idea'
import billing from './billing'
import profile from './profile'
import passRequest from './passRequest'
import news from './news'

export default combineReducers({
    common,
    auth,
    idea,
    billing,
    profile,
    passRequest,
    news
})
