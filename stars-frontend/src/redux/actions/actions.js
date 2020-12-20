import {
	LOAD_POSTS_SUCCESS,
	LOAD_POSTS_ERROR,
	LOAD_POPULAR_TAGS_ERROR,
	LOAD_POPULAR_TAGS_SUCCESS
} from './actionsTypes'
import axios from '../../api/axios'

// Load all posts

export function loadPosts() {
	return async (dispatch) => {
		try {
			var posts = []
			await axios.get('posts').then((response) => (posts = response.data))
			dispatch(fetchPostsSuccess(posts))
		} catch (e) {
			dispatch(fetchPostsError(e))
		}
	}
}

export function fetchPostsSuccess(posts) {
	return {
		type: LOAD_POSTS_SUCCESS,
		posts: posts
	}
}

export function fetchPostsError(e) {
	return {
		type: LOAD_POSTS_ERROR,
		error: e
	}
}

// Load popular tags

export function loadPopularTags() {
	return async (dispatch) => {
		try {
			var tags = []
			await axios.get('tags').then((response) => (tags = response.data))
			dispatch(fetchPopularTagsSuccess(tags))
		} catch (e) {
			dispatch(fetchPopularTagsError(e))
		}
	}
}

export function fetchPopularTagsSuccess(tags) {
	return {
		type: LOAD_POPULAR_TAGS_SUCCESS,
		tags: tags
	}
}

export function fetchPopularTagsError(e) {
	return {
		type: LOAD_POPULAR_TAGS_ERROR,
		error: e
	}
}
