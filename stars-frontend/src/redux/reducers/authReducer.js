import { LOGIN_SIGNOUT, LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_CLEAR, SUBS_LOAD_SUCCESS } from '../actions/actionsTypes'

const initialState = {
	followers: null,
	following: null,
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
			return initialState
		case LOGIN_CLEAR:
			return {
				...state,
				authError: null
			}
		case SUBS_LOAD_SUCCESS:
			return {
				...state,
				followers: action.followers,
				following: action.following	
			}
		default:
			return state
	}
}
