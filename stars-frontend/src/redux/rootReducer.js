import { combineReducers } from 'redux'
import postsList from './reducers/postsList'
import popularTags from './reducers/popularTags'
import profileData from './reducers/profileData'

export default combineReducers({
    post: postsList,
    tag: popularTags,
    data: profileData
})