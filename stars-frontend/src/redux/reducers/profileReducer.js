import {
	LOAD_PROFILE_ERROR,
	LOAD_PROFILE_SUCCESS,
	LOAD_PROFILE_PHOTO,
	CLEAR_PROFILE_DATA
} from '../actions/actionsTypes'

const initialState = {
	username: '',
	blogname: '',
	photoURL: '',
	desc: '',
	followers: [],
	following: [],
	media: [],
	error: ''
}

export default function profileReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_PROFILE_SUCCESS:
			return {
				...state,
				username: action.username,
				blogname: action.blogname,
				photoURL: action.photoURL,
				desc: action.desc,
				followers: action.followers,
				following: action.following,
				media: action.media
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
		case CLEAR_PROFILE_DATA:
			return {
				username: '',
				blogname: '',
				photoURL: '',
				desc: '',
				followers: [],
				following: [],
				media: [],
				error: ''
			}
		default:
			return state
	}
}
