import { combineReducers } from 'redux'
import popularTags from './popularTags'
import notesReducer from './notesReducer'
import profileReducer from './profileReducer'
import authReducer from './authReducer'
import uploadReducer from './uploadReducer'
import notificationReducer from './notificationReducer'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'

export default combineReducers({
    tag: popularTags,
    notes: notesReducer,
    progress: uploadReducer,
    profile: profileReducer,
    auth: authReducer,
    notification: notificationReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
})