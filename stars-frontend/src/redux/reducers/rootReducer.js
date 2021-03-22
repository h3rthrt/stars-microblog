import { combineReducers } from 'redux'
import postsList from './postsList'
import popularTags from './popularTags'
import profileReducer from './profileReducer'
import authReducer from './authReducer'
import uploadReducer from './uploadReducer'
import createPostReducer from './createPostReducer'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'

export default combineReducers({
    post: postsList,
    tag: popularTags,
    progress: uploadReducer,
    profile: profileReducer,
    auth: authReducer,
    createPost: createPostReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
})