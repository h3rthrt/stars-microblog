import { LOAD_USER_LIKE_POSTS_SUCCESS, LOAD_USER_POSTS_SUCCESS } from "../actions/actionsTypes"


const initialState = {
	userPosts: [],
	userPostsLength: 0,
	userLikePosts: [],
	userLikePostsLength: 0
}

export default function notesReducer(state = initialState, action) {
	switch(action.type){
		case LOAD_USER_POSTS_SUCCESS:
			return {
				...state,
				userPosts: state.userPosts.concat(action.userPosts),
				userPostsLength: state.userPostsLength + action.userPostsLength
			}
		case LOAD_USER_LIKE_POSTS_SUCCESS:
			return {
				...state,
				userLikePosts: state.userLikePosts.concat(action.userLikePosts),
				userLikePostsLength: state.userLikePostsLength + action.userLikePostsLength
			}
		default:
			return state
	}
}