import { combineReducers } from 'redux'
import postsList from './postsList'
import popularTags from './popularTags'
import profileData from './profileData'
import authReducer from './auth'
import upload from './upload'

export default combineReducers({
    post: postsList,
    tag: popularTags,
    profile: profileData,
    auth: authReducer,
    progress: upload
})