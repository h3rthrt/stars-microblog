import { LOAD_POPULAR_TAGS_ERROR, LOAD_POPULAR_TAGS_SUCCESS } from '../actions/actionsTypes'

const initialState = {
	popularTags: [],
	error: ''
}

export default function popularTags(state = initialState, action) {
	switch (action.type) {
		case LOAD_POPULAR_TAGS_SUCCESS:
			return {
				...state,
				popularTags: action.tags
			}
		case LOAD_POPULAR_TAGS_ERROR:
			return {
				...state,
				error: action.error
			}
		default:
			return state
	}
}
