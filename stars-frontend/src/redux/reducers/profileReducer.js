import {
	LOAD_PROFILE_ERROR,
	LOAD_PROFILE_SUCCESS,
	LOAD_PROFILE_PHOTO,
	PROFILE_CLEAR_DATA,
	PROFILE_NOT_FOUND,
	LOAD_MEDIA_SUCCESS,
	SET_IS_LOADED_PROFILE
} from '../actions/actionsTypes'

const initialState = {
	uid: '',
	username: '',
	blogname: '',
	photoURL: '',
	desc: '',
	followers: [],
	following: [],
	media: [],
	isFound: true,
	isLoaded: false
}

export default function profileReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_PROFILE_SUCCESS:
			return {
				...state,
				uid: action.uid,
				username: action.username,
				blogname: action.blogname,
				photoURL: action.photoURL,
				desc: action.desc,
				followers: action.followers,
				following: action.following,
				isFound: true,
				isLoaded: true
			}
		case LOAD_MEDIA_SUCCESS:
			return {
				...state,
				media: action.media,
			}
		case LOAD_PROFILE_ERROR:
			return {
				...state,
				error: action.error
			}
		case LOAD_PROFILE_PHOTO:
			return {
				...state,
				photoURL: action.photoURL
			}
		case PROFILE_CLEAR_DATA:
			return initialState
		case 'CLEAR_PHOTO':
			return {
				...state,
				photoURL: ''
			}
		case PROFILE_NOT_FOUND:
			return {
				...initialState,
				isLoaded: true,
				isFound: false
			}
		case SET_IS_LOADED_PROFILE:
			return {
				...state,
				isLoaded: false
			}
		default:
			return state
	}
}
