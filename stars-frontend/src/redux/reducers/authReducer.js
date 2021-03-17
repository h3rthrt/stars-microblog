import { LOGIN_SIGNOUT, LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_CLEAR } from '../actions/actionsTypes'

const initialState = {
	authError: null
}

export default function authReducer(state = initialState, action) {
	switch (action.type) {
		case LOGIN_SUCCESS:
			return {
				...state,
				authError: null
			}
		case LOGIN_ERROR:
			return {
				...state,
				authError: action.error.message
			}
		case LOGIN_SIGNOUT:
			return state
		case LOGIN_CLEAR:
			return {
				...state,
				authError: null
			}
		default:
			return state
	}
}
