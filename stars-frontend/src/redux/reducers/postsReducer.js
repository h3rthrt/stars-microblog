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
	cachePosts: [],
	lastPost: null,
	complete: false,
	isFetching: true
}

export default function postsReducer(state = initialState, action) {
	const cachePosts = (posts) => posts.map((post, index) => {
		if (!!!state.cachePosts[index]) return posts[index]
		if (post.postId === state.cachePosts[index].postId) {
			return posts[index] = post 
		}
		return action.posts[index]
	})
	
	switch (action.type) {
		case LOAD_POSTS_SUCCESS:
			return {
				...state,
				posts: cachePosts(action.posts),
				lastPost: action.lastPost,
				pathname: action.pathname, 
				complete: false,
				cachePosts: !!state.posts.length ? state.cachePosts.concat(state.posts) : []
			}
		case  LOAD_MORE_POSTS_SUCCESS:
			return {
				...state,
				posts: state.posts.concat(cachePosts(action.posts)),
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
			state.cachePosts.concat(state.posts)
			return {
				...state,
				posts: [],
				complete: false,
				lastPost: null
			}
		default:
			return state
	}
}
