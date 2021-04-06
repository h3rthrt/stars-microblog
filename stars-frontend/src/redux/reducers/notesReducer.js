import { LOAD_USER_NEXT_POSTS_SUCCESS, LOAD_USER_POSTS_SUCCESS } from "../actions/actionsTypes"


const initialState = {
	userPosts: [],
	userPostsLength: 0
}

export default function notesReducer(state = initialState, action) {
	switch(action.type){
		case LOAD_USER_POSTS_SUCCESS:
			return {
				...state,
				userPosts: state.userPosts.concat(action.userPosts),
				userPostsLength: state.userPostsLength + action.userPostsLength
			}
		case LOAD_USER_NEXT_POSTS_SUCCESS:
			return {
				...state,
				userPosts: [...state.userPosts, action.userPosts],
				userPostsLength: state.userPostsLength + action.userPostsLength
			}
		default:
			return state
	}
}