import { LOAD_TAGS_SUCCESS } from "../actions/actionsTypes";

const initialState = {
	tags: []
}

export default function tagsReducer(state = initialState, action) {
	function sortByCount(arr) {
		arr.sort((a, b) => a.count > b.count ? -1 : 1);
	  }
	switch (action.type) {
		case LOAD_TAGS_SUCCESS:
			for (let i = 0; i < action.tags.length; i++) {
				for (let j = i + 1; j < action.tags.length; j++) {
					if (action.tags[i].name === action.tags[j].name) {
						action.tags[i].count++
						action.tags.splice(j)
					}
				}
			}
			sortByCount(action.tags)
			return {
				...state,
				tags: action.tags
			}
		default:
			return state
	}
}