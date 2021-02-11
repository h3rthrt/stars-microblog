import { AUTH_LOGOUT, AUTH_SUCCESS, AUTH_ERROR, AUTH_BLOGNAME, AUTH_PHOTO } from '../actions/actionsTypes'

const initialState = {
	uid: '',
	username: '',
	blogname: '',
	photoURL: '',
	error: ''
}

export default function authReducer(state = initialState, action) {
	switch (action.type) {
		case AUTH_SUCCESS:
			return {
				...state,
				uid: action.uid,
				username: action.username,
				photoURL: action.photoURL
			}
		case AUTH_LOGOUT:
			return {
				...state,
				uid: '',
				username: '',
				blogname: '',
				photoURL: ''
			}
		case AUTH_ERROR:
			return {
				...state,
				error: action.error
			}
		case AUTH_BLOGNAME:
			return {
				...state,
				blogname: action.blogname
			}
		case AUTH_PHOTO:
			return {
				...state,
				photoURL: action.photoURL
			}
		default:
			return state
	}
}
