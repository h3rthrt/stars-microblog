import {
	LOAD_POSTS_SUCCESS,
	LOAD_ADDED_POSTS_SUCCESS,
	SET_IS_FETCHING,
	LOAD_POSTS_COMPLETE,
	CLEAR_POSTS,
	LOAD_MORE_POSTS_SUCCESS
} from '../actions/actionsTypes'

const initialState = {
	posts: [],
	lastPost: null,
	complete: false,
	isFetching: true
}

export default function postsReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_POSTS_SUCCESS:
			return {
				...state,
				posts: state.posts.concat(action.posts),
				lastPost: action.lastPost,
				pathname: action.pathname
			}
		case  LOAD_MORE_POSTS_SUCCESS:
			return {
				...state,
				posts: state.posts.concat(action.posts),
				lastPost: action.lastPost
			}
		case LOAD_ADDED_POSTS_SUCCESS:
			return {
				...state,
				posts: action.posts.concat(state.posts)
			}
		case SET_IS_FETCHING:
			return {
				...state,
				isFetching: action.isFetching
			}
		case LOAD_POSTS_COMPLETE:
			return {
				...state,
				complete: true
			}
		case CLEAR_POSTS:
			return initialState
		default:
			return state
	}
}
