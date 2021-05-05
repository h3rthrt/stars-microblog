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
			action.tags.forEach((tag, index) => {
				for (let i = index + 1; i < action.tags.length; i++) {
					if (tag.name === action.tags[i].name) {
						tag.count++
						action.tags.splice(i, 1)
					}
				}
			})
			sortByCount(action.tags)
			return {
				...state,
				tags: action.tags
			}
		default:
			return state
	}
}