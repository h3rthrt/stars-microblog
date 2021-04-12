import {
	LOAD_USER_LIKE_POSTS_SUCCESS,
	LOAD_USER_POSTS_SUCCESS,
	LOAD_USER_ADDED_POSTS_SUCCESS,
	SET_IS_FETCHING
} from '../actions/actionsTypes'

const initialState = {
	userPosts: [],
	userLastPost: null,
	userLikePosts: [],
	userLikeLastPost: null,
	isFetching: true
}

export default function notesReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_USER_POSTS_SUCCESS:
			return {
				...state,
				userPosts: state.userPosts.concat(action.userPosts),
				userLastPost: action.lastPost
			}
		case LOAD_USER_ADDED_POSTS_SUCCESS:
			return {
				...state,
				userPosts: action.userPosts.concat(state.userPosts)
			}
		case LOAD_USER_LIKE_POSTS_SUCCESS:
			return {
				...state,
				userLikePosts: state.userLikePosts.concat(action.userLikePosts),
				userLikeLastPost: action.lastPost
			}
		case SET_IS_FETCHING:
			return {
				...state,
				isFetching: action.isFetching
			}
		default:
			return state
	}
}
