import { IS_EDIT_SEARCH } from "../actions/actionsTypes"

const initialState = {
	value: ''
}

export default function searchReducer(state = initialState, action) {
	switch (action.type) {
		case IS_EDIT_SEARCH:
			return {
				...state,
				value: action.value
			}
		default:
			return state
	}
}