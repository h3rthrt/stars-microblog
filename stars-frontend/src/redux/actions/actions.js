import {
	LOAD_POSTS_SUCCESS,
	LOAD_POSTS_ERROR,
	LOAD_POPULAR_TAGS_ERROR,
	LOAD_POPULAR_TAGS_SUCCESS,
	LOAD_PROFILE_SUCCESS,
	LOAD_PROFILE_ERROR
} from './actionsTypes'
import axios from '../../api/axios'

// Load posts

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

export function loadProfilePosts(payload) {
	return async (dispatch) => {
		try {
			var posts = []
			await axios.get(`${payload}?nickname=user1106`).then((response) => (posts = response.data))
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

// Load profile

export function loadProfile(payload) {
	return async (dispatch) => {
		try {
			var profileData = []
			await axios.get(`users?blogname=${payload}`).then((response) => (profileData = response.data))
			dispatch(fetchProfileDataSuccess(profileData))
		} catch (e) {
			dispatch(fetchProfileDataError(e))
		}
	}
}

export function fetchProfileDataSuccess(profileData) {
	return {
		type: LOAD_PROFILE_SUCCESS,
		data: profileData
	}
}

export function fetchProfileDataError(e) {
	return {
		type: LOAD_PROFILE_ERROR,
		error: e
	}
}
