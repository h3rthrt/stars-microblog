import { AUTH_LOGOUT, AUTH_SUCCESS, AUTH_ERROR } from '../actions/actionsTypes'

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
				blogname: action.blogname,
				photoURL: action.photoURL
			}
		case AUTH_LOGOUT:
			return {
				...state,
				uid: null
			}
		case AUTH_ERROR:
			return {
				...state,
				error: action.error
			}
		default:
			return state
	}
}
