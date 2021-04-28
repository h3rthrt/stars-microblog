import { LOGIN_SIGNOUT, LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_CLEAR, SUBS_LOAD_SUCCESS, FOLLOW_SUCCESS, UNFOLLOW_SUCCESS } from '../actions/actionsTypes'

const initialState = {
	followers: null,
	following: null,
	followingRefs: null,
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
				following: action.following,
				followingRefs: action.followingRefs
			}
		case FOLLOW_SUCCESS:
			return {
				...state,
				following: state.following.concat(action.userId),
				followingRefs: state.followingRefs.concat(action.userRef)
			}
		case UNFOLLOW_SUCCESS:
			return {
				...state,
				following: state.following.filter((value) => {
					return value !== action.userId
				}),
				followingRefs: state.followingRefs.filter((value) => {
					return value.id !== action.userId
				})
			}
		default:
			return state
	}
}