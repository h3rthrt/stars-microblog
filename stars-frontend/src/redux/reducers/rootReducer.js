import { combineReducers } from 'redux'
import tagsReducer from './tagsReducer'
import postsReducer from './postsReducer'
import profileReducer from './profileReducer'
import authReducer from './authReducer'
import uploadReducer from './uploadReducer'
import notificationReducer from './notificationReducer'
import searchReducer from './searchReducer'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'
import { LOGIN_SIGNOUT } from '../actions/actionsTypes'

const appReducer = combineReducers({
    tags: tagsReducer,
    search: searchReducer,
    posts: postsReducer,
    progress: uploadReducer,
    profile: profileReducer,
    auth: authReducer,
    notification: notificationReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
})

export const rootReducer = (state, action) => {
    if (action.type === LOGIN_SIGNOUT) {
        state = undefined
    }
    return appReducer(state, action)
}