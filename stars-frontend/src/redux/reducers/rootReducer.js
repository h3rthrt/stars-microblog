import { combineReducers } from 'redux'
import postsList from './postsList'
import popularTags from './popularTags'
import profileData from './profileData'
import authReducer from './auth'

export default combineReducers({
    post: postsList,
    tag: popularTags,
    data: profileData,
    auth: authReducer
})