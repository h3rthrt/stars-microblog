import { AUTH_LOGOUT, AUTH_SUCCESS, AUTH_ERROR } from '../actions/actionsTypes'

const initialState = {
	uid: '',
	error: ''
}

export default function authReducer(state = initialState, action) {
	switch (action.type) {
		case AUTH_SUCCESS:
			return {
				...state,
				uid: action.uid
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
