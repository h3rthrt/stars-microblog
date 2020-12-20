import { combineReducers } from 'redux'
import postsList from './reducers/postsList'
import popularTags from './reducers/popularTags'

export default combineReducers({
    post: postsList,
    tag: popularTags
})