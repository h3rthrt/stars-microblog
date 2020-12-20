import { LOAD_POSTS_ERROR, LOAD_POSTS_SUCCESS } from '../actions/actionsTypes'

const initialState = {
	postsList: [],
	error: ''
}

export default function postsList(state = initialState, action) {
	switch (action.type) {
		case LOAD_POSTS_SUCCESS:
			return {
				...state,
				postsList: action.posts
			}
		case LOAD_POSTS_ERROR:
			return {
				...state,
				error: action.error
			}
		default:
			return state
	}
}
